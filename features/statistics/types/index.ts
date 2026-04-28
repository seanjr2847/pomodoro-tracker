export interface DailyStats {
  date: string;
  totalMinutes: number;
  sessionCount: number;
}

export interface CategoryStats {
  categoryId: string | null;
  categoryName: string;
  categoryColor: string;
  totalMinutes: number;
  sessionCount: number;
}

export interface WeeklyStats {
  weekStart: Date;
  weekEnd: Date;
  totalMinutes: number;
  sessionCount: number;
  dailyBreakdown: DailyStats[];
}

export interface MonthlyTrend {
  date: string;
  count: number;
}
