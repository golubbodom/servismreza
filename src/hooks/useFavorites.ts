import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";

export function useFavorites(userId: string | null) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshFavorites = useCallback(async () => {
    if (!userId) {
      setFavorites([]);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("favorites")
      .select("firm_id")
      .eq("user_id", userId);

    setLoading(false);

    if (error) {
      console.error("Favorites select error:", error);
      setFavorites([]);
      return;
    }

    const ids = (data ?? []).map((r: any) => String(r.firm_id));
    setFavorites(ids);
  }, [userId]);

  // Učitaj favorite svaki put kad se userId promeni
  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  // Realtime sync (da se FavoritesView update-uje odmah)
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("favorites_rt")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "favorites",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          refreshFavorites();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, refreshFavorites]);

  const isFavorite = useCallback(
    (firmId: string) => favorites.includes(String(firmId)),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (firmId: string) => {
      if (!userId) {
        return { ok: false as const, reason: "not_logged_in" as const };
      }

      const id = String(firmId);
      const already = favorites.includes(id);

      // Optimistic UI
      setFavorites((prev) => (already ? prev.filter((x) => x !== id) : [...prev, id]));

      if (already) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("firm_id", id);

        if (error) {
          console.error("Favorites delete error:", error);
          // rollback
          setFavorites((prev) => [...prev, id]);
          return { ok: false as const, reason: "db_error" as const };
        }

        return { ok: true as const, action: "removed" as const };
      } else {
        const { error } = await supabase.from("favorites").insert({
          user_id: userId,
          firm_id: id,
        });

        if (error) {
          console.error("Favorites insert error:", error);
          // rollback
          setFavorites((prev) => prev.filter((x) => x !== id));
          return { ok: false as const, reason: "db_error" as const };
        }

        return { ok: true as const, action: "added" as const };
      }
    },
    [userId, favorites]
  );

  return { favorites, loading, isFavorite, toggleFavorite, refreshFavorites };
}
