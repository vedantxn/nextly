"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await authClient.forgetPassword({
      email,
      redirectTo: "/reset-password",
    });

    if (res.error) {
      setError(res.error.message ?? "Something went wrong");
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col max-w-md mx-auto w-full">
        <section className="space-y-6 py-[16vh] 2xl:py-48">
          <div className="flex flex-col items-center gap-4 w-full px-4">
            <h1 className="text-2xl font-semibold">Check your email</h1>
            <p className="text-muted-foreground text-center">
              If an account exists for {email}, we sent a password reset link.
            </p>
            <a href="/sign-in" className="text-primary underline text-sm">
              Back to sign in
            </a>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-md mx-auto w-full">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center gap-4 w-full px-4">
          <h1 className="text-2xl font-semibold">Forgot Password</h1>
          <p className="text-muted-foreground text-center text-sm">
            Enter your email and we&apos;ll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2.5 bg-transparent"
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 font-medium disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <a href="/sign-in" className="text-sm text-muted-foreground underline">
            Back to sign in
          </a>
        </div>
      </section>
    </div>
  );
}
