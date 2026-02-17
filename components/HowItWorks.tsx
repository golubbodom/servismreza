import React from "react";

const HowItWorks: React.FC = () => {
  const benefits = [
    {
      title: "Pažljivo odabrani partneri",
      description:
        "Sarađujemo sa partnerima i firmama sa kojima imamo direktnu komunikaciju i jasan dogovor o saradnji.",
      icon: (
        <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      title: "Potpuna transparentnost",
      description:
        "Na sajtu pružamo jasne i osnovne informacije o uslugama i partnerima, bez skrivenih koraka ili komplikacija.",
      icon: (
        <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
    },
    {
      title: "Direktna komunikacija",
      description:
        "Kontakt sa partnerima ostvarujete direktno – bez posrednika, upita ili dodatnih procesa.",
      icon: (
        <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
  ];

  return (
    // ✅ transparent look (kao druge sekcije)
<section id="kako-radi" className="pt-16 pb-12 md:pt-24 md:pb-16 bg-white/30 backdrop-blur-0 sm:backdrop-blur-sm relative overflow-hidden">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-black text-brand-navy mb-4 tracking-tight leading-tight">
            Usluge i firme na <span className="text-brand-orange">jednom mestu</span>.
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Jednostavan pristup proverenim partnerima i direktan kontakt, bez gubljenja vremena.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-6">          
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="group bg-white/90 p-3 sm:p-8 rounded-2xl sm:rounded-[32px] border border-brand-accent-blue shadow-sm transition-none sm:transition-all duration-0 sm:duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/10 hover:border-brand-blue min-h-[180px] sm:min-h-[260px]">
              {/* blue icon chip */}
              <div className=" inline-flex items-center justify-center w-9 h-9 sm:w-14 sm:h-14 rounded-2xl mb-5 bg-brand-accent-blue/60 text-brand-blue border border-blue-100 transition-all duration-300 group-hover:bg-brand-blue group-hover:text-white group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-blue-200/40">
                {b.icon}
              </div>

              <h3 className="text-xl font-black text-brand-navy mb-3">
                {b.title}
              </h3>

              <p className="text-base text-slate-600 leading-relaxed font-medium">
                {b.description}
              </p>

              <div className="mt-6 h-[3px] w-12 rounded-full bg-brand-blue/30 group-hover:bg-brand-blue"/></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
