"use client";

import { useMemo, useState } from "react";

type QuickAddOrderProps = {
  pricePerKg: number;
  enabledMethods?: string[];
  onCreated: () => Promise<void>;
};

export default function QuickAddOrder({ pricePerKg, enabledMethods = ["cash", "mobile_money"], onCreated }: QuickAddOrderProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [landmark, setLandmark] = useState("");
  const [kilos, setKilos] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "mobile_money">("cash");
  const [prepay, setPrepay] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const estimatedPrice = useMemo(() => {
    const kgValue = Number.parseFloat(kilos);
    if (Number.isNaN(kgValue) || kgValue <= 0) return 0;
    return Math.round(kgValue * pricePerKg);
  }, [kilos, pricePerKg]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      customer_name: customerName.trim(),
      phone: phone.trim(),
      street_address: streetAddress.trim(),
      address_line_2: address2.trim() || null,
      landmark: landmark.trim() || null,
      kilos: Number.parseFloat(kilos),
      payment_method: paymentMethod,
      prepay,
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setMessage({ type: "error", text: data.error ?? "Failed to create order" });
      return;
    }

    setMessage({ type: "ok", text: "Order added." });
    setCustomerName("");
    setPhone("");
    setStreetAddress("");
    setAddress2("");
    setLandmark("");
    setKilos("");
    setPaymentMethod("cash");
    setPrepay(false);
    await onCreated();
  }

  return (
    <section
      id="quick-add-order"
      className="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]"
    >
      <div className="border-b border-[var(--admin-border)] px-5 py-4">
        <h3 className="font-[var(--font-syne)] text-sm font-semibold text-[var(--admin-text)]">
          Quick Add Order
        </h3>
      </div>

      <form className="space-y-3 px-5 py-4" onSubmit={handleSubmit}>
        {message ? (
          <p
            className={`rounded-md border px-2 py-1.5 text-xs ${
              message.type === "ok"
                ? "border-[#4caf7d66] bg-[#4caf7d22] text-[var(--admin-green)]"
                : "border-[#e0525266] bg-[#e0525222] text-[var(--admin-red)]"
            }`}
          >
            {message.text}
          </p>
        ) : null}

        <label className="block">
          <span className="mb-1 block text-[9px] uppercase tracking-[1.5px] text-[var(--admin-muted)]">
            Customer Name
          </span>
          <input
            required
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            className="w-full rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-xs text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]"
            placeholder="Customer name"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-[9px] uppercase tracking-[1.5px] text-[var(--admin-muted)]">
            Phone
          </span>
          <input
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-xs text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]"
            placeholder="e.g. 0712345678"
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="mb-1 block text-[9px] uppercase tracking-[1.5px] text-[var(--admin-muted)]">
              Kilos (kg)
            </span>
            <input
              required
              min="0.1"
              step="0.1"
              type="number"
              value={kilos}
              onChange={(event) => setKilos(event.target.value)}
              className="w-full rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-xs text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]"
              placeholder="5"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[9px] uppercase tracking-[1.5px] text-[var(--admin-muted)]">
              Price (TZS)
            </span>
            <input
              readOnly
              value={estimatedPrice ? estimatedPrice.toLocaleString("en-TZ") : ""}
              className="w-full rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-xs text-[var(--admin-muted)] outline-none"
              placeholder="Auto-calc"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-[9px] uppercase tracking-[1.5px] text-[var(--admin-muted)]">
            Street Address
          </span>
          <input
            required
            value={streetAddress}
            onChange={(event) => setStreetAddress(event.target.value)}
            className="w-full rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-xs text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]"
            placeholder="e.g. Mikocheni, Dar es Salaam"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-[9px] uppercase tracking-[1.5px] text-[var(--admin-muted)]">
            Address Line 2{" "}
            <span className="normal-case tracking-normal opacity-60">(optional)</span>
          </span>
          <input
            value={address2}
            onChange={(event) => setAddress2(event.target.value)}
            className="w-full rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-xs text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]"
            placeholder="e.g. Apt 4B, Sinza Road"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-[9px] uppercase tracking-[1.5px] text-[var(--admin-muted)]">
            Landmark{" "}
            <span className="normal-case tracking-normal opacity-60">(optional)</span>
          </span>
          <input
            value={landmark}
            onChange={(event) => setLandmark(event.target.value)}
            className="w-full rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-xs text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]"
            placeholder="e.g. Near Shoprite"
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="mb-1 block text-[9px] uppercase tracking-[1.5px] text-[var(--admin-muted)]">
              Payment Method
            </span>
            <select
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value as "cash" | "mobile_money")}
              className="w-full rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-xs text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]"
            >
              {enabledMethods.includes("cash") && <option value="cash">Cash</option>}
              {enabledMethods.includes("mobile_money") && <option value="mobile_money">Mobile Money</option>}
            </select>
          </label>

          <label className="flex items-end pb-1 text-xs text-[var(--admin-muted)]">
            <input
              type="checkbox"
              checked={prepay}
              onChange={(event) => setPrepay(event.target.checked)}
              className="mr-2"
            />
            Mark as prepaid
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-1 w-full rounded-md bg-[var(--admin-accent)] px-3 py-2.5 text-xs font-medium text-white hover:bg-[#d05520] disabled:opacity-50"
        >
          {saving ? "Adding..." : "+ Add Order"}
        </button>
      </form>
    </section>
  );
}
