"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Pill, Calendar, Dumbbell } from "lucide-react";

interface Reminder {
  id: string;
  title: string;
  time: string;
  type: "medication" | "appointment" | "checkin" | "exercise";
}

interface UpcomingRemindersProps {
  reminders?: Reminder[];
}

const defaultReminders: Reminder[] = [
  { id: "1", title: "Daily check-in", time: "Today, 8:00 PM", type: "checkin" },
  { id: "2", title: "Take Vitamin D", time: "Today, 9:00 AM", type: "medication" },
  { id: "3", title: "Evening walk", time: "Today, 6:00 PM", type: "exercise" },
  { id: "4", title: "Doctor appointment", time: "Tomorrow, 10:30 AM", type: "appointment" },
];

const typeConfig = {
  medication: { icon: Pill, color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
  appointment: { icon: Calendar, color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  checkin: { icon: Bell, color: "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300" },
  exercise: { icon: Dumbbell, color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
};

export function UpcomingReminders({ reminders = defaultReminders }: UpcomingRemindersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Reminders</CardTitle>
        <CardDescription>Things you don&apos;t want to miss</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {reminders.map((reminder) => {
          const config = typeConfig[reminder.type];
          const Icon = config.icon;
          return (
            <div key={reminder.id} className="flex items-start gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${config.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{reminder.title}</p>
                <p className="text-xs text-muted-foreground">{reminder.time}</p>
              </div>
              <Badge variant="outline" className="shrink-0 capitalize text-xs">
                {reminder.type}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
