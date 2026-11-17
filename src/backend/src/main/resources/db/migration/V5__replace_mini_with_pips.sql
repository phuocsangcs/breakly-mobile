-- The Mini Crossword now needs an NYT Games subscription, so it is replaced by Pips (free daily dominoes puzzle).
-- The Mini is deactivated rather than deleted: deleting it would cascade-delete users' game_plays history.

UPDATE content_items SET active = FALSE
WHERE type = 'GAME' AND external_ref = 'https://www.nytimes.com/crosswords/game/mini';

INSERT INTO
    content_items (
        id,
        type,
        external_ref,
        title,
        description,
        category,
        author,
        thumbnail_url,
        sort_order
    )
VALUES (
        gen_random_uuid (),
        'GAME',
        'https://www.nytimes.com/games/pips',
        'Pips',
        'Place every domino where it belongs. Easy, medium and hard daily puzzles.',
        'logic',
        'The New York Times',
        'https://www.nytimes.com/games-assets/v2/metadata/pips-apple-touch-icon.png',
        4
    );
