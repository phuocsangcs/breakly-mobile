// Navigation guard for the game browser: stay on the game's own site, never jump to native apps or other sites.

/** Hosts the in-app game browser may navigate to (the game site itself, including its login pages). */
export function allowedHostsFor(gameUrl: string): string[] {
  try {
    const host = new URL(gameUrl).hostname.replace(/^www\./, "");
    // NYT games share sign-in and assets across nytimes.com subdomains and the nyt.com short domain.
    return host.endsWith("nytimes.com") ? ["nytimes.com", "nyt.com"] : [host];
  } catch {
    return [];
  }
}

export type NavigationDecision = "allow" | "open-external" | "block";

export function decideNavigation(url: string, allowedHosts: string[]): NavigationDecision {
  if (url.startsWith("about:") || url.startsWith("data:") || url.startsWith("blob:")) return "allow";
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return "block";
  }
  // intent://, nytimes://, market://… would leave the time-boxed break for another app.
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return "block";
  const host = parsed.hostname;
  const allowed = allowedHosts.some((h) => host === h || host.endsWith(`.${h}`));
  return allowed ? "allow" : "open-external";
}
