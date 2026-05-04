"use client";

import { signIn } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn.email({ email, password });
    if (res.error) {
      setError(res.error.message ?? "Sign in failed");
      setLoading(false);
    } else {
      router.push("/projects");
    }
  }

  return (
    <div className="flex flex-col max-w-md mx-auto w-full">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center gap-4 w-full px-4">
          <h1 className="text-2xl font-semibold">Sign In</h1>

          <button
            onClick={() => signIn.social({ provider: "google", callbackURL: "/projects" })}
            className="w-full border rounded-lg py-2.5 font-medium hover:bg-muted transition-colors"
          >
            Continue with Google
          </button>
          <button
            onClick={() => signIn.social({ provider: "github", callbackURL: "/projects" })}
            className="w-full border rounded-lg py-2.5 font-medium hover:bg-muted transition-colors"
          >
            Continue with GitHub
          </button>

          <div className="w-full flex items-center gap-3 text-muted-foreground text-sm">
            <div className="flex-1 h-px bg-border" />
            or
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleEmailSignIn} className="w-full space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2.5 bg-transparent"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2.5 bg-transparent"
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 font-medium disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <a href="/forgot-password" className="text-sm text-muted-foreground underline">
            Forgot password?
          </a>

          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a href="/sign-up" className="text-primary underline">
              Sign up
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
