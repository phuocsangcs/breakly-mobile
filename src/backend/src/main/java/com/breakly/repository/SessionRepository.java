package com.breakly.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.breakly.entity.BreakSession;

// Repository for BreakSession entity persistence operations.
public interface SessionRepository extends JpaRepository<BreakSession, UUID> {

    Page<BreakSession> findByUserIdOrderByStartedAtDesc(UUID userId, Pageable pageable);

    Optional<BreakSession> findByUserIdAndClientId(UUID userId, UUID clientId);

    @Query("select s.startedAt from BreakSession s where s.user.id = :userId order by s.startedAt desc")
    List<Instant> findStartTimes(@Param("userId") UUID userId);

    long countByUserId(UUID userId);

    @Query("select coalesce(sum(s.actualSeconds), 0) from BreakSession s where s.user.id = :userId")
    long sumActualSeconds(@Param("userId") UUID userId);
}
