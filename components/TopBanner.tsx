import React from "react";

type Props = {
  onClickCta?: () => void; // npr. otvori PartnerModal
};

export default function TopBanner({ onClickCta }: Props) {
  const [hidden, setHidden] = React.useState(false);

  React.useEffect(() => {
    const v = localStorage.getItem("sm_top_banner_hidden");
    if (v === "1") setHidden(true);
  }, []);

  if (hidden) return null;

  return (
    <div className="w-full border-b border-orange-200/50 bg-brand-orange/10 text-brand-navy">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* X */}
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-slate-700/70 hover:text-slate-900 hover:bg-white/40 transition"
          aria-label="Zatvori banner"
          title="Zatvori"
          onClick={() => {
            localStorage.setItem("sm_top_banner_hidden", "1");
            setHidden(true);
          }}
        >
          ✕
        </button>

        {/* Scroller */}
        <button
          type="button"
          onClick={() => onClickCta?.()}
          className="w-full py-2 overflow-hidden"
          title="Klikni da se prijaviš"
        >
          <div className="relative flex items-center justify-center">
<div className="banner-marquee">
  <div className="banner-track text-sm font-black">
    {/* Segment 1 */}
    <div className="banner-segment">
      <span className="mx-6">
        🚀 Servis Mreža je nova platforma – pridružite se besplatno i povećajte vidljivost svoje firme!
      </span>
      <span className="mx-6 opacity-70">•</span>
      <span className="mx-6">
        ✅ Prijava je besplatna • Prolazi proveru pre objave • Klikni da postaneš partner
      </span>
      <span className="mx-6 opacity-70">•</span>
    </div>

    {/* Segment 2 (isti kao 1) */}
    <div className="banner-segment">
      <span className="mx-6">
        🚀 Servis Mreža je nova platforma – pridružite se besplatno i povećajte vidljivost svoje firme!
      </span>
      <span className="mx-6 opacity-70">•</span>
      <span className="mx-6">
        ✅ Prijava je BESPLATNA • Prolazi proveru pre objave • Klikni da postaneš partner
      </span>
      <span className="mx-6 opacity-70">•</span>
    </div>
  </div>
</div>
          </div>
        </button>
      </div>
    </div>
  );
}