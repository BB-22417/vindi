"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Heart, BedDouble, Zap, Thermometer, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Metric {
  label: string;
  value: string;
  change: number;
  unit?: string;
  icon: any;
  color: string;
  bgColor: string;
}

const defaultMetrics: Metric[] = [
  {
    label: "Avg Mood",
    value: "6.8",
    change: 0.5,
    unit: "/10",
    icon: Heart,
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
  },
  {
    label: "Avg Sleep",
    value: "7.2",
    change: 0.8,
    unit: " hrs",
    icon: BedDouble,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    label: "Energy Level",
    value: "5.4",
    change: -0.3,
    unit: "/10",
    icon: Zap,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    label: "Hot Flashes",
    value: "3.2",
    change: -1.2,
    unit: "/day",
    icon: Thermometer,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
];

interface AnalyticsSummaryProps {
  metrics?: Metric[];
}

export function AnalyticsSummary({ metrics = defaultMetrics }: AnalyticsSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, i) => {
        const Icon = metric.icon;
        const isPositive = metric.change >= 0;
        const isHotFlashes = metric.label === "Hot Flashes";
        const isGood = isHotFlashes ? !isPositive : isPositive;

        return (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", metric.bgColor)}>
                  <Icon className={cn("h-5 w-5", metric.color)} />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5",
                  isGood
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}>
                  {isGood ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(metric.change).toFixed(1)}
                </div>
              </div>
              <p className="text-2xl font-bold">
                {metric.value}
                <span className="text-sm font-normal text-muted-foreground ml-1">{metric.unit}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">{metric.label}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
