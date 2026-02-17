import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";

export function useCategoryFollows(userId: string | null) {
  const [follows, setFollows] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const followSet = useMemo(() => new Set(follows), [follows]);

  useEffect(() => {
    if (!userId) {
      setFollows([]);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_category_follows")
        .select("category")
        .eq("user_id", userId);

      if (!cancelled) {
        if (error) {
          console.error("user_category_follows load error:", error);
          setFollows([]);
        } else {
          setFollows((data ?? []).map((r: any) => String(r.category)));
        }
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const toggleFollow = async (category: string) => {
    if (!userId) return;

    const id = String(category);
    const isOn = followSet.has(id);

    // optimistički UI
    setFollows((prev) => (isOn ? prev.filter((x) => x !== id) : [...prev, id]));

    if (isOn) {
      const { error } = await supabase
        .from("user_category_follows")
        .delete()
        .eq("user_id", userId)
        .eq("category", id);

      if (error) {
        console.error("user_category_follows delete error:", error);
        // rollback
        setFollows((prev) => [...prev, id]);
      }
    } else {
      const { error } = await supabase.from("user_category_follows").insert({
        user_id: userId,
        category: id,
      });

      if (error) {
        console.error("user_category_follows insert error:", error);
        // rollback
        setFollows((prev) => prev.filter((x) => x !== id));
      }
    }
  };

  return { follows, followSet, toggleFollow, loading };
}
