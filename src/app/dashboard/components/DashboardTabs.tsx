"use client";
import { useState } from "react";
import { LogWorkoutForm } from "./LogWorkoutForm";
import { WorkoutHistory } from "./WorkoutHistory";
import { StatsCards } from "./StatsCards";
import { DebriefCard } from "./DebriefCard";
import { WeekGroup } from "@/lib/workout-utils";
import { Workout, AiDebrief } from "@/types/database";

interface DashboardTabsProps {
  weekGroups: WeekGroup[];
  workouts: Workout[];
  debriefs: AiDebrief[];
}

type Tab = "log" | "history" | "debrief";

export function DashboardTabs({
  weekGroups,
  workouts,
  debriefs,
}: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("log");

  const tabs: { id: Tab; label: string }[] = [
    { id: "log", label: "Log" },
    { id: "history", label: `History · ${workouts.length}` },
    { id: "debrief", label: "✨ Debrief" },
  ];

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex gap-1 mb-6 bg-slate-900 border border-slate-800 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-slate-800 text-white"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "log" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <LogWorkoutForm onSuccess={() => setActiveTab("history")} />
        </div>
      )}

      {activeTab === "history" && <WorkoutHistory weekGroups={weekGroups} />}

      {activeTab === "debrief" && (
        <div>
          {weekGroups.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ fontSize: "40px" }}>📊</p>
              <p className="text-slate-400 text-sm mt-3">
                Log some workouts first to get your AI debrief.
              </p>
            </div>
          ) : (
            weekGroups.map((group) => {
              console.log("Rendering DebriefCard for week:", group.weekStart);

              return (
                <DebriefCard
                  key={group.weekStart}
                  weekGroup={group}
                  existingDebrief={
                    debriefs.find((d) => d.week_start === group.weekStart) ??
                    null
                  }
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
