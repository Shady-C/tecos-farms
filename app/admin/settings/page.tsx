"use client";

import { useState, useEffect } from "react";
import type { Settings } from "@/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const [pricePerKg, setPricePerKg] = useState("");
  const [orderCutoffDay, setOrderCutoffDay] = useState("");
  const [orderCutoffTime, setOrderCutoffTime] = useState("");
  const [deliveryDay, setDeliveryDay] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data: Settings) => {
        setSettings(data);
        setPricePerKg(String(data.price_per_kg));
        setOrderCutoffDay(data.order_cutoff_day ?? "");
        setOrderCutoffTime(
          typeof data.order_cutoff_time === "string"
            ? data.order_cutoff_time.slice(0, 5)
            : ""
        );
        setDeliveryDay(data.delivery_day ?? "");
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
        order_cutoff_day: orderCutoffDay.trim() || "wednesday",
        order_cutoff_time: orderCutoffTime || "23:59:00",
        delivery_day: deliveryDay.trim() || "saturday",
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
    return <p className="text-stone-500">Loading…</p>;
  }

  if (!settings) {
    return (
      <p className="text-red-600">
        {message?.type === "error" ? message.text : "Could not load settings."}
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-stone-800 mb-6">Settings</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md flex flex-col gap-4 p-4 bg-white rounded-lg border border-stone-200 shadow-sm"
      >
        {message && (
          <p
            className={
              message.type === "ok"
                ? "text-sm text-green-700 bg-green-50 p-2 rounded"
                : "text-sm text-red-600 bg-red-50 p-2 rounded"
            }
          >
            {message.text}
          </p>
        )}
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-700">Price per kg (TZS)</span>
          <input
            type="number"
            min="0"
            step="1"
            value={pricePerKg}
            onChange={(e) => setPricePerKg(e.target.value)}
            required
            className="border border-stone-300 rounded-lg px-3 py-2 min-h-[44px]"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-700">Order cutoff day</span>
          <select
            value={orderCutoffDay}
            onChange={(e) => setOrderCutoffDay(e.target.value)}
            className="border border-stone-300 rounded-lg px-3 py-2 min-h-[44px]"
          >
            {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(
              (d) => (
                <option key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              )
            )}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-700">Order cutoff time</span>
          <input
            type="time"
            value={orderCutoffTime}
            onChange={(e) => setOrderCutoffTime(e.target.value)}
            className="border border-stone-300 rounded-lg px-3 py-2 min-h-[44px]"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-700">Delivery day</span>
          <select
            value={deliveryDay}
            onChange={(e) => setDeliveryDay(e.target.value)}
            className="border border-stone-300 rounded-lg px-3 py-2 min-h-[44px]"
          >
            {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(
              (d) => (
                <option key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              )
            )}
          </select>
        </label>
        <button
          type="submit"
          disabled={saving}
          className="mt-2 px-4 py-3 bg-green-700 text-white rounded-lg font-medium min-h-[44px] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>
    </div>
  );
}
