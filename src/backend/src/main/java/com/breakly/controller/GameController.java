package com.breakly.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.breakly.dto.GameDto.GameResponse;
import com.breakly.dto.GameDto.PlayResponse;
import com.breakly.dto.GameDto.RecordPlayRequest;
import com.breakly.service.GameService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

// REST controller for the Game Corner: per-user game list and idempotent daily play recording.
@RestController
@RequestMapping("/api/v1/games")
@RequiredArgsConstructor
public class GameController {

    private final GameService games;

    @GetMapping
    public List<GameResponse> list(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(defaultValue = "Asia/Ho_Chi_Minh") String tz) {
        return games.list(AuthController.userId(jwt), tz);
    }

    /** 201 Created the first time a game is played on a day, 200 OK for repeats of the same day. */
    @PostMapping("/{gameId}/plays")
    public ResponseEntity<PlayResponse> recordPlay(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID gameId,
            @Valid @RequestBody RecordPlayRequest req) {
        PlayResponse res = games.recordPlay(AuthController.userId(jwt), gameId, req);
        return ResponseEntity.status(res.firstPlayToday() ? HttpStatus.CREATED : HttpStatus.OK).body(res);
    }
}
