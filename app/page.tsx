"use client";

import { useState, useEffect } from "react";
import countries from "../data/countries.json";
import type { MobileMoneyDetails } from "@/types";
import HeroHeader from "@/components/order/HeroHeader";
import PriceBanner from "@/components/order/PriceBanner";
import KiloSelector from "@/components/order/KiloSelector";
import PaymentMethodPicker, { type PaymentChoice } from "@/components/order/PaymentMethodPicker";
import OrderSummary from "@/components/order/OrderSummary";
import SubmitBar from "@/components/order/SubmitBar";
import SuccessScreen from "@/components/order/SuccessScreen";

const sortedCountries = [...countries].sort((a, b) => {
  const numA = parseInt(a.dial_code.replace("+", ""));
  const numB = parseInt(b.dial_code.replace("+", ""));
  return numA - numB;
});

type PublicSettings = {
  price_per_kg: number;
  min_kg: number;
  delivery_day?: string;
  order_cutoff_day?: string;
  order_cutoff_time?: string;
  enabled_payment_methods: string[];
  mobile_money_details: MobileMoneyDetails | null;
};

type SuccessData = {
  id: string;
  total_price: number;
  delivery_batch: string;
};

const SECTION_DELAY = ["0s", "0.05s", "0.1s", "0.15s", "0.2s", "0.25s"];

