"use client";

import { useState, useEffect } from "react";
import type { Settings, DeliveryZone } from "@/types";

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
  const [orderCutoffDay, setOrderCutoffDay] = useState("");
  const [orderCutoffTime, setOrderCutoffTime] = useState("");
  const [deliveryDay, setDeliveryDay] = useState("");

  // Delivery zones
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [newZoneName, setNewZoneName] = useState("");
  const [newZoneIcon, setNewZoneIcon] = useState("");
  const [newZoneDetail, setNewZoneDetail] = useState("");

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
        setZones(Array.isArray(data.delivery_zones) ? data.delivery_zones : []);
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
        delivery_zones: zones,
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

  function addZone() {
    const name = newZoneName.trim();
    const icon = newZoneIcon.trim() || "📍";
    const detail = newZoneDetail.trim();
    if (!name) return;
    setZones((prev) => [...prev, { name, icon, detail }]);
    setNewZoneName("");
    setNewZoneIcon("");
    setNewZoneDetail("");
  }

  function removeZone(index: number) {
    setZones((prev) => prev.filter((_, i) => i !== index));
  }

  function updateZoneField(index: number, field: keyof DeliveryZone, value: string) {
    setZones((prev) =>
      prev.map((z, i) => (i === index ? { ...z, [field]: value } : z))
    );
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
        className="max-w-lg flex flex-col gap-6"
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

        {/* Core settings card */}
        <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border border-stone-200 shadow-sm">
          <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wide">Order Settings</h2>

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
              {DAYS.map((d) => (
                <option key={d} value={d}>{capitalize(d)}</option>
              ))}
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
              {DAYS.map((d) => (
                <option key={d} value={d}>{capitalize(d)}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Delivery zones card */}
        <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border border-stone-200 shadow-sm">
          <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wide">Delivery Zones</h2>
          <p className="text-xs text-stone-500">These zones appear as selectable cards on the public order form.</p>

          {/* Existing zones */}
          {zones.length === 0 ? (
            <p className="text-sm text-stone-400 italic">No zones yet. Add one below.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {zones.map((zone, i) => (
                <div key={i} className="flex gap-2 items-start p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={zone.icon}
                        onChange={(e) => updateZoneField(i, "icon", e.target.value)}
                        placeholder="🏙️"
                        className="border border-stone-300 rounded px-2 py-1 text-sm w-16 text-center"
                        title="Icon (emoji)"
                      />
                      <input
                        type="text"
                        value={zone.name}
                        onChange={(e) => updateZoneField(i, "name", e.target.value)}
                        placeholder="Zone name"
                        className="border border-stone-300 rounded px-2 py-1 text-sm flex-1"
                      />
                    </div>
                    <input
                      type="text"
                      value={zone.detail}
                      onChange={(e) => updateZoneField(i, "detail", e.target.value)}
                      placeholder="Sub-areas (e.g. Mikocheni, Sinza, Mwenge)"
                      className="border border-stone-300 rounded px-2 py-1 text-sm w-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeZone(i)}
                    className="text-stone-400 hover:text-red-600 transition-colors p-1 flex-shrink-0 mt-0.5"
                    title="Remove zone"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new zone */}
          <div className="border-t border-stone-200 pt-3 flex flex-col gap-2">
            <p className="text-xs font-medium text-stone-500">Add a zone</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newZoneIcon}
                onChange={(e) => setNewZoneIcon(e.target.value)}
                placeholder="🏙️"
                className="border border-stone-300 rounded-lg px-2 py-2 text-sm w-16 text-center"
                title="Icon (emoji)"
              />
              <input
                type="text"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                placeholder="Zone name"
                className="border border-stone-300 rounded-lg px-3 py-2 text-sm flex-1"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addZone())}
              />
            </div>
            <input
              type="text"
              value={newZoneDetail}
              onChange={(e) => setNewZoneDetail(e.target.value)}
              placeholder="Sub-areas (e.g. Mikocheni, Sinza, Mwenge)"
              className="border border-stone-300 rounded-lg px-3 py-2 text-sm w-full"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addZone())}
            />
            <button
              type="button"
              onClick={addZone}
              disabled={!newZoneName.trim()}
              className="self-start px-4 py-2 bg-stone-700 text-white rounded-lg text-sm font-medium disabled:opacity-40"
            >
              + Add Zone
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-3 bg-green-700 text-white rounded-lg font-medium min-h-[44px] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save all settings"}
        </button>
      </form>
    </div>
  );
}
