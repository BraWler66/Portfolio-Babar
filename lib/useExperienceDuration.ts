"use client";

import { useEffect, useState } from "react";

// Neural Lines start date — July 1, 2025
const NEURAL_START = new Date("2025-07-01T00:00:00");

// Internship was exactly 3 months (fixed)
const INTERN_MONTHS = 3;

/** Returns decimal months between two dates, e.g. 9.4 */
function monthsBetween(from: Date, to: Date): number {
  const years = to.getFullYear() - from.getFullYear();
  const months = to.getMonth() - from.getMonth();
  const dayFraction = (to.getDate() - from.getDate()) / 30;
  return years * 12 + months + dayFraction;
}

/** Format decimal months into a human label like "1.2 yrs" or "9 months" */
export function formatDuration(totalMonths: number): string {
  if (totalMonths < 12) {
    return `${Math.round(totalMonths)} month${Math.round(totalMonths) !== 1 ? "s" : ""}`;
  }
  const years = totalMonths / 12;
  return `${years.toFixed(1)} yrs`;
}

export interface ExperienceDurations {
  /** Neural Lines live duration label e.g. "9 months" or "1.2 yrs" */
  neuralLabel: string;
  /** Combined total label for About section */
  totalLabel: string;
  /** Neural Lines decimal months (live) */
  neuralMonths: number;
}

export function useExperienceDuration(): ExperienceDurations {
  const [now, setNow] = useState(() => new Date());

  // Tick every minute — sub-month precision doesn't need seconds
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const neuralMonths = Math.max(0, monthsBetween(NEURAL_START, now));
  const totalMonths = INTERN_MONTHS + neuralMonths;

  return {
    neuralLabel: formatDuration(neuralMonths),
    totalLabel: formatDuration(totalMonths),
    neuralMonths,
  };
}
