import { useState, useEffect  } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import logo from "../src/assets/brand/servismrezalogo.png";
import AboutModal from "./AboutModal";
import AuthModal from "./AuthModal";
import { ShimmerButton } from "./ui/shimmer-button";
import pinFilled from "../src/assets/icons/pin-filled.png";

type Props = {
  onOpenPartner?: () => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
  onOpenChangePassword?: () => void;
  onOpenFavorites?: () => void; 
  onOpenSavedCategories?: () => void;
};

export default function Header({ onOpenPartner, isLoggedIn = false, onLogout, onOpenFavorites, onOpenChangePassword, onOpenSavedCategories }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  
  useEffect(() => {
  if (!isLoggedIn) {
    setAccountMenuOpen(false);
  }
}, [isLoggedIn]);

  

  const scrollToSection = (e: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (id === "#") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      setIsMenuOpen(false);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const openAuth = () => {
    setIsAuthOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <header className="relative top-0 z-50 bg-gradient-to-r from-[#2b3f5c] to-[#1f2e45] border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();

                const duration = 550;
                const start = performance.now();

                const getTop = () =>
                  document.body.scrollTop ||
                  document.documentElement.scrollTop ||
                  (document.scrollingElement?.scrollTop ?? 0);

                const setTop = (v: number) => {
                  document.body.scrollTop = v;
                  document.documentElement.scrollTop = v;
                  if (document.scrollingElement) document.scrollingElement.scrollTop = v;
                };

                const from = getTop();
                const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

                const step = (now: number) => {
                  const t = Math.min(1, (now - start) / duration);
                  const eased = easeOutCubic(t);
                  setTop(Math.round(from * (1 - eased)));
                  if (t < 1) requestAnimationFrame(step);
                };

                requestAnimationFrame(step);

                setIsMenuOpen(false);
                setAccountMenuOpen(false);
              }}
              className="cursor-pointer flex items-center gap-3 group transition-transform active:scale-95"
              aria-label="Servis Mreža - početna"
            >
              <img
                src={logo}
                alt="Servis Mreža"
                className="h-14 w-auto object-contain animate-[pulse_2.8s_ease-in-out_infinite]"
              />

              <div className="leading-none">
                <div className="text-white font-black tracking-tight text-lg md:text-xl">
                  SERVIS <span className="text-brand-orange">MREŽA</span>
                </div>
              </div>
            </a>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-10">
            <a
              href="#kategorije"
              onClick={(e) => scrollToSection(e, "kategorije")}
              className="text-white/80 hover:text-white font-bold transition-colors"
            >
              Kategorije
            </a>
            <button
              type="button"
              onClick={() => setIsAboutOpen(true)}
              className="text-white/80 hover:text-white font-bold transition-colors"
            >
              O nama
            </button>
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center space-x-6 relative">
            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((v) => !v)}
                  className="text-white/80 font-bold hover:text-white transition-all hover:scale-105"
                >
                  Moj nalog ▾
                </button>

                {/* ✅ Dropdown meni */}
                {accountMenuOpen && (
                  <>
                    {/* klik van zatvara */}
                    <button
                      type="button"
                      onClick={() => setAccountMenuOpen(false)}
                      className="fixed inset-0 z-[90] cursor-default"
                      style={{ pointerEvents: accountMenuOpen ? "auto" : "none" }}
                      aria-label="Close account menu"
                    />
                    <div className="absolute right-0 top-14 z-[100] w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);   
                          setAccountMenuOpen(false);
                          onOpenFavorites?.();   
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left font-bold text-slate-800 hover:bg-slate-100 transition">
                        ⭐ Favoriti
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAccountMenuOpen(false);
                           onOpenSavedCategories?.();
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left font-bold text-slate-800 hover:bg-slate-100 transition">
                         <img
                          src={pinFilled}
                          alt=""
                          className="w-4 h-4 md:w-5 md:h-5 object-contain"
                        />Sačuvane kategorije
                    </button>              

                      <button
                         type="button"
                         onClick={() => {
                           setAccountMenuOpen(false);
                           setIsMenuOpen(false);
                           onOpenChangePassword?.();
                         }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left font-bold text-slate-800 hover:bg-slate-100 transition">
                        <span>🔐</span> Promeni lozinku
                        </button>

                      <div className="border-t border-slate-200" />

                      <button
                        type="button"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          setLogoutConfirmOpen(true);
                        }}
                        className="w-full text-left px-5 py-3 font-bold text-red-600 hover:bg-red-50"
                      >
                        ↩ Odjavi se
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={openAuth}
                className="text-white/80 font-bold hover:text-white transition-all hover:scale-105"
              >
                Prijavi se
              </button>
            )}

            <ShimmerButton type="button" onClick={onOpenPartner} className="hover:brightness-95">
              Postani partner
            </ShimmerButton>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              className="p-2 text-white/80 focus:outline-none transition-transform hover:scale-110"
              aria-label={isMenuOpen ? "Zatvori meni" : "Otvori meni"}
              aria-expanded={isMenuOpen}
            >
              <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-brand-navy-header border-b border-white/5 px-6 py-8 space-y-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <a
            href="#kategorije"
            onClick={(e) => scrollToSection(e, "kategorije")}
            className="block text-white text-xl font-black hover:text-brand-orange transition-colors"
          >
            Kategorije
          </a>

          <button
            type="button"
            onClick={() => {
              setIsAboutOpen(true);
              setIsMenuOpen(false);
            }}
            className="block w-full text-left text-white text-xl font-black hover:text-brand-orange transition-colors"
          >
            O nama
          </button>

 <div className="pt-6 border-t border-white/10 flex flex-col gap-4">

  {isLoggedIn ? (
    <>
      <button
        type="button"
        onClick={() => {
          setAccountMenuOpen((v) => !v);
        }}
className="w-full text-center py-4 text-white font-black border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-[0.99]"
      >
        Moj nalog
      </button>

      {accountMenuOpen && (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl overflow-hidden">
 
<button
  type="button"
  onClick={() => {
    setIsMenuOpen(false);
    setAccountMenuOpen(false);
    onOpenFavorites?.();
  }}
  className="w-full flex items-center gap-3 px-4 py-4 text-left text-white font-bold hover:bg-white/5 transition"
>
  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">⭐</span>
  <div className="flex-1">
    <div className="font-black">Favoriti</div>
    <div className="text-xs text-white/60 font-semibold -mt-0.5">Sačuvane firme</div>
  </div>
  <span className="text-white/40">›</span>
</button>

    <div className="h-px bg-white/10" />

<button
  type="button"
  onClick={() => {
    setIsMenuOpen(false);
    setAccountMenuOpen(false);
    onOpenSavedCategories?.();
  }}
  className="w-full flex items-center gap-3 px-4 py-4 text-left text-white font-bold hover:bg-white/5 transition"
>
  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
    <img
    src={pinFilled}
    alt=""
    className="w-6 h-6 object-contain"
  />
  </span>

  <div className="flex-1">
    <div className="font-black">Sačuvane kategorije</div>
    <div className="text-xs text-white/60 font-semibold -mt-0.5">
      Pregled kategorija koje pratiš
    </div>
  </div>
  <span className="text-white/40">›</span>
</button>


<div className="h-px bg-white/10" />
    <button
  type="button"
  onClick={() => {
    setIsMenuOpen(false);
    setAccountMenuOpen(false);
    onOpenChangePassword?.();
  }}
  className="w-full flex items-center gap-3 px-4 py-4 text-left text-white font-bold hover:bg-white/5 transition">
  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
        🔐
      </span>
  <div className="flex-1">
    <div className="font-black">Promeni lozinku</div>
    <div className="text-xs text-white/60 font-semibold -mt-0.5"></div>
  </div>
</button>

  <div className="h-px bg-white/10" />
    <button
      type="button"
      onClick={async () => {
        setAccountMenuOpen(false);
        setIsMenuOpen(false);
        setLogoutConfirmOpen(true);
      }}
      className="w-full flex items-center gap-3 px-4 py-4 text-left text-white font-bold hover:bg-white/5 transition"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/15 text-red-200">
        🔓
      </span>
      <div className="flex-1">
        <div className="font-black text-red-200">Odjavi se</div>
      </div>
    </button>
  </div>
      )}
    </>
  ) : (
    <button
      type="button"
      onClick={openAuth}
      className="w-full text-center py-4 text-white/80 font-bold border border-white/10 rounded-2xl hover:bg-white/5 transition-all"
    >
      Prijavi se
    </button>
  )}

  <button
    type="button"
    onClick={() => {
      setIsMenuOpen(false);
      onOpenPartner?.();
    }}
    className="w-full text-center bg-brand-orange text-white py-4 rounded-2xl shadow-lg uppercase tracking-tight hover:scale-[1.02] transition-all active:scale-[0.99]"
  >
    Postani partner
  </button>
</div>

        </div>
      )}

      <AboutModal open={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <AuthModal open={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Logout confirm modal (tvoj postojeći) */}
      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
            onClick={() => setLogoutConfirmOpen(false)}
            aria-label="Zatvori"
          />
          <div className="relative w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-md shadow-2xl border border-white/40 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-brand-navy">Odjava</h3>
                  <p className="mt-1 text-slate-600 font-medium">
                    Da li si siguran da želiš da se odjaviš?
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setLogoutConfirmOpen(false)}
                  className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 transition active:scale-95"
                  aria-label="Zatvori"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setLogoutConfirmOpen(false)}
                  className="px-4 py-2 rounded-2xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Otkaži
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    setLogoutConfirmOpen(false);
                    await onLogout?.();
                  }}
                  className="px-4 py-2 rounded-2xl bg-brand-orange text-white font-black hover:brightness-95 active:scale-95"
                >
                  Odjavi se
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
