
import React from 'react';
import { TESTIMONIALS } from '../constants';

const Testimonials: React.FC = () => {
  return (
    <section id="iskustva" className="py-24 bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 text-white">Šta kažu naši korisnici?</h2>
          <p className="text-blue-200 text-lg">Pridružite se hiljadama zadovoljnih klijenata širom Srbije.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="bg-blue-800/50 sm:backdrop-blur-sm p-8 rounded-3xl border border-blue-700">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-xl italic mb-8 leading-relaxed text-blue-50">"{t.content}"</p>
              <div className="flex items-center space-x-4">
                <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full border-2 border-blue-400" />
                <div>
                  <h4 className="font-bold text-lg">{t.name}</h4>
                  <p className="text-blue-300 text-sm">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
