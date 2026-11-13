export type ArticleLoadError = "network" | "timeout" | "http" | "process" | "invalid-url";
export const ARTICLE_TIMEOUT_MS = 20000;

export function isArticleUrl(url: string) {
  try { return ["https:", "http:"].includes(new URL(url).protocol); }
  catch { return false; }
}

/** A failed attempt stays failed until an explicit retry. Late native events cannot revive it. */
export function createArticleLoadAttempt(callbacks: {
  start: () => void; finish: () => void; fail: (error: ArticleLoadError) => void;
}, timeoutMs = ARTICLE_TIMEOUT_MS) {
  let state: "idle" | "loading" | "loaded" | "failed" | "disposed" = "idle";
  let timer: ReturnType<typeof setTimeout> | undefined;
  const clear = () => { clearTimeout(timer); timer = undefined; };
  const fail = (error: ArticleLoadError) => {
    if (state === "disposed" || state === "failed") return;
    state = "failed";
    clear();
    callbacks.fail(error);
  };
  return {
    start() {
      if (state === "disposed" || state === "failed" || state === "loading") return;
      state = "loading";
      callbacks.start();
      timer = setTimeout(() => fail("timeout"), timeoutMs);
    },
    finish() {
      if (state !== "loading") return;
      state = "loaded";
      clear();
      callbacks.finish();
    },
    fail,
    dispose() { state = "disposed"; clear(); },
  };
}
