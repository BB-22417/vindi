"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { FlaskConical, Plus, Star, TrendingUp, Calendar, Clock } from "lucide-react";

interface Intervention {
  id: string;
  name: string;
  type: string;
  startDate: string;
  description: string;
  effectiveness: number;
  beforeScore: number;
  afterScore: number;
  notes: string;
  active: boolean;
}

const defaultInterventions: Intervention[] = [
  {
    id: "1",
    name: "Magnesium Supplement",
    type: "supplement",
    startDate: "2024-01-01",
    description: "400mg magnesium glycinate before bed",
    effectiveness: 8,
    beforeScore: 4,
    afterScore: 8,
    notes: "Significant improvement in sleep quality and reduction in night sweats",
    active: true,
  },
  {
    id: "2",
    name: "Evening Yoga",
    type: "exercise",
    startDate: "2024-01-10",
    description: "20-minute gentle yoga before bed",
    effectiveness: 6,
    beforeScore: 5,
    afterScore: 7,
    notes: "Helps with relaxation but inconsistent results",
    active: true,
  },
  {
    id: "3",
    name: "Reduce Caffeine",
    type: "dietary",
    startDate: "2023-12-15",
    description: "No caffeine after 12 PM",
    effectiveness: 9,
    beforeScore: 3,
    afterScore: 8,
    notes: "Dramatic reduction in hot flashes and improved sleep",
    active: true,
  },
];

const interventionTypes = ["supplement", "medication", "exercise", "dietary", "mindfulness", "therapy", "other"];

export default function InterventionsPage() {
  const [interventions, setInterventions] = useState(defaultInterventions);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("supplement");
  const [newDescription, setNewDescription] = useState("");
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split("T")[0]);

  const handleAdd = () => {
    if (!newName.trim()) {
      toast.error("Please enter an intervention name");
      return;
    }
    const intervention: Intervention = {
      id: String(Date.now()),
      name: newName,
      type: newType,
      startDate: newStartDate,
      description: newDescription,
      effectiveness: 5,
      beforeScore: 5,
      afterScore: 5,
      notes: "",
      active: true,
    };
    setInterventions((prev) => [intervention, ...prev]);
    setDialogOpen(false);
    setNewName("");
    setNewDescription("");
    toast.success("Intervention added! Start tracking its effectiveness.");
  };

  const rateEffectiveness = (id: string, rating: number) => {
    setInterventions((prev) =>
      prev.map((i) => (i.id === id ? { ...i, effectiveness: rating } : i))
    );
    toast.success("Effectiveness rating updated");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Interventions</h1>
            <p className="text-muted-foreground mt-1">Track what helps and measure the impact of your interventions.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Intervention
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Intervention</DialogTitle>
                <DialogDescription>Track a new supplement, medication, exercise, or lifestyle change.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input placeholder="e.g., Magnesium Glycinate" value={newName} onChange={(e) => setNewName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={newType} onValueChange={setNewType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {interventionTypes.map((t) => (
                        <SelectItem key={t} value={t} className="capitalize">
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={newStartDate} onChange={(e) => setNewStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Dosage, frequency, and any other details..." value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAdd}>Add Intervention</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-green-500">{interventions.length}</CardTitle>
              <CardDescription>Total Interventions</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-brand-500">
                {interventions.filter((i) => i.effectiveness >= 7).length}
              </CardTitle>
              <CardDescription>Highly Effective</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-blue-500">
                {Math.round(interventions.reduce((sum, i) => sum + i.effectiveness, 0) / interventions.length * 10) / 10}
              </CardTitle>
              <CardDescription>Avg Effectiveness</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="space-y-4">
          {interventions.map((intervention) => (
            <Card key={intervention.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900">
                      <FlaskConical className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-base">{intervention.name}</CardTitle>
                        <Badge variant="secondary" className="capitalize text-xs">{intervention.type}</Badge>
                        {intervention.active && (
                          <Badge variant="success" className="text-[10px]">Active</Badge>
                        )}
                      </div>
                      <CardDescription>{intervention.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Started: {intervention.startDate}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Duration: {Math.floor((Date.now() - new Date(intervention.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <Label className="text-sm mb-2 block">Effectiveness Rating</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => rateEffectiveness(intervention.id, rating)}
                        className={`h-8 w-8 rounded-full text-xs font-medium transition-colors ${
                          rating <= intervention.effectiveness
                            ? "bg-brand-500 text-white"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Before</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 rounded-full bg-red-100 dark:bg-red-900/30">
                        <div className="h-full rounded-full bg-red-500" style={{ width: `${intervention.beforeScore * 10}%` }} />
                      </div>
                      <span className="text-sm font-medium">{intervention.beforeScore}/10</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">After</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 rounded-full bg-green-100 dark:bg-green-900/30">
                        <div className="h-full rounded-full bg-green-500" style={{ width: `${intervention.afterScore * 10}%` }} />
                      </div>
                      <span className="text-sm font-medium">{intervention.afterScore}/10</span>
                    </div>
                  </div>
                </div>

                {intervention.notes && (
                  <p className="text-sm text-muted-foreground mt-3 italic">{intervention.notes}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4">
          <p className="text-xs text-amber-800 dark:text-amber-200">
            <strong>Medical Disclaimer:</strong> Always consult your healthcare provider before starting any new supplement, medication, or exercise regimen. Intervention tracking is for informational purposes and does not replace professional medical advice.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
