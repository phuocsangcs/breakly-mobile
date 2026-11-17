-- Game Corner icons: each game's own app icon, as declared in its page metadata (apple-touch-icon).
-- The Mini has no game-specific touch icon, so its in-page icon is used.
-- New migration instead of editing V3: Flyway checksums make applied migrations immutable.

UPDATE content_items SET thumbnail_url = 'https://www.nytimes.com/games-assets/v2/metadata/wordle-apple-touch-icon.png'
WHERE type = 'GAME' AND external_ref = 'https://www.nytimes.com/games/wordle/index.html';

UPDATE content_items SET thumbnail_url = 'https://www.nytimes.com/games-assets/v2/metadata/connections-apple-touch-icon.png'
WHERE type = 'GAME' AND external_ref = 'https://www.nytimes.com/games/connections';

UPDATE content_items SET thumbnail_url = 'https://www.nytimes.com/games-assets/v2/metadata/strands-apple-touch-icon.png'
WHERE type = 'GAME' AND external_ref = 'https://www.nytimes.com/games/strands';

UPDATE content_items SET thumbnail_url = 'https://www.nytimes.com/games-assets/v2/assets/icons/mini.svg'
WHERE type = 'GAME' AND external_ref = 'https://www.nytimes.com/crosswords/game/mini';
