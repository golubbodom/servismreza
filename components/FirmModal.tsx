import React, { useEffect, useMemo, useState } from "react";
import type { Firm } from "../src/types/firm";
import GalleryModal from "./GalleryModal";
import { supabase } from "../src/supabaseClient";

const FIRM_GALLERY: Record<string, string[]> = {
  // VAŽNO: key mora da bude identičan firm.name
  "stolarija obradovic": [
    "/gallery/obradovicslika1.png",
    "/gallery/obradovicslika2.png",
    "/gallery/obradovicslika3.png",
    "/gallery/obradovicslika 4.png",
    "/gallery/obradovicslika5.png",
  ],
};

type Props = {
  firm: Firm | null;
  onClose: () => void;
};

const mapsHref = (address: string, city: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address}, ${city}`
  )}`;

export default function FirmModal({ firm, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  
  const norm = (s: string) =>
  (s || "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

  const images = useMemo(() => {
  const key = norm(firm?.name ?? "");
  const local = FIRM_GALLERY[key] || [];
  return galleryUrls.length > 0 ? galleryUrls : local;
}, [firm, galleryUrls]);



  // ESC zatvara modal
  useEffect(() => {
    if (!firm) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [firm, onClose]);

  // reset "copied" kad otvoriš drugi modal / zatvoriš
  useEffect(() => {
    setCopied(false);
  }, [firm]);

    useEffect(() => {
    setCopied(false);
    setIsGalleryOpen(false);
  }, [firm]);

useEffect(() => {
  const run = async () => {
    if (!firm) return;

 const appId =
  (firm as any).source_application_id ||
  (firm as any).sourceApplicationId ||
  (firm as any).partner_application_id ||
  (firm as any).partnerApplicationId ||
  null;
  
    if (!appId) {
      setGalleryUrls([]);
      return;
    }

    const folder = `partner_applications/${appId}`;

    const { data: files, error } = await supabase.storage
      .from("firm-images")
      .list(folder, { limit: 50, sortBy: { column: "name", order: "asc" } });

    if (error) {
      console.error("gallery list error:", error);
      setGalleryUrls([]);
      return;
    }

    const urls =
      (files ?? [])
        .filter((f) => f.name && !f.name.endsWith("/"))
        .map((f) => {
          const path = `${folder}/${f.name}`;
          const { data } = supabase.storage.from("firm-images").getPublicUrl(path);
          return data.publicUrl;
        });

    setGalleryUrls(urls);
  };

  run();
}, [firm]);

  if (!firm) return null;

  const isNear = (firm as any)?._isNear === true;

  const isMobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      onMouseDown={onClose}
    >
      <div className="absolute inset-0 bg-black/60" />
      

      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200"
        onMouseDown={(e) => e.stopPropagation()}
      >
       {/* Header */}
<div className="p-5 border-b border-slate-200">
  <div className="flex items-start justify-between gap-4">
    {/* LEVO: ime + grad + adresa */}
    <div className="min-w-0">
      <h3 className="text-xl font-black text-brand-navy leading-snug break-words">
        {firm.name}
      </h3>

      <p className="mt-1 text-sm font-semibold text-slate-600">
        {firm.city}
      {Number.isFinite(firm.distanceKm) ? ` • ${firm.distanceKm.toFixed(1)} km` : ""}
      </p>

      {firm.address && (
        <a
          className="mt-1 inline-flex text-sm font-black text-brand-blue hover:underline"
          href={mapsHref(firm.address, firm.city)}
          target="_blank"
          rel="noreferrer"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {firm.address}
        </a>
      )}
    </div>

    

    {/* DESNO: rating + X zajedno */}
    <div className="shrink-0 flex items-center gap-3">
      {firm.googleRating && firm.googleMapsUrl && (
        <a
          href={firm.googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm font-black text-brand-blue hover:underline"
          onMouseDown={(e) => e.stopPropagation()}
          title="Pogledaj Google recenzije"
        >
          ⭐ {firm.googleRating}
          {firm.googleReviews && (
            <span className="font-semibold text-slate-600">
              ({firm.googleReviews})
            </span>
          )}
        </a>
      )}

      <button
        type="button"
        onClick={onClose}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 hover:bg-slate-50 active:scale-95 transition"
        aria-label="Zatvori"
        title="Zatvori (Esc)"
      >
        ✕
      </button>
    </div>
  </div>
</div>
        {/* Body */}
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {firm.services.map((s) => (
              <span
                key={s}
                className="text-[11px] font-black text-slate-700 bg-slate-100 px-2 py-1 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-5 space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-600 font-semibold">Telefon</span>
              <span className="font-black text-brand-blue">{firm.phone}</span>
            </div>
                 {(firm as any).email && (
            <div className="mt-2 text-sm text-slate-700 font-semibold">
                  Email:{" "}
            <a  href={`mailto:${(firm as any).email}`}
                onClick={(e) => e.stopPropagation()}
                className="text-brand-blue font-black hover:underline">
            {(firm as any).email}
            </a>
            </div>
            )}
            
            {firm.workingHours && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-600 font-semibold">Radno vreme</span>
                <span className="font-semibold text-slate-800">
                  {firm.workingHours}
                </span>
              </div>
            )}
          </div>

          {firm.description && (
            <div className="mt-5">
              <div className="text-sm font-black text-brand-navy mb-2">Opis</div>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                {firm.description}
              </p>
            </div>
          )}

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              disabled={images.length === 0}
              className="mb-3 w-full inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 font-black text-brand-navy hover:bg-slate-50 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Galerija {images.length ? `(${images.length})` : ""}
            </button>
            {isMobile ? (
              <a
                href={`tel:${firm.phone.replace(/\s/g, "")}`}
                  className={`w-full inline-flex items-center justify-center text-white font-black px-4 py-3 rounded-xl active:scale-95 transition ${
                  isNear ? "bg-brand-orange hover:brightness-95" : "bg-brand-blue hover:brightness-95"}`}
                onMouseDown={(e) => e.stopPropagation()}
              >
                Pozovi
              </a>
            ) : (
              <>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(firm.phone);
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 1400);
                    } catch {
                    }
                  }}
                className={`w-full inline-flex items-center justify-center text-white font-black px-4 py-3 rounded-xl active:scale-95 transition ${
                  isNear ? "bg-brand-orange hover:brightness-95" : "bg-brand-blue hover:brightness-95"}`}>
                  Kopiraj broj
                </button>

                {copied && (
                  <div className="mt-3 text-center text-sm font-black text-green-700">
                    Broj kopiran ✅
                  </div>
                )}
              </>
            )}
          </div>
        </div>
              {isGalleryOpen && (
        <GalleryModal
          title={`Galerija – ${firm.name}`}
          images={images}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}
      </div>
    </div>
  );
}
