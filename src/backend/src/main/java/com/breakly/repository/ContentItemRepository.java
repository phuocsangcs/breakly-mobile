package com.breakly.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.breakly.entity.ContentItem;

// Repository for ContentItem entity persistence operations.
public interface ContentItemRepository extends JpaRepository<ContentItem, UUID> {

    List<ContentItem> findByTypeAndActiveTrueOrderBySortOrderAsc(ContentItem.Type type);

    List<ContentItem> findByTypeAndVideoFormatAndActiveTrueOrderBySortOrderAsc(
            ContentItem.Type type, ContentItem.VideoFormat videoFormat);

    Optional<ContentItem> findByIdAndTypeAndActiveTrue(UUID id, ContentItem.Type type);

    Optional<ContentItem> findFirstByTypeAndCategoryAndActiveTrue(ContentItem.Type type, String category);
}
