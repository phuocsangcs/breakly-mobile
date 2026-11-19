// Downloaded tracks: metadata persisted in kv, files on disk (native). Offline copies play without network
// and show up in the "Downloaded" station. Only tracks whose licence allows it (downloadUrl set) can be saved.
import { create } from "zustand";
import { kv, StorageKeys } from "@/core/storage/kv";
import {
  canKeepOfflineCopies,
  deleteTrackFile,
  downloadTrackFile,
  exportToDevice,
  fileExists,
  mp3FileName,
} from "./downloadFiles";
import type { Track } from "./types";

export interface DownloadedTrack extends Track {
  localUri: string;
  sizeBytes: number;
  downloadedAt: string;
}

type Status = "downloading" | "error";

interface DownloadsState {
  items: Record<string, DownloadedTrack>;
  status: Record<string, Status>;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  download: (track: Track) => Promise<void>;
  remove: (trackId: string) => Promise<void>;
  saveToDevice: (trackId: string) => Promise<"saved" | "shared" | "cancelled">;
}

export const DOWNLOADED_CATEGORY = "downloaded";
export { canKeepOfflineCopies };

export const useDownloadsStore = create<DownloadsState>((set, get) => {
  const persist = () => kv.set(StorageKeys.musicDownloads, get().items);

  return {
    items: {},
    status: {},
    hydrated: false,

    hydrate: async () => {
      if (get().hydrated) return;
      const saved = (await kv.get<Record<string, DownloadedTrack>>(StorageKeys.musicDownloads)) ?? {};
      // Drop entries whose file was removed by the OS or the user.
      const alive = Object.fromEntries(Object.entries(saved).filter(([, t]) => fileExists(t.localUri)));
      set({ items: alive, hydrated: true });
      if (Object.keys(alive).length !== Object.keys(saved).length) await persist();
    },

    download: async (track) => {
      const url = track.downloadUrl;
      if (!url || get().status[track.id] === "downloading" || get().items[track.id]) return;
      set({ status: { ...get().status, [track.id]: "downloading" } });
      try {
        const { uri, sizeBytes } = await downloadTrackFile(track, url);
        const { [track.id]: _, ...rest } = get().status;
        if (!canKeepOfflineCopies) {
          set({ status: rest }); // the browser took over the download
          return;
        }
        const entry: DownloadedTrack = {
          ...track, localUri: uri, sizeBytes, downloadedAt: new Date().toISOString(),
        };
        set({ items: { ...get().items, [track.id]: entry }, status: rest });
        await persist();
      } catch {
        set({ status: { ...get().status, [track.id]: "error" } });
      }
    },

    remove: async (trackId) => {
      const item = get().items[trackId];
      if (!item) return;
      deleteTrackFile(item.localUri);
      const { [trackId]: _, ...rest } = get().items;
      set({ items: rest });
      await persist();
    },

    saveToDevice: async (trackId) => {
      const item = get().items[trackId];
      if (!item) return "cancelled";
      return exportToDevice(item.localUri, mp3FileName(item));
    },
  };
});

/** Local file for a track when it was downloaded, so playback works offline. */
export function localUriFor(trackId: string): string | null {
  return useDownloadsStore.getState().items[trackId]?.localUri ?? null;
}

export function downloadedTracks(): DownloadedTrack[] {
  return Object.values(useDownloadsStore.getState().items)
    .sort((a, b) => b.downloadedAt.localeCompare(a.downloadedAt));
}
