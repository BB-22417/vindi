"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SymptomEntry {
  date: string;
  day: string;
  severity: number;
}

interface SymptomHeatmapProps {
  data?: SymptomEntry[];
  symptom?: string;
}

const severityColors = [
  "bg-gray-100 dark:bg-gray-800",
  "bg-green-200 dark:bg-green-900",
  "bg-yellow-200 dark:bg-yellow-900",
  "bg-orange-200 dark:bg-orange-900",
  "bg-red-200 dark:bg-red-900",
  "bg-red-400 dark:bg-red-700",
];

export function SymptomHeatmap({ data = [], symptom = "Hot Flashes" }: SymptomHeatmapProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const weeks: SymptomEntry[][] = [];
  if (data.length > 0) {
    for (let i = 0; i < data.length; i += 7) {
      weeks.push(data.slice(i, i + 7));
    }
  } else {
    const emptyWeek = days.map((day) => ({ date: day, day, severity: 0 }));
    for (let w = 0; w < 4; w++) {
      weeks.push(emptyWeek);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Symptom Heatmap</CardTitle>
        <CardDescription>{symptom} severity over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1">
          <div className="flex flex-col gap-1 mr-2">
            {weeks.map((_, weekIdx) => (
              <div key={weekIdx} className="h-[18px]" />
            ))}
          </div>
          <div className="flex-1">
            <div className="flex gap-1">
              {days.map((day) => (
                <div key={day} className="flex-1 text-center text-xs text-muted-foreground mb-1">
                  {day}
                </div>
              ))}
            </div>
            <TooltipProvider>
              <div className="flex flex-col gap-1">
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex gap-1">
                    {week.map((entry, dayIdx) => (
                      <Tooltip key={dayIdx}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "flex-1 aspect-square rounded-sm cursor-pointer transition-colors hover:ring-2 hover:ring-ring",
                              severityColors[entry.severity] || severityColors[0]
                            )}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          {entry.date} - Severity: {entry.severity}/5
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-3 text-xs text-muted-foreground">
          <span>Less</span>
          {severityColors.map((color, i) => (
            <div key={i} className={cn("h-3 w-3 rounded-sm", color)} />
          ))}
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
