-- Initial database schema: users, refresh tokens, break sessions, user preferences and curated content.

CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    display_name VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Only the SHA-256 hash of each opaque refresh token is stored.
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    token_hash CHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens (user_id);

-- client_id is generated on the device so offline uploads are idempotent.
CREATE TABLE sessions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    client_id UUID NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ NOT NULL,
    planned_seconds INT NOT NULL,
    actual_seconds INT NOT NULL,
    end_reason VARCHAR(20) NOT NULL,
    music_seconds INT NOT NULL DEFAULT 0,
    articles_opened INT NOT NULL DEFAULT 0,
    videos_watched INT NOT NULL DEFAULT 0,
    services_used VARCHAR(50) NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_sessions_user_client UNIQUE (user_id, client_id)
);

CREATE INDEX idx_sessions_user_started ON sessions (user_id, started_at DESC);

CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    theme_id VARCHAR(50) NOT NULL DEFAULT 'cozy-room',
    one_minute_notice_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    default_duration_minutes INT NOT NULL DEFAULT 20,
    music_volume INT NOT NULL DEFAULT 80,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Hand-picked content. Only identifiers/links/metadata are stored, never the media itself.
--   MUSIC_CATEGORY: external_ref = Jamendo tag
--   NEWS_SOURCE   : external_ref = RSS feed URL
--   VIDEO         : external_ref = YouTube video id, video_format = SHORT | LONG
CREATE TABLE content_items (
    id UUID PRIMARY KEY,
    type VARCHAR(30) NOT NULL,
    external_ref VARCHAR(500) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    video_format VARCHAR(10),
    thumbnail_url TEXT,
    author VARCHAR(255),
    duration_seconds INT,
    sort_order INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_content_type_ref UNIQUE (type, external_ref)
);

CREATE INDEX idx_content_type_active ON content_items (type, active, sort_order);