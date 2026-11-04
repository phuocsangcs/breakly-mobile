package com.breakly.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.breakly.dto.SessionDto.CreateSessionRequest;
import com.breakly.dto.SessionDto.PageResponse;
import com.breakly.dto.SessionDto.SessionResponse;
import com.breakly.dto.SessionDto.StatsResponse;
import com.breakly.service.SessionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

// REST controller exposing break session recording, history and streak statistics.
@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessions;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SessionResponse record(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody CreateSessionRequest req) {
        return sessions.record(AuthController.userId(jwt), req);
    }

    @GetMapping
    public PageResponse<SessionResponse> list(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return sessions.list(AuthController.userId(jwt), page, size);
    }

    @GetMapping("/stats")
    public StatsResponse stats(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(defaultValue = "Asia/Ho_Chi_Minh") String tz) {
        return sessions.stats(AuthController.userId(jwt), tz);
    }
}
