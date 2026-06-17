"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Save, BedDouble, Brain, Thermometer, Heart, Activity, Apple, FileText } from "lucide-react";
import { symptomList, symptomSeverityLabels } from "@/lib/utils";

export default function TrackingPage() {
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [awakenings, setAwakenings] = useState(1);
  const [nightSweats, setNightSweats] = useState(false);
  const [mood, setMood] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const [stress, setStress] = useState(5);
  const [irritability, setIrritability] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [brainFog, setBrainFog] = useState(5);
  const [focus, setFocus] = useState(5);
  const [memory, setMemory] = useState(5);
  const [symptoms, setSymptoms] = useState<Record<string, string>>({});
  const [weight, setWeight] = useState("");
  const [bloodPressureSystolic, setBloodPressureSystolic] = useState("");
  const [bloodPressureDiastolic, setBloodPressureDiastolic] = useState("");
  const [temperature, setTemperature] = useState("");
  const [periodStarted, setPeriodStarted] = useState(false);
  const [periodEnded, setPeriodEnded] = useState(false);
  const [spotting, setSpotting] = useState(false);
  const [flowIntensity, setFlowIntensity] = useState("medium");
  const [exercise, setExercise] = useState(false);
  const [alcohol, setAlcohol] = useState(false);
  const [waterCups, setWaterCups] = useState(6);
  const [caffeine, setCaffeine] = useState(1);
  const [nutrition, setNutrition] = useState(5);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Daily check-in saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save check-in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Daily Check-in</h1>
          <p className="text-muted-foreground mt-1">Track your symptoms, mood, and lifestyle factors. Takes about 2 minutes.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-lg">Sleep</CardTitle>
              </div>
              <CardDescription>How did you sleep last night?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Hours of sleep: <strong>{sleepHours}</strong></Label>
                  <Slider value={[sleepHours]} onValueChange={([v]) => setSleepHours(v)} min={0} max={12} step={0.5} />
                </div>
                <div className="space-y-3">
                  <Label>Sleep quality: <strong>{sleepQuality}/10</strong></Label>
                  <Slider value={[sleepQuality]} onValueChange={([v]) => setSleepQuality(v)} min={1} max={10} />
                </div>
                <div className="space-y-3">
                  <Label>Night awakenings: <strong>{awakenings}</strong></Label>
                  <Slider value={[awakenings]} onValueChange={([v]) => setAwakenings(v)} min={0} max={10} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Night sweats</Label>
                  <Switch checked={nightSweats} onCheckedChange={setNightSweats} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                <CardTitle className="text-lg">Mood & Emotional</CardTitle>
              </div>
              <CardDescription>Rate your emotional well-being today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Mood", value: mood, setter: setMood },
                  { label: "Anxiety", value: anxiety, setter: setAnxiety },
                  { label: "Stress", value: stress, setter: setStress },
                  { label: "Irritability", value: irritability, setter: setIrritability },
                ].map((item) => (
                  <div key={item.label} className="space-y-3">
                    <Label>{item.label}: <strong>{item.value}/10</strong></Label>
                    <Slider value={[item.value]} onValueChange={([v]) => item.setter(v)} min={1} max={10} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-500" />
                <CardTitle className="text-lg">Energy & Cognition</CardTitle>
              </div>
              <CardDescription>How is your energy and mental clarity?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Energy", value: energy, setter: setEnergy },
                  { label: "Brain Fog", value: brainFog, setter: setBrainFog },
                  { label: "Focus", value: focus, setter: setFocus },
                  { label: "Memory", value: memory, setter: setMemory },
                ].map((item) => (
                  <div key={item.label} className="space-y-3">
                    <Label>{item.label}: <strong>{item.value}/10</strong></Label>
                    <Slider value={[item.value]} onValueChange={([v]) => item.setter(v)} min={1} max={10} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-red-500" />
                <CardTitle className="text-lg">Physical Symptoms</CardTitle>
              </div>
              <CardDescription>Rate your symptom severity today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {symptomList.slice(0, 8).map((symptom) => (
                  <div key={symptom} className="space-y-2">
                    <Label>{symptom}</Label>
                    <RadioGroup
                      value={symptoms[symptom] || ""}
                      onValueChange={(v) => setSymptoms((prev) => ({ ...prev, [symptom]: v }))}
                      className="flex gap-1"
                    >
                      {symptomSeverityLabels.map((label, i) => (
                        <div key={label} className="flex flex-col items-center gap-1">
                          <RadioGroupItem value={String(i)} id={`${symptom}-${i}`} className="peer sr-only" />
                          <Label
                            htmlFor={`${symptom}-${i}`}
                            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-xs transition-colors border-2 ${
                              symptoms[symptom] === String(i)
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-muted hover:border-primary/50"
                            }`}
                          >
                            {i}
                          </Label>
                          <span className="text-[10px] text-muted-foreground">{label}</span>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                <CardTitle className="text-lg">Body Metrics</CardTitle>
              </div>
              <CardDescription>Optional: track physical metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input type="number" step="0.1" placeholder="e.g. 65" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Blood Pressure</Label>
                  <div className="flex gap-2">
                    <Input type="number" placeholder="SYS" value={bloodPressureSystolic} onChange={(e) => setBloodPressureSystolic(e.target.value)} />
                    <Input type="number" placeholder="DIA" value={bloodPressureDiastolic} onChange={(e) => setBloodPressureDiastolic(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Temperature (°C)</Label>
                  <Input type="number" step="0.1" placeholder="e.g. 36.6" value={temperature} onChange={(e) => setTemperature(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-500" />
                <CardTitle className="text-lg">Cycle Tracking</CardTitle>
              </div>
              <CardDescription>Track your menstrual cycle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label>Period started</Label>
                  <Switch checked={periodStarted} onCheckedChange={setPeriodStarted} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Period ended</Label>
                  <Switch checked={periodEnded} onCheckedChange={setPeriodEnded} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Spotting</Label>
                  <Switch checked={spotting} onCheckedChange={setSpotting} />
                </div>
                <div className="space-y-2">
                  <Label>Flow intensity</Label>
                  <Select value={flowIntensity} onValueChange={setFlowIntensity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="heavy">Heavy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Apple className="h-5 w-5 text-green-500" />
                <CardTitle className="text-lg">Lifestyle</CardTitle>
              </div>
              <CardDescription>Track lifestyle factors affecting your symptoms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <Label>Exercise today</Label>
                  <Switch checked={exercise} onCheckedChange={setExercise} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Alcohol today</Label>
                  <Switch checked={alcohol} onCheckedChange={setAlcohol} />
                </div>
                <div className="space-y-3">
                  <Label>Water intake: <strong>{waterCups} cups</strong></Label>
                  <Slider value={[waterCups]} onValueChange={([v]) => setWaterCups(v)} min={0} max={15} />
                </div>
                <div className="space-y-2">
                  <Label>Caffeine servings</Label>
                  <Select value={String(caffeine)} onValueChange={(v) => setCaffeine(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None</SelectItem>
                      <SelectItem value="1">1 serving</SelectItem>
                      <SelectItem value="2">2 servings</SelectItem>
                      <SelectItem value="3">3 servings</SelectItem>
                      <SelectItem value="4">4+ servings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label>Nutrition quality: <strong>{nutrition}/10</strong></Label>
                  <Slider value={[nutrition]} onValueChange={([v]) => setNutrition(v)} min={1} max={10} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-lg">Notes</CardTitle>
              </div>
              <CardDescription>Anything else you&apos;d like to note?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="How are you feeling today? Any notable events, triggers, or observations..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            <Save className="mr-2 h-5 w-5" />
            {submitting ? "Saving..." : "Save Check-in"}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
