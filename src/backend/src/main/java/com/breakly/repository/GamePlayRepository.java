package com.breakly.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.breakly.entity.GamePlay;

// Repository for GamePlay persistence: race-safe daily insert and per-user play-day lookups.
public interface GamePlayRepository extends JpaRepository<GamePlay, UUID> {

    /** (gameId, playDate) pairs, used to compute "played today" and streaks without loading entities. */
    interface PlayDay {
        UUID getGameId();

        LocalDate getPlayDate();
    }

    /**
     * Inserts the play unless one already exists for the same user, game and day.
     * Relies on uq_game_plays_user_game_date, so two concurrent requests can never create duplicates.
     *
     * @return 1 when a new row was inserted, 0 when the day was already recorded
     */
    @Modifying
    @Query(value = """
            insert into game_plays (id, user_id, game_id, play_date)
            values (gen_random_uuid(), :userId, :gameId, :playDate)
            on conflict (user_id, game_id, play_date) do nothing
            """, nativeQuery = true)
    int insertIfAbsent(@Param("userId") UUID userId, @Param("gameId") UUID gameId,
            @Param("playDate") LocalDate playDate);

    @Query("select p.game.id as gameId, p.playDate as playDate from GamePlay p where p.user.id = :userId")
    List<PlayDay> findPlayDays(@Param("userId") UUID userId);
}
