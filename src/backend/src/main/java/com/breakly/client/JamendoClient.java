package com.breakly.client;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import com.breakly.common.AppException;
import com.breakly.common.ErrorCode;
import com.breakly.config.AppProperties;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

// Jamendo API v3 client (free Creative Commons music). The client_id never leaves the server.
@Component
public class JamendoClient {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Track(
            String id,
            String name,
            int duration,
            @JsonProperty("artist_name") String artistName,
            @JsonProperty("album_name") String albumName,
            String image,
            String audio,
            String shareurl,
            @JsonProperty("license_ccurl") String licenseUrl) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record Headers(String status, int code, @JsonProperty("error_message") String errorMessage) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record TracksResponse(Headers headers, List<Track> results) {
    }

    private final RestClient http;
    private final AppProperties.Jamendo cfg;

    public JamendoClient(RestClient externalRestClient, AppProperties props) {
        this.http = externalRestClient;
        this.cfg = props.jamendo();
    }

    public List<Track> tracksByTag(String tag, int limit) {
        if (cfg.clientId() == null || cfg.clientId().isBlank()) {
            throw new AppException(ErrorCode.UPSTREAM_UNAVAILABLE, "Music provider is not configured");
        }
        try {
            TracksResponse res = http.get()
                    .uri(cfg.baseUrl() + "/tracks/?client_id={cid}&format=json&limit={limit}&fuzzytags={tag}"
                            + "&audioformat=mp32&imagesize=300&order=popularity_month",
                            cfg.clientId(), limit, tag)
                    .retrieve()
                    .body(TracksResponse.class);
            if (res == null || res.headers() == null || !"success".equals(res.headers().status())) {
                String msg = res != null && res.headers() != null ? res.headers().errorMessage() : "empty response";
                throw new AppException(ErrorCode.UPSTREAM_UNAVAILABLE, "Jamendo error: " + msg);
            }
            return res.results() == null ? List.of() : res.results();
        } catch (RestClientException e) {
            throw new AppException(ErrorCode.UPSTREAM_UNAVAILABLE, "Music provider unavailable", e);
        }
    }
}

