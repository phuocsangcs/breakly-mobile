// Pure helpers for the YouTube browser: which navigations are allowed and which URL is a video page.

const YOUTUBE_HOSTS = ["youtube.com", "youtu.be", "youtube-nocookie.com"];
// Cookie-consent and region pages YouTube may show before the home feed.
const CONSENT_HOSTS = ["consent.youtube.com", "consent.google.com"];

export type YouTubeNavigationDecision = "allow" | "open-external" | "block";

export function decideYouTubeNavigation(url: string): YouTubeNavigationDecision {
  if (url.startsWith("about:") || url.startsWith("data:") || url.startsWith("blob:")) return "allow";
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return "block";
  }
  // intent://, vnd.youtube://, market://… would leave the break for the YouTube app or the store.
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return "block";
  const host = parsed.hostname;
  const matches = (h: string) => host === h || host.endsWith(`.${h}`);
  if (YOUTUBE_HOSTS.some(matches) || CONSENT_HOSTS.some(matches)) return "allow";
  return "open-external";
}

/** Returns the video id for /watch?v=…, /shorts/…, /live/… and youtu.be/… URLs, otherwise null. */
export function extractYouTubeVideoId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const host = parsed.hostname;
  if (host === "youtu.be") return parsed.pathname.slice(1) || null;
  if (!host.endsWith("youtube.com")) return null;
  if (parsed.pathname === "/watch") return parsed.searchParams.get("v");
  const m = parsed.pathname.match(/^\/(shorts|live)\/([^/?#]+)/);
  return m ? m[2] : null;
}
