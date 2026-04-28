"use client";

import { Card } from "@/shared/ui/card";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { DailyStats } from "../types";

interface WeeklyChartProps {
  data: DailyStats[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("ko-KR", { month: "short", day: "numeric" }),
  }));

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
          <BarChart3 className="h-5 w-5 text-secondary-foreground" />
        </div>
        <h3 className="font-semibold">지난 7일 누적 시간</h3>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="label" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Bar dataKey="totalMinutes" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
