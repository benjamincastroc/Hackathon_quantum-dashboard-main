import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ProjectStatus } from "./data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function getRiskTextColor(score: number): string {
  if (score >= 75) return "text-red-400";
  if (score >= 50) return "text-orange-400";
  if (score >= 25) return "text-yellow-400";
  return "text-emerald-400";
}

export function getRiskBadge(score: number): string {
  if (score >= 75) return "bg-red-500/15 text-red-400 border border-red-500/25";
  if (score >= 50) return "bg-orange-500/15 text-orange-400 border border-orange-500/25";
  if (score >= 25) return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25";
  return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25";
}

export function getStatusStyles(status: ProjectStatus): string {
  switch (status) {
    case "Critical":
      return "bg-red-500/15 text-red-400 border border-red-500/30";
    case "Warning":
      return "bg-orange-500/15 text-orange-400 border border-orange-500/30";
    case "Review":
      return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30";
    case "Healthy":
      return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
  }
}

export function getStatusDot(status: ProjectStatus): string {
  switch (status) {
    case "Critical":
      return "bg-red-400";
    case "Warning":
      return "bg-orange-400";
    case "Review":
      return "bg-yellow-400";
    case "Healthy":
      return "bg-emerald-400";
  }
}

export function getSeverityStyles(severity: string): string {
  switch (severity) {
    case "Critical":
      return "bg-red-500/15 text-red-400 border border-red-500/30";
    case "High":
      return "bg-orange-500/15 text-orange-400 border border-orange-500/30";
    case "Medium":
      return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30";
    case "Low":
      return "bg-blue-500/15 text-blue-400 border border-blue-500/30";
    default:
      return "bg-slate-500/15 text-slate-400 border border-slate-500/30";
  }
}

export function getProgressBarColor(value: number, max = 100): string {
  const pct = (value / max) * 100;
  if (pct >= 90) return "bg-red-500";
  if (pct >= 70) return "bg-orange-500";
  if (pct >= 50) return "bg-yellow-500";
  return "bg-emerald-500";
}
