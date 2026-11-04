// Coordinates exclusive audio between the global music player and the TV screen (FR 4.5):
// entering TV pauses music if it was playing; leaving TV resumes it only if it wasn't paused manually.

interface MusicFocusTarget {
  isPlaying: () => boolean;
  pause: () => void;
  resume: () => void;
}

let musicTarget: MusicFocusTarget | null = null;
let resumeOnVideoExit = false;

export const mediaFocus = {
  registerMusic(target: MusicFocusTarget) {
    musicTarget = target;
  },
  enterVideo() {
    if (musicTarget?.isPlaying()) {
      resumeOnVideoExit = true;
      musicTarget.pause();
    } else {
      resumeOnVideoExit = false;
    }
  },
  exitVideo() {
    if (resumeOnVideoExit) {
      resumeOnVideoExit = false;
      musicTarget?.resume();
    }
  },
  clearVideoHold() {
    resumeOnVideoExit = false;
  },
};

