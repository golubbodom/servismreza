import { useMemo } from "react";
import type { Firm } from "../src/types/firm";
import { useFavorites } from "../src/hooks/useFavorites";

type Props = {
  userId: string | null;
  radiusKm: number;
  firms: Firm[];
  onClose: () => void;
  onSelectFirm: (firm: Firm) => void;
};

const formatKm = (km: number) => {
  if (!Number.isFinite(km)) return "—";
  if (km < 1) return `${km.toFixed(2)} km`;
  return `${km.toFixed(1)} km`;
};

export default function FavoritesView({
  userId,
  radiusKm,
  firms,
  onClose,
  onSelectFirm,
}: Props) {
const { favorites, toggleFavorite } = useFavorites(userId);

  const favoriteFirms = useMemo(() => {
    if (!favorites?.length) return [];
    return firms.filter((f) => favorites.includes(String(f.id)));
  }, [firms, favorites]);

  const near = favoriteFirms.filter((f) => Number.isFinite(f.distanceKm) && f.distanceKm <= radiusKm);
  const far = favoriteFirms.filter((f) => !Number.isFinite(f.distanceKm) || f.distanceKm > radiusKm);

  // ako nema nijedan favorit
  if (!favoriteFirms.length) {
    return (
      <section className="pt-8 pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-brand-navy tracking-tight">
                ⭐ Moji favoriti
              </h2>
              <p className="mt-2 text-slate-600 font-medium">
                Trenutno nemaš sačuvanih firmi.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 inline-flex items-center justify-center rounded-2xl bg-red-50 border border-red-200 px-4 py-2 font-black text-red-700 hover:bg-red-100 active:scale-95 transition"
              aria-label="Zatvori favorite"
            >
              ✕
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 md:p-8">
            <div className="mt-2 text-slate-600 font-semibold">
              Dodaj omiljene firme klikom na ⭐ zvezdicu i pojaviće se ovde.
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-8 pb-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-brand-navy tracking-tight">
              ⭐ Moji favoriti
            </h2>
            <p className="mt-2 text-slate-600 font-medium">
              Klikni na karticu da vidiš detalje.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 inline-flex items-center justify-center rounded-2xl bg-red-50 border border-red-200 px-4 py-2 font-black text-red-700 hover:bg-red-100 active:scale-95 transition"
            aria-label="Zatvori favorite"
          >
            ✕
          </button>
        </div>

        {/* NEAR */}
        <div className="mb-10">
          <div className="flex items-end justify-between mb-4">
            <h3 className="text-lg md:text-xl font-black text-brand-navy">
              U blizini (do {radiusKm} km)
            </h3>
            <span className="text-xs font-black text-slate-500">{near.length} rezultata</span>
          </div>

          {near.length === 0 ? (
            <div className="bg-white/80 border border-slate-200 rounded-2xl p-5 text-slate-700 font-semibold">
              Nema firmi u blizini.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {near.map((f) => (
          <div key={String(f.id)}>
<FavoriteCard
  firm={f}
  badge="near"
  onClick={() => onSelectFirm({ ...f, _isNear: true } as any)}
  onToggleFavorite={() => toggleFavorite(f.id)}
/>          </div>
          ))}

            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-slate-200/70 mb-10" />

        {/* FAR */}
        <div>
          <div className="flex items-end justify-between mb-4">
            <h3 className="text-lg md:text-xl font-black text-brand-navy">
              Šire okruženje
            </h3>
            <span className="text-xs font-black text-slate-500">{far.length} rezultata</span>
          </div>

          {far.length === 0 ? (
            <div className="bg-white/80 border border-slate-200 rounded-2xl p-5 text-slate-700 font-semibold">
              Nema firmi van {radiusKm} km.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {far.map((f) => (
  <div key={String(f.id)}>
<FavoriteCard
  firm={f}
  badge="far"
  onClick={() => onSelectFirm({ ...f, _isNear: false } as any)}
  onToggleFavorite={() => toggleFavorite(f.id)}
/>
  </div>
))}

            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const normalizePlace = (s: string) =>
  (s ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

const areaLabel = (f: any) => {
  const municipality = (f.municipality ?? f.city ?? "").trim();
  const place = (f.city ?? "").trim();

  if (!municipality) return place || "";
  if (!place) return municipality;

  const same = normalizePlace(municipality) === normalizePlace(place);
  return same ? municipality : `${municipality} • ${place}`;
};



function FavoriteCard({
  firm,
  onClick,
  badge,
  onToggleFavorite,
}: {
  firm: Firm;
  onClick: () => void;
  badge: "near" | "far";
  onToggleFavorite: () => void;
}) {

  const isNearBadge = badge === "near";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 active:scale-[0.99]"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="font-black text-brand-navy">{firm.name}</div>
          <div className="text-sm text-slate-600 font-semibold">
                  {areaLabel(firm)}
                </div>
                <div className="text-sm text-slate-600 font-semibold opacity-90">
                  {(firm as any).address}
                </div>

        </div>

        <div className="flex flex-col items-end gap-1">
  <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
    {formatKm(firm.distanceKm)}
  </span>

  {Number.isFinite(firm.distanceKm) && firm.distanceKm <= 2 && isNearBadge && (
    <span className="text-[10px] font-black text-brand-orange bg-orange-50 border border-orange-200 px-2 py-1 rounded-full">
      U blizini
    </span>
  )}
</div>


      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(firm.services ?? []).slice(0, 3).map((s) => (
          <span
            key={s}
            className="text-[10px] font-black text-slate-600 bg-slate-100 px-2 py-1 rounded-full"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className={
            "inline-flex items-center justify-center text-white font-black px-5 py-2 rounded-xl active:scale-95 transition hover:brightness-95 " +
            (isNearBadge ? "bg-brand-orange" : "bg-brand-blue")
          }
        >
          Detalji
        </button>

        <span className="w-7" />
  <button
  type="button"
  aria-label="Ukloni iz favorita"
  title="Ukloni iz favorita"
  onClick={(e) => {
    e.stopPropagation();
    onToggleFavorite();
  }}
  className={`text-2xl leading-none transition active:scale-95 ${
    isNearBadge ? "text-brand-orange" : "text-brand-blue"
  } hover:opacity-80`}
>
  ★
</button>
      </div>
    </div>
  );
}
