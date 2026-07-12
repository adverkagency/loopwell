import Link from "next/link";
import { forgotPassword } from "../actions";
import { AuthForm, Field } from "@/components/ui/auth-form";

export const metadata = { title: "Reset your password — Loopwell" };

export default function ForgotPasswordPage() {
  return (
    <AuthForm
      action={forgotPassword}
      title="Forgot your password?"
      subtitle="Enter your email and we'll send a reset link."
      submitLabel="Send reset link"
      footer={
        <Link href="/login" className="font-semibold text-teal-600 hover:text-teal-700">
          Back to log in
        </Link>
      }
    >
      <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
    </AuthForm>
  );
}
