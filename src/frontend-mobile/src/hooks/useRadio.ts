// Custom hook managing radio streaming channels, playing state, and volume.
export function useRadio() {
  return {
    isPlaying: false,
    activeStation: null,
  };
}

