"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Sparkles, Brain, TrendingUp, AlertTriangle, Info, X } from "lucide-react";
import { toast } from "sonner";

interface Insight {
  id: string;
  type: "correlation" | "pattern" | "recommendation" | "alert";
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
  date: string;
  dismissed: boolean;
}

const defaultInsights: Insight[] = [
  {
    id: "1",
    type: "correlation",
    title: "Sleep Quality Impacts Mood",
    description: "Analysis shows your mood scores are 40% higher on days following 7+ hours of quality sleep. Consider prioritizing your sleep schedule to maintain emotional balance.",
    severity: "info",
    date: "2024-01-15",
    dismissed: false,
  },
  {
    id: "2",
    type: "pattern",
    title: "Afternoon Hot Flash Pattern",
    description: "Hot flashes peak consistently between 2-4 PM. This may be linked to your daily cortisol rhythm. Scheduling cooler activities or using cooling techniques during this window may help.",
    severity: "warning",
    date: "2024-01-14",
    dismissed: false,
  },
  {
    id: "3",
    type: "alert",
    title: "Brain Fog Severity Spike",
    description: "Brain fog severity has increased 35% over the past week. This correlates with increased stress levels and reduced sleep quality. Consider stress-reduction techniques.",
    severity: "critical",
    date: "2024-01-13",
    dismissed: false,
  },
  {
    id: "4",
    type: "recommendation",
    title: "Hydration Linked to Fewer Headaches",
    description: "Days with 8+ cups of water show 50% fewer headache reports. Try to maintain adequate hydration throughout the day.",
    severity: "info",
    date: "2024-01-12",
    dismissed: false,
  },
  {
    id: "5",
    type: "correlation",
    title: "Exercise Improves Sleep Quality",
    description: "Exercise days show a 25% improvement in sleep quality scores. Even light activity like walking can make a significant difference.",
    severity: "info",
    date: "2024-01-11",
    dismissed: false,
  },
  {
    id: "6",
    type: "pattern",
    title: "Monthly Cycle Symptom Cluster",
    description: "Days 21-28 of your cycle show a cluster of increased irritability, bloating, and breast tenderness. This aligns with the luteal phase of your menstrual cycle.",
    severity: "warning",
    date: "2024-01-10",
    dismissed: false,
  },
];

const typeConfig = {
  correlation: { icon: TrendingUp, label: "Correlation", color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
  pattern: { icon: Brain, label: "Pattern", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  recommendation: { icon: Sparkles, label: "Recommendation", color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  alert: { icon: AlertTriangle, label: "Alert", color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" },
};

const severityColors = {
  info: "info" as const,
  warning: "warning" as const,
  critical: "destructive" as const,
};

export default function InsightsPage() {
  const [insights, setInsights] = useState(defaultInsights);
  const [generating, setGenerating] = useState(false);

  const dismissInsight = (id: string) => {
    setInsights((prev) => prev.map((i) => (i.id === id ? { ...i, dismissed: true } : i)));
    toast.success("Insight dismissed");
  };

  const generateInsights = async () => {
    setGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const newInsight: Insight = {
        id: String(Date.now()),
        type: "recommendation",
        title: "New Personalized Insight Generated",
        description: "Based on your recent data, we've identified that reducing caffeine intake after 2 PM may help improve your sleep quality and reduce night sweat episodes.",
        severity: "info",
        date: new Date().toISOString().split("T")[0],
        dismissed: false,
      };
      setInsights((prev) => [newInsight, ...prev]);
      toast.success("New insights generated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate insights");
    } finally {
      setGenerating(false);
    }
  };

  const activeInsights = insights.filter((i) => !i.dismissed);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">AI Insights</h1>
            <p className="text-muted-foreground mt-1">Personalized patterns, correlations, and recommendations based on your data.</p>
          </div>
          <Button onClick={generateInsights} disabled={generating} size="lg">
            <Sparkles className="mr-2 h-4 w-4" />
            {generating ? "Analyzing..." : "Generate New Insights"}
          </Button>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950/30 dark:to-purple-950/30 border border-brand-200 dark:border-brand-800 p-4 mb-8">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-brand-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-brand-800 dark:text-brand-300">How Insights Work</p>
              <p className="text-sm text-brand-600 dark:text-brand-400 mt-1">
                Our AI analyzes your tracked data to identify patterns, correlations, and trends. Generate new insights anytime or wait for automatic weekly updates. The more you track, the smarter your insights become.
              </p>
            </div>
          </div>
        </div>

        {activeInsights.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No insights yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Start tracking your symptoms daily and generate insights to see patterns.</p>
              <Button onClick={generateInsights} disabled={generating}>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Insights
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeInsights.map((insight) => {
              const config = typeConfig[insight.type];
              const Icon = config.icon;
              return (
                <Card key={insight.id} className="group relative hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="capitalize text-xs">
                              {config.label}
                            </Badge>
                            <Badge variant={severityColors[insight.severity]} className="capitalize text-[10px]">
                              {insight.severity}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{insight.date}</span>
                          </div>
                          <CardTitle className="text-base">{insight.title}</CardTitle>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => dismissInsight(insight.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">{insight.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4">
          <p className="text-xs text-amber-800 dark:text-amber-200">
            <strong>Medical Disclaimer:</strong> AI insights are generated based on pattern recognition and are for informational purposes only. They do not constitute medical advice. Always consult your healthcare provider before making any changes to your health routine.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
