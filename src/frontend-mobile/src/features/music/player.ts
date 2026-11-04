// Imperative singleton around `expo-audio`'s `createAudioPlayer` so playback survives screen navigation
// (e.g. listening to music while reading news inside a WebView).
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer, type AudioStatus } from "expo-audio";

type StatusListener = (status: AudioStatus) => void;

let player: AudioPlayer | null = null;
let modeReady = false;
const listeners = new Set<StatusListener>();

async function ensureMode() {
  if (modeReady) return;
  modeReady = true;
  await setAudioModeAsync({ playsInSilentMode: true, interruptionMode: "mixWithOthers" }).catch(() => undefined);
}

function getPlayer(): AudioPlayer {
  if (!player) {
    void ensureMode();
    player = createAudioPlayer(null, { updateInterval: 500 });
    player.addListener("playbackStatusUpdate", (status) => {
      listeners.forEach((l) => l(status));
    });
  }
  return player;
}

export const musicPlayer = {
  loadAndPlay(uri: string, volume0to1: number) {
    const p = getPlayer();
    p.volume = Math.max(0, Math.min(1, volume0to1));
    p.replace({ uri });
    p.play();
  },
  play() {
    getPlayer().play();
  },
  pause() {
    player?.pause();
  },
  stop() {
    if (!player) return;
    player.pause();
    void player.seekTo(0).catch(() => undefined);
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

