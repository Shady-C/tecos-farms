import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-semibold text-stone-800 mb-2">
        Teco&apos;s Farms
      </h1>
      <p className="text-stone-600 mb-8 text-center">
        Fresh pork, delivered to you.
      </p>
      <Link
        href="/order"
        className="px-6 py-3 bg-green-700 text-white rounded-lg font-medium min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
      >
        Order now
      </Link>
    </main>
  );
}
