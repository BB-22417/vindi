"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts";

interface SymptomRadarProps {
  data?: { symptom: string; current: number; previous: number }[];
}

const defaultData = [
  { symptom: "Hot Flashes", current: 6, previous: 8 },
  { symptom: "Night Sweats", current: 4, previous: 7 },
  { symptom: "Joint Pain", current: 5, previous: 5 },
  { symptom: "Brain Fog", current: 7, previous: 9 },
  { symptom: "Fatigue", current: 6, previous: 8 },
  { symptom: "Anxiety", current: 4, previous: 6 },
  { symptom: "Insomnia", current: 3, previous: 5 },
  { symptom: "Irritability", current: 5, previous: 7 },
];

export function SymptomRadar({ data = defaultData }: SymptomRadarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Symptom Profile</CardTitle>
        <CardDescription>Current vs previous period comparison</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid className="stroke-muted" />
              <PolarAngleAxis dataKey="symptom" className="text-xs text-muted-foreground" />
              <PolarRadiusAxis angle={30} domain={[0, 10]} className="text-xs text-muted-foreground" />
              <Radar name="Current" dataKey="current" stroke="#ec4899" fill="#ec4899" fillOpacity={0.3} />
              <Radar name="Previous" dataKey="previous" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
