import React, { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import HowItWorks from "./components/HowItWorks";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import SearchResults from "./components/SearchResults";
import type { Firm } from "./src/types/firm";
import FirmModal from "./components/FirmModal";
import PartnerModal from "./components/PartnerModal";
import { supabase } from "./src/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import ChangePasswordModal from "./components/ChangePasswordModal";
import FavoritesView from "./components/FavoritesView";
import SavedCategoriesView from "./components/SavedCategoriesView";
import { useCategoryFollows } from "./src/hooks/useCategoryFollows";




type LatLng = { lat: number; lng: number };

function haversineKm(a: LatLng, b: LatLng) {
  const R = 6371; // km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;

  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(x));
}

const App: React.FC = () => {
  type UserLocation = { lat: number; lng: number };

  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [locationPromptOpen, setLocationPromptOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const clearUserLocation = () => {setUserLocation(null); setLocationDenied(false);};
  const [accountOpen, setAccountOpen] = useState(false);
  const [changePassOpen, setChangePassOpen] = useState(false);
  const [showSavedCategories, setShowSavedCategories] = useState(false);
  const [cameFromSavedCategories, setCameFromSavedCategories] = useState(false);
 




  const requestUserLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocationDenied(true);
      setLocationToast(true);
      return;
    }
     setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
  (pos) => {
    setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    setLocationDenied(false);
    setLocationPromptOpen(false);

    setLocationToast(true);
    setTimeout(() => setLocationToast(false), 1200);

    setLocationLoading(false); 
  },
      (err) => {
        console.warn("geolocation error:", err);
        setLocationDenied(true);
        setLocationLoading(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }
    );
  };
  const [query, setQuery] = useState("");
  const [cityInput, setCityInput] = useState(""); 
  const [cityQuery, setCityQuery] = useState("");
  const [selectedFirm, setSelectedFirm] = useState<Firm | null>(null);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const { followSet, toggleFollow } = useCategoryFollows(session?.user?.id ?? null);
  const [firms, setFirms] = useState<Firm[]>([]);
  const didLoadFirms = useRef(false);
  const [locationToast, setLocationToast] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [accountMenuAction, setAccountMenuAction] = useState<"favorites" | "changePass" | null>(null);
  const isPanelOpen = showFavorites || showSavedCategories || changePassOpen;
  const [locationLoading, setLocationLoading] = useState(false);



  const firmsWithDistance = React.useMemo(() => {
 
  if (!userLocation) return firms;

  return firms.map((f: any) => {
    if (typeof f.lat === "number" && typeof f.lng === "number") {
      const d = haversineKm(userLocation, { lat: f.lat, lng: f.lng });
      return { ...f, distanceKm: d };
    }
  
    return { ...f, distanceKm: Number.POSITIVE_INFINITY };
  });
}, [firms, userLocation]);

  

const clearSearch = () => {
  setQuery("");
  setCityQuery("");
  setCityInput("");
};

  const selectCategoryFromSaved = (q: string) => {
  setCameFromSavedCategories(true); 
  setShowSavedCategories(false);
  setShowFavorites(false);
  setChangePassOpen(false);
  setCityQuery("");
  setQuery(q);
};


  const closeFirm = () => setSelectedFirm(null);
  const openPartner = () => setPartnerOpen(true);
  const closePartner = () => setPartnerOpen(false);
  const closeAccount = () => setAccountOpen(false);
  const openSavedCategories = () => {setQuery(""); setShowFavorites(false); setChangePassOpen(false); setShowSavedCategories(true);};
  const closeSavedCategories = () => setShowSavedCategories(false);

  const openFavorites = () => {
  setQuery(""); 
  setShowSavedCategories(false);
  setChangePassOpen(false);
  setShowFavorites(true);
};
const openChangePassword = () => {
  setQuery(""); 
  setAccountOpen(false);      
  setShowFavorites(false);    
  setChangePassOpen(true);    
};
  const closeFavorites = () => {setShowFavorites(false);setAccountMenuAction(null);};
  const normalizePhone = (input: string) =>
    input
      .trim()
      .replace(/[^\d+]/g, "")
      .replace(/^(\+|00)?381/, "0")
      .replace(/\D/g, "");

  const normalizeCity = (input: string) =>
    input
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "");

  const normalizeAddress = (input: string) =>
    input
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[.,:@';><}]/g, "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  // ✅ userId (treba za favorite / zvezdice)
useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    setUserId(data.session?.user?.id ?? null);
  });

  const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
    setUserId(newSession?.user?.id ?? null);
  });

  return () => sub.subscription.unsubscribe();
}, []);

