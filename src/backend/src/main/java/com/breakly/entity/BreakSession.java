package com.breakly.entity;

import java.time.Instant;
import java.util.EnumSet;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Entity representing one finished break session with its usage statistics (source for history and streak).
@Entity
@Table(name = "sessions")
@Getter
@Setter
@NoArgsConstructor
public class BreakSession {

    public enum EndReason { COMPLETED, ENDED_EARLY }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "client_id", nullable = false)
    private UUID clientId;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "ended_at", nullable = false)
    private Instant endedAt;

    @Column(name = "planned_seconds", nullable = false)
    private int plannedSeconds;

    @Column(name = "actual_seconds", nullable = false)
    private int actualSeconds;

    @Enumerated(EnumType.STRING)
    @Column(name = "end_reason", nullable = false)
    private EndReason endReason;

    @Column(name = "music_seconds", nullable = false)
    private int musicSeconds;

    @Column(name = "articles_opened", nullable = false)
    private int articlesOpened;

    @Column(name = "videos_watched", nullable = false)
    private int videosWatched;

    @Convert(converter = ServiceTypeSetConverter.class)
    @Column(name = "services_used", nullable = false)
    private Set<ServiceType> servicesUsed = EnumSet.noneOf(ServiceType.class);

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}

