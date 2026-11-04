package com.breakly.config;

import java.net.http.HttpClient;
import java.time.Duration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestClient;

// Shared outbound HTTP client (Jamendo, YouTube, RSS) with strict timeouts; enables scheduled jobs.
@Configuration
@EnableScheduling
public class HttpClientConfig {

    @Bean
    RestClient externalRestClient(AppProperties props) {
        HttpClient http = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
        JdkClientHttpRequestFactory factory = new JdkClientHttpRequestFactory(http);
        factory.setReadTimeout(props.news().requestTimeout());
        return RestClient.builder()
                .requestFactory(factory)
                .defaultHeader("User-Agent", "BreaklyBackend/1.0")
                .build();
    }
}

