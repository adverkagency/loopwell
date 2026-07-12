import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppNav } from "@/components/layout/app-nav";
import { logout } from "@/app/(auth)/actions";

/** Authenticated app shell — proxy already gates, this is defense in depth + user context. */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Partially-onboarded users never land on an empty Daily (IA §16)
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .eq("id", user.id)
    .single();
  if (!profile?.onboarding_completed_at) redirect("/onboarding");

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <AppNav />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-hairline bg-paper/80 px-4 py-3 backdrop-blur-md">
          <span className="flex items-center gap-2 text-lg font-bold tracking-tight text-ink md:hidden">
            <span
              aria-hidden
              className="flex h-8 w-8 items-center justify-center rounded-field bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-rest-xs"
            >
              L
            </span>
            Loopwell
          </span>
          <span className="hidden text-sm text-ink-secondary md:inline">
            {user.email}
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="flex min-h-9 items-center rounded-full border border-hairline-strong px-4 text-xs font-semibold text-ink transition hover:bg-surface-hover"
            >
              Log out
            </button>
          </form>
        </header>
        <main className="mx-auto w-full max-w-[940px] px-4 pb-[100px] pt-4 sm:px-6 sm:pt-6 md:pb-8 lg:px-8 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
