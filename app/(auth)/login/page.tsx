import Link from "next/link";
import { login } from "../actions";
import { AuthForm, Field } from "@/components/ui/auth-form";

export const metadata = { title: "Log in — Loopwell" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reset?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      {params.reset === "done" ? (
        <p role="status" className="mb-4 rounded-field bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700">
          Password updated — log in with your new password.
        </p>
      ) : null}
      <AuthForm
        action={login}
        title="Welcome back"
        subtitle="Pick up right where you left off."
        submitLabel="Log in"
        footer={
          <>
            No account yet?{" "}
            <Link href="/register" className="font-semibold text-teal-600 hover:text-teal-700">
              Create one free
            </Link>
          </>
        }
      >
        <input type="hidden" name="next" value={params.next ?? ""} />
        <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
        <Field label="Password" name="password" type="password" autoComplete="current-password" />
        <div className="text-right">
          <Link href="/forgot-password" className="text-sm text-ink-secondary hover:text-ink">
            Forgot password?
          </Link>
        </div>
      </AuthForm>
    </>
  );
}