//  reveal animacije 
useEffect(() => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll(".reveal, .reveal-group");
  revealElements.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}, []);



  const loadFirms = async () => {
    const { data, error } = await supabase
      .from("firms")
      .select("id, name, city, municipality, address, phone, email, services, working_hours, description, created_at, lat, lng, source_application_id")     
      .order("created_at", { ascending: false });

    if (error) {
      console.error("loadFirms error:", error);
      return;
    }

    const mapped: Firm[] = (data ?? []).map((row: any) => ({
      id: row.id,
      name: row.name,
      city: row.city,
      municipality: row.municipality ?? null,
      phone: row.phone,
      email: row.email ?? null,
      services: row.services ?? [],
      distanceKm: Number.POSITIVE_INFINITY,
      address: row.address,
      workingHours: row.working_hours ?? undefined,
      description: row.description ?? undefined,
      lat: (row as any).lat ?? null,
      lng: (row as any).lng ?? null,
      sourceApplicationId: row.source_application_id ?? null,
      partnerApplicationId: row.partner_application_id ?? null,
    }));

    setFirms(mapped);
  };

  useEffect(() => {
    if (didLoadFirms.current) return;
    didLoadFirms.current = true;
    loadFirms();
  }, []);

  // scroll do rezultata
  useEffect(() => {
    if (!query) return;
    const t = setTimeout(() => {
      const el = document.getElementById("rezultati");
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
  if (showFavorites) {
    setTimeout(() => {
      document
        .getElementById("favorites-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }
}, [showFavorites]);

useEffect(() => {
  if (showSavedCategories) {
    setTimeout(() => {
      document
        .getElementById("saved-categories-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }
}, [showSavedCategories]);


  const userEmail = session?.user?.email ?? null;
  // ====== PARTNER PHOTOS UPLOAD (max 5) ======
const BUCKET = "firm-images"; // <-- ovde upiši TAČNO ime bucket-a

const uploadPartnerPhotos = async (applicationId: string, photos: File[]) => {
  if (!photos || photos.length === 0) return;

  const take = photos.slice(0, 5);
  const uploaded: { path: string; sort: number }[] = [];

  for (let i = 0; i < take.length; i++) {
    const file = take[i];

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const path = `partner_applications/${applicationId}/${fileName}`;

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type || "image/jpeg", upsert: false });

    if (upErr) {
      console.error("Storage upload error:", upErr);
      continue; // ne rušimo celu prijavu
    }

    uploaded.push({ path, sort: i });
  }

  if (uploaded.length === 0) return;

  const { error: dbErr } = await supabase
    .from("partner_application_photos")
    .insert(
      uploaded.map((x) => ({
        application_id: applicationId,
        path: x.path,
        sort: x.sort,
      }))
    );

  if (dbErr) console.error("DB insert partner_application_photos error:", dbErr);
};

  return (
    <div className="min-h-screen bg-transparent relative">

  <Header
  onOpenPartner={openPartner}
  isLoggedIn={!!session}
  onLogout={async () => {
    await supabase.auth.signOut();
  }}
  onOpenFavorites={openFavorites}
  onOpenChangePassword={openChangePassword}
  onOpenSavedCategories={openSavedCategories}
  />
      <main>
   
   <Hero
     onSearch={(q) => {

     if (!userLocation && !cityInput.trim()) setLocationPromptOpen(true);
     setShowFavorites(false);
     setShowSavedCategories(false);
     setChangePassOpen(false);

     setCityQuery(cityInput.trim());

     if (q === query) {
      setQuery("");
      setTimeout(() => setQuery(q), 0);
    } else {
      setQuery(q);
    };}}
     
    cityValue={cityInput}
    onCityChange={setCityInput}
       hasLocation={!!userLocation}
       onRequestLocation={() => setLocationPromptOpen(true)}
       onDisableLocation={clearUserLocation}/>

       
  

{/* SEARCH RESULTS */}
{query && (userLocation || cityQuery.trim()) && !isPanelOpen && (
  <div className="reveal reveal-visible">
    <SearchResults
      query={query}
      cityQuery={cityQuery}
      radiusKm={25}
      firms={firmsWithDistance}
      onClear={clearSearch}
      onSelectFirm={setSelectedFirm}
      onOpenPartner={openPartner}
      userId={userId}
      cameFromSavedCategories={cameFromSavedCategories}
      onBackToSavedCategories={() => {
      setQuery("");
      setShowSavedCategories(true);
  }}
    />
  </div>
)}
 {/* FAVORITES VIEW */}
{showFavorites && (
  <div id="favorites-section">
  <FavoritesView
  userId={session?.user?.id ?? null}
  radiusKm={25}
  firms={firmsWithDistance}
  onClose={() => setShowFavorites(false)}
  onSelectFirm={setSelectedFirm}
/>
  </div>
)}

{showSavedCategories && (
  <div id="saved-categories-section">
  <SavedCategoriesView
    userId={session?.user?.id ?? null}
    followSet={followSet}
    onToggleFollow={toggleFollow}
    onClose={closeSavedCategories}
    onSelectCategory={selectCategoryFromSaved}
/>

  </div>
)}
      {locationToast && (
        <div className="fixed bottom-6 right-6 pointer-events-none z-[999999]">
         <div className="bg-brand-orange text-white px-2 py-1 rounded-xl shadow-lg font-medium">
            📍  Lokacija uključena
         </div>
            </div>
)}

<PartnerModal
  open={partnerOpen}
  onClose={closePartner}
  onSubmit={async (data, photos, opts) => {
    const phoneNorm = normalizePhone(data.phone);
    const cityNorm = normalizeCity(data.city);
    const addressNorm = normalizeAddress(data.address);

    const force = !!opts?.force;

    // DUP CHECK
    if (!force) {
      const { data: dupRows, error: dupErr } = await supabase.rpc("check_partner_duplicate", {
        p_city_norm: cityNorm,
        p_address_norm: addressNorm,
        p_phone_norm: phoneNorm,
      });

      if (dupErr) {
        console.error("Dup RPC error:", dupErr);
        return { ok: false, reason: "error" as const, message: "Ne mogu da proverim duplikate trenutno." };
      }

      if (dupRows && dupRows.length > 0) {
        const d = dupRows[0];
        const why = d.dup_type === "phone" ? "sa istim brojem telefona" : "na ovoj adresi";

        return {
          ok: false,
          reason: "confirm" as const,
          message: `Deluje da već postoji firma ${why} (npr. "${d.company_name}"). Ako je ovo druga firma, klikni "Pošalji ipak".`,
        };
      }
    }

    // ID pravimo mi
    const applicationId =
      (globalThis.crypto && "randomUUID" in globalThis.crypto)
        ? globalThis.crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

    // INSERT
    const { error: insErr } = await supabase
      .from("partner_applications")
      .insert({
        id: applicationId,
        company_name: data.companyName,
        city: data.city,
        city_norm: cityNorm,
        municipality: data.municipality,
        address: data.address,
        address_norm: addressNorm,
        phone: data.phone,
        phone_norm: phoneNorm,
        email: data.email || null,
        tags: data.tags,
        working_hours: data.workingHours || null,
        description: data.description || null,
        lat: data.lat ?? null,
        lng: data.lng ?? null,
        status: "pending",
        dup_confirmed: force,
      });

    if (insErr) {
      console.error("Insert error:", insErr);
      return { ok: false, reason: "error" as const, message: "Došlo je do greške pri slanju prijave." };
    }

    // UPLOAD (ne ruši prijavu)
    try {
      await uploadPartnerPhotos(applicationId, photos || []);
    } catch (e) {
      console.error("uploadPartnerPhotos exception:", e);
    }

    return { ok: true as const };
  }}
/>


      <ChangePasswordModal
         open={changePassOpen}
         onClose={() => setChangePassOpen(false)}
         email={userEmail}
         />
        <div className="reveal">
          <Categories
              firms={firmsWithDistance}
              userId={session?.user?.id ?? null}
              followSet={followSet}
              onToggleFollow={toggleFollow}
              onSelectCategory={(q) => {
                if (!userLocation && !cityQuery.trim()) {
                 setLocationPromptOpen(true);
                return; }
                setShowFavorites(false);
                setShowSavedCategories(false);
                setChangePassOpen(false);
                setCameFromSavedCategories(false);
              setQuery(q);}}/>
        </div>

        <div className="reveal">
          <HowItWorks />
        </div>

        <div className="reveal">
          <FAQ />
        </div>
      </main>
      <Footer />

      <FirmModal firm={selectedFirm} onClose={closeFirm} />
      {locationPromptOpen && !userLocation && !cityInput.trim() && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="text-xl font-black text-brand-navy">Uključi lokaciju?</div>
            <p className="mt-2 text-sm text-slate-600 font-semibold leading-relaxed">
              Ako dozvoliš lokaciju, prikazaćemo firme u krugu od{" "}
              <span className="font-black">25 km</span>. Ako ne želiš, možeš uneti grad i dobiti rezultate samo za taj grad.
            </p>

            {locationDenied && (
              <div className="mt-3 rounded-xl bg-red-50 border border-red-200 p-3 text-sm font-bold text-red-700">
                Lokacija je odbijena ili nije dostupna u browseru. Možeš uneti grad u polje iznad.
              </div>
            )}

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={requestUserLocation}
                disabled={locationLoading}
                className={
                  "flex-1 rounded-xl bg-brand-orange px-4 py-3 text-white font-black hover:brightness-95 active:scale-95 transition inline-flex items-center justify-center gap-3 " +
                  (locationLoading ? "opacity-70 cursor-not-allowed active:scale-100" : "")
                }
              >
                {locationLoading && (
                  <span className="h-5 w-5 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
                )}
                {locationLoading ? "Uključujem..." : "Dozvoli lokaciju"}
              </button>

              <button
                type="button"
                onClick={() => setLocationPromptOpen(false)}
                disabled={locationLoading}
                className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-slate-800 font-black hover:bg-slate-200 active:scale-95 transition"
              >
                Preskoči
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
