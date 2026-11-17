// Web build: youtube.com refuses to be framed, so the TV screen uses the curated embed feed there instead.
import { forwardRef } from "react";
import type { YouTubeBrowserHandle, YouTubeBrowserProps } from "./YouTubeBrowser";

export const YOUTUBE_HOME_URL = "https://m.youtube.com/";

export const YouTubeBrowser = forwardRef<YouTubeBrowserHandle, YouTubeBrowserProps>(function YouTubeBrowser() {
  return null;
});
