"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await authClient.resetPassword({
      newPassword: password,
    });

    if (res.error) {
      setError(res.error.message ?? "Something went wrong");
      setLoading(false);
    } else {
      router.push("/sign-in");
    }
  }

  return (
    <div className="flex flex-col max-w-md mx-auto w-full">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center gap-4 w-full px-4">
          <h1 className="text-2xl font-semibold">Reset Password</h1>

          <form onSubmit={handleSubmit} className="w-full space-y-3">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2.5 bg-transparent"
              required
              minLength={8}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 font-medium disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
