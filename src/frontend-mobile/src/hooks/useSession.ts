// Custom hook managing active break session timer countdown and completion status.
export function useSession() {
  return {
    timeRemaining: 300,
    isRunning: false,
  };
}

