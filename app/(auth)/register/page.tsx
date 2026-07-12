import Link from "next/link";
import { register } from "../actions";
import { AuthForm, Field } from "@/components/ui/auth-form";

export const metadata = { title: "Create your account — Loopwell" };

export default function RegisterPage() {
  return (
    <AuthForm
      action={register}
      title="Create your account"
      subtitle="Your first win is about 60 seconds away."
      submitLabel="Create account"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-teal-600 hover:text-teal-700">
            Log in
          </Link>
        </>
      }
    >
      <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
      <Field label="Password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" />
    </AuthForm>
  );
}
