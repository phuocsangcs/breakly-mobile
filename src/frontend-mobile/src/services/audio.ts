// AudioService singleton managing background music, looping ambient tracks, and volume.
export class AudioService {
  private static instance: AudioService;

  private constructor() {}

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public play(trackUrl: string) {}
  public pause() {}
  public setVolume(level: number) {}
}

export const audioService = AudioService.getInstance();

