import { useLayoutEffect } from "react";

const MAX_PARALLEL_PRELOAD = 24;

/**
 * Warm the browser cache for product images as early as possible
 * (e.g. right when a chat response arrives, before PLP paints).
 */
export const preloadImages = (urls: string[], limit = MAX_PARALLEL_PRELOAD) => {
  if (typeof window === "undefined") return;

  const unique = Array.from(
    new Set(urls.map((url) => url?.trim()).filter(Boolean)),
  ).slice(0, limit);

  unique.forEach((url) => {
    const img = new Image();
    img.decoding = "async";
    if ("fetchPriority" in img) {
      (img as HTMLImageElement & { fetchPriority: string }).fetchPriority =
        "high";
    }
    img.src = url;
  });
};

/**
 * Starts downloading every URL immediately (before paint) so the browser
 * does not wait for the first <img> to finish layout / LCP before fetching the rest.
 */
const usePreloadImages = (urls: string[], limit = MAX_PARALLEL_PRELOAD) => {
  const limited = urls.slice(0, limit);
  const urlsKey = limited.join("|");

  useLayoutEffect(() => {
    if (!urlsKey) return;
    preloadImages(urlsKey.split("|").filter(Boolean), limit);
  }, [urlsKey, limit]);
};

export default usePreloadImages;
