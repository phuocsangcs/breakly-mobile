-- Game Corner: curated daily web games, per-user daily plays and a per-session games counter.
--   GAME: external_ref = game URL opened in the in-app browser, category = word | logic

INSERT INTO
    content_items (
        id,
        type,
        external_ref,
        title,
        description,
        category,
        author,
        sort_order
    )
VALUES (
        gen_random_uuid (),
        'GAME',
        'https://www.nytimes.com/games/wordle/index.html',
        'Wordle',
        'Guess the hidden five-letter word in six tries.',
        'word',
        'The New York Times',
        1
    ),
    (
        gen_random_uuid (),
        'GAME',
        'https://www.nytimes.com/games/connections',
        'Connections',
        'Sort sixteen words into four hidden groups.',
        'logic',
        'The New York Times',
        2
    ),
    (
        gen_random_uuid (),
        'GAME',
        'https://www.nytimes.com/games/strands',
        'Strands',
        'Find the themed words hidden in a letter grid.',
        'word',
        'The New York Times',
        3
    ),
    (
        gen_random_uuid (),
        'GAME',
        'https://www.nytimes.com/crosswords/game/mini',
        'The Mini',
        'A tiny crossword you can finish in a minute or two.',
        'word',
        'The New York Times',
        4
    );

-- One row per user, game and local calendar day. The unique key makes "mark as played" idempotent.
CREATE TABLE game_plays (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES content_items (id) ON DELETE CASCADE,
    play_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_game_plays_user_game_date UNIQUE (user_id, game_id, play_date)
);

CREATE INDEX idx_game_plays_user_date ON game_plays (user_id, play_date DESC);

-- Existing rows default to 0, so older clients that do not send the field keep working.
ALTER TABLE sessions ADD COLUMN games_played INT NOT NULL DEFAULT 0;
