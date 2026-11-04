package com.breakly.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import java.util.TreeSet;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClient;

import com.breakly.client.RssClient;
import com.breakly.common.TtlCache;

// Fast unit tests covering RSS parsing, daily streak calculation, token hashing and TTL cache fallback.
class CoreLogicUnitTests {

    @Test
    void computesCurrentAndLongestStreaks() {
        LocalDate today = LocalDate.of(2026, 11, 3);
        TreeSet<LocalDate> days = new TreeSet<>(List.of(
                LocalDate.of(2026, 10, 20),
                LocalDate.of(2026, 10, 21),
                LocalDate.of(2026, 10, 22),
                LocalDate.of(2026, 10, 23),
                today.minusDays(1),
                today));

        assertEquals(2, SessionService.computeCurrentStreak(days, today));
        assertEquals(4, SessionService.computeLongestStreak(days));
    }

    @Test
    void parsesVnExpressRssItems() throws Exception {
        String sampleRss = """
                <?xml version="1.0" encoding="UTF-8"?>
                <rss version="2.0"><channel><title>VnExpress</title>
                  <item>
                    <title>AI &amp; Mobile</title>
                    <description><![CDATA[<a href="x"><img src="https://img.vne.net/a.jpg"/></a>Tom tat bai viet]]></description>
                    <pubDate>Tue, 03 Nov 2026 10:00:00 +0700</pubDate>
                    <link>https://vnexpress.net/ai-mobile-123.html</link>
                  </item>
                </channel></rss>
                """;
        var m = RssClient.class.getDeclaredMethod("parse", String.class, String.class, int.class);
        m.setAccessible(true);
        @SuppressWarnings("unchecked")
        List<RssClient.Article> items = (List<RssClient.Article>) m.invoke(
                new RssClient(RestClient.create()), sampleRss, "Số hóa", 10);

        assertEquals(1, items.size());
        assertEquals("AI & Mobile", items.getFirst().title());
        assertEquals("https://img.vne.net/a.jpg", items.getFirst().imageUrl());
        assertEquals("Tom tat bai viet", items.getFirst().summary());
    }

    @Test
    void ttlCacheReturnsStaleValueWhenUpstreamFails() {
        TtlCache<String, String> cache = new TtlCache<>(Duration.ofMillis(1));
        AtomicInteger calls = new AtomicInteger();
        assertEquals("v1", cache.get("k", () -> {
            calls.incrementAndGet();
            return "v1";
        }));
        try {
            Thread.sleep(5);
        } catch (InterruptedException ignored) {
        }
        String fallback = cache.get("k", () -> {
            throw new RuntimeException("upstream down");
        });
        assertEquals("v1", fallback);
        assertTrue(calls.get() >= 1);
    }

    @Test
    void hashesRefreshTokensDeterministically() {
        String h1 = AuthService.hash("sample-refresh-token");
        assertEquals(64, h1.length());
        assertEquals(h1, AuthService.hash("sample-refresh-token"));
    }
}

