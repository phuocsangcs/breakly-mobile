package com.breakly.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.breakly.dto.ContentDto.ArticleResponse;
import com.breakly.dto.ContentDto.ContentItemResponse;
import com.breakly.dto.ContentDto.TrackResponse;
import com.breakly.entity.ContentItem;
import com.breakly.service.ContentService;

import lombok.RequiredArgsConstructor;

// REST controller exposing curated content, Jamendo tracks and VnExpress news feeds.
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ContentController {

    private final ContentService content;

    @GetMapping("/content")
    public List<ContentItemResponse> list(
            @RequestParam ContentItem.Type type,
            @RequestParam(required = false) ContentItem.VideoFormat format) {
        return content.list(type, format);
    }

    @GetMapping("/music/tracks")
    public List<TrackResponse> tracks(
            @RequestParam(defaultValue = "lofi") String category,
            @RequestParam(defaultValue = "20") int limit) {
        return content.tracks(category, limit);
    }

    @GetMapping("/news")
    public List<ArticleResponse> news(@RequestParam(required = false) UUID sourceId) {
        return content.news(sourceId);
    }
}
