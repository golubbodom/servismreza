import { useMemo } from "react";
import { CATEGORIES } from "../constants";
import pinOutline from "../src/assets/icons/pin-outline.png";
import pinFilled from "../src/assets/icons/pin-filled.png";

type Props = {
  userId: string | null; // može ostati, ne smeta
  followSet: Set<string>;
  onToggleFollow: (query: string) => void;
  onClose: () => void;
  onSelectCategory: (query: string) => void;
};

export default function SavedCategoriesView({
  followSet,
  onToggleFollow,
  onClose,
  onSelectCategory,
}: Props) {
 
const followedCats = useMemo(() => {
  if (!followSet || followSet.size === 0) return [];
  return CATEGORIES.filter((c) => followSet.has(String(c.query)));
}, [followSet]);

  if (!followedCats.length) {
    return (
      <section className="pt-8 pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-brand-navy tracking-tight">
                  <span className="inline-flex items-center gap-2 align-middle">
                 <img
                  src={pinFilled}
                  alt=""
                  className="w-6 h-6 md:w-7 md:h-7 object-contain"
                /> Sačuvane kategorije
                </span>
              </h2>
              <p className="mt-2 text-slate-600 font-medium">
                Trenutno nemaš sačuvane kategorije.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 inline-flex items-center justify-center rounded-2xl bg-red-50 border border-red-200 px-4 py-2 font-black text-red-700 hover:bg-red-100 active:scale-95 transition"
            >
              ✕
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 md:p-8">
            
           <div className="mt-2 text-slate-600 font-semibold">
            <span className="inline-flex items-center gap-2 align-middle">
              Pinuj kategorije klikom na
              <img
                src={pinOutline}
                alt=""
                className="w-4 h-4 align-middle"
              />
              i pojaviće se ovde.
            </span>
          </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-8 pb-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-brand-navy tracking-tight">
                <img
    src={pinFilled}
    alt=""
    className="w-4 h-4 object-contain"
  /> Sačuvane kategorije
            </h2>
            <p className="mt-2 text-slate-600 font-medium">
              Klikni na kategoriju da vidiš firme.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 inline-flex items-center justify-center rounded-2xl bg-red-50 border border-red-200 px-4 py-2 font-black text-red-700 hover:bg-red-100 active:scale-95 transition"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {followedCats.map((cat) => (
            <div
                key={cat.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectCategory(cat.query)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSelectCategory(cat.query);
                }}
                className="text-left bg-white p-4 md:p-7 rounded-[28px] border border-slate-100 hover:border-brand-orange/20 md:hover:shadow-2xl md:hover:shadow-orange-900/55 md:hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
              >

              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 md:w-14 md:h-14 bg-brand-accent-blue/20 flex items-center justify-center rounded-2xl">
                  <span>{cat.icon}</span>
                </div>
               <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFollow(String(cat.query)); // ✅ ovo je sada jedino ispravno
                    }}
                    className="rounded-xl p-2 bg-white/80 hover:bg-white border border-slate-200 shadow-sm active:scale-95 transition"
                    aria-label="Ukloni iz sačuvanih"
                    title="Unpin"
                  >
                    <img
                      src={pinFilled}
                      alt=""
                      className="w-5 h-5 object-contain opacity-100 scale-110"
                    />
                </button>

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
    </section>
  );
}
