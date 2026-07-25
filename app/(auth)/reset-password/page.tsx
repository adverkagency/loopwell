import { resetPassword } from "../actions";
import { AuthForm, Field } from "@/components/ui/auth-form";

export const metadata = { title: "Set a new password — Loopwell" };

export default function ResetPasswordPage() {
  return (
    <AuthForm
      action={resetPassword}
      eyebrow="Almost there"
      title={
        <>
          Set a <em className="italic text-lp-primary">new password</em>.
        </>
      }
      subtitle="Choose something strong you haven't used before."
      submitLabel="Update password"
    >
      <Field label="New password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" />
      <Field label="Confirm new password" name="confirm" type="password" autoComplete="new-password" />
    </AuthForm>
  );
}
