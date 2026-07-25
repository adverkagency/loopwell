import Link from "next/link";
import { Check } from "lucide-react";
import { register } from "../actions";
import { AuthForm, Field } from "@/components/ui/auth-form";

export const metadata = { title: "Create your account — Loopwell" };

const PASSWORD_RULES = ["At least 8 characters", "One number or symbol", "No common passwords"];

export default function RegisterPage() {
  return (
    <AuthForm
      action={register}
      eyebrow="Free forever"
      title={
        <>
          Start your <em className="italic text-lp-primary">quiet</em> transformation.
        </>
      }
      subtitle="A minute to set up. One small step to start."
      submitLabel="Create account"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-lp-ink underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
      />
      <ul className="space-y-1 text-xs text-lp-muted">
        {PASSWORD_RULES.map((r) => (
          <li key={r} className="flex items-center gap-2">
            <span className="grid h-3.5 w-3.5 place-items-center rounded-full border border-lp-hairline">
              <Check className="h-2 w-2" />
            </span>
            {r}
          </li>
        ))}
      </ul>
      <p className="text-xs text-lp-muted">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-4 hover:text-lp-ink">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-4 hover:text-lp-ink">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthForm>
  );
}
