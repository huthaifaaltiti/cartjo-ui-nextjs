import { useEffect, useRef, useState } from "react";

// Without caching
// export function useResolvedImages(urls: string[] | undefined) {
//   const [imageMap, setImageMap] = useState<Record<string, string>>({});
//   const [loading, setLoading] = useState(false);

//   const safeUrls = urls ?? [];

//   useEffect(() => {
//     if (!safeUrls.length) {
//       setLoading(false);
//       return;
//     }

//     const uniqueUrls = [...new Set(safeUrls.filter(Boolean))];

//     const fetchAll = async () => {
//       setLoading(true);

//       const entries = await Promise.all(
//         uniqueUrls.map(async (url) => {
//           try {
//             const res = await fetch(
//               `/api/image-proxy?url=${encodeURIComponent(url)}`,
//             );

//             if (!res.ok) return [url, ""] as const;
//             const { base64, contentType } = await res.json();
//             return [url, `data:${contentType};base64,${base64}`] as const;
//           } catch {
//             return [url, ""] as const;
//           }
//         }),
//       );

//       setImageMap(Object.fromEntries(entries));
//       setLoading(false);
//     };

//     fetchAll();
//   }, [safeUrls.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

//   return { imageMap, loading };
// }

const imageCache = new Map<string, string>(); // global cache

const MAX_CONCURRENT = 6;

export function useResolvedImages(urls: string[] | undefined) {
  const [imageMap, setImageMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(false);

  const safeUrls = urls ?? [];

  useEffect(() => {
    abortRef.current = false;

    if (!safeUrls.length) {
      setLoading(false);
      return;
    }

    const uniqueUrls = [...new Set(safeUrls.filter(Boolean))];

    const newMap: Record<string, string> = {};

    const urlsToFetch: string[] = [];

    // 1️⃣ Use cache immediately
    for (const url of uniqueUrls) {
      const cached = imageCache.get(url);
      if (cached) {
        newMap[url] = cached;
      } else {
        urlsToFetch.push(url);
      }
    }

    setImageMap((prev) => ({ ...prev, ...newMap }));

    if (!urlsToFetch.length) return;

    setLoading(true);

    const queue = [...urlsToFetch];

    const worker = async () => {
      while (queue.length && !abortRef.current) {
        const url = queue.shift();
        if (!url) continue;

        try {
          const res = await fetch(
            `/api/image-proxy?url=${encodeURIComponent(url)}`,
          );

          if (!res.ok) continue;

          const { base64, contentType } = await res.json();
          const dataUrl = `data:${contentType};base64,${base64}`;

          imageCache.set(url, dataUrl);

          if (!abortRef.current) {
            setImageMap((prev) => ({
              ...prev,
              [url]: dataUrl,
            }));
          }
        } catch {}
      }
    };

    // 2️⃣ concurrency control (huge performance improvement)
    const workers = Array.from({ length: MAX_CONCURRENT }, worker);

    Promise.all(workers).finally(() => {
      if (!abortRef.current) setLoading(false);
    });

    return () => {
      abortRef.current = true;
    };
  }, [safeUrls.join(",")]);

  return { imageMap, loading };
}
