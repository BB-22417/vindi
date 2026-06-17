"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip, ResponsiveContainer, Legend } from "recharts";

interface TrendChartProps {
  data?: { date: string; mood: number; sleep: number; energy: number; symptoms: number }[];
}

const defaultData = [
  { date: "Jan", mood: 6, sleep: 6, energy: 5, symptoms: 7 },
  { date: "Feb", mood: 5, sleep: 5, energy: 4, symptoms: 8 },
  { date: "Mar", mood: 7, sleep: 7, energy: 6, symptoms: 5 },
  { date: "Apr", mood: 6, sleep: 6, energy: 5, symptoms: 6 },
  { date: "May", mood: 8, sleep: 8, energy: 7, symptoms: 4 },
  { date: "Jun", mood: 7, sleep: 7, energy: 8, symptoms: 5 },
];

export function TrendChart({ data = defaultData }: TrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Wellness Trends</CardTitle>
        <CardDescription>Multi-metric trends over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
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
              <Legend />
              <Line type="monotone" dataKey="mood" stroke="#ec4899" strokeWidth={2} dot={false} name="Mood" />
              <Line type="monotone" dataKey="sleep" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Sleep" />
              <Line type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={2} dot={false} name="Energy" />
              <Line type="monotone" dataKey="symptoms" stroke="#ef4444" strokeWidth={2} dot={false} name="Symptoms" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
