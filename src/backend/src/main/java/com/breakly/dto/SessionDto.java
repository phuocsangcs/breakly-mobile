package com.breakly.dto;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.breakly.entity.BreakSession;
import com.breakly.entity.ServiceType;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

// DTOs for recording and querying break sessions and user streak statistics.
public final class SessionDto {

    private SessionDto() {
    }

    public record CreateSessionRequest(
            @NotNull UUID clientId,
            @NotNull Instant startedAt,
            @NotNull Instant endedAt,
            @Min(1) int plannedSeconds,
            @Min(0) int actualSeconds,
            @NotNull BreakSession.EndReason endReason,
            @Min(0) int musicSeconds,
            @Min(0) int articlesOpened,
            @Min(0) int videosWatched,
            Set<ServiceType> servicesUsed) {
    }

    public record SessionResponse(
            UUID id,
            UUID clientId,
            Instant startedAt,
            Instant endedAt,
            int plannedSeconds,
            int actualSeconds,
            BreakSession.EndReason endReason,
            int musicSeconds,
            int articlesOpened,
            int videosWatched,
            Set<ServiceType> servicesUsed) {

        public static SessionResponse from(BreakSession s) {
            return new SessionResponse(s.getId(), s.getClientId(), s.getStartedAt(), s.getEndedAt(),
                    s.getPlannedSeconds(), s.getActualSeconds(), s.getEndReason(), s.getMusicSeconds(),
                    s.getArticlesOpened(), s.getVideosWatched(), s.getServicesUsed());
        }
    }

    public record PageResponse<T>(List<T> items, int page, int size, long totalElements, boolean hasNext) {
    }

    public record StatsResponse(int currentStreak, int longestStreak, long totalSessions, long totalMinutes) {
    }
}

