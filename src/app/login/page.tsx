"use client";
import { useState } from "react";
import { signIn, signInAsDemo } from "@/app/auth/actions";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn(new FormData(e.currentTarget));
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-slate-400 text-sm">Sign in to your journal</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-slate-400" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="bg-surface border border-slate-800 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-primary transition-colors placeholder:text-slate-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-slate-400" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Your password"
              className="bg-surface border border-slate-800 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-primary transition-colors placeholder:text-slate-600"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 py-3 rounded-lg font-bold text-sm transition-all ${
              loading
                ? "bg-card text-primary-text0 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary-hover"
            }`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-primary-text0 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary-light hover:text-primary-light"
          >
            Sign up
          </Link>
          <div className="mt-4">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex-1 h-px"
                style={{ background: "var(--color-border)" }}
              />
              <span className="text-xs text-slate-600">or</span>
              <div
                className="flex-1 h-px"
                style={{ background: "var(--color-border)" }}
              />
            </div>

            <form action={signInAsDemo}>
              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-medium transition-all border"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                  color: "#94a3b8",
                }}
              >
                Try the demo — no signup needed ✨
              </button>
            </form>
          </div>
        </p>
      </div>
    </main>
  );
}
