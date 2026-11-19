-- More radio stations. external_ref is the Jamendo tag (fuzzytags) each station plays.
INSERT INTO
    content_items (
        id,
        type,
        external_ref,
        title,
        category,
        sort_order
    )
VALUES (gen_random_uuid (), 'MUSIC_CATEGORY', 'jazz', 'Jazz', 'jazz', 5),
    (gen_random_uuid (), 'MUSIC_CATEGORY', 'downtempo', 'Chill', 'chill', 6),
    (gen_random_uuid (), 'MUSIC_CATEGORY', 'classical', 'Classical', 'classical', 7),
    (gen_random_uuid (), 'MUSIC_CATEGORY', 'guitar', 'Guitar', 'guitar', 8);
