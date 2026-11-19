// Turns a Creative Commons licence URL into a short label for attribution ("CC BY-NC-SA 3.0").
// CC BY licences require crediting the artist and linking the licence wherever the track is played.
export function licenseLabel(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(/creativecommons\.org\/(licenses|publicdomain)\/([a-z-]+)\/?([\d.]+)?/i);
  if (!m) return "View licence";
  if (m[1].toLowerCase() === "publicdomain") return m[2].toLowerCase() === "zero" ? "CC0 (public domain)" : "Public domain";
  return `CC ${m[2].toUpperCase()}${m[3] ? ` ${m[3]}` : ""}`;
}
