import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteContentRow = {
  id: string;
  key: string;
  value: Record<string, any>;
  description: string | null;
  updated_at: string;
};

/**
 * Fetches a single site_content entry by key. Returns the JSON `value`
 * (or `fallback` while loading / on error). Subscribes to realtime
 * updates so admin edits propagate without a refresh.
 */
export function useSiteContent<T extends Record<string, any>>(
  key: string,
  fallback: T,
): { value: T; loading: boolean } {
  const [value, setValue] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (data?.value) setValue({ ...fallback, ...(data.value as T) });
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    load();
    const channel = supabase
      .channel(`site_content:${key}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content", filter: `key=eq.${key}` },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [key, load]);

  return { value, loading };
}
