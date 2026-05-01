"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { WeekGroup } from "@/lib/workout-utils";
interface WorkoutChartProps {
  weekGroups: WeekGroup[];
}

interface ChartData {
  week: string;
  sessions: number;
  minutes: number;
  avgIntensity: number;
  isCurrentWeek: boolean;
}

// custom tooltip that shows on hover
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip(props: any) {
  const { active, payload, label } = props;

  if (!active || !payload?.length) return null;

  const data = payload[0].payload as ChartData;

  return (
    <div className="bg-card border border-slate-700 rounded-xl px-4 py-3 text-sm shadow-xl">
      <p className="text-white font-medium mb-1">{label}</p>
      <p className="text-primary-light">
        {data.sessions} session{data.sessions !== 1 ? "s" : ""}
      </p>
      <p className="text-slate-400">{data.minutes} mins total</p>
      <p className="text-slate-400">avg intensity {data.avgIntensity}/10</p>
    </div>
  );
}

export function WorkoutChart({ weekGroups }: WorkoutChartProps) {
  if (weekGroups.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-slate-600 text-sm">
        No data yet — log some workouts to see your chart.
      </div>
    );
  }

  // build chart data — most recent 8 weeks, oldest to newest left to right
  const chartData: ChartData[] = weekGroups
    .slice(0, 8)
    .reverse()
    .map((group, index, arr) => ({
      week: group.weekLabel.split("·")[0].trim(), // just the date range, no "This week" prefix
      sessions: group.totalSessions,
      minutes: group.totalMinutes,
      avgIntensity: group.avgIntensity,
      isCurrentWeek: index === arr.length - 1, // last item is most recent
    }));

  const maxSessions = Math.max(...chartData.map((d) => d.sessions));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Sessions per week</h3>
        <span className="text-xs text-slate-400">
          Last {chartData.length} weeks
        </span>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={chartData}
          margin={{ top: 4, right: 0, left: -20, bottom: 0 }}
          barSize={28}
        >
          <XAxis
            dataKey="week"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => {
              // shorten label to just day/month range start
              const parts = value.split("–");
              return parts[0].trim();
            }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={[0, Math.max(maxSessions + 1, 5)]}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />
          <Bar dataKey="sessions" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.isCurrentWeek
                    ? "#6366f1" // indigo for current week
                    : "#161D35" // slate for past weeks
                }
                stroke={entry.isCurrentWeek ? "#6366f1" : "#1E2847"}
                strokeWidth={1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* legend */}
      <div className="flex items-center gap-4 mt-2 justify-end">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-primary" />
          <span className="text-xs text-slate-400">Current week</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-slate-700 border border-slate-600" />
          <span className="text-xs text-slate-400">Past weeks</span>
        </div>
      </div>
    </div>
  );
}
