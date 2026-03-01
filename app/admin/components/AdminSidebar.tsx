"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogout from "../AdminLogout";
import { getNextDeliveryDate, formatDeliveryDate } from "@/lib/delivery";

type AdminSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
};

type NavItem = {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  placeholder?: boolean;
};

const navSections: Array<{ title: string; items: NavItem[] }> = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", href: "/admin", icon: "⊞" },
      { label: "Orders", href: "/admin/orders", icon: "📋" },
      { label: "Customers", href: "#", icon: "👥", placeholder: true },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Farm Sheet", href: "#", icon: "🥩", placeholder: true },
      { label: "Deliveries", href: "#", icon: "🚚", placeholder: true },
      { label: "Payments", href: "#", icon: "💰", placeholder: true },
    ],
  },
  {
    title: "Reports",
    items: [
      { label: "History", href: "#", icon: "📊", placeholder: true },
      { label: "Settings", href: "/admin/settings", icon: "⚙" },
    ],
  },
];

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AdminSidebar({ isOpen, onClose, userName }: AdminSidebarProps) {
  const pathname = usePathname();
  const avatarText = initials(userName) || "AD";
  const [currentDeliveryDate, setCurrentDeliveryDate] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const day = data?.delivery_day ?? "saturday";
        setCurrentDeliveryDate(getNextDeliveryDate(day));
      })
      .catch(() => setCurrentDeliveryDate(getNextDeliveryDate("saturday")));
  }, []);

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[220px] border-r border-[var(--admin-border)] bg-[var(--admin-surface)] transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col py-7">
          <div className="mb-5 border-b border-[var(--admin-border)] px-6 pb-7">
            <div className="font-[var(--font-syne)] text-[22px] font-extrabold tracking-[-0.5px] text-[var(--admin-accent)]">
              PorkOMS
            </div>
            <div className="mt-1 text-[9px] uppercase tracking-[2px] text-[var(--admin-muted)]">
              Order Management
            </div>
          </div>

          <div className="mx-4 mb-5 rounded-lg border border-[#e8622a44] bg-gradient-to-br from-[#e8622a22] to-[#f0a04b11] p-3">
            <div className="mb-1 text-[8px] uppercase tracking-[2px] text-[var(--admin-accent-2)]">
              Current Cycle
            </div>
            <div className="text-[11px] font-medium text-[var(--admin-text)]">
              {currentDeliveryDate
                ? formatDeliveryDate(currentDeliveryDate)
                : "—"}
            </div>
            <span className="mt-2 inline-block rounded-sm border border-[#4caf7d44] bg-[#4caf7d22] px-1.5 py-0.5 text-[8px] uppercase tracking-[1.5px] text-[var(--admin-green)]">
              Open
            </span>
          </div>

          <nav className="flex-1 overflow-y-auto">
            {navSections.map((section) => (
              <div key={section.title} className="mb-2">
                <div className="px-4 pb-2 text-[8px] uppercase tracking-[2px] text-[var(--admin-dim)]">
                  {section.title}
                </div>
                {section.items.map((item) => {
                  const active =
                    item.href !== "#" &&
                    (item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href));
                  const commonClassName = `mx-0 flex items-center gap-2.5 border-l-2 px-6 py-2.5 text-[12px] transition-colors ${
                    active
                      ? "border-l-[var(--admin-accent)] bg-[#e8622a0d] text-[var(--admin-text)]"
                      : "border-l-transparent text-[var(--admin-muted)] hover:bg-white/5 hover:text-[var(--admin-text)]"
                  }`;

                  if (item.placeholder) {
                    return (
                      <button
                        key={item.label}
                        type="button"
                        className={`${commonClassName} w-full text-left`}
                        title="Placeholder button"
                      >
                        <span className="inline-block w-4 text-center text-sm">{item.icon}</span>
                        <span>{item.label}</span>
                        {item.badge ? (
                          <span className="ml-auto rounded-xl bg-[var(--admin-accent)] px-1.5 py-0.5 text-[9px] font-semibold text-white">
                            {item.badge}
                          </span>
                        ) : null}
                      </button>
                    );
                  }

                  return (
                    <Link key={item.label} href={item.href} className={commonClassName} onClick={onClose}>
                      <span className="inline-block w-4 text-center text-sm">{item.icon}</span>
                      <span>{item.label}</span>
                      {item.badge ? (
                        <span className="ml-auto rounded-xl bg-[var(--admin-accent)] px-1.5 py-0.5 text-[9px] font-semibold text-white">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="border-t border-[var(--admin-border)] px-6 pt-5">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--admin-accent)] to-[var(--admin-accent-2)] text-xs font-bold text-white">
                {avatarText}
              </div>
              <div>
                <div className="text-[11px] font-medium text-[var(--admin-text)]">{userName}</div>
                <div className="text-[9px] text-[var(--admin-muted)]">Admin</div>
              </div>
            </div>
            <AdminLogout className="w-full rounded-md border border-[var(--admin-border)] px-3 py-2 text-left text-xs text-[var(--admin-muted)] hover:border-[var(--admin-dim)] hover:text-[var(--admin-text)]" />
          </div>
        </div>
      </aside>
    </>
  );
}
