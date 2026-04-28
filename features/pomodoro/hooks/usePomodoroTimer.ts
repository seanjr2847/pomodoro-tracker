"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DEFAULT_SETTINGS, type SessionType } from "../types";

interface UsePomodoroTimerProps {
  onSessionComplete?: (type: SessionType, duration: number) => void;
}

export function usePomodoroTimer({ onSessionComplete }: UsePomodoroTimerProps = {}) {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>("work");
  const [cycleCount, setCycleCount] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getDurationForType = (type: SessionType) => {
    switch (type) {
      case "work":
        return DEFAULT_SETTINGS.workDuration * 60;
      case "break":
        return DEFAULT_SETTINGS.shortBreakDuration * 60;
      case "long-break":
        return DEFAULT_SETTINGS.longBreakDuration * 60;
    }
  };

  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }, []);

  const showNotification = useCallback((title: string, body: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon: "/icon.svg" });
    }
  }, []);

  const start = useCallback(() => {
    setIsRunning(true);
    setStartTime(new Date());
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(getDurationForType(sessionType));
    setStartTime(null);
  }, [sessionType]);

  const skip = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    setTimeLeft(0);
  }, []);

  const switchSession = useCallback(
    (type: SessionType) => {
      setSessionType(type);
      setTimeLeft(getDurationForType(type));
      setIsRunning(false);
      setStartTime(null);
    },
    []
  );

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);

      const duration = getDurationForType(sessionType) / 60;
      onSessionComplete?.(sessionType, duration);

      if (sessionType === "work") {
        const newCycleCount = cycleCount + 1;
        setCycleCount(newCycleCount);

        if (newCycleCount % DEFAULT_SETTINGS.cyclesBeforeLongBreak === 0) {
          showNotification("작업 완료!", "긴 휴식 시간입니다 (15분)");
          switchSession("long-break");
        } else {
          showNotification("작업 완료!", "짧은 휴식 시간입니다 (5분)");
          switchSession("break");
        }
      } else {
        showNotification("휴식 완료!", "다시 집중할 시간입니다 (25분)");
        switchSession("work");
      }
    }
  }, [timeLeft, isRunning, sessionType, cycleCount, onSessionComplete, showNotification, switchSession]);

  return {
    timeLeft,
    isRunning,
    sessionType,
    cycleCount,
    start,
    pause,
    reset,
    skip,
    switchSession,
  };
}
