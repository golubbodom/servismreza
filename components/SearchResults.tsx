import React, { useEffect, useMemo, useState } from "react";
import type { Firm } from "../src/types/firm";
import { useFavorites } from "../src/hooks/useFavorites";

// ---- Search helpers (synonyms + normalize) ----
const SYNONYMS: Record<string, string[]> = {
  // ✅ ELEKTRIKA
  elektrika: [
    "elektricar", "električar", "struja", "osigurac", "osigurač", "automatski osigurac",
    "uticnica", "utičnica", "prekidac", "prekidač", "rasveta", "svetlo", "kvar"
  ],

  // ✅ VODOINSTALATER
  vodoinstalater: [
    "vodoinstalater", "vodoinstalateri", "cev", "cevi", "pukla cev", "curenje", "curi",
    "slavina", "wc", "bojler", "odgusenje", "odgušenje", "kanalizacija", "sifon"
  ],

  // ✅ MOLER
  moler: ["moler", "moleri", "krecenje", "krečenje", "gletovanje", "gips", "gipsar", "farbanje"],

  // ✅ KERAMICARI (tvoj query je "Keramičari" - preporuka: spusti na "keramicar", ali može i ovako)
  "Keramičari": ["keramicar", "keramičar", "pločice", "plocice", "fugovanje", "kupatilo", "kuhinja"],

  // ✅ KROVOPOKRIVACI
  "Krovopokrivači": ["krov", "crep", "crepovi", "lim", "oluk", "oluci", "gradja", "tegola"],

  // ✅ PVC
  pvc: ["pvc", "stolarija", "prozori", "prozor", "vrata", "roletne", "komarnici", "dihtovanje", "okovi"],

  // ✅ BRAVAR (tvoj query je "Bravar")
  Bravar: ["bravar", "brava", "brave", "cilindar", "cilindri", "otkljucavanje", "otključavanje", "kljuc", "ključ"],

  // ✅ KLIMA SERVIS
  "klima servis": ["klima", "klime", "servis klime", "dopuna freona", "freon", "montaza klime", "montaža klime", "ciscenje klime", "čišćenje klime"],

  // ✅ GREJANJE
  Grejanje: ["grejanje", "radijator", "radijatori", "kotao", "kotlovi", "peć", "pec", "toplana", "bojler"],

  // ✅ VIDEO NADZOR (tvoj query je "Kamera")
  Kamera: ["kamera", "kamere", "video nadzor", "nadzor", "dvr", "nvr", "alarm", "alarmsistem"],

  // ✅ IT SERVIS
  "racunar servis": ["racunar", "računar", "kompjuter", "laptop", "windows", "instalacija", "mreza", "mreža", "servis racunara"],

  // ✅ SERVIS BELE TEHNIKE
  "servis bele tehnike": [
    "bela tehnika", "servis bele tehnike", "ves masina", "veš masina", "vesmasina",
    "sudomasina", "sudomašina", "frizider", "frižider", "zamrzivac", "zamrzivač",
    "sporet", "šporet", "rerna", "ringla", "bojler"
  ],
};

const normalizeText = (s: string) =>
  (s ?? "")
    .toLowerCase()
    .replace(/đ/g, "dj")
    .replace(/\u0111/g, "dj")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// ---- Invertovani indeks sinonima: token/fraza -> kanon ključ ----
const buildSynIndex = () => {
  const phraseToCanon = new Map<string, string>(); // "bela tehnika" -> "servis bele tehnike"
  const tokenToCanons = new Map<string, Set<string>>(); // "ves" -> {"servis bele tehnike"}

  const addTokenCanon = (tok: string, canon: string) => {
    const t = normalizeText(tok);
    if (!t) return;
    if (!tokenToCanons.has(t)) tokenToCanons.set(t, new Set());
    tokenToCanons.get(t)!.add(canon);
  };

  Object.entries(SYNONYMS).forEach(([canonRaw, list]) => {
    const canon = normalizeText(canonRaw);

    // kanon sam sebe
    addTokenCanon(canonRaw, canon);
    phraseToCanon.set(normalizeText(canonRaw), canon);

    (list ?? []).forEach((phrase) => {
      const p = normalizeText(phrase);
      if (!p) return;

      // cela fraza -> kanon
      phraseToCanon.set(p, canon);

      // tokeni iz fraze -> kanon
      p.split(" ").forEach((tok) => addTokenCanon(tok, canon));
    });
  });

  return { phraseToCanon, tokenToCanons };
};

const SYN_INDEX = buildSynIndex();

