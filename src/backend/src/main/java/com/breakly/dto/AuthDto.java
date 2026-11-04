package com.breakly.dto;

import java.util.UUID;

import com.breakly.entity.User;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Request/response payloads for authentication endpoints.
public final class AuthDto {

    private AuthDto() {
    }

    public record RegisterRequest(
            @NotBlank @Email @Size(max = 255) String email,
            @NotBlank @Size(min = 8, max = 72) String password,
            @Size(max = 100) String displayName) {
    }

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {
    }

    public record RefreshRequest(@NotBlank String refreshToken) {
    }

    public record UserResponse(UUID id, String email, String displayName) {
        public static UserResponse from(User u) {
            return new UserResponse(u.getId(), u.getEmail(), u.getDisplayName());
        }
    }

    public record AuthResponse(String accessToken, String refreshToken, long expiresIn, UserResponse user) {
    }
}

