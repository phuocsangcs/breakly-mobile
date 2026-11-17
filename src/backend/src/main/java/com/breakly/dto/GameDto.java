package com.breakly.dto;

import java.time.LocalDate;
import java.util.UUID;

import com.breakly.entity.ContentItem;

import jakarta.validation.constraints.NotNull;

// DTOs for the Game Corner catalog and daily play tracking.
public final class GameDto {

    private GameDto() {
    }

    public record GameResponse(
            UUID id,
            String title,
            String description,
            String url,
            String category,
            String provider,
            String thumbnailUrl,
            boolean playedToday,
            int currentStreak) {

        public static GameResponse from(ContentItem c, boolean playedToday, int currentStreak) {
            return new GameResponse(c.getId(), c.getTitle(), c.getDescription(), c.getExternalRef(),
                    c.getCategory(), c.getAuthor(), c.getThumbnailUrl(), playedToday, currentStreak);
        }
    }

    /** playDate is the user's local calendar day; the client knows the user's time zone, the server does not. */
    public record RecordPlayRequest(@NotNull LocalDate playDate) {
    }

    public record PlayResponse(UUID gameId, LocalDate playDate, boolean firstPlayToday, int currentStreak) {
    }
}
