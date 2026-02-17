import React, { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenFavorites: () => void;
  onOpenChangePassword: () => void;
  onLogout: () => void;
  onOpenSavedCategories: () => void;
};

export default function AccountModal({
  open,
  onClose,
  onOpenFavorites,
  onOpenSavedCategories,
  onOpenChangePassword,
  onLogout,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Overlay */}
      <button
        aria-label="Zatvori"
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px] animate-in fade-in duration-200"
        onClick={onClose}
        type="button"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-200/60">
          <div>
            <h2 className="text-2xl font-black text-brand-navy tracking-tight">
              Moj nalog 
            </h2>
            <p className="mt-1 text-slate-600 font-medium">
              Favoriti, lozinka i podešavanja naloga.
            </p>
          </div>

          <button
            onClick={onClose}
            className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition"
            aria-label="Zatvori prozor"
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenFavorites();
            }}
            className="w-full flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 font-black text-brand-navy hover:bg-slate-50 active:scale-[0.99] transition"
          >
            <span>⭐ Favoriti</span>
            <span className="text-slate-400">›</span>
          </button>

          <button
            type="button"
            onClick={() => {
             onClose();
              onOpenSavedCategories();
              }}
            className="w-full flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 font-black text-brand-navy hover:bg-slate-50 active:scale-[0.99] transition"
                  >
              <span>📌 Sačuvane kategorije</span>
              <span className="text-slate-400">›</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenChangePassword();
            }}
            className="w-full flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 font-black text-brand-navy hover:bg-slate-50 active:scale-[0.99] transition"
          >
            <span>🔐 Promeni lozinku</span>
            <span className="text-slate-400">›</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full rounded-2xl bg-red-50 border border-red-200 px-4 py-3 font-black text-red-700 hover:bg-red-100 active:scale-[0.99] transition"
          >
            Odjavi se
          </button>
        </div>
      </div>
    </div>
  );
}
