"use client";
import { useState } from "react";
import {
  WeekGroup,
  getWorkoutEmoji,
  getWorkoutLabel,
  formatDuration,
} from "@/lib/workout-utils";
import { Workout } from "@/types/database";

interface WorkoutHistoryProps {
  weekGroups: WeekGroup[];
}

function IntensityBar({ intensity }: { intensity: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-3 rounded-sm ${
              i < intensity
                ? intensity <= 3
                  ? "bg-blue-400"
                  : intensity <= 6
                    ? "bg-emerald-400"
                    : intensity <= 8
                      ? "bg-amber-400"
                      : "bg-red-400"
                : "bg-slate-800"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-slate-500">{intensity}/10</span>
    </div>
  );
}

function WorkoutCard({ workout }: { workout: Workout }) {
  const date = new Date(workout.workout_date).toLocaleDateString("en-SG", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span style={{ fontSize: "24px" }} className="mt-0.5">
            {getWorkoutEmoji(workout.type)}
          </span>
          <div>
            <p className="text-sm font-medium text-white">
              {getWorkoutLabel(workout.type)}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {date} · {formatDuration(workout.duration_minutes)}
            </p>
            {workout.notes && (
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                "{workout.notes}"
              </p>
            )}
          </div>
        </div>
        <div className="shrink-0">
          <IntensityBar intensity={workout.intensity} />
        </div>
      </div>
    </div>
  );
}

function WeekSection({ group }: { group: WeekGroup }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-white">
            {group.weekLabel}
          </span>
          <span className="text-xs text-slate-600">
            {group.totalSessions} session{group.totalSessions !== 1 ? "s" : ""}{" "}
            · {group.totalMinutes}m
          </span>
        </div>
        <span
          className={`text-slate-600 text-xs transition-transform ${expanded ? "rotate-180" : ""}`}
        >
          ▲
        </span>
      </button>

      {expanded && (
        <div className="flex flex-col gap-2">
          {group.workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}
    </div>
  );
}

export function WorkoutHistory({ weekGroups }: WorkoutHistoryProps) {
  if (weekGroups.length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ fontSize: "40px" }}>🏋️</p>
        <p className="text-slate-400 text-sm mt-3">No workouts yet.</p>
        <p className="text-slate-600 text-xs mt-1">
          Log your first session above.
        </p>
      </div>
    );
  }

  return (
    <div>
      {weekGroups.map((group) => (
        <WeekSection key={group.weekStart} group={group} />
      ))}
    </div>
  );
}
