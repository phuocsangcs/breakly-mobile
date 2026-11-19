// Web build: no app file system. "Download" hands the MP3 link to the browser, which saves it to the
// user's Downloads folder (or opens it in a tab when the server does not send a download header).
import type { Track } from "./types";

export const canKeepOfflineCopies = false;

export function mp3FileName(track: Pick<Track, "title" | "artist">): string {
  const base = `${track.artist} - ${track.title}`.replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim();
  return `${base.slice(0, 80) || "track"}.mp3`;
}

export async function downloadTrackFile(track: Track, url: string): Promise<{ uri: string; sizeBytes: number }> {
  const a = document.createElement("a");
  a.href = url;
  a.download = mp3FileName(track);
  a.target = "_blank";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  return { uri: url, sizeBytes: 0 };
}

export function fileExists(): boolean {
  return false;
}

export function deleteTrackFile(): void {}

export async function exportToDevice(): Promise<"saved" | "shared" | "cancelled"> {
  return "cancelled";
}
