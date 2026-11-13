import type { StyleProp, ViewStyle } from "react-native";
export interface ArticleWebViewProps {
  url: string;
  style?: StyleProp<ViewStyle>;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onLoadProgress?: (progress: number) => void;
  onError?: () => void;
}
