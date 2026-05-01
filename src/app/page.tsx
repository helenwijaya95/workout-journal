import Link from "next/link";
import { DemoLoginButton } from "@/components/DemoLoginButton";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-navy text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "20px" }}>🏋️</span>
          <span className="font-bold text-white">TrainLog</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-slate-800 text-xs font-medium text-slate-400 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          AI-powered workout analysis
        </div>

        <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6">
          Your personal trainer{" "}
          <span className="text-primary-light">in your pocket</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed mb-10">
          Log your workouts in seconds. Get a weekly AI debrief that analyses
          your patterns, flags overtraining, and tells you exactly what to focus
          on next week — no personal trainer needed.
        </p>

        {/* Hero buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-10">
          <Link
            href="/signup"
            className="w-full sm:w-auto text-center text-white px-8 py-4 rounded-xl font-bold text-sm transition-all active:scale-95"
            style={{ background: "var(--color-primary)" }}
          >
            Start tracking free
          </Link>
          <div className="w-full sm:w-auto">
            <DemoLoginButton />
          </div>
        </div>

        {/* reassurance copy */}
        <p className="text-xs text-slate-600 mt-4">
          Free to use · No credit card · Demo available
        </p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface border border-slate-800 rounded-2xl p-6">
            <div style={{ fontSize: "32px" }} className="mb-4">
              ⚡
            </div>
            <h3 className="font-bold text-white mb-2">Log in 30 seconds</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tap your workout type, set duration and how hard it felt. Done. No
              complicated forms or syncing required.
            </p>
          </div>

          <div className="bg-surface border border-slate-800 rounded-2xl p-6">
            <div style={{ fontSize: "32px" }} className="mb-4">
              ✨
            </div>
            <h3 className="font-bold text-white mb-2">Weekly AI debrief</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every week, get a personalised analysis of your training —
              highlights, overtraining flags, and one concrete suggestion for
              next week.
            </p>
          </div>

          <div className="bg-surface border border-slate-800 rounded-2xl p-6">
            <div style={{ fontSize: "32px" }} className="mb-4">
              📊
            </div>
            <h3 className="font-bold text-white mb-2">See your patterns</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Visualise your training consistency over time. Know whether you're
              building momentum or slowly losing it before it's too late.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-center mb-12">How it works</h2>

        <div className="flex flex-col gap-6">
          {[
            {
              step: "01",
              title: "Log your workout",
              description:
                "Choose your workout type, duration, and rate how hard it felt on a scale of 1–10. Add notes if anything stood out.",
            },
            {
              step: "02",
              title: "Build your history",
              description:
                "Your workouts group automatically by week. See your training at a glance — sessions, total time, average intensity.",
            },
            {
              step: "03",
              title: "Get your AI debrief",
              description:
                "At the end of each week, generate your AI analysis. Get honest feedback on what went well, what to watch, and what to do next.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-6 items-start">
              <div className="text-3xl font-black text-slate-800 shrink-0 w-12">
                {item.step}
              </div>
              <div className="bg-surface border border-slate-800 rounded-2xl p-5 flex-1">
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <div className="bg-surface border border-slate-800 rounded-2xl p-10">
          <h2 className="text-2xl font-bold mb-3">Ready to train smarter?</h2>
          <p className="text-slate-400 text-sm mb-6">
            Free to use. No credit card required.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold text-sm transition-all active:scale-95"
          >
            Start tracking free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "16px" }}>🏋️</span>
            <span className="text-sm font-medium text-slate-400">TrainLog</span>
          </div>
          <p className="text-xs text-slate-600">
            Built with Next.js 15 · TypeScript · Supabase · Gemini AI
          </p>
        </div>
      </footer>
    </main>
  );
}
