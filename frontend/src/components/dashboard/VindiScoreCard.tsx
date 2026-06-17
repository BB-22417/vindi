"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { calculateVindiScore, getScoreLabel, getScoreColor, getScoreBgColor } from "@/lib/utils";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface VindiScoreCardProps {
  mood?: number;
  sleep?: number;
  energy?: number;
  symptoms?: number;
  stress?: number;
  trend?: "up" | "down" | "stable";
  trendValue?: number;
}

export function VindiScoreCard({
  mood = 7,
  sleep = 6,
  energy = 5,
  symptoms = 4,
  stress = 5,
  trend = "stable",
  trendValue = 0,
}: VindiScoreCardProps) {
  const score = calculateVindiScore(mood, sleep, energy, symptoms, stress);
  const label = getScoreLabel(score);
  const colorClass = getScoreColor(score);
  const bgColorClass = getScoreBgColor(score);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Vindi Score</CardTitle>
          <div className={`flex items-center gap-1 text-sm ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"}`}>
            {trend === "up" && <TrendingUp className="h-4 w-4" />}
            {trend === "down" && <TrendingDown className="h-4 w-4" />}
            {trend === "stable" && <Activity className="h-4 w-4" />}
            <span>{trendValue > 0 ? "+" : ""}{trendValue}</span>
          </div>
        </div>
        <CardDescription>Your overall wellness score</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-4 mb-4">
          <div className="flex flex-col">
            <span className={`text-5xl font-bold ${colorClass}`}>{score}</span>
            <span className="text-sm text-muted-foreground mt-1">/ 100</span>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-xs font-medium text-white ${bgColorClass}`}>
            {label}
          </div>
        </div>
        <Progress value={score} className="h-2.5" />
        <div className="grid grid-cols-5 gap-2 mt-4">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Mood</div>
            <div className="text-sm font-semibold">{mood}/10</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Sleep</div>
            <div className="text-sm font-semibold">{sleep}/10</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Energy</div>
            <div className="text-sm font-semibold">{energy}/10</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Symptoms</div>
            <div className="text-sm font-semibold">{symptoms}/10</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Stress</div>
            <div className="text-sm font-semibold">{stress}/10</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
