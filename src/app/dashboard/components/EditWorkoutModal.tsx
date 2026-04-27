"use client";
import { useState } from "react";
import { updateWorkout, deleteWorkout } from "@/app/dashboard/actions";
import { Workout } from "@/types/database";
import { WORKOUT_TYPES } from "@/lib/workout-config";

interface EditWorkoutModalProps {
  workout: Workout;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditWorkoutModal({
  workout,
  onClose,
  onSuccess,
}: EditWorkoutModalProps) {
  const [intensity, setIntensity] = useState(workout.intensity);
  const [selectedType, setSelectedType] = useState(workout.type);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("type", selectedType);
    formData.set("intensity", intensity.toString());

    const result = await updateWorkout(workout.id, formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess();
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    const result = await deleteWorkout(workout.id);

    if (result?.error) {
      setError(result.error);
      setDeleting(false);
      setShowDeleteConfirm(false);
      return;
    }

    setDeleting(false);
    onSuccess();
  };

  return (
    // backdrop
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* modal */}
      <div
        className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-5"
        style={{
          background: "var(--color-card)",
          border: "0.5px solid var(--color-border)",
        }}
      >
        {/* header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Edit workout</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {!showDeleteConfirm ? (
          <form onSubmit={handleUpdate} className="flex flex-col gap-5">
            {/* workout type */}
            <div>
              <label className="text-sm font-medium text-slate-400 mb-3 block">
                Workout type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {WORKOUT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSelectedType(type.value)}
                    className="flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all"
                    style={{
                      background:
                        selectedType === type.value
                          ? "var(--color-primary-subtle)"
                          : "var(--color-surface)",
                      borderColor:
                        selectedType === type.value
                          ? "var(--color-primary)"
                          : "var(--color-border)",
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>{type.emoji}</span>
                    <span className="text-xs font-medium text-white">
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* duration and date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-400">
                  Duration (mins)
                </label>
                <input
                  name="duration_minutes"
                  type="number"
                  min="1"
                  max="300"
                  required
                  defaultValue={workout.duration_minutes}
                  className="rounded-lg px-4 py-3 text-white text-sm outline-none transition-colors"
                  style={{
                    background: "var(--color-surface)",
                    border: "0.5px solid var(--color-border)",
                  }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-400">
                  Date
                </label>
                <input
                  name="workout_date"
                  type="date"
                  required
                  defaultValue={workout.workout_date}
                  max={new Date().toISOString().split("T")[0]}
                  className="rounded-lg px-4 py-3 text-white text-sm outline-none transition-colors [color-scheme:dark]"
                  style={{
                    background: "var(--color-surface)",
                    border: "0.5px solid var(--color-border)",
                  }}
                />
              </div>
            </div>

            {/* intensity */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-400">
                  Intensity
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold text-white">
                    {intensity}
                  </span>
                  <span className="text-slate-500 text-sm">/ 10</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            {/* notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-400">
                Notes{" "}
                <span className="text-slate-600 font-normal">(optional)</span>
              </label>
              <textarea
                name="notes"
                rows={2}
                defaultValue={workout.notes ?? ""}
                placeholder="How did it feel?"
                className="rounded-lg px-4 py-3 text-white text-sm outline-none transition-colors resize-none placeholder:text-slate-600"
                style={{
                  background: "var(--color-surface)",
                  border: "0.5px solid var(--color-border)",
                }}
              />
            </div>

            {error && (
              <div
                className="rounded-lg px-4 py-3 text-sm"
                style={{
                  background: "var(--color-danger-subtle)",
                  border: "0.5px solid var(--color-danger)",
                  color: "var(--color-danger)",
                }}
              >
                {error}
              </div>
            )}

            {/* actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "var(--color-danger-subtle)",
                  color: "var(--color-danger)",
                }}
              >
                Delete
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-slate-400 transition-all"
                style={{ background: "var(--color-surface)" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !selectedType}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all"
                style={{
                  background:
                    loading || !selectedType
                      ? "var(--color-border)"
                      : "var(--color-primary)",
                }}
              >
                {loading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        ) : (
          // delete confirmation
          <div className="flex flex-col gap-4">
            <div
              className="rounded-xl p-4 text-center"
              style={{ background: "var(--color-surface)" }}
            >
              <p style={{ fontSize: "32px" }} className="mb-3">
                🗑️
              </p>
              <p className="text-white font-medium mb-1">
                Delete this workout?
              </p>
              <p className="text-sm text-slate-400">
                This can't be undone. The workout will be permanently removed
                from your journal.
              </p>
            </div>

            {error && (
              <div
                className="rounded-lg px-4 py-3 text-sm"
                style={{
                  background: "var(--color-danger-subtle)",
                  color: "var(--color-danger)",
                }}
              >
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-slate-400 transition-all cursor-pointer"
                style={{ background: "var(--color-surface)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all cursor-pointer"
                style={{
                  background: deleting
                    ? "var(--color-border)"
                    : "var(--color-danger)",
                }}
              >
                {deleting ? "Deleting..." : "Yes, delete it"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
