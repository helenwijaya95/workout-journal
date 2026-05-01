export function DashboardSkeleton() {
  return (
    <main
      className="min-h-screen text-white"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col gap-2">
            <div
              className="h-6 w-32 rounded-lg animate-pulse"
              style={{ background: "var(--color-card)" }}
            />
            <div
              className="h-4 w-24 rounded-lg animate-pulse"
              style={{ background: "var(--color-card)" }}
            />
          </div>
          <div
            className="h-9 w-20 rounded-lg animate-pulse"
            style={{ background: "var(--color-card)" }}
          />
        </div>

        {/* stats cards — explicit 4 divs instead of Array.from */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div
            className="rounded-xl p-4 animate-pulse"
            style={{ background: "var(--color-card)", height: "80px" }}
          />
          <div
            className="rounded-xl p-4 animate-pulse"
            style={{ background: "var(--color-card)", height: "80px" }}
          />
          <div
            className="rounded-xl p-4 animate-pulse"
            style={{ background: "var(--color-card)", height: "80px" }}
          />
          <div
            className="rounded-xl p-4 animate-pulse"
            style={{ background: "var(--color-card)", height: "80px" }}
          />
        </div>

        {/* chart */}
        <div
          className="rounded-2xl p-6 mb-6 animate-pulse"
          style={{ background: "var(--color-card)", height: "280px" }}
        />

        {/* tabs */}
        <div
          className="rounded-xl p-1 mb-6 animate-pulse"
          style={{ background: "var(--color-card)", height: "48px" }}
        />

        {/* workout cards — explicit 3 divs */}
        <div className="flex flex-col gap-3">
          <div
            className="animate-pulse"
            style={{
              background: "var(--color-card)",
              height: "80px",
              borderLeft: "3px solid var(--color-border)",
              borderRadius: "0 12px 12px 0",
            }}
          />
          <div
            className="animate-pulse"
            style={{
              background: "var(--color-card)",
              height: "80px",
              borderLeft: "3px solid var(--color-border)",
              borderRadius: "0 12px 12px 0",
              opacity: 0.8,
            }}
          />
          <div
            className="animate-pulse"
            style={{
              background: "var(--color-card)",
              height: "80px",
              borderLeft: "3px solid var(--color-border)",
              borderRadius: "0 12px 12px 0",
              opacity: 0.6,
            }}
          />
        </div>
      </div>
    </main>
  );
}
