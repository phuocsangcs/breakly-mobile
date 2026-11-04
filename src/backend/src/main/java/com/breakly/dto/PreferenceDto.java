package com.breakly.dto;

import java.time.Instant;

import com.breakly.entity.UserPreference;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// DTOs for reading and updating user preferences.
public final class PreferenceDto {

    private PreferenceDto() {
    }

    public record PreferenceRequest(
            @NotBlank @Size(max = 50) String themeId,
            boolean oneMinuteNoticeEnabled,
            @Min(1) @Max(120) int defaultDurationMinutes,
            @Min(0) @Max(100) int musicVolume) {
    }

    public record PreferenceResponse(
            String themeId,
            boolean oneMinuteNoticeEnabled,
            int defaultDurationMinutes,
            int musicVolume,
            Instant updatedAt) {

        public static PreferenceResponse from(UserPreference p) {
            return new PreferenceResponse(p.getThemeId(), p.isOneMinuteNoticeEnabled(),
                    p.getDefaultDurationMinutes(), p.getMusicVolume(), p.getUpdatedAt());
        }
    }
}

