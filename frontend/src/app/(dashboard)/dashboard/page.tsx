"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { VindiScoreCard } from "@/components/dashboard/VindiScoreCard";
import { QuickCheckin } from "@/components/dashboard/QuickCheckin";
import { AnalyticsSummary } from "@/components/dashboard/AnalyticsSummary";
import { MoodChart } from "@/components/dashboard/MoodChart";
import { SleepChart } from "@/components/dashboard/SleepChart";
import { SymptomHeatmap } from "@/components/dashboard/SymptomHeatmap";
import { RecentInsights } from "@/components/dashboard/RecentInsights";
import { UpcomingReminders } from "@/components/dashboard/UpcomingReminders";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState("7d");

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s your wellness overview.</p>
          </div>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="6mo">Last 6 months</SelectItem>
              <SelectItem value="12mo">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-6">
          <QuickCheckin />
        </div>

        <div className="mb-8">
          <AnalyticsSummary />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <VindiScoreCard />
          </div>
          <div>
            <UpcomingReminders />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MoodChart />
          <SleepChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <SymptomHeatmap />
          </div>
          <div className="lg:col-span-2">
            <RecentInsights />
          </div>
        </div>

        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4">
          <p className="text-xs text-amber-800 dark:text-amber-200">
            <strong>Medical Disclaimer:</strong> Vindi is for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your healthcare provider.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
