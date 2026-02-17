
import { Category, Testimonial, FAQItem } from './types';
import pvc from "./src/assets/icons/pvc.png";
import painter from "./src/assets/icons/painter.png";
import electrician from "./src/assets/icons/electrician.png";
import plumber from "./src/assets/icons/plumber.png";
import aircondition from "./src/assets/icons/aircondition.png";
import komp from "./src/assets/icons/komp.png";
import bravar from "./src/assets/icons/bravar.png";
import kamera from "./src/assets/icons/kamera.png";
import grejanje from "./src/assets/icons/grejanje.png";
import krovopokrivac from "./src/assets/icons/krovopokrivac.png";
import tiler from "./src/assets/icons/tiler.png";
import servisbt from "./src/assets/icons/servisbt.png";


export const CATEGORIES: Category[] = [
  { id: '1', name: 'Električari', query: 'elektrika', icon: <img src={electrician} alt="Električar" className="w-7 h-7 md:w-10 md:h-10 object-contain" />, description: 'Instalacije, popravke kvarova i osvetljenje.'},
  { id: '2', name: 'Vodoinstalateri',query: 'vodoinstalater', icon: <img src={plumber} alt="Vodoinstalater" className="w-7 h-7 md:w-10 md:h-10 object-contain" />, description: 'Hitne intervencije, montaža sanitarija i odgušenja.'},
  { id: '3', name: 'Moleri i Gipsari',query: 'moler', icon: <img src={painter} alt="Moleri/gipsari" className="w-7 h-7 md:w-10 md:h-10 object-contain" />, description: 'Krečenje, gletovanje i dekorativne tehnike.'},
  { id: '4', name: "Keramičari", query: "Keramičari", icon: <img src={tiler} alt="Keramičari" className="w-7 h-7 md:w-10 md:h-10 object-contain" />, description: "Postavljanje pločica, fugovanje, kupatila i kuhinje."},
  { id: '5', name: "Krovopokrivači", query: "Krovopokrivači", icon: <img src={krovopokrivac} alt="krovopokrivac" className="w-7 h-7 md:w-10 md:h-10 object-contain" />, description: "Crep, lim, oluci, sanacije i popravke."},
  { id: '6', name: 'PVC stolarija',query: 'pvc', icon: <img src={pvc} alt="pvc" className="w-7 h-7 md:w-10 md:h-10 object-contain" />, description: 'Ugradnja, servis, dihtovanje, okovi, roletne.'},
  { id: '7', name: "Bravari", query: "Bravar", icon: <img src={bravar} alt="Bravar" className="w-7 h-7 md:w-10 md:h-10 object-contain" />, description: "Otključavanje, brave, cilindri."},
  { id: '8', name: 'Servis Klima', query: 'klima servis', icon: <img src={aircondition} alt="Klima" className="w-7 h-7 md:w-10 md:h-10 object-contain" />, description: 'Montaža, servis i dopuna freona.'},
  { id: '9', name: "Grejanje", query: "Grejanje", icon: <img src={grejanje} alt="grejanje" className="w-7 h-7 md:w-10 md:h-10 object-contain" />, description: "Radijatori, kotlovi, servisi, intervencije."},
  { id: '10', name: "Video nadzor", query: "Kamera", icon: <img src={kamera} alt="Video nadzor" className="w-7 h-7 md:w-10 md:h-10 object-contain" />, description: "Kamere, alarmi, instalacija i podešavanje."},
  { id: '11', name: 'IT Servis',query: 'racunar servis', icon: <img src={komp} alt="Moleri/gipsari" className="w-7 h-7 md:w-10 md:h-10 object-contain" />, description: 'Popravka računara, instalacija sistema i mreža.'},
  { id: '12', name: "Servis bele tehnike", query: "servis bele tehnike", icon: <img src={servisbt} alt="ciscenje" className="w-7 h-7 md:w-10 md:h-10 object-contain" />, description: "Popravke veš mašina, sudomašina, frižidera, šporeta i bojlera."},
];
