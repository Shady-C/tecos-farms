"use client";

import { useState, useEffect } from "react";
import type { Settings, MobileMoneyDetails } from "@/types";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  // Order settings
  const [pricePerKg, setPricePerKg] = useState("");
  const [minKg, setMinKg] = useState("");
  const [orderCutoffDay, setOrderCutoffDay] = useState("");
  const [orderCutoffTime, setOrderCutoffTime] = useState("");
  const [deliveryDay, setDeliveryDay] = useState("");

  // Payment methods
  const [enabledMethods, setEnabledMethods] = useState<string[]>(["cash", "mobile_money"]);
  const [mobileMoneyDetails, setMobileMoneyDetails] = useState<MobileMoneyDetails>({
    number: "",
    name: "",
    instructions: "",
  });


  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data: Settings) => {
        setSettings(data);
        setPricePerKg(String(data.price_per_kg));
        setMinKg(String(data.min_kg ?? 1));
        setOrderCutoffDay(data.order_cutoff_day ?? "");
        setOrderCutoffTime(
          typeof data.order_cutoff_time === "string"
            ? data.order_cutoff_time.slice(0, 5)
            : ""
        );
        setDeliveryDay(data.delivery_day ?? "");
        setEnabledMethods(
          Array.isArray(data.enabled_payment_methods) ? data.enabled_payment_methods : ["cash", "mobile_money"]
        );
        if (data.mobile_money_details) {
          setMobileMoneyDetails(data.mobile_money_details);
        }
      })
      .catch(() => setMessage({ type: "error", text: "Failed to load settings" }))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price_per_kg: parseFloat(pricePerKg) || 0,
        min_kg: parseFloat(minKg) || 1,
        order_cutoff_day: orderCutoffDay.trim() || "wednesday",
        order_cutoff_time: orderCutoffTime || "23:59:00",
        delivery_day: deliveryDay.trim() || "saturday",
        enabled_payment_methods: enabledMethods,
        mobile_money_details: enabledMethods.includes("mobile_money") ? mobileMoneyDetails : null,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setMessage({ type: "ok", text: "Settings saved." });
    } else {
      const data = await res.json().catch(() => ({}));
      setMessage({ type: "error", text: data.error ?? "Failed to save" });
    }
  }

  if (loading) {
    return <p className="text-[var(--admin-muted)]">Loading...</p>;
  }

  if (!settings) {
    return (
      <p className="text-[var(--admin-red)]">
        {message?.type === "error" ? message.text : "Could not load settings."}
      </p>
    );
  }

  return (
    <div className="text-[var(--admin-text)]">
      <h1 className="mb-6 font-[var(--font-syne)] text-[26px] font-bold tracking-[-0.5px]">Settings</h1>
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
        {message && (
          <p
            className={
              message.type === "ok"
                ? "rounded-md border border-[#4caf7d66] bg-[#4caf7d22] px-3 py-2 text-sm text-[var(--admin-green)]"
                : "rounded-md border border-[#e0525266] bg-[#e0525222] px-3 py-2 text-sm text-[var(--admin-red)]"
            }
          >
            {message.text}
          </p>
        )}

        {/* Core settings card */}
        <section className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5">
          <h2 className="mb-4 text-[9px] font-semibold uppercase tracking-[2px] text-[var(--admin-muted)]">
            Order Settings
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-[var(--admin-muted)]">Price per kg (TZS)</span>
              <input
                type="number"
                min="0"
                step="1"
                value={pricePerKg}
                onChange={(e) => setPricePerKg(e.target.value)}
                required
                className="rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-sm text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-[var(--admin-muted)]">Minimum order (kg)</span>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={minKg}
                onChange={(e) => setMinKg(e.target.value)}
                required
                className="rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-sm text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-[var(--admin-muted)]">Order cutoff day</span>
              <select
                value={orderCutoffDay}
                onChange={(e) => setOrderCutoffDay(e.target.value)}
                className="rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-sm text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {capitalize(d)}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-[var(--admin-muted)]">Order cutoff time</span>
              <input
                type="time"
                value={orderCutoffTime}
                onChange={(e) => setOrderCutoffTime(e.target.value)}
                className="rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-sm text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-[var(--admin-muted)]">Delivery day</span>
              <select
                value={deliveryDay}
                onChange={(e) => setDeliveryDay(e.target.value)}
                className="rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-sm text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {capitalize(d)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {/* Payment methods card */}
        <section className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5">
          <h2 className="mb-4 text-[9px] font-semibold uppercase tracking-[2px] text-[var(--admin-muted)]">
            Payment Methods
          </h2>
          <p className="mb-3 text-xs text-[var(--admin-muted)]">
            Control which payment options are available on the public order form.
          </p>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm text-[var(--admin-text)]">
              <input
                type="checkbox"
                checked={enabledMethods.includes("cash")}
                onChange={(e) => {
                  setEnabledMethods((prev) =>
                    e.target.checked
                      ? [...prev, "cash"]
                      : prev.filter((m) => m !== "cash")
                  );
                }}
              />
              Cash on Delivery
            </label>

            <label className="flex items-center gap-2 text-sm text-[var(--admin-text)]">
              <input
                type="checkbox"
                checked={enabledMethods.includes("mobile_money")}
                onChange={(e) => {
                  setEnabledMethods((prev) =>
                    e.target.checked
                      ? [...prev, "mobile_money"]
                      : prev.filter((m) => m !== "mobile_money")
                  );
                }}
              />
              Mobile Money (M-Pesa)
            </label>

            {enabledMethods.includes("mobile_money") && (
              <div className="ml-6 mt-1 flex flex-col gap-3 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[2px] text-[var(--admin-muted)]">
                  Mobile Money Details
                </p>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-[var(--admin-muted)]">Phone Number</span>
                  <input
                    type="text"
                    value={mobileMoneyDetails.number}
                    onChange={(e) =>
                      setMobileMoneyDetails((prev) => ({ ...prev, number: e.target.value }))
                    }
                    placeholder="e.g. 0712345678"
                    className="rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-3 py-2.5 text-sm text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-[var(--admin-muted)]">Account Name</span>
                  <input
                    type="text"
                    value={mobileMoneyDetails.name}
                    onChange={(e) =>
                      setMobileMoneyDetails((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g. Teco's Farms"
                    className="rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-3 py-2.5 text-sm text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-[var(--admin-muted)]">Instructions</span>
                  <textarea
                    value={mobileMoneyDetails.instructions}
                    onChange={(e) =>
                      setMobileMoneyDetails((prev) => ({ ...prev, instructions: e.target.value }))
                    }
                    placeholder="e.g. Send payment to this number and include your name as reference"
                    rows={2}
                    className="rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-3 py-2.5 text-sm text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]"
                  />
                </label>
              </div>
            )}
          </div>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-[var(--admin-accent)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#d05520] disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save all settings"}
        </button>
      </form>
    </div>
  );
}
