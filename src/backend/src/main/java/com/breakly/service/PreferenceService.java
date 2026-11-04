package com.breakly.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.breakly.dto.PreferenceDto.PreferenceRequest;
import com.breakly.dto.PreferenceDto.PreferenceResponse;
import com.breakly.entity.UserPreference;
import com.breakly.repository.UserPreferenceRepository;

import lombok.RequiredArgsConstructor;

// Service reading and saving per-user preferences (creates defaults on first access).
@Service
@RequiredArgsConstructor
public class PreferenceService {

    private final UserPreferenceRepository repo;

    @Transactional
    public PreferenceResponse get(UUID userId) {
        UserPreference p = repo.findById(userId).orElseGet(() -> repo.save(new UserPreference(userId)));
        return PreferenceResponse.from(p);
    }

    @Transactional
    public PreferenceResponse update(UUID userId, PreferenceRequest req) {
        UserPreference p = repo.findById(userId).orElseGet(() -> new UserPreference(userId));
        p.setThemeId(req.themeId().trim());
        p.setOneMinuteNoticeEnabled(req.oneMinuteNoticeEnabled());
        p.setDefaultDurationMinutes(req.defaultDurationMinutes());
        p.setMusicVolume(req.musicVolume());
        return PreferenceResponse.from(repo.save(p));
    }
}
