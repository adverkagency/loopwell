import Link from "next/link";
import { forgotPassword } from "../actions";
import { AuthForm, Field } from "@/components/ui/auth-form";

export const metadata = { title: "Reset your password — Loopwell" };

export default function ForgotPasswordPage() {
  return (
    <AuthForm
      action={forgotPassword}
      eyebrow="Account recovery"
      title={
        <>
          Forgot your <em className="italic text-lp-primary">password</em>?
        </>
      }
      subtitle="Enter your email and we'll send a reset link within a minute."
      submitLabel="Send reset link"
      footer={
        <Link href="/login" className="font-medium text-lp-ink underline underline-offset-4">
          ← Back to sign in
        </Link>
      }
    >
      <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
    </AuthForm>
  );
}
