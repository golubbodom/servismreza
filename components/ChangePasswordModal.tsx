import React, { useEffect, useState } from "react";
import { supabase } from "../src/supabaseClient";
import eye from "../src/assets/icons/eye.png";
import eyeOff from "../src/assets/icons/eye-off.png";




type Props = {
  open: boolean;
  onClose: () => void;
  email: string | null; // email ulogovanog usera
};

export default function ChangePasswordModal({ open, onClose, email }: Props) {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPass2, setNewPass2] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [noticeType, setNoticeType] = useState<"info" | "error" | "success">("info");
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showNew2, setShowNew2] = useState(false);

  useEffect(() => {
    if (!open) return;
    setOldPass("");
    setNewPass("");
    setNewPass2("");
    setNotice(null);
    setNoticeType("info");
  }, [open]);

  if (!open) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    if (!email) {
      setNoticeType("error");
      setNotice("Nisi ulogovan.");
      return;
    }

    if (newPass.length < 6) {
      setNoticeType("error");
      setNotice("Nova lozinka mora imati bar 6 karaktera.");
      return;
    }

    if (newPass !== newPass2) {
      setNoticeType("error");
      setNotice("Nova lozinka se ne poklapa u oba polja.");
      return;
    }

    setLoading(true);

    // 1) potvrdi staru lozinku (reauth)
    const { error: reauthErr } = await supabase.auth.signInWithPassword({
      email,
      password: oldPass,
    });

    if (reauthErr) {
      setLoading(false);
      setNoticeType("error");
      setNotice("Pogrešna stara lozinka.");
      return;
    }

    // 2) promeni na novu lozinku
    const { error: updErr } = await supabase.auth.updateUser({ password: newPass });

    setLoading(false);

    if (updErr) {
      setNoticeType("error");
      setNotice("Greška pri promeni lozinke. Pokušaj ponovo.");
      return;
    }

    setNoticeType("success");
    setNotice("Lozinka je uspešno promenjena ✅");
    setTimeout(() => onClose(), 900);
  };

  const box =
    noticeType === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : noticeType === "success"
      ? "border-green-200 bg-green-50 text-green-800"
      : "border-sky-100 bg-sky-50 text-slate-700";

  const title =
    noticeType === "error" ? "Greška" : noticeType === "success" ? "Uspeh" : "Info";

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
        onClick={onClose}
        aria-label="Zatvori"
      />
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-brand-navy">Promeni lozinku</h3>
              <p className="mt-1 text-slate-600 font-medium">
                Unesi staru lozinku, pa zatim novu.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 transition active:scale-95"
              aria-label="Zatvori"
            >
              ✕
            </button>
          </div>

          {notice && (
            <div className={`mt-4 rounded-2xl border p-4 ${box}`}>
              <div className="font-black">{title}</div>
              <div className="text-sm font-medium mt-1">{notice}</div>
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-black text-brand-navy">Stara lozinka</span>
              <div className="mt-2 relative">
  <input
    type={showOld ? "text" : "password"}
    autoComplete="current-password"
    value={oldPass}
    onChange={(e) => setOldPass(e.target.value)}
    className="w-full rounded-2xl border border-slate-200 bg-white pl-4 pr-12 py-3 font-bold text-brand-navy focus:outline-none focus:ring-4 focus:ring-orange-50/60 focus:border-brand-orange transition"
    required
  />

  <button
    type="button"
    onClick={() => setShowOld((v) => !v)}
className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-2 py-1
text-slate-400/70 hover:text-slate-700
hover:bg-slate-100/70
focus:outline-none focus:ring-4 focus:ring-orange-50/60
active:scale-95 transition
opacity-60 hover:opacity-100"
    aria-label={showOld ? "Sakrij lozinku" : "Prikaži lozinku"}
    title={showOld ? "Sakrij lozinku" : "Prikaži lozinku"}
  >
    <img src={showOld ? eyeOff : eye} alt="" className="w-5 h-5 opacity-40 hover:opacity-100 transition" />
  </button>
</div>

            </label>

            <label className="block">
              <span className="text-sm font-black text-brand-navy">Nova lozinka</span>
              <div className="mt-2 relative">
  <input
    type={showNew ? "text" : "password"}
    autoComplete="new-password"
    value={newPass}
    onChange={(e) => setNewPass(e.target.value)}
    className="w-full rounded-2xl border border-slate-200 bg-white pl-4 pr-12 py-3 font-bold text-brand-navy focus:outline-none focus:ring-4 focus:ring-orange-50/60 focus:border-brand-orange transition"
    required
  />

  <button
    type="button"
    onClick={() => setShowNew((v) => !v)}
className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-2 py-1
text-slate-400/70 hover:text-slate-700
hover:bg-slate-100/70
focus:outline-none focus:ring-4 focus:ring-orange-50/60
active:scale-95 transition
opacity-60 hover:opacity-100"
    aria-label={showNew ? "Sakrij lozinku" : "Prikaži lozinku"}
    title={showNew ? "Sakrij lozinku" : "Prikaži lozinku"}
  >
    <img src={showOld ? eyeOff : eye} alt="" className="w-5 h-5 opacity-40 hover:opacity-100 transition" />
  </button>
</div>

            </label>

            <label className="block">
              <span className="text-sm font-black text-brand-navy">Ponovi novu lozinku</span>
              <div className="mt-2 relative">
  <input
    type={showNew2 ? "text" : "password"}
    autoComplete="new-password"
    value={newPass2}
    onChange={(e) => setNewPass2(e.target.value)}
    className="w-full rounded-2xl border border-slate-200 bg-white pl-4 pr-12 py-3 font-bold text-brand-navy focus:outline-none focus:ring-4 focus:ring-orange-50/60 focus:border-brand-orange transition"
    required
  />

  <button
    type="button"
    onClick={() => setShowNew2((v) => !v)}
className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-2 py-1
text-slate-400/70 hover:text-slate-700
hover:bg-slate-100/70
focus:outline-none focus:ring-4 focus:ring-orange-50/60
active:scale-95 transition
opacity-60 hover:opacity-100"
    aria-label={showNew2 ? "Sakrij lozinku" : "Prikaži lozinku"}
    title={showNew2 ? "Sakrij lozinku" : "Prikaži lozinku"}
  >
    <img src={showOld ? eyeOff : eye} alt="" className="w-5 h-5 opacity-40 hover:opacity-100 transition" />
  </button>
</div>

            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-orange text-white px-6 py-3 rounded-2xl font-black hover:brightness-95 active:scale-95 transition disabled:opacity-60"
            >
              {loading ? "Menjam..." : "Sačuvaj novu lozinku"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
