package com.breakly;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.breakly.entity.ContentItem;
import com.breakly.entity.User;
import com.breakly.repository.ContentItemRepository;
import com.breakly.repository.UserRepository;

// End-to-end tests for the Game Corner API against a real PostgreSQL (Testcontainers): catalog, idempotent plays,
// per-user isolation and input validation.
@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
class GameCornerIntegrationTests {

    private static final String TZ = "Asia/Ho_Chi_Minh";

    @Autowired
    MockMvc mvc;

    @Autowired
    UserRepository users;

    @Autowired
    ContentItemRepository content;

    UUID alice;
    UUID bob;
    UUID wordleId;
    LocalDate today;

    @BeforeEach
    void setUp() {
        alice = users.save(new User("alice-" + UUID.randomUUID() + "@test.dev", "x", "Alice")).getId();
        bob = users.save(new User("bob-" + UUID.randomUUID() + "@test.dev", "x", "Bob")).getId();
        wordleId = content.findByTypeAndActiveTrueOrderBySortOrderAsc(ContentItem.Type.GAME).getFirst().getId();
        today = LocalDate.now(ZoneId.of(TZ));
    }

    @Test
    void listsSeededGamesForSignedInUser() throws Exception {
        mvc.perform(get("/api/v1/games").param("tz", TZ).with(jwt().jwt(j -> j.subject(alice.toString()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4))
                .andExpect(jsonPath("$[0].title").value("Wordle"))
                // The Mini (now subscription-only) is deactivated by V5 and replaced by Pips.
                .andExpect(jsonPath("$[3].title").value("Pips"))
                .andExpect(jsonPath("$[0].playedToday").value(false))
                .andExpect(jsonPath("$[0].currentStreak").value(0));
    }

    @Test
    void requiresAuthentication() throws Exception {
        mvc.perform(get("/api/v1/games")).andExpect(status().isUnauthorized());
    }

    @Test
    void recordingTwiceOnSameDayIsIdempotent() throws Exception {
        String body = "{\"playDate\":\"" + today + "\"}";

        mvc.perform(post("/api/v1/games/{id}/plays", wordleId)
                .with(jwt().jwt(j -> j.subject(alice.toString())))
                .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.firstPlayToday").value(true))
                .andExpect(jsonPath("$.currentStreak").value(1));

        mvc.perform(post("/api/v1/games/{id}/plays", wordleId)
                .with(jwt().jwt(j -> j.subject(alice.toString())))
                .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstPlayToday").value(false))
                .andExpect(jsonPath("$.currentStreak").value(1));

        mvc.perform(get("/api/v1/games").param("tz", TZ).with(jwt().jwt(j -> j.subject(alice.toString()))))
                .andExpect(jsonPath("$[0].playedToday").value(true));

        // Another user's list is not affected by Alice's play.
        mvc.perform(get("/api/v1/games").param("tz", TZ).with(jwt().jwt(j -> j.subject(bob.toString()))))
                .andExpect(jsonPath("$[0].playedToday").value(false));
    }

    @Test
    void rejectsDatesFarFromToday() throws Exception {
        mvc.perform(post("/api/v1/games/{id}/plays", wordleId)
                .with(jwt().jwt(j -> j.subject(alice.toString())))
                .contentType(MediaType.APPLICATION_JSON).content("{\"playDate\":\"2020-01-01\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void unknownGameReturns404() throws Exception {
        mvc.perform(post("/api/v1/games/{id}/plays", UUID.randomUUID())
                .with(jwt().jwt(j -> j.subject(alice.toString())))
                .contentType(MediaType.APPLICATION_JSON).content("{\"playDate\":\"" + today + "\"}"))
                .andExpect(status().isNotFound());
    }
}
