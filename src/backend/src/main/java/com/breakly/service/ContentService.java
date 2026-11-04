package com.breakly.service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.breakly.client.JamendoClient;
import com.breakly.client.RssClient;
import com.breakly.client.YoutubeClient;
import com.breakly.common.AppException;
import com.breakly.common.ErrorCode;
import com.breakly.common.TtlCache;
import com.breakly.config.AppProperties;
import com.breakly.dto.ContentDto.ArticleResponse;
import com.breakly.dto.ContentDto.ContentItemResponse;
import com.breakly.dto.ContentDto.TrackResponse;
import com.breakly.entity.ContentItem;
import com.breakly.repository.ContentItemRepository;

// Service managing curated content, Jamendo music proxy, VnExpress RSS aggregation and YouTube metadata enrichment.
@Service
public class ContentService {

    private static final Logger log = LoggerFactory.getLogger(ContentService.class);

    // Fallback public-domain tracks used in local dev when JAMENDO_CLIENT_ID is not
    // set.
    private static final List<TrackResponse> FALLBACK_TRACKS = List.of(
            new TrackResponse("demo-1", "Snowfall Lo-Fi", "Breakly Studio", "Calm Sessions", 120,
                    "https://picsum.photos/seed/lofi1/300/300",
                    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                    "https://creativecommons.org/licenses/by/4.0/"),
            new TrackResponse("demo-2", "Soft Rain Piano", "Breakly Studio", "Calm Sessions", 150,
                    "https://picsum.photos/seed/piano2/300/300",
                    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                    "https://creativecommons.org/licenses/by/4.0/"),
            new TrackResponse("demo-3", "Morning Acoustic", "Breakly Studio", "Calm Sessions", 140,
                    "https://picsum.photos/seed/acoustic3/300/300",
                    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                    "https://creativecommons.org/licenses/by/4.0/"));

    private final ContentItemRepository repo;
    private final JamendoClient jamendo;
    private final RssClient rss;
    private final YoutubeClient youtube;
    private final AppProperties props;
    private final TtlCache<String, List<TrackResponse>> trackCache;
    private final TtlCache<String, List<ArticleResponse>> newsCache;

    public ContentService(ContentItemRepository repo, JamendoClient jamendo, RssClient rss,
            YoutubeClient youtube, AppProperties props) {
        this.repo = repo;
        this.jamendo = jamendo;
        this.rss = rss;
        this.youtube = youtube;
        this.props = props;
        this.trackCache = new TtlCache<>(props.jamendo().cacheTtl());
        this.newsCache = new TtlCache<>(props.news().cacheTtl());
    }

    @Transactional
    public List<ContentItemResponse> list(ContentItem.Type type, ContentItem.VideoFormat format) {
        List<ContentItem> items = (type == ContentItem.Type.VIDEO && format != null)
                ? repo.findByTypeAndVideoFormatAndActiveTrueOrderBySortOrderAsc(type, format)
                : repo.findByTypeAndActiveTrueOrderBySortOrderAsc(type);
        if (type == ContentItem.Type.VIDEO) {
            enrichMissingVideoMeta(items);
        }
        return items.stream().map(ContentItemResponse::from).toList();
    }

    public List<TrackResponse> tracks(String category, int limit) {
        int clamped = Math.clamp(limit, 1, 50);
        String tag = repo.findFirstByTypeAndCategoryAndActiveTrue(ContentItem.Type.MUSIC_CATEGORY, category)
                .map(ContentItem::getExternalRef)
                .orElse(category);
        if (props.jamendo().clientId() == null || props.jamendo().clientId().isBlank()) {
            return FALLBACK_TRACKS;
        }
        return trackCache.get(tag + ":" + clamped, () -> jamendo.tracksByTag(tag, clamped).stream()
                .filter(t -> t.audio() != null && !t.audio().isBlank())
                .map(TrackResponse::from)
                .toList());
    }

    public List<ArticleResponse> news(UUID sourceId) {
        int max = props.news().maxItems();
        if (sourceId != null) {
            ContentItem src = repo.findByIdAndTypeAndActiveTrue(sourceId, ContentItem.Type.NEWS_SOURCE)
                    .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "News source not found"));
            return fetchSource(src, max);
        }
        List<ContentItem> sources = repo.findByTypeAndActiveTrueOrderBySortOrderAsc(ContentItem.Type.NEWS_SOURCE);
        return sources.stream()
                .limit(3)
                .flatMap(s -> fetchSource(s, max / 2).stream())
                .sorted(Comparator.comparing(ArticleResponse::publishedAt).reversed())
                .limit(max)
                .toList();
    }

    private List<ArticleResponse> fetchSource(ContentItem src, int max) {
        return newsCache.get(src.getId().toString(), () -> rss.fetchFeed(src.getExternalRef(), src.getTitle(), max)
                .stream().map(ArticleResponse::from).toList());
    }

    private void enrichMissingVideoMeta(List<ContentItem> videos) {
        if (!youtube.isConfigured())
            return;
        List<ContentItem> missing = videos.stream()
                .filter(v -> v.getThumbnailUrl() == null || v.getAuthor() == null)
                .limit(50)
                .toList();
        if (missing.isEmpty())
            return;
        try {
            Map<String, YoutubeClient.VideoMeta> byId = youtube.fetch(
                    missing.stream().map(ContentItem::getExternalRef).toList())
                    .stream().collect(Collectors.toMap(YoutubeClient.VideoMeta::id, Function.identity(), (a, b) -> a));
            missing.forEach(v -> {
                YoutubeClient.VideoMeta m = byId.get(v.getExternalRef());
                if (m != null) {
                    if (m.title() != null)
                        v.setTitle(m.title());
                    v.setAuthor(m.channel());
                    v.setThumbnailUrl(m.thumbnailUrl());
                    v.setDurationSeconds(m.durationSeconds());
                }
            });
        } catch (Exception e) {
            log.warn("YouTube metadata enrichment skipped: {}", e.getMessage());
        }
    }
}
