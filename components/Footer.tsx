import React, { useState } from "react";
import TermsModal from "./TermsModal";
import PrivacyModal from "./PrivacyModal";
import logo from "../src/assets/brand/servismrezalogo.png";
import ContactModal from "./ContactModal";
import CreditsModal from "./CreditsModal";


const Footer: React.FC = () => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  


  const smoothScrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer
      id="kontakt"
          className="bg-gradient-to-b from-blue-50/50 to-white text-brand-navy py-16 md:py-20 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:gap-12 md:grid-cols-4 mb-12">
          {/* Brand */}
                <div className="col-span-2 md:col-span-2">
               <div className="mb-6">
              <div className="flex items-center gap-3">
            <img  src={logo}
                  alt="Servis Mreža logo"
                  className="h-9 w-auto object-contain"
                  loading="lazy" />
                  <div className="flex items-center space-x-1.5 text-2xl font-black tracking-tighter">
                 <span className="text-brand-navy uppercase">Servis</span>
                 <span className="text-brand-orange uppercase">Mreža</span>
              </div>
             </div>
            </div>

            <p className="max-w-md mb-8 text-slate-600 font-medium leading-relaxed text-sm">
              Servis Mreža povezuje korisnike sa lokalnim majstorima širom Srbije – električari, vodoinstalateri, keramičari, krovopokrivači, servis bele tehnike i mnoge druge usluge.
            </p>

            <p className="text-sm font-semibold text-slate-600 mt-4">
                Pratite nas na društvenim mrežama
              </p>
            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://www.instagram.com/servismrezars/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-brand-orange transition transform hover:scale-110"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm5 5a5 5 0 110 10 5 5 0 010-10zm6.5-1.25a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z"/>
                </svg>
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-brand-orange transition transform hover:scale-110"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 22v-9h3l1-4h-4V7c0-1.1.3-2 2-2h2V1.5C16.7 1.2 15.6 1 14.5 1 11.5 1 10 3 10 6v3H7v4h3v9h3z"/>
                </svg>
              </a>
            </div>


          </div>
          {/* Links */}
          <div>
            <h4 className="text-brand-navy font-black mb-3 sm:mb-6 uppercase tracking-[0.2em] text-[10px] opacity-70">
              Linkovi
            </h4>
            <ul className="space-y-3 font-semibold text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => smoothScrollTo("kategorije")}
                  className="text-brand-blue hover:text-brand-orange transition-all duration-250"
                >
                  Kategorije
                </button>
              </li>
              <li>
                <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                className="text-brand-blue hover:text-brand-orange transition-all duration-250">
                        Kontakt
                </button>
              </li>
                <li>
                <button
                type="button"
                onClick={() => setIsCreditsOpen(true)}
                className="text-brand-blue hover:text-brand-orange transition-all duration-250">
                      Credits
                </button>
                </li>
              <li>
                <button
                  type="button"
                  className="text-brand-blue hover:text-brand-orange transition-all duration-250"
                  onClick={() => {const root = document.getElementById("root");
                  if (root) root.scrollIntoView({ behavior: "smooth", block: "start" });
                  else window.scrollTo({ top: 0, behavior: "smooth" });
                          }}>
                  Na vrh
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-brand-navy font-black mb-3 sm:mb-6 uppercase tracking-[0.2em] text-[10px] opacity-70">
              Informacije
            </h4>
            <ul className="space-y-2 sm:space-y-3 font-semibold text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => setIsTermsOpen(true)}
                  className="text-brand-blue hover:text-brand-orange transition-all duration-250"
                >
                  Uslovi korišćenja
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsPrivacyOpen(true)}
                  className="text-brand-blue hover:text-brand-orange transition-all duration-250"
                >
                  Politika privatnosti
                </button>
              </li>
            </ul>
          </div>
        </div>
        

        {/* Disclaimer */}
        <div className="mt-10 text-center">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] opacity-70">
            Servis Mreža je informativna platforma i ne pruža usluge izvođenja radova.
          </p>
        </div>
      </div>

      <TermsModal open={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <PrivacyModal open={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <ContactModal open={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <CreditsModal open={isCreditsOpen} onClose={() => setIsCreditsOpen(false)} />


    </footer>
  );
};

export default Footer;
