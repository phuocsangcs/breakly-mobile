package com.breakly.service;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.EnumSet;
import java.util.List;
import java.util.TreeSet;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.breakly.common.AppException;
import com.breakly.common.ErrorCode;
import com.breakly.dto.SessionDto.CreateSessionRequest;
import com.breakly.dto.SessionDto.PageResponse;
import com.breakly.dto.SessionDto.SessionResponse;
import com.breakly.dto.SessionDto.StatsResponse;
import com.breakly.entity.BreakSession;
import com.breakly.entity.ServiceType;
import com.breakly.entity.User;
import com.breakly.repository.SessionRepository;
import com.breakly.repository.UserRepository;

import lombok.RequiredArgsConstructor;

// Service recording break sessions (idempotent by client_id), listing history and calculating daily streaks.
@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessions;
    private final UserRepository users;
    private final Clock clock = Clock.systemUTC();

    @Transactional
    public SessionResponse record(UUID userId, CreateSessionRequest req) {
        return sessions.findByUserIdAndClientId(userId, req.clientId())
                .map(SessionResponse::from)
                .orElseGet(() -> {
                    User user = users.findById(userId)
                            .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED, "User not found"));
                    BreakSession s = new BreakSession();
                    s.setUser(user);
                    s.setClientId(req.clientId());
                    s.setStartedAt(req.startedAt());
                    s.setEndedAt(req.endedAt());
                    s.setPlannedSeconds(req.plannedSeconds());
                    s.setActualSeconds(req.actualSeconds());
                    s.setEndReason(req.endReason());
                    s.setMusicSeconds(req.musicSeconds());
                    s.setArticlesOpened(req.articlesOpened());
                    s.setVideosWatched(req.videosWatched());
                    s.setServicesUsed(req.servicesUsed() == null || req.servicesUsed().isEmpty()
                            ? EnumSet.noneOf(ServiceType.class)
                            : EnumSet.copyOf(req.servicesUsed()));
                    return SessionResponse.from(sessions.save(s));
                });
    }

    @Transactional(readOnly = true)
    public PageResponse<SessionResponse> list(UUID userId, int page, int size) {
        Page<BreakSession> p = sessions.findByUserIdOrderByStartedAtDesc(
                userId, PageRequest.of(Math.max(0, page), Math.clamp(size, 1, 50)));
        return new PageResponse<>(p.getContent().stream().map(SessionResponse::from).toList(),
                p.getNumber(), p.getSize(), p.getTotalElements(), p.hasNext());
    }

    @Transactional(readOnly = true)
    public StatsResponse stats(UUID userId, String tz) {
        ZoneId zone = parseZone(tz);
        List<Instant> starts = sessions.findStartTimes(userId);
        TreeSet<LocalDate> days = new TreeSet<>();
        starts.forEach(t -> days.add(t.atZone(zone).toLocalDate()));

        int current = computeCurrentStreak(days, LocalDate.now(clock.withZone(zone)));
        int longest = computeLongestStreak(days);
        long totalSessions = starts.size();
        long totalMinutes = sessions.sumActualSeconds(userId) / 60;
        return new StatsResponse(current, longest, totalSessions, totalMinutes);
    }

    static int computeCurrentStreak(TreeSet<LocalDate> days, LocalDate today) {
        if (days.isEmpty())
            return 0;
        LocalDate cursor = days.contains(today) ? today : today.minusDays(1);
        if (!days.contains(cursor))
            return 0;
        int streak = 0;
        while (days.contains(cursor)) {
            streak++;
            cursor = cursor.minusDays(1);
        }
        return streak;
    }

    static int computeLongestStreak(TreeSet<LocalDate> days) {
        int longest = 0, run = 0;
        LocalDate prev = null;
        for (LocalDate d : days) {
            run = (prev != null && prev.plusDays(1).equals(d)) ? run + 1 : 1;
            longest = Math.max(longest, run);
            prev = d;
        }
        return longest;
    }

    private static ZoneId parseZone(String tz) {
        try {
            return tz == null || tz.isBlank() ? ZoneId.of("UTC") : ZoneId.of(tz);
        } catch (Exception e) {
            return ZoneId.of("UTC");
        }
    }
}
