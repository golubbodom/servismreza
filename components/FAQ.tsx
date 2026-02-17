import React from "react";

const Collaboration: React.FC = () => {
  const steps = [
    {
      title: "Lokalna povezanost",
      text: "Fokusirani smo na partnere iz vaše okoline kako bi rešavanje vaših potreba bilo što brže i efikasnije.",
      icon: (
        <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: "Efikasan proces",
      text: "Naš cilj je da u par klikova dođete do informacija koje su vam ključne za početak saradnje, bez gubljenja vremena.",
      icon: (
        <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Dostupna podrška",
      text: "Uvek se možete osloniti na nas za sva pitanja o funkcionisanju sajta ili prijavi novih partnerskih usluga.",
      icon: (
        <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="saradnja" className="py-16 bg-brand-light-blue/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-black text-brand-navy mb-4 tracking-tight">
            Kako <span className="text-brand-orange">sarađujemo</span>
          </h2>
          <p className="text-lg  text-slate-700 max-w-2xl mx-auto font-medium leading-relaxed opacity-90">
            Prijave prolaze proveru, a saradnju gradimo na kvalitetu, brzini i podršci.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="group bg-white/90 p-3 sm:p-8 rounded-2xl sm:rounded-[32px] border border-orange-200 shadow-sm  transition-all duration-300  hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-900/10 hover:border-brand-orange">
              {/* icon */}
              <div
                className="w-9 h-9 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-6 bg-orange-50 text-brand-orange border border-orange-200 transition-all duration-300 group-hover:bg-brand-orange group-hover:text-black group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-orange-200/40">
                {step.icon}
              </div>

              <h3 className="text-xl font-black text-brand-navy mb-3 transition-colors duration-300 group-hover:text-black">
                {step.title}
              </h3>

              <p className="text-base text-slate-600 font-medium leading-relaxed">
                {step.text}
              </p>

              {/* underline */}
              <div className="mt-6 h-[3px] w-12 rounded-full bg-brand-orange/30 transition-colors duration-300 group-hover:bg-black" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collaboration;
