package com.breakly.service;

import java.time.Clock;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeSet;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.breakly.common.AppException;
import com.breakly.common.ErrorCode;
import com.breakly.dto.GameDto.GameResponse;
import com.breakly.dto.GameDto.PlayResponse;
import com.breakly.dto.GameDto.RecordPlayRequest;
import com.breakly.entity.ContentItem;
import com.breakly.repository.ContentItemRepository;
import com.breakly.repository.GamePlayRepository;
import com.breakly.repository.UserRepository;

import lombok.RequiredArgsConstructor;

// Service for the Game Corner: lists curated games with per-user "played today" + streak, and records daily plays.
@Service
@RequiredArgsConstructor
public class GameService {

    private final ContentItemRepository content;
    private final GamePlayRepository plays;
    private final UserRepository users;
    private final Clock clock = Clock.systemUTC();

    @Transactional(readOnly = true)
    public List<GameResponse> list(UUID userId, String tz) {
        LocalDate today = LocalDate.now(clock.withZone(SessionService.parseZone(tz)));
        Map<UUID, TreeSet<LocalDate>> daysByGame = playDaysByGame(userId);
        return content.findByTypeAndActiveTrueOrderBySortOrderAsc(ContentItem.Type.GAME).stream()
                .map(game -> {
                    TreeSet<LocalDate> days = daysByGame.getOrDefault(game.getId(), new TreeSet<>());
                    return GameResponse.from(game, days.contains(today),
                            SessionService.computeCurrentStreak(days, today));
                })
                .toList();
    }

    /** Idempotent: calling it several times on the same day stores a single row. */
    @Transactional
    public PlayResponse recordPlay(UUID userId, UUID gameId, RecordPlayRequest req) {
        LocalDate playDate = req.playDate();
        if (!isPlausibleLocalDate(playDate, LocalDate.now(clock.withZone(ZoneOffset.UTC)))) {
            throw new AppException(ErrorCode.BAD_REQUEST, "playDate must be the user's current local day");
        }
        content.findByIdAndTypeAndActiveTrue(gameId, ContentItem.Type.GAME)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Game not found"));
        if (!users.existsById(userId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED, "User not found");
        }

        boolean inserted = plays.insertIfAbsent(userId, gameId, playDate) == 1;
        TreeSet<LocalDate> days = playDaysByGame(userId).getOrDefault(gameId, new TreeSet<>());
        return new PlayResponse(gameId, playDate, inserted, SessionService.computeCurrentStreak(days, playDate));
    }

    /**
     * Every time zone is between UTC-12 and UTC+14, so a user's "today" is always
     * yesterday, today or tomorrow in UTC. Anything else is a wrong clock or a forged request.
     */
    static boolean isPlausibleLocalDate(LocalDate playDate, LocalDate utcToday) {
        return playDate != null
                && !playDate.isBefore(utcToday.minusDays(1))
                && !playDate.isAfter(utcToday.plusDays(1));
    }

    private Map<UUID, TreeSet<LocalDate>> playDaysByGame(UUID userId) {
        Map<UUID, TreeSet<LocalDate>> byGame = new HashMap<>();
        for (GamePlayRepository.PlayDay p : plays.findPlayDays(userId)) {
            byGame.computeIfAbsent(p.getGameId(), k -> new TreeSet<>()).add(p.getPlayDate());
        }
        return byGame;
    }
}
