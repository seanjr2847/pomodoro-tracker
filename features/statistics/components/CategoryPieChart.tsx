"use client";

import { Card } from "@/shared/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { CategoryStats } from "../types";

interface CategoryPieChartProps {
  data: CategoryStats[];
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const chartData = data.map((d) => ({
    name: d.categoryName,
    value: d.totalMinutes,
    color: d.categoryColor,
  }));

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
          <PieChartIcon className="h-5 w-5 text-secondary-foreground" />
        </div>
        <h3 className="font-semibold">카테고리별 비중 (30일)</h3>
      </div>
      {chartData.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          아직 데이터가 없습니다
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value}분`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
