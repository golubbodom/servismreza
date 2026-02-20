import React, { useEffect, useState } from "react";

type Props = {
  title: string;
  images: string[];
  onClose: () => void;
};

export default function GalleryModal({ title, images, onClose }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeIndex !== null) setActiveIndex(null);
        else onClose();
      }
      if (activeIndex !== null) {
        if (e.key === "ArrowRight") setActiveIndex((i) => (i === null ? 0 : Math.min(i + 1, images.length - 1)));
        if (e.key === "ArrowLeft") setActiveIndex((i) => (i === null ? 0 : Math.max(i - 1, 0)));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, images.length, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-base font-black text-brand-navy">{title}</h3>
          <button
            className="h-9 w-9 rounded-full border hover:bg-gray-50"
            onClick={onClose}
            aria-label="Zatvori"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          {images.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500 font-semibold">Nema slika.</div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((src, idx) => (
                <button
                  key={src + idx}
                  className="group overflow-hidden rounded-xl border bg-slate-50"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Otvori sliku ${idx + 1}`}
                >
                  <img
                    src={src}
                    alt={`Slika ${idx + 1}`}
                    className="h-32 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-3"
          onClick={() => setActiveIndex(null)}
        >
          <div className="relative max-h-[90vh] max-w-[95vw]" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-white text-black shadow"
              onClick={() => setActiveIndex(null)}
              aria-label="Zatvori sliku"
            >
              ✕
            </button>

            <img
              src={images[activeIndex]}
              alt={`Uvećana slika ${activeIndex + 1}`}
              className="max-h-[90vh] max-w-[95vw] rounded-xl object-contain"
            />

            <div className="mt-2 text-center text-xs text-white/80 font-semibold">
              {activeIndex + 1} / {images.length} (← →, ESC)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}