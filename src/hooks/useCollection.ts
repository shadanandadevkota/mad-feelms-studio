import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Generic collection hook for any of the CMS tables (work_items,
 * wedding_films, wedding_photos, ad_projects, editorial_projects,
 * media_cases, media_services).
 *
 * - Fetches all rows ordered by sort_order
 * - Optionally filters out is_visible=false (for public pages)
 * - Subscribes to realtime so the site updates as admin edits land
 */
export function useCollection<T extends { id: string; sort_order: number; is_visible: boolean }>(
  table:
    | "work_items"
    | "wedding_films"
    | "wedding_photos"
    | "ad_projects"
    | "editorial_projects"
    | "media_cases"
    | "media_services",
  opts: { onlyVisible?: boolean } = { onlyVisible: true },
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    let q = supabase.from(table).select("*").order("sort_order", { ascending: true });
    if (opts.onlyVisible) q = q.eq("is_visible", true);
    const { data } = await q;
    setItems((data as T[]) ?? []);
    setLoading(false);
  }, [table, opts.onlyVisible]);

  useEffect(() => {
    load();
    const channel = supabase
      .channel(`cms:${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, load]);

  return { items, loading, reload: load };
}
