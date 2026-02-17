import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const AUTHORS = [
  { name: "th studio", url: "https://www.flaticon.com/authors/th-studio" },
  { name: "I Wayan Wika", url: "https://www.flaticon.com/authors/i-wayan-wika" },
  { name: "Surang", url: "https://www.flaticon.com/authors/surang" },
  { name: "Ylivdesign", url: "https://www.flaticon.com/authors/ylivdesign" },
  { name: "HAJICON", url: "https://www.flaticon.com/authors/hajicon" },
  { name: "monkik", url: "https://www.flaticon.com/authors/monkik" },
  { name: "imaginationlol", url: "https://www.flaticon.com/authors/imaginationlol" },
  { name: "Freepik", url: "https://www.flaticon.com/authors/freepik" }
];

export default function CreditsModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-2xl font-black text-brand-navy">
              Credits
            </h2>
            <p className="text-slate-600 font-medium mt-1 text-sm">
              Ikonice korišćene na sajtu.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-3 py-2 font-black hover:bg-slate-50 active:scale-95 transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-sm font-semibold text-slate-700">
          <p>
            Icons made by:
          </p>

          <ul className="space-y-2">
            {AUTHORS.map((author) => (
              <li key={author.name}>
                <a
                  href={author.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue hover:text-brand-orange underline transition"
                >
                  {author.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="pt-3 border-t border-slate-200 mt-4">
            from{" "}
            <a
              href="https://www.flaticon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue hover:text-brand-orange underline transition"
            >
              www.flaticon.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
