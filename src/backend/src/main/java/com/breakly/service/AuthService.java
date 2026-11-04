package com.breakly.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.breakly.common.AppException;
import com.breakly.common.ErrorCode;
import com.breakly.config.AppProperties;
import com.breakly.dto.AuthDto.AuthResponse;
import com.breakly.dto.AuthDto.LoginRequest;
import com.breakly.dto.AuthDto.RegisterRequest;
import com.breakly.dto.AuthDto.UserResponse;
import com.breakly.entity.RefreshToken;
import com.breakly.entity.User;
import com.breakly.repository.RefreshTokenRepository;
import com.breakly.repository.UserRepository;

import lombok.RequiredArgsConstructor;

// Service handling registration, login, refresh-token rotation and logout.
@Service
@RequiredArgsConstructor
public class AuthService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository users;
    private final RefreshTokenRepository refreshTokens;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;
    private final AppProperties props;
    private final Clock clock = Clock.systemUTC();

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        String email = normalize(req.email());
        if (users.existsByEmailIgnoreCase(email)) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS, "Email is already registered");
        }
        String name = req.displayName() == null || req.displayName().isBlank() ? null : req.displayName().trim();
        User user = users.save(new User(email, passwordEncoder.encode(req.password()), name));
        return issueTokens(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest req) {
        User user = users.findByEmailIgnoreCase(normalize(req.email()))
                .filter(u -> passwordEncoder.matches(req.password(), u.getPasswordHash()))
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS, "Invalid email or password"));
        return issueTokens(user);
    }

    /** Rotates the refresh token. Reusing an already-revoked token revokes every session of that user. */
    @Transactional(noRollbackFor = AppException.class)
    public AuthResponse refresh(String rawToken) {
        Instant now = clock.instant();
        RefreshToken token = refreshTokens.findByTokenHash(hash(rawToken))
                .orElseThrow(() -> invalidToken());
        if (token.getRevokedAt() != null) {
            refreshTokens.revokeAllForUser(token.getUser().getId(), now);
            throw invalidToken();
        }
        if (!token.isActive(now)) {
            throw invalidToken();
        }
        token.setRevokedAt(now);
        return issueTokens(token.getUser());
    }

    @Transactional
    public void logout(String rawToken) {
        refreshTokens.findByTokenHash(hash(rawToken))
                .filter(t -> t.getRevokedAt() == null)
                .ifPresent(t -> t.setRevokedAt(clock.instant()));
    }

    private AuthResponse issueTokens(User user) {
        Instant now = clock.instant();
        AppProperties.Jwt jwt = props.jwt();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(jwt.issuer())
                .subject(user.getId().toString())
                .issuedAt(now)
                .expiresAt(now.plus(jwt.accessTtl()))
                .claim("email", user.getEmail())
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        String accessToken = jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();

        String rawRefresh = randomToken();
        refreshTokens.save(new RefreshToken(user, hash(rawRefresh), now.plus(jwt.refreshTtl())));

        return new AuthResponse(accessToken, rawRefresh, jwt.accessTtl().toSeconds(), UserResponse.from(user));
    }

    private static AppException invalidToken() {
        return new AppException(ErrorCode.INVALID_TOKEN, "Invalid or expired refresh token");
    }

    private static String normalize(String email) {
        return email.trim().toLowerCase();
    }

    private static String randomToken() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    static String hash(String raw) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
