package com.breakly.config;

import java.time.Duration;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

// Strongly-typed application settings bound from the "breakly.*" namespace (values come from environment variables).
@ConfigurationProperties(prefix = "breakly")
public record AppProperties(Jwt jwt, Cors cors, Jamendo jamendo, Youtube youtube, News news) {

    public record Jwt(String secret, String issuer, Duration accessTtl, Duration refreshTtl) {
    }

    public record Cors(List<String> allowedOrigins) {
    }

    public record Jamendo(String clientId, String baseUrl, Duration cacheTtl) {
    }

    public record Youtube(String apiKey, String baseUrl, Duration cacheTtl) {
    }

    public record News(Duration cacheTtl, Duration requestTimeout, int maxItems) {
    }
}

