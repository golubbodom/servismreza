"use client";

import React from "react";

export function ShimmerButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`relative inline-flex items-center justify-center rounded-xl
        overflow-hidden bg-brand-orange text-white font-black
        px-4 py-2 ${className}`}
    >
      {/* shimmer ring */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          background:
            "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.6) 45%, transparent 60%)",
          animation: "shimmer 2.8s linear infinite",
        }}
      />

      {/* content */}
      <span className="relative z-10">{children}</span>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </button>
  );
}
