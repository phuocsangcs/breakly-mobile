// Native file operations for downloaded tracks (expo-file-system + expo-sharing).
// Files live in the app's document folder so they keep playing offline; "save to device" copies one out.
import { Directory, File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import type { Track } from "./types";

export const canKeepOfflineCopies = true;

function musicDir(): Directory {
  const dir = new Directory(Paths.document, "music");
  dir.create({ idempotent: true, intermediates: true });
  return dir;
}

/** "Artist - Title.mp3" with characters that file systems reject removed. */
export function mp3FileName(track: Pick<Track, "title" | "artist">): string {
  const base = `${track.artist} - ${track.title}`.replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim();
  return `${base.slice(0, 80) || "track"}.mp3`;
}

export async function downloadTrackFile(track: Track, url: string): Promise<{ uri: string; sizeBytes: number }> {
  const target = new File(musicDir(), `${track.id}.mp3`);
  const file = await File.downloadFileAsync(url, target, { idempotent: true });
  return { uri: file.uri, sizeBytes: file.size };
}

export function fileExists(uri: string): boolean {
  try {
    return new File(uri).exists;
  } catch {
    return false;
  }
}

export function deleteTrackFile(uri: string): void {
  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch {
    // already gone
  }
}

/**
 * Puts a copy of the MP3 where the user can find it outside the app.
 * Android: the user picks a folder (e.g. Download or Music) and the file is copied there.
 * iOS: the share sheet, where "Save to Files" stores it on the phone.
 */
export async function exportToDevice(uri: string, fileName: string): Promise<"saved" | "shared" | "cancelled"> {
  const source = new File(uri);
  if (Platform.OS === "android") {
    let folder: Directory;
    try {
      folder = await Directory.pickDirectoryAsync();
    } catch {
      return "cancelled";
    }
    const out = folder.createFile(fileName.replace(/\.mp3$/i, ""), "audio/mpeg");
    out.write(await source.bytes());
    return "saved";
  }
  if (!(await Sharing.isAvailableAsync())) return "cancelled";
  await Sharing.shareAsync(source.uri, { mimeType: "audio/mpeg", UTI: "public.mp3", dialogTitle: fileName });
  return "shared";
}
