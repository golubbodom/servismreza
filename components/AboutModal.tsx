import React, { useEffect } from "react";

type AboutModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function AboutModal({ open, onClose }: AboutModalProps) {
  // ESC zatvara modal
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <button
        aria-label="Zatvori"
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-white/90 backdrop-blur-md shadow-2xl border border-white/40 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 sm:p-8 border-b border-slate-200/60">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
              O Servis Mreži
            </h2>
            <p className="mt-1 text-slate-600 font-medium">
              Brže do pouzdanih lokalnih usluga.
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

        {/* Content */}
        <div className="p-6 sm:p-6 text-slate-700 leading-relaxed">
          <p className="mt-4">
            Servis Mreža je online platforma koja povezuje ljude sa pouzdanim
            lokalnim firmama i majstorima širom Srbije.
          </p>

          <p className="mt-4">
            Naš cilj je jednostavan — da vam olakšamo pronalazak usluge koja vam
            je potrebna, bez gubljenja vremena, posrednika i komplikovanih
            koraka.
          </p>

          <p className="mt-4">
            Bilo da tražite majstora za kuću, firmu za održavanje poslovnog
            prostora ili specijalizovane usluge, Servis Mreža vam omogućava brz
            pregled kategorija, direktan kontakt i jasne informacije na jednom
            mestu.
          </p>

          <p className="mt-4 text-slate-600">
            Ne pružamo usluge izvođenja radova — već vas povezujemo sa onima koji
            ih nude, transparentno i bez skrivenih obaveza.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-full bg-sky-50 text-sky-800 text-sm font-bold">
              Brzo
            </span>
            <span className="px-3 py-1.5 rounded-full bg-sky-50 text-sky-800 text-sm font-bold">
              Transparentno
            </span>
            <span className="px-3 py-1.5 rounded-full bg-sky-50 text-sky-800 text-sm font-bold">
              Lokalno
            </span>
          </div>

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
