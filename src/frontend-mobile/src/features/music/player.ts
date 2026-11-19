// Imperative singleton around `expo-audio`'s `createAudioPlayer` so playback survives screen navigation
// (e.g. listening to music while reading news inside a WebView).
// iOS: keeps playing with the screen locked (FR 4.x) and shows title/artist/artwork with play/pause and
// seek on the lock screen and in Control Center. Both need the audio session to own audio focus (doNotMix).
import { Platform } from "react-native";
import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioMetadata,
  type AudioPlayer,
  type AudioStatus,
} from "expo-audio";

type StatusListener = (status: AudioStatus) => void;

export type TrackMetadata = AudioMetadata;

let player: AudioPlayer | null = null;
let modeReady = false;
let lockScreenActive = false;
const listeners = new Set<StatusListener>();
const isNative = Platform.OS !== "web";

async function ensureMode() {
  if (modeReady) return;
  modeReady = true;
  await setAudioModeAsync({
    playsInSilentMode: true,
    // Keep the session alive when the phone is locked or the app is in the background.
    shouldPlayInBackground: true,
    // Required for lock-screen controls; other apps' audio pauses while Breakly plays.
    interruptionMode: "doNotMix",
  }).catch(() => undefined);
}

function canUseAudio(): boolean {
  if (Platform.OS === "web") {
    // Avoid running inside Node.js during SSR / Expo Router bundling
    return typeof window !== "undefined" && typeof Audio !== "undefined";
  }
  return true;
}

function getPlayer(): AudioPlayer | null {
  if (!canUseAudio()) return null;
  if (!player) {
    void ensureMode();
    try {
      player = createAudioPlayer(null, { updateInterval: 500 });
      player.addListener("playbackStatusUpdate", (status) => {
        listeners.forEach((l) => l(status));
      });
    } catch {
      return null;
    }
  }
  return player;
}

function showOnLockScreen(p: AudioPlayer, metadata: TrackMetadata | undefined) {
  if (!isNative) return;
  try {
    if (!lockScreenActive) {
      // A single player has no next/previous on the lock screen; seek ±15 s covers skipping around a track.
      p.setActiveForLockScreen(true, metadata, { showSeekForward: true, showSeekBackward: true });
      lockScreenActive = true;
    } else if (metadata) {
      p.updateLockScreenMetadata(metadata);
    }
  } catch {
    // Lock-screen controls are a nice-to-have; playback must not fail because of them.
  }
}

export const musicPlayer = {
  loadAndPlay(uri: string, volume0to1: number, metadata?: TrackMetadata) {
    const p = getPlayer();
    if (!p) return;
    p.volume = Math.max(0, Math.min(1, volume0to1));
    p.replace({ uri });
    p.play();
    showOnLockScreen(p, metadata);
  },
  play() {
    getPlayer()?.play();
  },
  pause() {
    player?.pause();
  },
  stop() {
    if (!player) return;
    player.pause();
    void player.seekTo(0).catch(() => undefined);
    if (isNative && lockScreenActive) {
      try {
        player.clearLockScreenControls();
      } catch {
        // ignore
      }
      lockScreenActive = false;
    }
  },
  seekTo(seconds: number) {
    if (!player) return;
    void player.seekTo(Math.max(0, seconds)).catch(() => undefined);
  },
  setVolume(volume0to1: number) {
    if (player) player.volume = Math.max(0, Math.min(1, volume0to1));
  },
  subscribe(listener: StatusListener): () => void {
    getPlayer();
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
