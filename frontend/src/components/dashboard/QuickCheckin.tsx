"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

interface QuickCheckinProps {
  completed?: boolean;
  lastCheckin?: string;
}

export function QuickCheckin({ completed = false, lastCheckin }: QuickCheckinProps) {
  if (completed) {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <ClipboardCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-semibold text-green-800 dark:text-green-300">Today&apos;s Check-in Complete</p>
              <p className="text-sm text-green-600 dark:text-green-400">
                {lastCheckin ? `Last check-in: ${lastCheckin}` : "Great job staying on track!"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-brand-50 to-pink-50 dark:from-brand-950/20 dark:to-pink-950/20 border-brand-200 dark:border-brand-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
              <ClipboardCheck className="h-6 w-6 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <p className="font-semibold text-brand-800 dark:text-brand-300">Quick Check-in</p>
              <p className="text-sm text-brand-600 dark:text-brand-400">
                Take 2 minutes to log how you&apos;re feeling today
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/dashboard/tracking">
              Start
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
