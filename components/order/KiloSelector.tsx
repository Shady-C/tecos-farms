"use client";

import { useState } from "react";

const QUICK_KG = [2, 3, 5, 8, 10, 15];
const MIN_KG = 2;
const MAX_KG = 50;

interface KiloSelectorProps {
  kg: number;
  pricePerKg: number;
  onChange: (kg: number) => void;
}

function fmt(n: number) {
  return n.toLocaleString("en-TZ");
}

export default function KiloSelector({ kg, pricePerKg, onChange }: KiloSelectorProps) {
  const [bumpKey, setBumpKey] = useState(0);

  function triggerBump(newKg: number) {
    onChange(newKg);
    setBumpKey((k) => k + 1);
  }

  function changeKg(delta: number) {
    const next = kg + delta;
    if (next < MIN_KG || next > MAX_KG) return;
    triggerBump(next);
  }

  function setKg(val: number) {
    triggerBump(val);
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--white)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
    >
      <div className="px-4 pt-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Select Amount
          </div>
          <div className="text-[11px]" style={{ color: "var(--muted)" }}>
            Tap or use +/−
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => changeKg(-1)}
            disabled={kg <= MIN_KG}
            className="flex items-center justify-center rounded-xl text-[22px] font-light flex-shrink-0 transition-all active:scale-95 disabled:opacity-40"
            style={{
              width: 44,
              height: 44,
              border: "1.5px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text)",
            }}
          >
            −
          </button>

          <div className="flex-1 text-center">
            <div
              key={bumpKey}
              className="animate-bump"
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: 38,
                fontWeight: 700,
                color: "var(--text)",
                lineHeight: 1,
              }}
            >
              {kg}
            </div>
            <div className="text-xs font-medium mt-0.5" style={{ color: "var(--muted)" }}>
              kilograms
            </div>
          </div>

          <button
            type="button"
            onClick={() => changeKg(1)}
            disabled={kg >= MAX_KG}
            className="flex items-center justify-center rounded-xl text-[22px] font-semibold flex-shrink-0 transition-all active:scale-95 disabled:opacity-40"
            style={{
              width: 44,
              height: 44,
              border: "1.5px solid var(--accent)",
              background: "var(--accent-bg)",
              color: "var(--accent)",
            }}
          >
            +
          </button>
        </div>

        {/* Quick chips */}
        <div className="flex flex-wrap gap-2 mt-3.5">
          {QUICK_KG.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setKg(val)}
              className="rounded-lg px-3.5 py-1.5 text-xs transition-all"
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                border: kg === val ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
                background: kg === val ? "var(--accent-bg)" : "var(--surface)",
                color: kg === val ? "var(--accent)" : "var(--muted)",
                fontWeight: kg === val ? 700 : 400,
              }}
            >
              {val} kg
            </button>
          ))}
        </div>

        {/* Price preview */}
        <div
          className="flex items-center justify-between rounded-xl px-4 py-3.5 mt-3.5"
          style={{
            background: "var(--accent-bg)",
            border: "1.5px solid #f5c9b0",
          }}
        >
          <div>
            <div className="text-xs font-medium" style={{ color: "var(--muted)" }}>
              Your total
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--dim)" }}>
              {kg} kg × {fmt(pricePerKg)} TZS
            </div>
          </div>
          <div className="text-right">
            <div
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: 20,
                fontWeight: 700,
                color: "var(--accent)",
              }}
            >
              {fmt(kg * pricePerKg)}
            </div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>
              TZS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
