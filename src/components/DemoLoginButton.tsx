"use client";

import { useState } from "react";
import { signInAsDemo } from "@/app/auth/actions";

export function DemoLoginButton() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDemo = async () => {
    setLoading(true);
    setError(null);
    const result = await signInAsDemo();
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDemo}
        disabled={loading}
        className="w-full px-2 py-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap"
        style={{
          background: loading
            ? "var(--color-surface)"
            : "var(--color-primary-subtle)",
          border: "1px solid var(--color-primary-light)",
          color: loading ? "#475569" : "var(--color-primary-light)",
          minWidth: "220px",
        }}
      >
        {loading ? "Loading demo..." : "Try the demo — no signup needed ✨"}
      </button>
      {error && (
        <p className="text-red-400 text-xs text-center mt-2">{error}</p>
      )}
    </div>
  );
}
