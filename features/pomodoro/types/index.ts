export type SessionType = "work" | "break" | "long-break";

export interface PomodoroSession {
  id: string;
  userId: string | null;
  categoryId: string | null;
  durationMin: number;
  type: string;
  note: string | null;
  startedAt: Date;
  completedAt: Date;
  createdAt: Date;
}

export interface CreateSessionInput {
  categoryId?: string;
  durationMin: number;
  type: SessionType;
  note?: string;
  startedAt: Date;
  completedAt: Date;
}

export interface PomodoroSettings {
  workDuration: number; // 분
  shortBreakDuration: number; // 분
  longBreakDuration: number; // 분
  cyclesBeforeLongBreak: number;
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  cyclesBeforeLongBreak: 4,
};
