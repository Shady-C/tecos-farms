import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import AdminLogout from "./AdminLogout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="min-h-screen bg-stone-50">
      {session && (
        <nav className="border-b border-stone-200 bg-white px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              href="/admin/orders"
              className="text-stone-700 font-medium hover:text-stone-900"
            >
              Orders
            </Link>
            <Link
              href="/admin/settings"
              className="text-stone-700 font-medium hover:text-stone-900"
            >
              Settings
            </Link>
          </div>
          <AdminLogout />
        </nav>
      )}
      <div className="p-4 md:p-6">{children}</div>
    </div>
  );
}
