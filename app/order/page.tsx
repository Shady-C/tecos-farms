"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type PublicSettings = {
  price_per_kg: number;
  delivery_day?: string;
  order_cutoff_day?: string;
};

export default function OrderPage() {
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [kilos, setKilos] = useState<string>("");

  useEffect(() => {
    fetch("/api/settings/public")
      .then((res) => res.json())
      .then((data) => {
        if (data.price_per_kg != null) {
          setSettings({
            price_per_kg: data.price_per_kg,
            delivery_day: data.delivery_day,
            order_cutoff_day: data.order_cutoff_day,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const kilosNum = parseFloat(kilos) || 0;
  const total =
    settings && kilosNum > 0
      ? Math.round(kilosNum * settings.price_per_kg)
      : 0;

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (!settings || kilosNum <= 0) return;
    setSubmitState("submitting");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name.trim(),
          phone: phone.trim(),
          area: area.trim(),
          kilos: kilosNum,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMessage(data.error ?? "Something went wrong");
        setSubmitState("error");
        return;
      }
      setSubmitState("success");
    } catch {
      setErrorMessage("Network error. Please try again.");
      setSubmitState("error");
    }
  }

  if (submitState === "success") {
    return (
      <main className="min-h-screen p-6 flex flex-col items-center justify-center bg-stone-50">
        <div className="max-w-md w-full text-center">
          <h1 className="text-xl font-semibold text-stone-800 mb-2">
            Order received
          </h1>
          <p className="text-stone-600 mb-6">
            We&apos;ll confirm your order and delivery details soon.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-green-700 text-white rounded-lg font-medium min-h-[44px]"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 bg-stone-50">
      <div className="max-w-md mx-auto">
        <Link
          href="/"
          className="text-green-700 text-sm font-medium mb-4 inline-block"
        >
          ← Back
        </Link>
        <h1 className="text-xl font-semibold text-stone-800 mb-2">
          Place your order
        </h1>
        <p className="text-stone-600 mb-6">
          Teco&apos;s Farms — fresh pork, delivered.
        </p>

        {loading ? (
          <p className="text-stone-500">Loading…</p>
        ) : !settings ? (
          <p className="text-red-600">Unable to load prices. Please try again later.</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 p-4 bg-white rounded-lg border border-stone-200 shadow-sm"
          >
            {errorMessage && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {errorMessage}
              </p>
            )}
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-stone-700">Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border border-stone-300 rounded-lg px-3 py-2 min-h-[44px]"
                autoComplete="name"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-stone-700">Phone</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="border border-stone-300 rounded-lg px-3 py-2 min-h-[44px]"
                autoComplete="tel"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-stone-700">Delivery area</span>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
                placeholder="e.g. Kinondoni, Mbezi"
                className="border border-stone-300 rounded-lg px-3 py-2 min-h-[44px]"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-stone-700">Kilos</span>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={kilos}
                onChange={(e) => setKilos(e.target.value)}
                required
                className="border border-stone-300 rounded-lg px-3 py-2 min-h-[44px]"
              />
            </label>
            <div className="pt-2 border-t border-stone-200">
              <p className="text-sm text-stone-600">
                Price: {settings.price_per_kg.toLocaleString()} TZS/kg
              </p>
              <p className="text-lg font-semibold text-stone-800 mt-1">
                Total: {total > 0 ? total.toLocaleString() : "—"} TZS
              </p>
            </div>
            <button
              type="submit"
              disabled={submitState === "submitting" || kilosNum <= 0}
              className="mt-2 px-4 py-3 bg-green-700 text-white rounded-lg font-medium min-h-[44px] disabled:opacity-60"
            >
              {submitState === "submitting" ? "Submitting…" : "Submit order"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
