"use client";

import { useState, useEffect, useCallback } from "react";
import type { Order, Settings } from "@/types";
import { getNextDeliveryDate } from "@/lib/delivery";
import FarmSheetCard from "./components/FarmSheetCard";
import PaymentSummary from "./components/PaymentSummary";
import RecentOrders from "./components/RecentOrders";
import StatsGrid from "./components/StatsGrid";
import DeliveryNavigator from "./components/DeliveryNavigator";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [upcomingDate, setUpcomingDate] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Load settings first to determine the upcoming delivery date
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((settings: Settings | null) => {
        const deliveryDay = settings?.delivery_day ?? "saturday";
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

  const fetchOrders = useCallback(
    (date: string) => {
      if (!date) return;
      setLoading(true);
      fetch(`/api/orders?delivery_date=${encodeURIComponent(date)}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data: Order[]) => setOrders(Array.isArray(data) ? data : []))
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    },
    []
  );

  useEffect(() => {
    if (selectedDate) fetchOrders(selectedDate);
  }, [selectedDate, fetchOrders]);

  function handleNavigate(date: string) {
    setSelectedDate(date);
  }

  const totalKg = orders.reduce((sum, o) => sum + Number(o.kilos), 0);

  return (
    <div className="text-[var(--admin-text)]">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-[var(--font-syne)] text-[26px] font-bold tracking-[-0.5px]">
            Dashboard
          </h1>
          <p className="mt-1 text-[11px] text-[var(--admin-muted)]">
            Cycle overview
          </p>
        </div>

        {selectedDate && upcomingDate && (
          <DeliveryNavigator
            selectedDate={selectedDate}
            upcomingDate={upcomingDate}
            orderCount={orders.length}
            totalKg={totalKg}
            onNavigate={handleNavigate}
          />
        )}
      </div>

      {loading ? (
        <p className="text-[var(--admin-muted)]">Loading...</p>
      ) : (
        <>
          <StatsGrid orders={orders} />

          <div className="grid gap-5 lg:grid-cols-[1fr_minmax(280px,340px)]">
            <RecentOrders orders={orders} />

            <div className="flex flex-col gap-5">
              <FarmSheetCard
                totalKg={totalKg}
                totalOrders={orders.length}
                pdfUrl={null}
              />
              <PaymentSummary orders={orders} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
