import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../src/supabaseClient";
import eye from "../src/assets/icons/eye.png";
import eyeOff from "../src/assets/icons/eye-off.png";


type AuthModalProps = {
  open: boolean;
  onClose: () => void;
};

type View = "login" | "register" | "forgot";

const LAST_EMAIL_KEY = "sm_last_email";

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [view, setView] = useState<View>("login");

  // Form state (UI only)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [noticeType, setNoticeType] = useState<"info" | "success" | "error">("info");



  // Reset fields when opened/closed
  useEffect(() => {
    if (!open) return;
    setView("login");
    setEmail(localStorage.getItem(LAST_EMAIL_KEY) ?? "");
    setPassword("");
    setNotice(null);
    setNoticeType("info");
  }, [open]);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const title = useMemo(() => {
    if (view === "login") return "Prijavi se";
    if (view === "register") return "Napravi nalog";
    return "Reset lozinke";
  }, [view]);

  const subtitle = useMemo(() => {
    if (view === "login") {
      return "Registracijom dobijaš: favorite, istoriju pretrage i ocenjivanje firmi.";
    }
    if (view === "register") {
      return "Napravi nalog za favorite, istoriju pretrage i ocenjivanje firmi.";
    }
    return "Unesi email — poslaćemo ti link za reset lozinke.";
  }, [view]);

  if (!open) return null;

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    if (view === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

     if (error) {
  if (error.message === "Invalid login credentials") {
    setNotice("Pogrešan email ili lozinka.");
    setNoticeType("error");
  } else {
    setNotice("Došlo je do greške prilikom prijave.");
    setNoticeType("error");
  }
  return;
}

      onClose();
      return;
    }

    if (view === "register") {
      const { error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setNotice(error.message);
        setNoticeType("error")
        return;
      }

      setNotice("Proveri email za potvrdu naloga ✅");
      setNoticeType("success");
      return;
    }

    if (view === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (error) {
        setNotice("Greška prilikom slanja emaila za reset lozinke.");
        setNoticeType("error");
        return;
      }

      setNotice("Poslali smo link za reset lozinke ✅ Proveri Inbox/Spam.");
      setNoticeType("success");
    }
  } catch (err: any) {
    setNotice("Došlo je do neočekivane greške.");
    setNoticeType("error");
  }
};



  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Overlay */}
      <button
        aria-label="Zatvori"
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px] animate-in fade-in duration-200"
        onClick={onClose}
        type="button"
      />

      {/* Modal */}
        <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 sm:p-8 border-b border-slate-200/60">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
              {title}
            </h2>
            <p className="mt-1 text-slate-600 font-medium max-w-xl">
              {subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition"
            aria-label="Zatvori prozor"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8">
          {notice && (
  <div
    className={
      "mb-6 rounded-2xl p-4 " +
      (noticeType === "error"
        ? "border border-red-200 bg-red-50 text-red-800"
        : noticeType === "success"
        ? "border border-green-200 bg-green-50 text-green-800"
        : "border border-sky-100 bg-sky-50 text-slate-700")
    }
  >
    <div className="font-black text-brand-navy">
      {noticeType === "error" ? "Greška" : noticeType === "success" ? "Uspešno" : "Info"}
    </div>
    <div className="text-sm font-medium mt-1">{notice}</div>
  </div>
)}

          {/* Top switch (login/register) */}
          {view !== "forgot" && (
            <div className="mb-6 flex items-center gap-2 rounded-2xl bg-slate-100 p-2">
              <button
                type="button"
                onClick={() => setView("login")}
                className={
                  "flex-1 rounded-xl px-4 py-2 font-black transition " +
                  (view === "login"
                    ? "bg-white shadow text-brand-navy"
                    : "text-slate-600 hover:text-brand-navy")
                }
              >
                Imam nalog
              </button>
              <button
                type="button"
                onClick={() => setView("register")}
                className={
                  "flex-1 rounded-xl px-4 py-2 font-black transition " +
                  (view === "register"
                    ? "bg-white shadow text-brand-navy"
                    : "text-slate-600 hover:text-brand-navy")
                }
              >
                Napravi nalog
              </button>
            </div>
          )}

          {/* Animated “pages” */}
          <div className="relative">
            {/* Login */}
            <div
              className={
                "transition-all duration-250 " +
                (view === "login"
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-3 pointer-events-none absolute inset-0")
              }
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <FieldEmail value={email} onChange={setEmail}  />
                <FieldPassword value={password} onChange={setPassword} autoComplete="current-password"/>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    className="text-sm font-bold text-sky-700 hover:text-sky-800 underline underline-offset-4"
                  >
                    Zaboravio si lozinku?
                  </button>

                  <button
                    type="submit"
                    className="bg-brand-orange text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-orange-950/10 hover:scale-[1.02] active:scale-95 transition"
                  >
                    Prijavi se
                  </button>
                </div>
              </form>
            </div>

            {/* Register */}
            <div
              className={
                "transition-all duration-250 " +
                (view === "register"
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-3 pointer-events-none absolute inset-0")
              }
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <FieldEmail value={email} onChange={setEmail} />
                <FieldPassword value={password} onChange={setPassword} autoComplete="new-password"/>

                <div className="rounded-2xl bg-sky-50 border border-sky-100 p-4 text-slate-700">
                  <div className="font-black text-brand-navy mb-1">Benefiti naloga</div>
                  <ul className="text-sm font-medium list-disc pl-5 space-y-1">
                    <li>Čuvanje omiljenih firmi (favoriti)</li>
                    <li>Istorija pretrage</li>
                    <li>Ocene i komentari</li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-brand-orange text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-orange-950/10 hover:scale-[1.02] active:scale-95 transition"
                  >
                    Registruj se
                  </button>
                </div>
              </form>
            </div>

            {/* Forgot */}
            <div
              className={
                "transition-all duration-250 " +
                (view === "forgot"
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2 pointer-events-none absolute inset-0")
              }
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <FieldEmail value={email} onChange={setEmail} />
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="text-sm font-black text-slate-700 hover:text-brand-navy transition"
                  >
                    ← Nazad na prijavu
                  </button>

                  <button
                    type="submit"
                    className="bg-brand-orange text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-orange-950/10 hover:scale-[1.02] active:scale-95 transition"
                  >
                    Pošalji link
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Bottom note */}
        </div>
      </div>
    </div>
  );
}

function FieldEmail({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-brand-navy">Email</span>
      <input
        type="email"
        autoComplete="email"
        value={value}
        onChange={(e) => {const v = e.target.value;
              onChange(v);
              localStorage.setItem("sm_last_email", v);}}
        placeholder="npr. nikola@email.com"
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold text-brand-navy placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-orange-50/60 focus:border-brand-orange transition"
        required
      />
    </label>
  );
}
function FieldPassword({
  value,
  onChange,
  autoComplete = "current-password",
}: {
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
const [show, setShow] = useState(false);

return (
  <label className="block">
    <span className="text-sm font-black text-brand-navy">Lozinka</span>

    <div className="mt-2 relative">
      <input
        type={show ? "text" : "password"}
        autoComplete="current-password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="••••••••"
        className="w-full rounded-2xl border border-slate-200 bg-white pl-4 pr-12 py-3 font-bold text-brand-navy placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-orange-50/60 focus:border-brand-orange transition"
        required
      />

      <button
  type="button"
  onClick={() => setShow((v) => !v)}
  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-2 py-1
             text-slate-400/70 hover:text-slate-700
             hover:bg-slate-100/70
             focus:outline-none focus:ring-4 focus:ring-orange-50/60
             active:scale-95 transition
             opacity-60 hover:opacity-100"
  aria-label={show ? "Sakrij lozinku" : "Prikaži lozinku"}
  title={show ? "Sakrij lozinku" : "Prikaži lozinku"}
>
  <img
    src={show ? eyeOff : eye}
    alt=""
    className="w-5 h-5 opacity-50 hover:opacity-100 transition"
  />
</button>

    </div>
  </label>
);
}

