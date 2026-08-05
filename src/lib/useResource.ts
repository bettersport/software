"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Fetches a JSON resource ({ data }) from an API route and keeps it in local
 * state. Returns the data plus helpers to mutate it optimistically and reload.
 * Pass url=null to skip fetching (e.g. while the session is still loading).
 */
export function useResource<T>(url: string | null, empty: T) {
  const [data, setData] = useState<T>(empty);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!url) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setData((json.data ?? empty) as T);
      }
    } catch {
      /* keep previous data */
    } finally {
      setLoading(false);
    }
    // `empty` is a stable caller literal; intentionally excluded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, setData, loading, reload };
}

/** POST/PATCH/DELETE helper that returns the parsed JSON or throws on error. */
export async function apiSend<T = unknown>(
  url: string,
  method: "POST" | "PATCH" | "PUT" | "DELETE",
  body?: unknown,
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Error ${res.status}`);
  return json as T;
}
