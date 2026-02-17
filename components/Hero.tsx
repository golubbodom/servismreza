
import React, {useMemo, useState, useRef, } from 'react';

interface Ripple {
  x: number;
  y: number;
  id: number;
}

type HeroProps = {
  onSearch: (q: string) => void;
  cityValue: string;
  onCityChange: (v: string) => void;
  hasLocation: boolean;
  onRequestLocation: () => void;
  onDisableLocation: () => void;
};

const SERBIA_CITIES = [
  "Beograd","Novi Sad","Niš","Kragujevac","Subotica","Zrenjanin","Pančevo","Čačak","Kraljevo","Novi Pazar",
  "Smederevo","Leskovac","Valjevo","Vranje","Šabac","Sombor","Požarevac","Pirot","Kikinda","Jagodina",
  "Užice","Bor","Prokuplje","Loznica","Kruševac","Sremska Mitrovica","Vršac","Bačka Palanka","Paraćin","Aranđelovac",
  "Aleksinac","Bajina Bašta","Bela Palanka","Beočin","Bečej","Bujanovac","Gornji Milanovac","Inđija","Ivanjica","Kanjiža",
  "Kladovo","Knjaževac","Knić","Koceljeva","Kosjerić","Kovačica","Kovin","Krupanj","Kučevo","Kuršumlija",
  "Lajkovac","Lapovo","Lebane","Lučani","Majdanpek","Mali Zvornik","Mionica","Negotin","Nova Varoš","Odžaci",
  "Opovo","Osečina","Petrovac na Mlavi","Pećinci","Požega","Priboj","Prijepolje","Rača","Raška","Rekovac",
  "Ruma","Sečanj","Sjenica","Sokobanja","Stara Pazova","Surdulica","Svilajnac","Svrljig","Temerin","Titel",
  "Topola","Trstenik","Tutin","Ub","Vladimirci","Veliko Gradište","Vladičin Han","Žabalj","Žagubica","Žitište","Zlatibor"
];

