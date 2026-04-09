"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useRealtime<T>(table: string, filter?: { column: string; value: string }) {
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          ...(filter ? { filter: `${filter.column}=eq.${filter.value}` } : {}),
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setData((prev) => [...prev, payload.new as T]);
          } else if (payload.eventType === "UPDATE") {
            setData((prev) =>
              prev.map((item) =>
                (item as Record<string, unknown>).id === (payload.new as Record<string, unknown>).id ? (payload.new as T) : item
              )
            );
          } else if (payload.eventType === "DELETE") {
            setData((prev) =>
              prev.filter((item) => (item as Record<string, unknown>).id !== (payload.old as Record<string, unknown>).id)
            );
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [table, filter?.column, filter?.value]);

  return data;
}
