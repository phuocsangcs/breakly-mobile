package com.breakly.dto;

import java.time.Instant;
import java.util.UUID;

import com.breakly.client.JamendoClient;
import com.breakly.client.RssClient;
import com.breakly.entity.ContentItem;

// DTOs for curated content, music tracks and news articles.
public final class ContentDto {

    private ContentDto() {
    }

    public record ContentItemResponse(
            UUID id,
            ContentItem.Type type,
            String externalRef,
            String title,
            String description,
            String category,
            ContentItem.VideoFormat videoFormat,
            String thumbnailUrl,
            String author,
            Integer durationSeconds) {

        public static ContentItemResponse from(ContentItem c) {
            String thumb = c.getThumbnailUrl();
            if (thumb == null && c.getType() == ContentItem.Type.VIDEO) {
                thumb = "https://i.ytimg.com/vi/" + c.getExternalRef() + "/hqdefault.jpg";
            }
            return new ContentItemResponse(c.getId(), c.getType(), c.getExternalRef(), c.getTitle(),
                    c.getDescription(), c.getCategory(), c.getVideoFormat(), thumb, c.getAuthor(),
                    c.getDurationSeconds());
        }
    }

    public record TrackResponse(
            String id,
            String title,
            String artist,
            String album,
            int durationSeconds,
            String artworkUrl,
            String streamUrl,
            String licenseUrl) {

        public static TrackResponse from(JamendoClient.Track t) {
            return new TrackResponse(t.id(), t.name(), t.artistName(), t.albumName(),
                    t.duration(), t.image(), t.audio(), t.licenseUrl());
        }
    }

    public record ArticleResponse(
            String id,
            String title,
            String summary,
            String imageUrl,
            String link,
            String source,
            Instant publishedAt) {

        public static ArticleResponse from(RssClient.Article a) {
            return new ArticleResponse(a.id(), a.title(), a.summary(), a.imageUrl(),
                    a.link(), a.source(), a.publishedAt());
        }
    }
}

