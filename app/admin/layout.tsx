import { createClient } from "@/lib/supabase/server";
import { DM_Mono, Syne } from "next/font/google";
import AdminShell from "./components/AdminShell";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
  display: "swap",
});

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const fallbackName = session?.user?.email?.split("@")[0] ?? "Admin User";
  const userName = fallbackName
    .split(".")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return (
    <div
      className={`admin-dark ${syne.variable} ${dmMono.variable} font-[var(--font-dm-mono)] min-h-screen`}
    >
      <div className="hidden font-[var(--font-syne)]" />
      <AdminShell userName={userName}>{children}</AdminShell>
    </div>
  );
}
