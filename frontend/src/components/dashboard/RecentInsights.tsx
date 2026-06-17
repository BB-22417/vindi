"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Insight {
  id: string;
  title: string;
  description: string;
  type: "pattern" | "correlation" | "recommendation" | "alert";
  severity?: "info" | "warning" | "critical";
}

interface RecentInsightsProps {
  insights?: Insight[];
}

const defaultInsights: Insight[] = [
  {
    id: "1",
    title: "Mood-Sleep Correlation Detected",
    description: "Your mood scores tend to be 40% higher after 7+ hours of sleep.",
    type: "correlation",
    severity: "info",
  },
  {
    id: "2",
    title: "Hot Flash Pattern",
    description: "Hot flashes peak in the afternoon. Consider scheduling cooler activities.",
    type: "pattern",
    severity: "warning",
  },
  {
    id: "3",
    title: "Brain Fog Alert",
    description: "Brain fog severity has increased 25% this week. Stress levels are also elevated.",
    type: "alert",
    severity: "critical",
  },
];

const typeColors = {
  pattern: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  correlation: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  recommendation: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  alert: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
};

const severityColors = {
  info: "info",
  warning: "warning",
  critical: "destructive",
} as const;

export function RecentInsights({ insights = defaultInsights }: RecentInsightsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">AI Insights</CardTitle>
            <CardDescription>Personalized patterns and recommendations</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/insights">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className="group rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="flex items-start gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${typeColors[insight.type]}`}>
                <Lightbulb className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium">{insight.title}</p>
                  {insight.severity && (
                    <Badge variant={severityColors[insight.severity]} className="capitalize text-[10px]">
                      {insight.severity}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
