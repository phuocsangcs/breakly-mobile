// Domain types for the Game Corner: curated daily web games with per-user "played today" and streak.
export interface Game {
  id: string;
  title: string;
  description: string | null;
  url: string;
  category: string | null;
  provider: string | null;
  thumbnailUrl: string | null;
  playedToday: boolean;
  currentStreak: number;
}

export interface GamePlayResponse {
  gameId: string;
  playDate: string; // YYYY-MM-DD in the user's time zone
  firstPlayToday: boolean;
  currentStreak: number;
}

/** Public catalog row from GET /content?type=GAME (used for guests). */
export interface GameContentItem {
  id: string;
  externalRef: string;
  title: string;
  description: string | null;
  category: string | null;
  thumbnailUrl: string | null;
  author: string | null;
}
