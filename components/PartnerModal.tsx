import React, { useEffect, useMemo, useRef, useState } from "react";

type PartnerApplication = {
  companyName: string;
  municipality: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  tags: string[];
  workingHours?: string;
  description?: string;
};

export type SubmitResult =
  | { ok: true }
  | { ok: false; reason: "duplicate" | "error" | "confirm"; message: string };

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: PartnerApplication, opts?: { force?: boolean }) => Promise<SubmitResult>;
};

const normalizeTag = (s: string) =>
  s
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N}\s-]/gu, "");

const isValidPhone = (s: string) => {
  const cleaned = s.replace(/[^\d+]/g, "");
  return cleaned.replace(/\D/g, "").length >= 6;
};

// ✅ Type guard: kad je ok:false -> imamo reason + message
const isSubmitError = (r: SubmitResult): r is Extract<SubmitResult, { ok: false }> => r.ok === false;

export default function PartnerModal({ open, onClose, onSubmit }: Props) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [municipality, setMunicipality] = useState("");

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [workingHours, setWorkingHours] = useState("");
  const [description, setDescription] = useState("");

  const [touched, setTouched] = useState(false);
  const [success, setSuccess] = useState(false);

  const [submitMsg, setSubmitMsg] = useState<null | { type: "info" | "error"; text: string }>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // confirm flow
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [lastPayload, setLastPayload] = useState<PartnerApplication | null>(null);

  // ESC zatvori
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Reset kad se zatvori
  useEffect(() => {
    if (open) return;
    setTouched(false);
    setSuccess(false);
    setSubmitMsg(null);
    setIsSubmitting(false);
    setNeedsConfirm(false);
    setLastPayload(null);
    setCompanyName("");
    setCity("");
    setAddress("");
    setPhone("");
    setEmail("");
    setTags([]);
    setTagInput("");
    setWorkingHours("");
    setDescription("");
    setMunicipality("");
  }, [open]);

  const canAddMoreTags = tags.length < 5;

  const addTag = (raw: string) => {
    if (!canAddMoreTags) return;

    const cleaned = normalizeTag(raw);
    if (!cleaned) return;

    const short = cleaned.slice(0, 28);
    const lower = short.toLowerCase();
    if (tags.some((t) => t.toLowerCase() === lower)) return;

    setTags((prev) => [...prev, short]);
  };

  const addFromInput = () => {
    if (!tagInput.trim()) return;
    const parts = tagInput.split(",").map((p) => p.trim()).filter(Boolean);
    parts.forEach((p) => addTag(p));
    setTagInput("");
  };

  const removeTag = (t: string) => {
    setTags((prev) => prev.filter((x) => x !== t));
  };

  const errors = useMemo(() => {
    const e: Record<string, string> = {};

    if (!companyName.trim()) e.companyName = "Unesi naziv firme.";
    if (!municipality.trim()) e.municipality = "Unesi opštinu.";
    if (!city.trim()) e.city = "Unesi mesto.";
    if (!address.trim()) e.address = "Unesi adresu (ulica i broj).";
    if (!phone.trim()) e.phone = "Unesi kontakt telefon.";
    else if (!isValidPhone(phone)) e.phone = "Telefon ne izgleda ispravno.";

    if (tags.length === 0) e.tags = "Dodaj bar 1 uslugu (max 5).";
    if (description.trim().length > 300) e.description = "Opis max 300 karaktera.";

    return e;
  }, [companyName, municipality, city, address, phone, tags, description]);

  const isValid = Object.keys(errors).length === 0;

  const buildPayload = (): PartnerApplication => ({
    companyName: companyName.trim(),
    municipality: municipality.trim(),
    city: city.trim(),
    address: address.trim(),
    phone: phone.trim(),
    email: email.trim() || "",
    tags,
    workingHours: workingHours.trim() || undefined,
    description: description.trim() || undefined,
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setSubmitMsg(null);
    setNeedsConfirm(false);
    setLastPayload(null);

    if (!isValid) return;
    if (!onSubmit) return;
    if (isSubmitting) return;

    const payload = buildPayload();

    setIsSubmitting(true);
    try {
      const res = await onSubmit(payload);

      if (!isSubmitError(res)) {
        setSuccess(true);
        return;
      }

      // ovde smo 100% ok:false
      setSuccess(false);

      if (res.reason === "confirm") {
        setNeedsConfirm(true);
        setLastPayload(payload);
        setSubmitMsg({ type: "info", text: res.message });
        return;
      }

      setSubmitMsg({
        type: res.reason === "duplicate" ? "info" : "error",
        text: res.message,
      });
    } catch (err) {
      console.error("Partner submit exception:", err);
      setSuccess(false);
      setSubmitMsg({
        type: "error",
        text: "Došlo je do greške pri slanju prijave. Pokušajte ponovo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitAnyway = async () => {
    if (!onSubmit) return;
    if (!lastPayload) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitMsg(null);

    try {
      const res = await onSubmit(lastPayload, { force: true });

      if (!isSubmitError(res)) {
        setSuccess(true);
        setNeedsConfirm(false);
        setLastPayload(null);
        return;
      }

      // ovde smo 100% ok:false
      setSuccess(false);
      setNeedsConfirm(false);
      setLastPayload(null);
      setSubmitMsg({
        type: res.reason === "duplicate" ? "info" : "error",
        text: res.message,
      });
    } catch (err) {
      console.error("Partner submitAnyway exception:", err);
      setSubmitMsg({
        type: "error",
        text: "Došlo je do greške pri slanju prijave. Pokušajte ponovo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Postani partner"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div
        ref={dialogRef}
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-[#003153]">Postani partner</h3>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              Besplatno • Prijave prolaze proveru pre objave
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 hover:bg-slate-50 active:scale-95 transition"
            aria-label="Zatvori"
            title="Zatvori (Esc)"
          >
            ✕
          </button>
        </div>

        <div className="p-5 max-h-[80vh] overflow-auto">
          {success ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="text-brand-navy font-black text-lg">Prijava poslata ✅</div>
              <p className="mt-2 text-slate-700 font-semibold">
                Hvala! Vaša prijava je na proveri. Nakon odobrenja, firma će biti vidljiva u
                pretrazi.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-brand-orange px-4 py-2 text-white font-black active:scale-95 transition hover:brightness-95"
              >
                Zatvori
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {submitMsg && (
                <div
                  className={`rounded-2xl border p-4 ${
                    submitMsg.type === "info"
                      ? "border-amber-200 bg-amber-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <p className="font-black text-brand-navy">{submitMsg.text}</p>

                  {needsConfirm && (
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={submitAnyway}
                        disabled={isSubmitting}
                        className="rounded-xl bg-brand-orange px-4 py-2 text-white font-black active:scale-95 transition hover:brightness-95 disabled:opacity-60"
                      >
                        {isSubmitting ? "Šaljem..." : "Pošalji ipak"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setNeedsConfirm(false);
                          setLastPayload(null);
                          setSubmitMsg(null);
                        }}
                        disabled={isSubmitting}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-700 font-black hover:bg-slate-50 active:scale-95 transition disabled:opacity-60"
                      >
                        Izmeni podatke
                      </button>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={submit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Naziv firme *"
                    value={companyName}
                    onChange={setCompanyName}
                    placeholder="npr. Prozor Sistem"
                    error={touched ? errors.companyName : undefined}
                  />

                  <Field
                    label="Opština *"
                    value={municipality}
                    onChange={setMunicipality}
                    placeholder="npr. Beograd"
                    error={touched ? errors.municipality : undefined}
                  />

                  <Field
                    label="Mesto *"
                    value={city}
                    onChange={setCity}
                    placeholder="npr. Mladenovac"
                    error={touched ? errors.city : undefined}
                  />


                 <Field
                   label="Adresa (ulica i broj) *"
                   value={address}
                   onChange={(v) =>
                   setAddress(
                                v
                            .replace(/[.,:@';><}]/g, "")
                            .replace(/\s+/g, " ")
                            )}
                  placeholder="npr. Knez Mihajlova 2"
                  error={touched ? errors.address : undefined}/>

                  <Field
                    label="Kontakt telefon *"
                    value={phone}
                    onChange={setPhone}
                    placeholder="npr. 060/123-456"
                    error={touched ? errors.phone : undefined}
                  />

                  <Field
                     label="Email (opciono)"
                     value={email}
                     onChange={setEmail}
                     placeholder="npr. firma@email.com"
                  />



                </div>
                
                <div>
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <label className="block text-sm font-black text-brand-navy">
                        Usluge / tagovi (max 5) *
                      </label>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        Unesite kratke pojmove. Možete i više odjednom razdvojeno zarezom.
                      </p>
                    </div>
                    <div className="text-xs font-black text-slate-500">{tags.length}/5</div>
                  </div>

                  <div className="mt-2 flex gap-2">
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addFromInput();
                        }
                      }}
                      disabled={!canAddMoreTags || isSubmitting}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-brand-blue/30 disabled:opacity-60"
                      placeholder={
                        canAddMoreTags
                          ? "npr. PVC stolarija, komarnici, ugradnja"
                          : "Dostigli ste max 5 tagova"
                      }
                    />
                    <button
                      type="button"
                      onClick={addFromInput}
                      disabled={!canAddMoreTags || isSubmitting}
                      className="shrink-0 rounded-xl bg-brand-orange px-4 py-3 text-white font-black active:scale-95 transition hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Dodaj
                    </button>
                  </div>

                  {touched && errors.tags && (
                    <p className="mt-2 text-sm font-black text-red-600">{errors.tags}</p>
                  )}

                  {tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700"
                        >
                          {t}
                          <button
                            type="button"
                            onClick={() => removeTag(t)}
                            disabled={isSubmitting}
                            className="rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-black hover:bg-slate-50 active:scale-95 transition disabled:opacity-60"
                            aria-label={`Ukloni tag ${t}`}
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Radno vreme (opciono)"
                    value={workingHours}
                    onChange={setWorkingHours}
                    placeholder="npr.Pon–Pet 08:00–16:00,Sub 09-13"
                  />

                  <div className="md:col-span-2">
                    <label className="block text-sm font-black text-brand-navy">
                      Kratak opis (opciono)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={isSubmitting}
                      className="mt-2 w-full min-h-[100px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-brand-blue/30 disabled:opacity-60"
                      placeholder="2–4 rečenice o vašim uslugama..."
                    />
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">Max 300 karaktera</span>
                      <span
                        className={`text-xs font-black ${
                          description.length > 300 ? "text-red-600" : "text-slate-500"
                        }`}
                      >
                        {description.length}/300
                      </span>
                    </div>
                    {touched && errors.description && (
                      <p className="mt-1 text-sm font-black text-red-600">{errors.description}</p>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-2xl bg-brand-orange px-5 py-4 text-white font-black text-base active:scale-[0.99] transition hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Šaljem..." : "Pošalji prijavu"}
                  </button>

                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    Slanjem prijave potvrđujete da su podaci tačni. Prijave se proveravaju pre
                    objave.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-black text-brand-navy">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-brand-blue/30 ${
          error ? "border-red-300 focus:ring-red-200" : "border-slate-200"
        }`}
        placeholder={placeholder}
      />
      {error && <p className="mt-2 text-sm font-black text-red-600">{error}</p>}
    </div>
  );
}
