"use client";

import { useState, useEffect, useCallback } from "react";
import type { Order, Settings } from "@/types";
import { getNextDeliveryDate } from "@/lib/delivery";
import OrdersTable from "../components/OrdersTable";
import QuickAddOrder from "../components/QuickAddOrder";
import DeliveryNavigator from "../components/DeliveryNavigator";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [upcomingDate, setUpcomingDate] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);

  // Load settings first to determine the upcoming delivery date
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Settings | null) => {
        setSettings(data);
        const deliveryDay = data?.delivery_day ?? "saturday";
        const next = getNextDeliveryDate(deliveryDay);
        setUpcomingDate(next);
        setSelectedDate(next);
      })
      .catch(() => {
        const fallback = getNextDeliveryDate("saturday");
        setUpcomingDate(fallback);
        setSelectedDate(fallback);
      });
  }, []);

  const fetchOrders = useCallback((date: string) => {
    if (!date) return;
    setLoading(true);
    fetch(`/api/orders?delivery_date=${encodeURIComponent(date)}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Order[]) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedDate) fetchOrders(selectedDate);
  }, [selectedDate, fetchOrders]);

  async function updateOrder(
    id: string,
    updates: {
      payment_status?: Order["payment_status"];
      order_status?: Order["order_status"];
    }
  ) {
    setBusyOrderId(id);
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) fetchOrders(selectedDate);
    setBusyOrderId(null);
  }

  const excelUrl = selectedDate
    ? `/api/export/excel?delivery_date=${encodeURIComponent(selectedDate)}`
    : null;

  const totalKg = orders.reduce((sum, o) => sum + Number(o.kilos), 0);

  function scrollToQuickAdd() {
    document
      .getElementById("quick-add-order")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="text-[var(--admin-text)]">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-[var(--font-syne)] text-[26px] font-bold tracking-[-0.5px]">
            Orders
          </h1>
          <p className="mt-1 text-[11px] text-[var(--admin-muted)]">
            Delivery cycle management
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {selectedDate && upcomingDate && (
            <DeliveryNavigator
              selectedDate={selectedDate}
              upcomingDate={upcomingDate}
              orderCount={orders.length}
              totalKg={totalKg}
              onNavigate={setSelectedDate}
            />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              title="Placeholder button"
              className="rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-4 py-2 text-[11px] text-[var(--admin-text)] hover:border-[var(--admin-dim)]"
            >
              Send Blast
            </button>
            {excelUrl && (
              <a
                href={excelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-4 py-2 text-[11px] text-[var(--admin-text)] hover:border-[var(--admin-dim)]"
              >
                Export CSV
              </a>
            )}
            <button
              type="button"
              onClick={scrollToQuickAdd}
              className="rounded-md bg-[var(--admin-accent)] px-4 py-2 text-[11px] font-medium text-white hover:bg-[#d05520]"
            >
              + Add Order
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-[var(--admin-muted)]">Loading...</p>
      ) : (
        <div className="flex flex-col items-start gap-5 lg:flex-row">
          <div className="min-w-0 flex-1">
            <OrdersTable
              orders={orders}
              onUpdateOrder={updateOrder}
              busyOrderId={busyOrderId}
            />
          </div>
          <div className="w-full shrink-0 lg:w-80">
            <QuickAddOrder
              pricePerKg={settings?.price_per_kg ?? 0}
              enabledMethods={
                settings?.enabled_payment_methods ?? ["cash", "mobile_money"]
              }
              onCreated={() => fetchOrders(selectedDate)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
