import Link from "next/link";
import { login } from "../actions";
import { AuthForm, Field } from "@/components/ui/auth-form";

export const metadata = { title: "Sign in — Loopwell" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reset?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      {params.reset === "done" ? (
        <p
          role="status"
          className="mb-4 rounded-xl border border-lp-primary/20 bg-lp-primary/10 px-4 py-3 text-sm font-medium text-lp-primary"
        >
          Password updated — sign in with your new password.
        </p>
      ) : null}
      <AuthForm
        action={login}
        eyebrow="Welcome back"
        title={
          <>
            Sign in to <em className="italic text-lp-primary">Loopwell</em>.
          </>
        }
        subtitle="Pick up where you left off. Your streaks are waiting."
        submitLabel="Sign in"
        footer={
          <>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-lp-ink underline underline-offset-4">
              Start free →
            </Link>
          </>
        }
      >
        <input type="hidden" name="next" value={params.next ?? ""} />
        <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          action={
            <Link href="/forgot-password" className="text-xs text-lp-muted hover:text-lp-ink">
              Forgot?
            </Link>
          }
        />
      </AuthForm>
    </>
  );
}
