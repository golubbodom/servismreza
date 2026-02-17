import React, { useEffect } from "react";

export default function PrivacyModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <button
        aria-label="Zatvori"
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px] animate-in fade-in duration-200"
        onClick={onClose}
        type="button"
      />

      <div className="relative w-full max-w-3xl rounded-3xl bg-white/90 backdrop-blur-md shadow-2xl border border-white/40 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        <div className="flex items-start justify-between gap-4 p-6 sm:p-8 border-b border-slate-200/60">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
              Politika privatnosti
            </h2>
            <p className="mt-1 text-slate-600 font-medium">
              Kako čuvamo i koristimo podatke.
            </p>
          </div>

          <button
            onClick={onClose}
            className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 transition active:scale-95"
            aria-label="Zatvori prozor"
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="p-6 sm:p-8 text-slate-700 leading-relaxed">
          <p className="font-medium">
            Servis Mreža obrađuje samo osnovne podatke neophodne za funkcionisanje
            platforme (npr. email za nalog, ako korisnik odluči da se registruje).
          </p>

          <ul className="mt-4 list-disc pl-5 space-y-2 text-sm font-medium text-slate-700">
            <li>Ne prodajemo korisničke podatke trećim licima.</li>
            <li>Podaci se koriste za poboljšanje iskustva (favoriti, istorija pretrage, ocene).</li>
            <li>Korisnik može zatražiti brisanje naloga i podataka.</li>
          </ul>

        
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-brand-orange text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-orange-950/10 hover:scale-[1.02] active:scale-95 transition"
            >
              Zatvori
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
