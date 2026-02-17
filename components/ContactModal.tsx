import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ContactModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 p-5 border-b border-slate-200">
          <div>
            <h3 className="text-xl font-black text-brand-navy">Kontakt</h3>
            <p className="mt-1 text-sm text-slate-600 font-semibold">
              Pišite nam za pitanja, predloge ili prijavu problema.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 font-black text-slate-700 hover:bg-slate-50 active:scale-95 transition"
            aria-label="Zatvori"
            title="Zatvori"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          <div className="text-sm font-black text-slate-600 uppercase tracking-wide">
            Email
          </div>

          <a
            href="mailto:info@servismreza.com"
            className="mt-2 inline-block text-brand-orange font-black text-lg hover:underline"
          >
            info@servismreza.com
          </a>

          <p className="mt-4 text-sm text-slate-600 font-semibold">
            Odgovaramo u najkraćem mogućem roku. Prijave firmi prolaze proveru pre objave.
          </p>
        </div>
      </div>
    </div>
  );
}
