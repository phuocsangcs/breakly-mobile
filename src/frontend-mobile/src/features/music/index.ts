// Public API of the music feature.
export { useMusicCategories, useMusicPlayer } from "./hooks";
export { useMusicStore, onMusicPlayingSecond } from "./store";
export { DownloadActionButton, DownloadIconButton } from "./components/DownloadButton";
export { SeekBar } from "./components/SeekBar";
export { licenseLabel } from "./license";
export { canKeepOfflineCopies, DOWNLOADED_CATEGORY, useDownloadsStore, type DownloadedTrack } from "./downloads";
export type * from "./types";

