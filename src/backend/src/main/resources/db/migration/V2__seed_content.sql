-- Seed curated content. Edit/extend these rows to change app content without rebuilding the app.
-- Video titles/thumbnails/durations are auto-filled from the YouTube Data API when a key is configured.

INSERT INTO
    content_items (
        id,
        type,
        external_ref,
        title,
        category,
        sort_order
    )
VALUES (
        gen_random_uuid (),
        'MUSIC_CATEGORY',
        'lounge',
        'Lo-fi',
        'lofi',
        1
    ),
    (
        gen_random_uuid (),
        'MUSIC_CATEGORY',
        'piano',
        'Piano',
        'piano',
        2
    ),
    (
        gen_random_uuid (),
        'MUSIC_CATEGORY',
        'acoustic',
        'Acoustic',
        'acoustic',
        3
    ),
    (
        gen_random_uuid (),
        'MUSIC_CATEGORY',
        'ambient',
        'Nature',
        'nature',
        4
    );

INSERT INTO
    content_items (
        id,
        type,
        external_ref,
        title,
        category,
        sort_order
    )
VALUES (
        gen_random_uuid (),
        'NEWS_SOURCE',
        'https://vnexpress.net/rss/tin-moi-nhat.rss',
        'Mới nhất',
        'latest',
        1
    ),
    (
        gen_random_uuid (),
        'NEWS_SOURCE',
        'https://vnexpress.net/rss/the-gioi.rss',
        'Thế giới',
        'world',
        2
    ),
    (
        gen_random_uuid (),
        'NEWS_SOURCE',
        'https://vnexpress.net/rss/khoa-hoc.rss',
        'Khoa học',
        'science',
        3
    ),
    (
        gen_random_uuid (),
        'NEWS_SOURCE',
        'https://vnexpress.net/rss/so-hoa.rss',
        'Số hóa',
        'tech',
        4
    ),
    (
        gen_random_uuid (),
        'NEWS_SOURCE',
        'https://vnexpress.net/rss/giai-tri.rss',
        'Giải trí',
        'ent',
        5
    ),
    (
        gen_random_uuid (),
        'NEWS_SOURCE',
        'https://vnexpress.net/rss/the-thao.rss',
        'Thể thao',
        'sports',
        6
    ),
    (
        gen_random_uuid (),
        'NEWS_SOURCE',
        'https://vnexpress.net/rss/suc-khoe.rss',
        'Sức khỏe',
        'health',
        7
    );

-- Sample videos: replace these IDs with your own curated picks (must allow embedding).
INSERT INTO
    content_items (
        id,
        type,
        external_ref,
        title,
        category,
        video_format,
        sort_order
    )
VALUES (
    gen_random_uuid (),
    'VIDEO',
    'jfKfPfyJRdk',
    'lofi hip hop radio - beats to relax/study to',
    'relax',
    'LONG',
    1
),
(
    gen_random_uuid (),
    'VIDEO',
    '4xDzrJKXOOY',
    'synthwave radio - beats to chill/game to',
    'relax',
    'LONG',
    2
),
(
    gen_random_uuid (),
    'VIDEO',
    'lTRiuFIWV54',
    '1 A.M Study Session - lofi hip hop',
    'relax',
    'LONG',
    3
),
(
    gen_random_uuid (),
    'VIDEO',
    'DWcJFNfaw9c',
    'Ambient Study Music To Concentrate',
    'focus',
    'SHORT',
    1
),
(
    gen_random_uuid (),
    'VIDEO',
    '5qap5aO4i9A',
    'Relaxing Cozy Beats Clip',
    'cozy',
    'SHORT',
    2
),
(
    gen_random_uuid (),
    'VIDEO',
    'rUxyKA_-grg',
    'Calm Nature Window Clip',
    'nature',
    'SHORT',
    3
);