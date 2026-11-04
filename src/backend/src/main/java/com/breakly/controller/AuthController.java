package com.breakly.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.breakly.common.AppException;
import com.breakly.common.ErrorCode;
import com.breakly.dto.AuthDto.AuthResponse;
import com.breakly.dto.AuthDto.LoginRequest;
import com.breakly.dto.AuthDto.RefreshRequest;
import com.breakly.dto.AuthDto.RegisterRequest;
import com.breakly.dto.AuthDto.UserResponse;
import com.breakly.repository.UserRepository;
import com.breakly.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

// REST controller exposing authentication, token refresh and current-user endpoints.
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository users;

    @PostMapping("/auth/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
        return authService.register(req);
    }

    @PostMapping("/auth/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @PostMapping("/auth/refresh")
    public AuthResponse refresh(@Valid @RequestBody RefreshRequest req) {
        return authService.refresh(req.refreshToken());
    }

    @PostMapping("/auth/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@Valid @RequestBody RefreshRequest req) {
        authService.logout(req.refreshToken());
    }

    @GetMapping("/users/me")
    public UserResponse me(@AuthenticationPrincipal Jwt jwt) {
        return users.findById(userId(jwt))
                .map(UserResponse::from)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED, "User no longer exists"));
    }

    static UUID userId(Jwt jwt) {
        return UUID.fromString(jwt.getSubject());
    }
}
