import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/app-shell";
import { safeTimezone } from "@/lib/dates";

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
    .select("onboarding_completed_at, display_name, timezone")
    .eq("id", user.id)
    .single();
  if (!profile?.onboarding_completed_at) redirect("/onboarding");

  const tz = safeTimezone(profile?.timezone as string | undefined);
  const name = (profile?.display_name as string | null) ?? null;

  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      hour12: false,
    }).format(new Date())
  );
  const partOfDay =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const dateLabel = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <AppShell
      greeting={`${partOfDay}${name ? `, ${name}` : ""}`}
      dateLabel={dateLabel}
      initials={initialsOf(name, user.email ?? "")}
      email={user.email ?? ""}
    >
      {children}
    </AppShell>
  );
}

function initialsOf(name: string | null, email: string) {
  const source = name?.trim() || email.split("@")[0] || "L";
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[1][0] : source.slice(0, 2);
  return letters.toUpperCase();
}
