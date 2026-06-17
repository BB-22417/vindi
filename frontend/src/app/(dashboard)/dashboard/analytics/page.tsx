"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoodChart } from "@/components/dashboard/MoodChart";
import { SleepChart } from "@/components/dashboard/SleepChart";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { SymptomRadar } from "@/components/dashboard/SymptomRadar";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Download } from "lucide-react";

const brainFogData = [
  { date: "Mon", severity: 7, caffeine: 2 },
  { date: "Tue", severity: 6, caffeine: 1 },
  { date: "Wed", severity: 8, caffeine: 3 },
  { date: "Thu", severity: 5, caffeine: 1 },
  { date: "Fri", severity: 4, caffeine: 0 },
  { date: "Sat", severity: 3, caffeine: 0 },
  { date: "Sun", severity: 5, caffeine: 1 },
];

const hotFlashData = [
  { time: "6am", frequency: 1 },
  { time: "8am", frequency: 0 },
  { time: "10am", frequency: 2 },
  { time: "12pm", frequency: 3 },
  { time: "2pm", frequency: 4 },
  { time: "4pm", frequency: 3 },
  { time: "6pm", frequency: 2 },
  { time: "8pm", frequency: 1 },
  { time: "10pm", frequency: 0 },
];

const weightData = [
  { date: "Jan", weight: 68 },
  { date: "Feb", weight: 67.5 },
  { date: "Mar", weight: 67.8 },
  { date: "Apr", weight: 67.2 },
  { date: "May", weight: 66.8 },
  { date: "Jun", weight: 66.5 },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground mt-1">Deep dive into your symptom patterns and trends.</p>
          </div>
          <div className="flex items-center gap-3">
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
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MoodChart />
          <SleepChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Brain Fog & Caffeine Correlation</CardTitle>
              <CardDescription>How caffeine affects your mental clarity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={brainFogData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs text-muted-foreground" />
                    <YAxis className="text-xs text-muted-foreground" />
                    <RechartTooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                    />
                    <Legend />
                    <Bar dataKey="severity" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Brain Fog Severity" />
                    <Bar dataKey="caffeine" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Caffeine (cups)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hot Flash Frequency</CardTitle>
              <CardDescription>Average hot flash frequency by time of day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hotFlashData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="time" className="text-xs text-muted-foreground" />
                    <YAxis className="text-xs text-muted-foreground" />
                    <RechartTooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                    />
                    <Area type="monotone" dataKey="frequency" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} strokeWidth={2} name="Hot Flashes" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TrendChart />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weight Trend</CardTitle>
              <CardDescription>Your weight over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs text-muted-foreground" />
                    <YAxis domain={["auto", "auto"]} className="text-xs text-muted-foreground" />
                    <RechartTooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                    />
                    <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} name="Weight (kg)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <SymptomRadar />
        </div>

        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4">
          <p className="text-xs text-amber-800 dark:text-amber-200">
            <strong>Medical Disclaimer:</strong> These analytics are for informational purposes only and are not a medical diagnosis. Always consult your healthcare provider about your symptoms and treatment options.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
