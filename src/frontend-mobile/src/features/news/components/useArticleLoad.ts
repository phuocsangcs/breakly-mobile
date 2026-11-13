import { useEffect, useRef, useState } from "react";
import { createArticleLoadAttempt, isArticleUrl, type ArticleLoadError } from "./articleLoad";
import type { ArticleWebViewProps } from "./ArticleWebView.types";

export function useArticleLoad(props: ArticleWebViewProps) {
  const callbacks = useRef(props);
  useEffect(() => { callbacks.current = props; }, [props]);
  const [error, setError] = useState<ArticleLoadError | null>(null);
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const activeRetry = useRef(retry);
  const currentUrl = useRef(props.url);
  const [sourceUrl, setSourceUrl] = useState(props.url);
  const [failedUrl, setFailedUrl] = useState(props.url);
  const attempt = useRef<ReturnType<typeof createArticleLoadAttempt> | null>(null);

  useEffect(() => {
    activeRetry.current = retry;
    const next = createArticleLoadAttempt({
      start: () => { setLoading(true); callbacks.current.onLoadStart?.(); },
      finish: () => { setLoading(false); callbacks.current.onLoadProgress?.(1); callbacks.current.onLoadEnd?.(); },
      fail: (reason) => { setFailedUrl(currentUrl.current); setError(reason); setLoading(false); callbacks.current.onError?.(); callbacks.current.onLoadEnd?.(); },
    });
    attempt.current = next;
    if (isArticleUrl(sourceUrl)) next.start();
    else next.fail("invalid-url");
    return () => next.dispose();
  }, [sourceUrl, retry]);

  return { error, loading, retry, failedUrl, sourceUrl,
    start: (url: string) => { if (activeRetry.current !== retry) return; currentUrl.current = url; attempt.current?.start(); },
    finish: () => { if (activeRetry.current === retry) attempt.current?.finish(); },
    fail: (reason: ArticleLoadError, url?: string) => {
      if (activeRetry.current !== retry) return;
      if (url) currentUrl.current = url;
      attempt.current?.fail(reason);
    },
    tryAgain: () => { attempt.current?.dispose(); setError(null); setLoading(true); setSourceUrl(currentUrl.current); setRetry((n) => n + 1); },
  };
}
