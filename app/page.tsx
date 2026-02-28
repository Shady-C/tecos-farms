"use client";

import { useState, useEffect } from "react";
import countries from "../data/countries.json";

const sortedCountries = [...countries].sort((a, b) => {
  const numA = parseInt(a.dial_code.replace("+", ""));
  const numB = parseInt(b.dial_code.replace("+", ""));
  return numA - numB;
});

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
  const [countryCode, setCountryCode] = useState("+255");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
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

  function handlePhoneChange(value: string) {
    const stripped = value.replace(/^0+/, "");
    setPhone(stripped);
  }

  const kilosNum = parseFloat(kilos) || 0;
  const total =
    settings && kilosNum > 0
      ? Math.round(kilosNum * settings.price_per_kg)
      : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!settings || kilosNum <= 0) return;
    setSubmitState("submitting");
    setErrorMessage(null);
    try {
      const fullPhone = `${countryCode}${phone.trim()}`;
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name.trim(),
          phone: fullPhone,
          email: email.trim() || null,
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

  function resetForm() {
    setName("");
    setCountryCode("+255");
    setPhone("");
    setEmail("");
    setArea("");
    setKilos("");
    setSubmitState("idle");
    setErrorMessage(null);
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
          <button
            onClick={resetForm}
            className="inline-block px-6 py-3 bg-green-700 text-white rounded-lg font-medium min-h-[44px]"
          >
            Place another order
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 bg-stone-50">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8 pt-4">
          <h1 className="text-2xl font-bold text-green-800 mb-1">
            Teco&apos;s Farms
          </h1>
          <p className="text-stone-600">
            Fresh pork, delivered to you. Place your order below.
          </p>
        </div>

        {loading ? (
          <p className="text-stone-500 text-center">Loading…</p>
        ) : !settings ? (
          <p className="text-red-600 text-center">Unable to load prices. Please try again later.</p>
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
              <span className="text-sm font-medium text-stone-700">Full Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border border-stone-300 rounded-lg px-3 py-2 min-h-[44px]"
                autoComplete="name"
              />
            </label>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-stone-700">Phone</span>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="border border-stone-300 rounded-lg px-2 py-2 min-h-[44px] bg-white text-sm shrink-0 w-[110px]"
                >
                  {sortedCountries.map((c) => (
                    <option key={c.code} value={c.dial_code}>
                      {c.emoji} {c.dial_code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  required
                  placeholder="712345678"
                  className="border border-stone-300 rounded-lg px-3 py-2 min-h-[44px] flex-1 min-w-0"
                  autoComplete="tel-national"
                />
              </div>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-stone-700">Email <span className="font-normal text-stone-400">(optional)</span></span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-stone-300 rounded-lg px-3 py-2 min-h-[44px]"
                autoComplete="email"
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
