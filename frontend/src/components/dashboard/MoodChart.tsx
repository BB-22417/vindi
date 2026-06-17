"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip, ResponsiveContainer } from "recharts";

interface MoodChartProps {
  data?: { date: string; mood: number; anxiety: number; stress: number }[];
}

const defaultData = [
  { date: "Mon", mood: 7, anxiety: 4, stress: 5 },
  { date: "Tue", mood: 6, anxiety: 5, stress: 6 },
  { date: "Wed", mood: 8, anxiety: 3, stress: 4 },
  { date: "Thu", mood: 5, anxiety: 6, stress: 7 },
  { date: "Fri", mood: 7, anxiety: 4, stress: 5 },
  { date: "Sat", mood: 8, anxiety: 3, stress: 3 },
  { date: "Sun", mood: 7, anxiety: 4, stress: 4 },
];

export function MoodChart({ data = defaultData }: MoodChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Mood Trends</CardTitle>
        <CardDescription>Your mood, anxiety, and stress levels over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs text-muted-foreground" />
              <YAxis domain={[0, 10]} className="text-xs text-muted-foreground" />
              <RechartTooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Line type="monotone" dataKey="mood" stroke="#ec4899" strokeWidth={2} dot={{ fill: "#ec4899" }} name="Mood" />
              <Line type="monotone" dataKey="anxiety" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b" }} name="Anxiety" />
              <Line type="monotone" dataKey="stress" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6" }} name="Stress" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