const expandTokens = (token: string) => {
  const t = normalizeText(token);
  if (!t) return [];

  const expanded = new Set<string>([t]);

  // 1) direktan ključ
  const direct = SYNONYMS[t];
  if (direct) direct.forEach((x) => expanded.add(normalizeText(x)));

  // 2) token -> kanoni
  const canons = SYN_INDEX.tokenToCanons.get(t);
  if (canons) {
    canons.forEach((canon) => {
      expanded.add(canon);

      const rawCanonKey = Object.keys(SYNONYMS).find((k) => normalizeText(k) === canon);
      if (rawCanonKey) {
        SYNONYMS[rawCanonKey].forEach((x) => expanded.add(normalizeText(x)));
      }
    });
  }

  return [...expanded].filter(Boolean);
};


const normalizeCity = (input: string) =>
  (input ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

type Props = {
  query: string;
  cityQuery?: string;
  radiusKm: number;
  firms: Firm[];
  onClear: () => void;
  onSelectFirm: (firm: Firm) => void;
  onOpenPartner: () => void;
  userId: string | null; 
  cameFromSavedCategories?: boolean;
  onBackToSavedCategories?: () => void;
};

export default function SearchResults({
  query,
  cityQuery = "",
  radiusKm,
  firms,
  onClear,
  onSelectFirm,
  onOpenPartner,
  userId,
  cameFromSavedCategories,
  onBackToSavedCategories,
}: Props) {
  // favorites hook (ako userId null, hook treba da radi “prazno”)
  const { isFavorite, toggleFavorite } = useFavorites(userId);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClear();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClear]);

  const qNorm = normalizeText(query);
  const municipalityNorm = normalizeCity(cityQuery);
  const hasMunicipality = !!municipalityNorm;

  const filtered = useMemo(() => {
    if (!qNorm) return [];

    const rawTokens = qNorm.split(" ").filter(Boolean);
    const tokenGroups = rawTokens.map((t) => expandTokens(t)); // koristi sinonime

    const phraseCanon = SYN_INDEX.phraseToCanon.get(qNorm);
if (phraseCanon) {
  tokenGroups.push([phraseCanon]); // npr "servis bele tehnike"
}

    // 1) grad filter (ako je unet)
    let base = firms;
    if (municipalityNorm) {
      base = firms.filter((f: any) => {
        const m = (f.municipality ?? f.city) as string; // fallback za stare unose
        return normalizeCity(m) === municipalityNorm;
      });
    }

    // 2) filter po query (sa sinonimima)
    return base
      .filter((f) => {
        const hay = normalizeText(
              [f.name, f.city, (f as any).municipality, (f as any).address, ...(f.services ?? [])].join(" ")
                );
        return tokenGroups.every((alts) =>
          alts.some((a) => {
            if (!a) return true;
            const stem = a.length >= 6 ? a.slice(0, 5) : a.length >= 4 ? a.slice(0, 4) : a;
            return hay.includes(a) || (stem.length >= 4 && hay.includes(stem));
          })
        );
      })
      .sort((a, b) => {
        const da = Number.isFinite(a.distanceKm) ? a.distanceKm : Number.POSITIVE_INFINITY;
        const db = Number.isFinite(b.distanceKm) ? b.distanceKm : Number.POSITIVE_INFINITY;
        return da - db;
      });
  }, [qNorm, hasMunicipality, firms]);

  const near = hasMunicipality ? filtered : filtered.filter((f) => f.distanceKm <= radiusKm);
  const far = hasMunicipality ? [] : filtered.filter((f) => f.distanceKm > radiusKm);
  const hasAnyResults = near.length + far.length > 0;

  const formatKm = (km: number) => {
    if (!Number.isFinite(km)) return "";
    if (km < 1) return `${km.toFixed(2)} km`;
    return `${km.toFixed(1)} km`;
  };

  // responsive page size
  const getPageSize = () => (window.innerWidth < 768 ? 4 : 8);
  const [pageSize, setPageSize] = useState(getPageSize());
  useEffect(() => {
    const onResize = () => setPageSize(getPageSize());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const [page, setPage] = useState(1);

  // reset page na 1 kad se promene ulazi
  useEffect(() => {
    setPage(1);
  }, [qNorm, hasMunicipality , radiusKm, pageSize]);

  // ukupne strane po sekciji
  const nearTotalPages = Math.max(1, Math.ceil(near.length / pageSize));
  const farTotalPages = Math.max(1, Math.ceil(far.length / pageSize));
  const totalPages = Math.max(nearTotalPages, farTotalPages);

  // clamp per sekcija
  const nearPageClamped = Math.min(page, nearTotalPages);
  const farPageClamped = Math.min(page, farTotalPages);

  // animacije
  const [nearAnimKey, setNearAnimKey] = useState(0);
  const [farAnimKey, setFarAnimKey] = useState(0);

  useEffect(() => setNearAnimKey((k) => k + 1), [nearPageClamped]);
  useEffect(() => setFarAnimKey((k) => k + 1), [farPageClamped]);

  // slice za near/far
  const nearStart = (nearPageClamped - 1) * pageSize;
  const nearPageItems = near.slice(nearStart, nearStart + pageSize);

  const farStart = (farPageClamped - 1) * pageSize;
  const farPageItems = far.slice(farStart, farStart + pageSize);

  const getPageNumbers = (current: number, total: number) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = new Set<number>();
    pages.add(1);
    pages.add(total);

    pages.add(current);
    pages.add(current - 1);
    pages.add(current + 1);

    if (total > 10) {
      pages.add(current - 2);
      pages.add(current + 2);
    }

    const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

    const out: Array<number | "..."> = [];
    for (let i = 0; i < sorted.length; i++) {
      const p = sorted[i];
      const prev = sorted[i - 1];
      if (i > 0 && prev !== undefined && p - prev > 1) out.push("...");
      out.push(p);
    }
    return out;
  };

  const canShowStars = !!userId;

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


  return (
    <section id="rezultati" className="pt-6 pb-10 md:pt-8 md:pb-14 scroll-mt-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-10 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-brand-navy tracking-tight">
              Rezultati za: <span className="text-brand-blue">“{query}”</span>
            </h2>
            <p className="mt-2 text-slate-600 font-medium">
              {hasMunicipality
                ? `Prikazujemo firme za opštinu: ${cityQuery}`
                : `Najpre prikazujemo firme u krugu od ${radiusKm}km, zatim šire okruženje.`}
            </p>
          </div>
          {cameFromSavedCategories && (
        <button
             type="button"
              onClick={onBackToSavedCategories}
             className= "font-black hover:text-brand-orange transition">
               ← Nazad na sačuvane kategorije
             </button>)}


          <button
            type="button"
            onClick={onClear}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-black text-black hover:bg-red-100 hover:border-red-300 active:scale-95 transition shadow-sm cursor-pointer"
            aria-label="Očisti rezultate"
            title="Očisti rezultate (Esc)"
          >
            <span className="text-base leading-none">✕</span>
            Očisti
          </button>
        </div>

        {!hasAnyResults && (
          <div className="mb-10 rounded-2xl border border-slate-200 bg-white/80 p-6 md:p-8">
            <div className="text-center">
              <div className="text-lg md:text-xl font-black text-brand-navy">Nemate firmu za ovu uslugu?</div>
              <div className="mt-2 text-sm md:text-base text-slate-600 font-semibold">
                Prijavite se besplatno i budite među prvima koje klijenti pronalaze na Servis Mreži.
              </div>

              <button
                type="button"
                onClick={onOpenPartner}
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-brand-orange px-6 py-3 font-black text-white hover:brightness-95 active:scale-95 transition"
              >
                Postani partner
              </button>
            </div>
          </div>
        )}

        {/* NEAR */}
        <div className="mb-10">
          <div className="flex items-end justify-between mb-4">
            <h3 className="text-lg md:text-xl font-black text-brand-navy">
              {hasMunicipality  ? `Firme u opštini: ${cityQuery}` : `Firme u vašoj blizini (do ${radiusKm} km)`}
            </h3>
            <span className="text-xs font-black text-slate-500">{near.length} rezultata</span>
          </div>

          {near.length === 0 ? (
            <div className="bg-white/80 border border-slate-200 rounded-2xl p-5 text-slate-700 font-semibold">
              {hasMunicipality  ? `Trenutno nema firmi za grad "${cityQuery}".` : `Trenutno nema firmi u krugu do ${radiusKm} km.`}
            </div>
          ) : (
            <div key={`near-grid-${nearAnimKey}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 page-fade">
              {nearPageItems.map((f) => {
                const fav = canShowStars ? isFavorite(f.id) : false;

                return (
                  <div
                    key={f.id}
                    onClick={() => onSelectFirm({ ...f, _isNear: true } as any)}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-black text-brand-navy">{f.name}</div>
                        <div className="text-sm text-slate-600 font-semibold">
                              {areaLabel(f)}
                            </div>
                            <div className="text-sm text-slate-600 font-semibold opacity-90">
                              {(f as any).address}
                            </div>

                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                          {formatKm(f.distanceKm)}
                        </span>

                        {Number.isFinite(f.distanceKm) && f.distanceKm <= 1 && (
                          <span className="text-[10px] font-black text-brand-orange bg-orange-50 border border-orange-200 px-2 py-1 rounded-full">
                            U blizini
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {(f.services ?? []).slice(0, 3).map((s) => (
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
                          onSelectFirm({ ...f, _isNear: true } as any);
                        }}
                        className="inline-flex items-center justify-center bg-brand-orange text-white font-black px-5 py-2 rounded-xl active:scale-95 transition hover:brightness-95"
                      >
                        Detalji
                      </button>

                      {canShowStars ? (
                        <button
                          type="button"
                          aria-label="Sačuvaj u favorite"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(f.id);
                          }}
                          className={`text-2xl leading-none transition active:scale-95 ${
                            fav ? "text-brand-orange" : "text-slate-300 hover:text-slate-500"
                          }`}
                          title={fav ? "U favoritima" : "Dodaj u favorite"}
                        >
                          ★
                        </button>
                      ) : (
                        <span className="w-7" />
                      )}
                    </div>
                  </div>
                );
              })}

              {/* NEAR spaceri */}
              {Array.from({ length: Math.max(0, pageSize - nearPageItems.length) }).map((_, i) => (
                <div
                  key={`near-spacer-${i}`}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm opacity-0 pointer-events-none"
                />
              ))}
            </div>
          )}
        </div>

        {/* PAGER (jedan, upravlja i near i far) */}
        {totalPages > 1 && (
          <div id="pager-mid" className="mt-2 mb-10 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-brand-navy disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 active:scale-95 transition"
            >
              ←
            </button>

            {getPageNumbers(Math.min(page, totalPages), totalPages).map((p, idx) =>
              p === "..." ? (
                <span key={`dots-${idx}`} className="px-2 text-sm font-black text-slate-400">
                  …
                </span>
              ) : (
                <button
                  key={`page-${p}`}
                  type="button"
                  onClick={() => setPage(p)}
                  className={
                    p === Math.min(page, totalPages)
                      ? "rounded-xl bg-brand-navy text-white px-3 py-2 text-sm font-black shadow-sm active:scale-95 transition"
                      : "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-brand-navy hover:bg-slate-50 active:scale-95 transition"
                  }
                  aria-current={p === Math.min(page, totalPages) ? "page" : undefined}
                >
                  {p}
                </button>
              )
            )}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-brand-navy disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 active:scale-95 transition"
            >
              →
            </button>
          </div>
        )}

        {/* FAR */}
        {!hasMunicipality  && (
          <>
            <div className="h-px w-full bg-slate-200/70 mb-10" />

            <div>
              <div className="flex items-end justify-between mb-4">
                <h3 className="text-lg md:text-xl font-black text-brand-navy">
                  Firme u širem okruženju ({radiusKm}+ km)
                </h3>
                <span className="text-xs font-black text-slate-500">{far.length} rezultata</span>
              </div>

              {far.length === 0 ? (
                <div className="bg-white/80 border border-slate-200 rounded-2xl p-5 text-slate-700 font-semibold">
                  Trenutno nema firmi van {radiusKm} km.
                </div>
              ) : (
                <div key={`far-grid-${farAnimKey}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 page-fade">
                  {farPageItems.map((f) => {
                    const fav = canShowStars ? isFavorite(f.id) : false;

                    return (
                      <div
                        key={f.id}
                        onClick={() => onSelectFirm({ ...f, _isNear: false } as any)}
                        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 active:scale-[0.99]"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-black text-brand-navy">{f.name}</div>
                            <div className="text-sm text-slate-600 font-semibold">
                                {areaLabel(f)}
                              </div>
                              <div className="text-sm text-slate-600 font-semibold opacity-90">
                                {(f as any).address}
                              </div>

                          </div>

                          <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                            {formatKm(f.distanceKm)}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {(f.services ?? []).slice(0, 3).map((s) => (
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
                              onSelectFirm({ ...f, _isNear: false } as any);
                            }}
                            className="inline-flex items-center justify-center bg-brand-blue text-white font-black px-5 py-2 rounded-xl active:scale-95 transition hover:brightness-95">
                            Detalji
                          </button>

                          {canShowStars ? (
                            <button
                              type="button"
                              aria-label="Sačuvaj u favorite"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(f.id);
                              }}
                              className={`text-2xl leading-none transition active:scale-95 ${
                                fav ? "text-brand-blue" : "text-slate-300 hover:text-slate-500"
                              }`}
                              title={fav ? "U favoritima" : "Dodaj u favorite"}
                            >
                              ★
                            </button>
                          ) : (
                            <span className="w-7" />
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* FAR spaceri */}
                  {Array.from({ length: Math.max(0, pageSize - farPageItems.length) }).map((_, i) => (
                    <div
                      key={`far-spacer-${i}`}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm opacity-0 pointer-events-none"
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
