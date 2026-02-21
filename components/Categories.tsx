
import React from 'react';
import { CATEGORIES } from "../constants";
import pinOutline from "../src/assets/icons/pin-outline.png";
import pinFilled from "../src/assets/icons/pin-filled.png";

import type { Firm } from "../src/types/firm";

type Props = {
  firms: Firm[];
  onSelectCategory?: (query: string) => void;
  userId?: string | null;
  followSet: Set<string>;
  onToggleFollow: (query: string) => void;
};

const CATEGORY_TERMS: Record<string, string[]> = {
  pvc: ["pvc", "stolarija", "roletne", "okovi", "dihtovanje"],
  moler: ["moler", "molersko", "gipsar", "gipsarski", "fasader", "fasada", "krecenje", "gletovanje"],
  // po potrebi dodaješ za druge kategorije
};



const Categories: React.FC<Props> = ({ firms, onSelectCategory, userId, followSet, onToggleFollow }) =>  {
const PAGE_SIZE = 6;
const norm = (s: string) =>
  (s || "")
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

const [page, setPage] = React.useState(0); // 0 = prva strana, 1 = druga
const [isAnimating, setIsAnimating] = React.useState(false);
const [animDir, setAnimDir] = React.useState<"next" | "prev">("next");

// koliko strana imamo
const totalPages = Math.ceil(CATEGORIES.length / PAGE_SIZE);

// samo 6 komada za trenutnu stranu
const pageItems = React.useMemo(() => {
  const start = page * PAGE_SIZE;
  return CATEGORIES.slice(start, start + PAGE_SIZE);
}, [page]);

const CATEGORY_TERMS: Record<string, string[]> = {
  pvc: ["pvc", "stolarija", "roletne", "okovi", "dihtovanje"],
  moler: ["moler", "molersko", "gipsar", "gipsarski", "fasader", "fasada", "krecenje", "gletovanje"],
  // dodaješ po potrebi
};

const countByQuery = React.useMemo(() => {
  const map: Record<string, number> = {};

  for (const f of firms || []) {
    const services = (f.services || []).map((x) => norm(String(x)));

    for (const c of CATEGORIES) {
      const rawKey = String(c.query || c.name || "");
      const key = norm(rawKey);
      if (!key) continue;

      const terms = (CATEGORY_TERMS[key] ?? [key]).map(norm);

      const hit = services.some((srv) => terms.some((t) => srv.includes(t)));
      if (hit) map[key] = (map[key] || 0) + 1;
    }
  }

  return map;
}, [firms]);


const goToPage = (nextPage: number, dir: "next" | "prev") => {
  if (isAnimating) return;
  if (nextPage < 0 || nextPage >= totalPages) return;

  setAnimDir(dir);
  setIsAnimating(true);

  // mala “out” animacija, pa prebacimo stranu
  window.setTimeout(() => {
    setPage(nextPage);
    // “in” animacija
    window.setTimeout(() => setIsAnimating(false), 20);
  }, 220);
};

const goNext = () => goToPage(page + 1, "next");
const goPrev = () => goToPage(page - 1, "prev");

  return (
    <section id="kategorije" className="pt-16 pb-20 bg-brand-light-blue/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
<h2 className="text-4xl lg:text-5xl font-black text-brand-navy mb-4 tracking-tight">Provereni <span className="text-brand-orange">majstori i firme</span></h2>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto font-medium opacity-90">Mi vas povezujemo sa lokalnim profesionalcima — brzo pronađite uslugu koja vam treba i kontaktirajte direktno.</p>
        </div>
        
        {/* GRID + ANIMACIJA */}
<div
  className={
    "transition-all duration-200 ease-out " +
    (isAnimating
      ? animDir === "next"
        ? "opacity-0 -translate-x-3"
        : "opacity-0 translate-x-3"
      : "opacity-100 translate-x-0")
  }
>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
    {pageItems.map((cat) => (
      <div
        key={cat.id}
        role="button"
        tabIndex={0}
        onClick={() => onSelectCategory?.(cat.query)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSelectCategory?.(cat.query);
        }}
        className="bg-white p-4 md:p-7 rounded-[28px] border border-slate-100 hover:border-brand-orange/20 md:hover:shadow-2xl md:hover:shadow-orange-900/55 md:hover:-translate-y-2 transition-all duration-300 group cursor-pointer relative"
      >
        {(() => {
          const qKey = norm(String(cat.query || cat.name || ""));
          const n = countByQuery[qKey] || 0;

          return (
            <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-100/70 px-2 py-1 text-[11px] font-black text-slate-500/70">
              {n} {n === 1 ? "firma" : "firmi"}
            </div>
          );
        })()}
                <div className="flex items-start justify-between mb-5">
          <div className="text-xl md:text-2x1 w-11 h-11 md:w-14 md:h-14 bg-brand-accent-blue/20 flex items-center justify-center rounded-2xl group-hover:text-white transition-all duration-300">
            <span>{cat.icon}</span>
          </div>

     {userId && (
      
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onToggleFollow(String(cat.query));
    }}
    className="absolute top-3 right-3 rounded-xl p-2
      bg-white/80 hover:bg-white border border-slate-200
      shadow-sm active:scale-95 transition"
    aria-label={followSet.has(String(cat.query)) ? "Otkači kategoriju" : "Zakači kategoriju"}
    title={followSet.has(String(cat.query)) ? "Otkači" : "Zakači"}
  >
    <img
      src={followSet.has(String(cat.query)) ? pinFilled : pinOutline}
      alt=""
      className={`w-5 h-5 object-contain transition-all duration-200 ${
        followSet.has(String(cat.query))
          ? "opacity-100 scale-110"
          : "opacity-20 hover:opacity-80"
      }`}
    />
  </button>
)}


        </div>

        <h3 className="text-sm md:text-lg font-black text-brand-navy mb-2 group-hover:text-brand-orange transition-colors duration-300">
          {cat.name}
        </h3>
        <p className="text-slate-600 leading-snug text-xs md:text-sm line-clamp-2 font-medium">
          {cat.description}
        </p>
      </div>
    ))}
  </div>
</div>

        
      </div>
      <div className="mt-8 flex items-center justify-center gap-3">
  <button
    type="button"
    onClick={goPrev}
    disabled={page === 0 || isAnimating}
    className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-black text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
    ← Prethodna
  </button>

  <div className="text-sm font-black text-slate-600">
    Strana {page + 1} / {totalPages}
  </div>

  <button
    type="button"
    onClick={goNext}
    disabled={page === totalPages - 1 || isAnimating}
    className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-black text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
    Sledeća →
  </button>
</div>


    </section>
  );

};
export default Categories;