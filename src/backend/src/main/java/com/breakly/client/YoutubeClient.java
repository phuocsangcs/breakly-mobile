package com.breakly.client;

import java.time.Duration;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.breakly.config.AppProperties;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

// YouTube Data API v3 client used only to enrich curated video IDs with title, channel, thumbnail and duration.
@Component
public class YoutubeClient {

    public record VideoMeta(String id, String title, String channel, String thumbnailUrl, Integer durationSeconds) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record Thumbnail(String url) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record Snippet(String title, String channelTitle, Map<String, Thumbnail> thumbnails) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record ContentDetails(String duration) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record Item(String id, Snippet snippet, ContentDetails contentDetails) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record ListResponse(List<Item> items) {
    }

    private final RestClient http;
    private final AppProperties.Youtube cfg;

    public YoutubeClient(RestClient externalRestClient, AppProperties props) {
        this.http = externalRestClient;
        this.cfg = props.youtube();
    }

    public boolean isConfigured() {
        return cfg.apiKey() != null && !cfg.apiKey().isBlank();
    }

    /** Fetches metadata for up to 50 video IDs in a single quota-cheap call. */
    public List<VideoMeta> fetch(List<String> ids) {
        if (ids.isEmpty() || !isConfigured()) {
            return List.of();
        }
        ListResponse res = http.get()
                .uri(cfg.baseUrl() + "/videos?part=snippet,contentDetails&id={ids}&key={key}",
                        String.join(",", ids), cfg.apiKey())
                .retrieve()
                .body(ListResponse.class);
        if (res == null || res.items() == null) {
            return List.of();
        }
        return res.items().stream().map(YoutubeClient::toMeta).toList();
    }

    private static VideoMeta toMeta(Item item) {
        Snippet s = item.snippet();
        String thumb = null;
        if (s != null && s.thumbnails() != null) {
            for (String size : List.of("maxres", "high", "medium", "default")) {
                Thumbnail t = s.thumbnails().get(size);
                if (t != null) {
                    thumb = t.url();
                    break;
                }
            }
        }
        return new VideoMeta(item.id(), s != null ? s.title() : null, s != null ? s.channelTitle() : null,
                thumb, parseDuration(item.contentDetails()));
    }

    private static Integer parseDuration(ContentDetails details) {
        if (details == null || details.duration() == null) {
            return null;
        }
        try {
            long seconds = Duration.parse(details.duration()).toSeconds();
            return seconds > 0 ? (int) seconds : null; // live streams report P0D
        } catch (DateTimeParseException e) {
            return null;
        }
    }
}

