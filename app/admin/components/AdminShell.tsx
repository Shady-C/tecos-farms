"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";

type AdminShellProps = {
  children: React.ReactNode;
  userName: string;
};

export default function AdminShell({ children, userName }: AdminShellProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)]">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={userName}
      />

      <main className="min-h-screen lg:ml-[220px]">
        <div className="border-b border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-3 py-2 text-xs text-[var(--admin-text)]"
          >
            Menu
          </button>
        </div>
        <div className="px-4 py-5 sm:px-5 lg:px-9 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
