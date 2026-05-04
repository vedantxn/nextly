"use client";

import { signUp, signIn } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signUp.email({ name, email, password });
    if (res.error) {
      setError(res.error.message ?? "Sign up failed");
      setLoading(false);
    } else {
      router.push("/projects");
    }
  }

  return (
    <div className="flex flex-col max-w-md mx-auto w-full">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center gap-4 w-full px-4">
          <h1 className="text-2xl font-semibold">Sign Up</h1>

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

          <form onSubmit={handleEmailSignUp} className="w-full space-y-3">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2.5 bg-transparent"
              required
            />
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
              minLength={8}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 font-medium disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/sign-in" className="text-primary underline">
              Sign in
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
