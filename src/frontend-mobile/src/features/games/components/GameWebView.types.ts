import type { StyleProp, ViewStyle } from "react-native";

export interface GameWebViewProps {
  url: string;
  title: string;
  style?: StyleProp<ViewStyle>;
  onLoadStart?: () => void;
  onLoadProgress?: (progress: number) => void;
  onLoadEnd?: () => void;
  /** Fired once per mount when the user actually gets the game in front of them (counts as a play). */
  onOpened?: () => void;
  onError?: () => void;
}
