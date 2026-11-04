package com.breakly.entity;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Entity representing user settings synced across devices (theme, one-minute notice, defaults).
@Entity
@Table(name = "user_preferences")
@Getter
@Setter
@NoArgsConstructor
public class UserPreference {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "theme_id", nullable = false)
    private String themeId = "cozy-room";

    @Column(name = "one_minute_notice_enabled", nullable = false)
    private boolean oneMinuteNoticeEnabled = true;

    @Column(name = "default_duration_minutes", nullable = false)
    private int defaultDurationMinutes = 20;

    @Column(name = "music_volume", nullable = false)
    private int musicVolume = 80;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public UserPreference(UUID userId) {
        this.userId = userId;
    }
}
