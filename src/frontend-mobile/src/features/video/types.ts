// Domain types for curated YouTube videos (short vertical clips and long-form videos).
export type VideoFormat = "SHORT" | "LONG";

export interface VideoItem {
  id: string;
  externalRef: string; // YouTube video ID
  title: string;
  description: string | null;
  category: string | null;
  videoFormat: VideoFormat;
  thumbnailUrl: string | null;
  author: string | null;
  durationSeconds: number | null;
}

