package com.breakly.common;

import java.time.Instant;
import java.util.Map;

// Uniform error payload returned by every failing API call: { code, message, details, timestamp }.
public record ApiError(String code, String message, Map<String, Object> details, Instant timestamp) {

    public static ApiError of(ErrorCode code, String message) {
        return new ApiError(code.name(), message, null, Instant.now());
    }

    public static ApiError of(ErrorCode code, String message, Map<String, Object> details) {
        return new ApiError(code.name(), message, details, Instant.now());
    }
}

