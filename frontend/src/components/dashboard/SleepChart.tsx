"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip, ResponsiveContainer, Legend } from "recharts";

interface SleepChartProps {
  data?: { date: string; hours: number; quality: number; awakenings: number }[];
}

const defaultData = [
  { date: "Mon", hours: 7.5, quality: 8, awakenings: 1 },
  { date: "Tue", hours: 6, quality: 5, awakenings: 3 },
  { date: "Wed", hours: 8, quality: 9, awakenings: 0 },
  { date: "Thu", hours: 5.5, quality: 4, awakenings: 4 },
  { date: "Fri", hours: 7, quality: 7, awakenings: 2 },
  { date: "Sat", hours: 8.5, quality: 9, awakenings: 0 },
  { date: "Sun", hours: 7, quality: 6, awakenings: 2 },
];

export function SleepChart({ data = defaultData }: SleepChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sleep Patterns</CardTitle>
        <CardDescription>Your sleep hours and quality over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs text-muted-foreground" />
              <YAxis className="text-xs text-muted-foreground" />
              <RechartTooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Legend />
              <Bar dataKey="hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Hours" />
              <Bar dataKey="quality" fill="#ec4899" radius={[4, 4, 0, 0]} name="Quality" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
