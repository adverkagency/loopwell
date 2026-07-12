import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-10">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-lg font-bold tracking-tight text-ink"
      >
        <span
          aria-hidden
          className="flex h-8 w-8 items-center justify-center rounded-field bg-gradient-to-br from-teal-400 to-teal-600 font-bold text-white shadow-rest-xs"
        >
          L
        </span>
        Loopwell
      </Link>
      <main className="w-full max-w-[400px] rounded-card border border-hairline bg-elevated p-6 shadow-rest">
        {children}
      </main>
    </div>
  );
}