function Section({
  label,
  children,
  delayIndex,
}: {
  label: string;
  children: React.ReactNode;
  delayIndex: number;
}) {
  return (
    <div
      className="animate-slide-up"
      style={{ animationDelay: SECTION_DELAY[delayIndex] ?? "0s" }}
    >
      <div
        className="text-[11px] font-semibold uppercase tracking-widest mb-2.5 ml-0.5"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

export default function OrderPage() {
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [settingsError, setSettingsError] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+255");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [kg, setKg] = useState(5);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [landmark, setLandmark] = useState("");
  const [payment, setPayment] = useState<PaymentChoice>("mpesa_prepay");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetch("/api/settings/public")
      .then((res) => res.json())
      .then((data) => {
        if (data.price_per_kg != null) {
          setSettings({
            price_per_kg: data.price_per_kg,
            min_kg: data.min_kg ?? 1,
            delivery_day: data.delivery_day,
            order_cutoff_day: data.order_cutoff_day,
            order_cutoff_time: data.order_cutoff_time,
            enabled_payment_methods: Array.isArray(data.enabled_payment_methods)
              ? data.enabled_payment_methods
              : ["cash", "mobile_money"],
            mobile_money_details: data.mobile_money_details ?? null,
          });
        } else {
          setSettingsError(true);
        }
      })
      .catch(() => setSettingsError(true))
      .finally(() => setLoading(false));
  }, []);

  function handlePhoneChange(value: string) {
    setPhone(value.replace(/^0+/, ""));
  }

  const total = settings ? Math.round(kg * settings.price_per_kg) : 0;

  const paymentMethodMap: Record<PaymentChoice, "cash" | "mobile_money"> = {
    mpesa_prepay: "mobile_money",
    cash: "cash",
    mpesa_delivery: "mobile_money",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!settings || kg < settings.min_kg) return;

    setSubmitState("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name.trim(),
          phone: `${countryCode}${phone.trim()}`,
          email: email.trim() || null,
          street_address: address1.trim(),
          address_line_2: address2.trim() || null,
          landmark: landmark.trim() || null,
          kilos: kg,
          payment_method: paymentMethodMap[payment],
          prepay: payment === "mpesa_prepay",
          notes: notes.trim() || null,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        setSubmitState("error");
        return;
      }

      setSuccessData({
        id: data.id,
        total_price: data.total_price,
        delivery_batch: data.delivery_batch,
      });
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setSubmitState("error");
    }
  }

  function resetForm() {
    setName("");
    setCountryCode("+255");
    setPhone("");
    setEmail("");
    setKg(5);
    setAddress1("");
    setAddress2("");
    setLandmark("");
    setPayment("mpesa_prepay");
    setNotes("");
    setSubmitState("idle");
    setErrorMessage(null);
    setSuccessData(null);
  }

  if (successData && settings) {
    return (
      <SuccessScreen
        orderId={successData.id}
        kg={kg}
        totalTzs={successData.total_price}
        deliveryBatch={successData.delivery_batch}
        onNewOrder={resetForm}
      />
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg)", paddingBottom: 120 }}
    >
      {/* Hero */}
      <HeroHeader
        deliveryDay={settings?.delivery_day}
        orderCutoffDay={settings?.order_cutoff_day}
        orderCutoffTime={settings?.order_cutoff_time}
      />

      {loading ? (
        <div className="max-w-[480px] mx-auto px-4 pt-4 text-center" style={{ color: "var(--muted)" }}>
          Loading…
        </div>
      ) : settingsError || !settings ? (
        <div className="max-w-[480px] mx-auto px-4 pt-4 text-center text-sm" style={{ color: "var(--accent)" }}>
          Unable to load prices. Please try again later.
        </div>
      ) : (
        <>
          {/* Price banner floats up from hero */}
          <div className="max-w-[480px] mx-auto px-4">
            <PriceBanner pricePerKg={settings.price_per_kg} />
          </div>

          <form
            id="order-form"
            onSubmit={handleSubmit}
            className="max-w-[480px] mx-auto px-4 flex flex-col gap-5"
            style={{ marginTop: 8 }}
          >
            {/* Error banner */}
            {errorMessage && (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  background: "#fff0ee",
                  border: "1.5px solid #f5c9b0",
                  color: "var(--accent)",
                }}
              >
                {errorMessage}
              </div>
            )}

            {/* 1. Your Details */}
            <Section label="Your Details" delayIndex={0}>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "var(--white)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
              >
                {/* Name */}
                <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div
                    className="text-[11px] font-semibold uppercase tracking-widest mb-1.5 flex items-center gap-1.5"
                    style={{ color: "var(--muted)" }}
                  >
                    Full Name <span style={{ color: "var(--accent)", fontSize: 13 }}>*</span>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Amina Msika"
                    autoComplete="name"
                    className="w-full bg-transparent border-none outline-none text-base font-medium"
                    style={{ fontFamily: "var(--font-outfit), sans-serif", color: "var(--text)" }}
                  />
                </div>

                {/* Phone */}
                <div className="px-4 pt-3 pb-3" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div
                    className="text-[11px] font-semibold uppercase tracking-widest mb-1.5 flex items-center gap-1.5"
                    style={{ color: "var(--muted)" }}
                  >
                    WhatsApp Number <span style={{ color: "var(--accent)", fontSize: 13 }}>*</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-transparent border-none outline-none text-base font-medium flex-shrink-0"
                      style={{
                        fontFamily: "var(--font-outfit), sans-serif",
                        color: "var(--muted)",
                        paddingRight: 8,
                        borderRight: "1px solid var(--border)",
                      }}
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
                      placeholder="712 345 678"
                      autoComplete="tel-national"
                      className="w-full bg-transparent border-none outline-none text-base font-medium"
                      style={{ fontFamily: "var(--font-outfit), sans-serif", color: "var(--text)" }}
                    />
                  </div>
                  <div className="text-[11px] mt-1" style={{ color: "var(--dim)" }}>
                    We&apos;ll confirm your order on WhatsApp
                  </div>
                </div>

                {/* Email */}
                <div className="px-4 pt-3 pb-3" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div
                    className="text-[11px] font-semibold uppercase tracking-widest mb-1.5"
                    style={{ color: "var(--muted)" }}
                  >
                    Email{" "}
                    <span style={{ color: "var(--dim)", textTransform: "none", fontWeight: 400, letterSpacing: 0 }}>
                      (optional)
                    </span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full bg-transparent border-none outline-none text-base font-medium"
                    style={{ fontFamily: "var(--font-outfit), sans-serif", color: "var(--text)" }}
                  />
                </div>

                {/* Address Line 1 */}
                <div className="px-4 pt-3 pb-3" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div
                    className="text-[11px] font-semibold uppercase tracking-widest mb-1.5 flex items-center gap-1.5"
                    style={{ color: "var(--muted)" }}
                  >
                    Address <span style={{ color: "var(--accent)", fontSize: 13 }}>*</span>
                  </div>
                  <input
                    type="text"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    required
                    placeholder="e.g. Mikocheni, Dar es Salaam"
                    autoComplete="address-line1"
                    className="w-full bg-transparent border-none outline-none text-base font-medium"
                    style={{ fontFamily: "var(--font-outfit), sans-serif", color: "var(--text)" }}
                  />
                </div>

                {/* Address Line 2 */}
                <div className="px-4 pt-3 pb-3" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div
                    className="text-[11px] font-semibold uppercase tracking-widest mb-1.5"
                    style={{ color: "var(--muted)" }}
                  >
                    Address Line 2{" "}
                    <span style={{ color: "var(--dim)", textTransform: "none", fontWeight: 400, letterSpacing: 0 }}>
                      (optional)
                    </span>
                  </div>
                  <input
                    type="text"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    placeholder="e.g. Apartment 4B, Sinza Road"
                    autoComplete="address-line2"
                    className="w-full bg-transparent border-none outline-none text-base font-medium"
                    style={{ fontFamily: "var(--font-outfit), sans-serif", color: "var(--text)" }}
                  />
                </div>

                {/* Landmark */}
                <div className="px-4 pt-3 pb-4">
                  <div
                    className="text-[11px] font-semibold uppercase tracking-widest mb-1.5"
                    style={{ color: "var(--muted)" }}
                  >
                    Landmark{" "}
                    <span style={{ color: "var(--dim)", textTransform: "none", fontWeight: 400, letterSpacing: 0 }}>
                      (optional)
                    </span>
                  </div>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Shoprite, opposite the mosque"
                    className="w-full bg-transparent border-none outline-none text-base font-medium"
                    style={{ fontFamily: "var(--font-outfit), sans-serif", color: "var(--text)" }}
                  />
                </div>
              </div>
            </Section>

            {/* 2. How Many Kilos */}
            <Section label="How Many Kilos?" delayIndex={1}>
              <KiloSelector
                kg={kg}
                pricePerKg={settings.price_per_kg}
                minKg={settings.min_kg}
                onChange={setKg}
              />
            </Section>

            {/* 3. Payment */}
            <Section label="How Will You Pay?" delayIndex={2}>
              <PaymentMethodPicker
                selected={payment}
                totalTzs={total}
                enabledMethods={settings.enabled_payment_methods}
                mobileMoneyDetails={settings.mobile_money_details}
                onChange={setPayment}
              />
            </Section>

            {/* 4. Notes */}
            <Section label="Special Notes (Optional)" delayIndex={3}>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "var(--white)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
              >
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requests? e.g. Please cut into small pieces, leave at the gate..."
                  rows={3}
                  className="w-full bg-transparent border-none outline-none resize-none px-4 py-4 text-[15px]"
                  style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    color: "var(--text)",
                    minHeight: 80,
                  }}
                />
              </div>
            </Section>

            {/* 5. Order Summary */}
            <Section label="Order Summary" delayIndex={4}>
              <OrderSummary kg={kg} pricePerKg={settings.price_per_kg} payment={payment} />
            </Section>
          </form>

          {/* Fixed submit bar — positioned fixed, inside main form via form attribute */}
          <SubmitBar
            isSubmitting={submitState === "submitting"}
            disabled={
              !name.trim() ||
              !phone.trim() ||
              !address1.trim() ||
              kg < settings.min_kg
            }
            formId="order-form"
          />
        </>
      )}
    </div>
  );
}
