import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, formatStr: string = "PPP"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, formatStr);
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function calculateVindiScore(
  mood: number,
  sleep: number,
  energy: number,
  symptoms: number,
  stress: number
): number {
  const normalizedMood = (mood / 10) * 25;
  const normalizedSleep = (sleep / 10) * 20;
  const normalizedEnergy = (energy / 10) * 20;
  const normalizedSymptoms = Math.max(0, 25 - (symptoms / 10) * 15);
  const normalizedStress = Math.max(0, 10 - (stress / 10) * 10);
  return Math.round(normalizedMood + normalizedSleep + normalizedEnergy + normalizedSymptoms + normalizedStress);
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  if (score >= 20) return "Poor";
  return "Critical";
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  if (score >= 40) return "text-orange-500";
  if (score >= 20) return "text-red-500";
  return "text-red-700";
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 40) return "bg-orange-500";
  if (score >= 20) return "bg-red-500";
  return "bg-red-700";
}

export function truncate(str: string, length: number = 100): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export const symptomSeverityLabels = ["None", "Mild", "Moderate", "Severe", "Very Severe"];

export const symptomList = [
  "Hot Flashes",
  "Night Sweats",
  "Joint Pain",
  "Headaches",
  "Fatigue",
  "Brain Fog",
  "Mood Swings",
  "Anxiety",
  "Insomnia",
  "Irritability",
  "Bloating",
  "Weight Gain",
  "Hair Changes",
  "Skin Changes",
  "Libido Changes",
  "Vaginal Dryness",
];
