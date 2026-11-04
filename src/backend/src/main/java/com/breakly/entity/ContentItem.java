package com.breakly.entity;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Entity representing hand-picked content: Jamendo music categories, RSS news sources and YouTube videos.
@Entity
@Table(name = "content_items")
@Getter
@Setter
@NoArgsConstructor
public class ContentItem {

    public enum Type { MUSIC_CATEGORY, NEWS_SOURCE, VIDEO }

    public enum VideoFormat { SHORT, LONG }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @Column(name = "external_ref", nullable = false)
    private String externalRef;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    private String category;

    @Enumerated(EnumType.STRING)
    @Column(name = "video_format")
    private VideoFormat videoFormat;

    @Column(name = "thumbnail_url", columnDefinition = "text")
    private String thumbnailUrl;

    private String author;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Column(nullable = false)
    private boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
