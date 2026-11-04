// Domain types for curated music categories and Jamendo tracks.
export interface MusicCategory {
  id: string;
  externalRef: string;
  title: string;
  category: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  durationSeconds: number;
  artworkUrl: string | null;
  streamUrl: string;
  licenseUrl: string | null;
}

