"use client";
import { useState } from "react";
import { logWorkout } from "@/app/dashboard/actions";
import { WORKOUT_TYPES } from "@/lib/workout-config";

interface LogWorkoutFormProps {
  onSuccess?: () => void;
}

export function LogWorkoutForm({ onSuccess }: LogWorkoutFormProps) {
  const [intensity, setIntensity] = useState(5);
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await logWorkout(new FormData(e.currentTarget));

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // reset form
    setIntensity(5);
    setSelectedType("");
    setLoading(false);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Workout type */}
      <div>
        <label className="text-sm font-medium text-slate-400 mb-3 block">
          Workout type <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {WORKOUT_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setSelectedType(type.value)}
              className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all ${
                selectedType === type.value
                  ? "border-primary bg-primary/10"
                  : "border-slate-800 bg-surface hover:border-slate-600"
              }`}
            >
              <span style={{ fontSize: "20px" }}>{type.emoji}</span>
              <span className="text-sm font-medium text-white">
                {type.label}
              </span>
              <span className="text-xs text-primary-text0">
                {type.description}
              </span>
            </button>
          ))}
        </div>
        {/* hidden input so FormData picks up the selected type */}
        <input type="hidden" name="type" value={selectedType} />
      </div>

      {/* Duration and date — side by side on mobile too */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            className="text-sm font-medium text-slate-400"
            htmlFor="duration"
          >
            Duration (mins) <span className="text-red-400">*</span>
          </label>
          <input
            id="duration"
            name="duration_minutes"
            type="number"
            min="1"
            max="300"
            required
            placeholder="45"
            className="bg-surface border border-slate-800 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-primary transition-colors placeholder:text-slate-600"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            className="text-sm font-medium text-slate-400"
            htmlFor="workout_date"
          >
            Date <span className="text-red-400">*</span>
          </label>
          <input
            id="workout_date"
            name="workout_date"
            type="date"
            required
            defaultValue={today}
            max={today}
            className="bg-surface border border-slate-800 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-primary transition-colors cursor-pointer scheme-dark"
          />
        </div>
      </div>

      {/* Intensity slider */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-400">
            Intensity <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">{intensity}</span>
            <span className="text-primary-text0 text-sm">/ 10</span>
          </div>
        </div>

        <input
          type="range"
          name="intensity"
          min="1"
          max="10"
          step="1"
          value={intensity}
          onChange={(e) => setIntensity(parseInt(e.target.value))}
          className="w-full accent-indigo-500"
        />

        <div className="flex justify-between text-xs text-slate-600">
          <span>Easy recovery</span>
          <span>Moderate</span>
          <span>Max effort</span>
        </div>

        {/* intensity feeling label */}
        <p className="text-xs text-center text-primary-text0">
          {intensity <= 3 && "Easy — recovery or light movement"}
          {intensity >= 4 &&
            intensity <= 6 &&
            "Moderate — challenging but sustainable"}
          {intensity >= 7 && intensity <= 8 && "Hard — pushing your limits"}
          {intensity >= 9 && "Maximum effort — leave it all out there"}
        </p>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-400" htmlFor="notes">
          Notes <span className="text-slate-600 font-normal">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="How did it feel? Anything worth remembering..."
          className="bg-surface border border-slate-800 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-primary transition-colors placeholder:text-slate-600 resize-none"
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !selectedType}
        className={`py-4 rounded-xl font-bold text-sm transition-all ${
          loading || !selectedType
            ? "bg-card text-primary-text0 cursor-not-allowed"
            : "bg-primary text-white hover:bg-primary-hover active:scale-95"
        }`}
      >
        {loading ? "Saving..." : "Log workout"}
      </button>
    </form>
  );
}
