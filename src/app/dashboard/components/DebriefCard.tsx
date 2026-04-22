"use client";
import { useState, useRef } from "react";
import { generateDebrief } from "@/app/dashboard/actions/debrief";
import { AiDebrief } from "@/types/database";
import { WeekGroup } from "@/lib/workout-utils";

interface DebriefCardProps {
  weekGroup: WeekGroup;
  existingDebrief: AiDebrief | null;
}

export function DebriefCard({ weekGroup, existingDebrief }: DebriefCardProps) {
  const [debrief, setDebrief] = useState<AiDebrief | null>(existingDebrief);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isCallingRef = useRef(false); // ← ref is synchronous, unlike state

  const handleGenerate = async () => {
    // ref check is synchronous — guaranteed to prevent double calls
    if (isCallingRef.current || loading) return;
    isCallingRef.current = true;

    setLoading(true);
    setError(null);

    try {
      const result = await generateDebrief(weekGroup.weekStart);
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setDebrief(result.data as AiDebrief);
      }
    } finally {
      setLoading(false);
      isCallingRef.current = false;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-white">
            {weekGroup.weekLabel}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {weekGroup.totalSessions} sessions · {weekGroup.totalMinutes} mins ·
            avg {weekGroup.avgIntensity}/10
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg">
          <span style={{ fontSize: "14px" }}>✨</span>
          <span className="text-xs font-medium text-slate-300">AI debrief</span>
        </div>
      </div>

      {debrief ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            {debrief.summary}
          </p>

          {debrief.insights.highlights?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-2">
                Highlights
              </p>
              <div className="flex flex-col gap-1.5">
                {debrief.insights.highlights.map((h, i) => (
                  <div key={i} className="flex gap-2 text-sm text-slate-300">
                    <span className="text-emerald-400 shrink-0">↑</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {debrief.insights.flags?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-amber-400 uppercase tracking-wider mb-2">
                Watch out
              </p>
              <div className="flex flex-col gap-1.5">
                {debrief.insights.flags.map((f, i) => (
                  <div key={i} className="flex gap-2 text-sm text-slate-300">
                    <span className="text-amber-400 shrink-0">⚠</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {debrief.insights.suggestions?.length > 0 && (
            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                Next week
              </p>
              <p className="text-sm text-slate-200 leading-relaxed">
                {debrief.insights.suggestions[0]}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center py-4 gap-4">
          <p className="text-sm text-slate-400 text-center">
            {weekGroup.totalSessions === 0
              ? "Log some workouts this week to get your debrief."
              : `You have ${weekGroup.totalSessions} workout${weekGroup.totalSessions !== 1 ? "s" : ""} logged. Ready for your AI analysis?`}
          </p>

          {weekGroup.totalSessions > 0 && (
            <button
              onClick={handleGenerate}
              disabled={loading || isCallingRef.current}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                loading || isCallingRef.current
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-emerald-500 text-white hover:bg-emerald-400 active:scale-95"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin inline-block">⟳</span>
                  Analysing your week...
                </span>
              ) : (
                "Get my weekly debrief"
              )}
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 flex items-start justify-between gap-4">
          <div className="flex items-start gap-2 text-sm text-red-400">
            <span className="shrink-0">⚠</span>
            <span>{error}</span>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-all shrink-0"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
