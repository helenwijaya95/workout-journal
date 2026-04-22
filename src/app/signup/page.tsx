"use client";
import { useState } from "react";
import { signUp } from "@/app/auth/actions";
import Link from "next/link";

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signUp(new FormData(e.currentTarget));
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Create your account
          </h1>
          <p className="text-slate-400 text-sm">
            Start tracking your training today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-slate-400" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Your name"
              className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600"
            />
          </div>

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
              className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600"
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
              minLength={6}
              placeholder="At least 6 characters"
              className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600"
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
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-emerald-500 text-white hover:bg-emerald-400"
            }`}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-emerald-400 hover:text-emerald-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
