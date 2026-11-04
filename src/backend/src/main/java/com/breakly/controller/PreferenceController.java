package com.breakly.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.breakly.dto.PreferenceDto.PreferenceRequest;
import com.breakly.dto.PreferenceDto.PreferenceResponse;
import com.breakly.service.PreferenceService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

// REST controller exposing user preferences (theme, one-minute notice, default duration, volume).
@RestController
@RequestMapping("/api/v1/preferences")
@RequiredArgsConstructor
public class PreferenceController {

    private final PreferenceService preferences;

    @GetMapping
    public PreferenceResponse get(@AuthenticationPrincipal Jwt jwt) {
        return preferences.get(AuthController.userId(jwt));
    }

    @PutMapping
    public PreferenceResponse update(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody PreferenceRequest req) {
        return preferences.update(AuthController.userId(jwt), req);
    }
}