const normalizeCity = (input: string) =>
  (input ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

const Hero: React.FC<HeroProps> = ({ onSearch, cityValue, onCityChange, hasLocation, onRequestLocation, onDisableLocation }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  

  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Add ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    if (searchValue.trim() === '') {
      // Empty input interaction
      setIsShaking(true);
      setIsHighlighted(true);
      setTimeout(() => setIsShaking(false), 400);
      setTimeout(() => setIsHighlighted(false), 300);
      inputRef.current?.focus();
    } else {
      setIsPressing(true);
      setTimeout(() => setIsPressing(false), 150);

      const q = searchValue.trim();
      onSearch(q);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Simulate button click to trigger animations
      const btn = e.currentTarget.parentElement?.querySelector('button');
      if (btn) btn.click();
    }
  };

  const [cityOpen, setCityOpen] = useState(false);
const [cityActive, setCityActive] = useState(0);

const cityNormInput = normalizeCity(cityValue);

const citySuggestions = useMemo(() => {
  const q = cityNormInput;
  if (!q || q.length < 2) return [];
  const starts = SERBIA_CITIES.filter(c => normalizeCity(c).startsWith(q));
  const contains = SERBIA_CITIES.filter(
    c => !normalizeCity(c).startsWith(q) && normalizeCity(c).includes(q)
  );
  return [...starts, ...contains].slice(0, 6);
}, [cityNormInput]);

const pickCity = (c: string) => {
  onCityChange(c);
  setCityOpen(false);
  setCityActive(0);
};


  return (
    <section className="relative bg-transparent pt-16 pb-16 lg:pt-28 lg:pb-32">
     
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
{/* Location toggle icon — fixed ispod navbara, ne dira layout */}
<button
  type="button"
  onClick={() => {
    if (hasLocation) onDisableLocation();
    else onRequestLocation();
  }}
  title={hasLocation ? "Lokacija uključena" : "Uključi lokaciju"}
  aria-label={hasLocation ? "Lokacija uključena" : "Uključi lokaciju"}
  className={`
    absolute right-6 top-[-45px] -translate-y-2 z-[9999] pointer-events-auto
    inline-flex items-center justify-center
    w-11 h-11 rounded-full border shadow-sm
    transition active:scale-95
    ${hasLocation
      ? "bg-brand-orange border-orange-200 text-white"
      : "bg-white/90 border-slate-200 text-slate-600 hover:bg-white"}
  `}
>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
      d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
      d="M12 10a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
</button>


</div>

      {/* Hero Background Layer with subtle blue/orange gradient tints */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <div 
          className="absolute inset-0 transition-opacity duration-700 opacity-60"
          style={{
            backgroundImage: 'radial-gradient(circle at top left, rgba(224, 242, 254, 0.18) 0%, transparent 40%), radial-gradient(circle at bottom right, rgba(254, 243, 199, 0.18) 0%, transparent 40%)'
          }}
        ></div>
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/15 via-white/5 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white/15 to-transparent"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center reveal">
          
          <span className="inline-block px-6 py-2 mb-10 text-[13px] md:text-s font-black tracking-[0.3em] text-brand-blue uppercase bg-white rounded-full border border-blue-50 shadow-sm">
            NAJVEĆA MREŽA LOKALNIH USLUGA
          </span>
          <h1 className="text-5xl lg:text-7xl font-black text-brand-navy leading-[0.95] mb-4 tracking-tighter">
            Pregled firmi i usluga za kuću i poslovni prostor
          </h1>
          
          <div className="w-16 h-1 bg-brand-orange mx-auto mb-8 rounded-full"></div>

          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Direktna veza sa lokalnim profesionalcima i firmama u Srbiji. <br className="hidden md:block" /> Brzo i transparentno.
          </p>
          
          {/* Search Bar Component */}
          <div className="max-w-2xl mx-auto px-2 sm:px-0">
            <div 
              className={`
                flex items-center w-full bg-white border rounded-[32px] transition-all duration-300 overflow-hidden
                ${(isFocused || isHighlighted) 
                  ? 'border-brand-orange ring-4 ring-orange-50/50 shadow-none' 
                  : 'border-slate-200 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)]'}
              `}
            >
              <div className={`pl-6 flex items-center justify-center transition-colors duration-300 ${isFocused ? 'text-brand-orange' : 'text-slate-400'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <input 
                ref={inputRef}
                type="text" 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="Pretražite usluge ili kategorije..." 
                className="w-full py-5 md:py-6 px-5 text-lg md:text-xl font-bold text-brand-navy bg-white focus:outline-none placeholder:text-slate-300"
              />
              
              <div className="pr-2 py-2">
                <button 
                  type="button"
                  onClick={handleSearchClick}
                  className={`
                    relative overflow-hidden bg-brand-orange text-white px-8 md:px-10 h-12 md:h-14 rounded-[24px] font-black 
                    transition-all duration-250 shadow-lg shadow-orange-100 
                    ${isShaking ? 'animate-shake' : ''} 
                    ${isPressing ? 'scale-95' : 'hover:scale-[1.05] hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-blue-500/10 active:scale-95'}
                    transform uppercase tracking-widest text-xs flex items-center justify-center
                  `}
                >
                  <span className="relative z-10 pointer-events-none">Traži</span>
                  {ripples.map((ripple) => (
                    <span
                      key={ripple.id}
                      className="animate-ripple"
                      style={{
                        left: ripple.x,
                        top: ripple.y,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  ))}
                </button>
              </div>
            </div>
          </div>
{/* City filter */}
<div className="max-w-2xl mx-auto px-2 sm:px-0 mt-3 relative">
  <div className="flex items-center w-full bg-white border border-slate-200 rounded-[32px] overflow-hidden">
    <div className="pl-6 flex items-center justify-center text-slate-400">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10a2 2 0 100-4 2 2 0 000 4z" />
      </svg>
    </div>

    <input
      type="text"
      value={cityValue}
      onChange={(e) => {
        onCityChange(e.target.value);
        setCityOpen(true);
        setCityActive(0);
      }}
      onFocus={() => setCityOpen(true)}
      onBlur={() => setTimeout(() => setCityOpen(false), 120)}
      onKeyDown={(e) => {
        if (!cityOpen) return;

        if (e.key === "ArrowDown") {
          e.preventDefault();
          setCityActive((i) => Math.min(i + 1, citySuggestions.length - 1));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setCityActive((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
          e.preventDefault();
          const c = citySuggestions[cityActive];
          if (c) pickCity(c);
        } else if (e.key === "Escape") {
          setCityOpen(false);
        }
      }}
      placeholder="Opština (opciono)"
      className="w-full py-4 px-5 text-base font-bold text-brand-navy bg-white focus:outline-none placeholder:text-slate-300"
    />

    {cityValue.trim() !== "" && (
      <button
        type="button"
        onClick={() => {
          onCityChange("");
          setCityOpen(false);
        }}
        className="px-4 py-3 text-slate-500 font-black hover:text-slate-700"
        aria-label="Obriši grad"
        title="Obriši grad"
      >
        ✕
      </button>
    )}

    <div className="pr-5 text-slate-400">▾</div>
  </div>

  {/* Dropdown */}
  {cityOpen && citySuggestions.length > 0 && (
    <div className="absolute left-2 right-2 sm:left-0 sm:right-0 mt-2 z-[9999] rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden max-h-60 overflow-y-auto">
      {citySuggestions.map((c, idx) => (
        <button
          key={c}
          type="button"
          onMouseDown={(e) => e.preventDefault()} 
          onClick={() => pickCity(c)}
          className={`w-full text-left px-5 py-3 font-bold transition ${
            idx === cityActive ? "bg-slate-100 text-brand-navy" : "bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  )}
</div>
        <p className="mt-4 text-[12px] sm:text-xs text-slate-400 font-medium text-center max-w-lg mx-auto leading-relaxed">
               Unosom opštine filtrirate rezultate na
          <span className="font-semibold text-slate-500"> odabranu opštinu</span>.
               Ako opština nije uneta, prikazuju se firme u blizini
          <span className="font-semibold text-slate-500"> (do 25 km)</span>
              na osnovu lokacije uređaja
          <span className="font-semibold text-slate-500"> (ukoliko je dozvoljena)</span>
               kao i rezultati iz šireg okruženja.
        </p>

        </div>
      </div>
    </section>
  );
};

export default Hero;