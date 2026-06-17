"use client";

import { useState } from "react";
import Link from "next/link";
import { LandingLayout } from "@/components/layout/LandingLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, ArrowRight, Activity, Brain, FileText, Users, Sparkles, Shield, Star, Heart } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Symptom Tracking",
    description: "Log your daily symptoms in 2 minutes. Track patterns across cycles, seasons, and lifestyle changes.",
    color: "text-pink-500",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
  },
  {
    icon: Sparkles,
    title: "Vindi Score",
    description: "Your personalized wellness score based on mood, sleep, energy, and symptom data. Watch your trends over time.",
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    icon: Brain,
    title: "AI Insights",
    description: "Get personalized patterns and correlations. Discover what triggers your symptoms and what helps.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
  },
  {
    icon: FileText,
    title: "Doctor Reports",
    description: "Generate comprehensive reports for your healthcare provider. Walk into appointments with evidence.",
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    age: 47,
    text: "Vindi helped me understand my patterns and gave me the confidence to talk to my doctor about my symptoms. I finally feel heard.",
    rating: 5,
  },
  {
    name: "Jennifer K.",
    age: 44,
    text: "The AI insights are incredibly accurate. It detected my caffeine-mood correlation before I even noticed it myself.",
    rating: 5,
  },
  {
    name: "Lisa R.",
    age: 51,
    text: "I love the doctor report feature. My gynecologist was impressed with the data. It made our conversation so much more productive.",
    rating: 5,
  },
];

const plans = [
  {
    name: "Basic",
    price: 3.99,
    description: "Essential tracking to understand your symptoms",
    features: [
      "Daily symptom tracking",
      "Vindi Score calculation",
      "Basic analytics dashboard",
      "7-day data history",
      "Email support",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Premium",
    price: 9.99,
    description: "Advanced insights for proactive health management",
    features: [
      "Everything in Basic",
      "AI-powered insights & patterns",
      "Unlimited data history",
      "Doctor-ready reports (PDF)",
      "Mood & sleep correlation analysis",
      "Symptom heatmap calendar",
      "Priority support",
    ],
    cta: "Start Premium",
    popular: true,
  },
  {
    name: "Premium Plus",
    price: 19.99,
    description: "Complete perimenopause wellness companion",
    features: [
      "Everything in Premium",
      "Unlimited AI insight generation",
      "Export data (PDF, CSV, JSON)",
      "Intervention tracking & analysis",
      "Community access & support",
      "Personalized recommendations",
      "Dedicated health coach chat",
      "Family sharing (up to 3)",
    ],
    cta: "Go Premium Plus",
    popular: false,
  },
];

export default function HomePage() {
  const [annual, setAnnual] = useState(false);

  return (
    <LandingLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-purple-50 dark:from-brand-950 dark:via-background dark:to-purple-950" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="container relative py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
              <Heart className="h-3.5 w-3.5 mr-1.5 text-brand-500" />
              Trusted by women worldwide
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
              Walk into your doctor&apos;s appointment with{" "}
              <span className="text-gradient-brand">evidence instead of guesses</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Track your perimenopause symptoms, get AI-powered insights, and generate comprehensive reports
              that give you and your doctor the clarity you deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-base" asChild>
                <Link href="/register">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="container py-20 lg:py-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Everything you need to navigate perimenopause</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From daily tracking to AI-powered insights, Vindi gives you a complete picture of your health.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-brand-200 dark:hover:border-brand-800">
                <CardHeader>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgColor} mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-muted/30 py-20 lg:py-28">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">What women are saying</h2>
            <p className="text-lg text-muted-foreground">Join thousands of women taking control of their perimenopause journey.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-2">
                <CardContent className="p-6">
                  <div className="flex mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
                      <span className="text-sm font-semibold text-brand-700 dark:text-brand-300">{t.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">Age {t.age}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="container py-20 lg:py-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-muted-foreground mb-6">Start free, upgrade when you need more.</p>
          <Tabs defaultValue="monthly" className="w-fit mx-auto" onValueChange={(v) => setAnnual(v === "annual")}>
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="annual">Annual (Save 20%)</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative border-2 ${plan.popular ? "border-brand-500 shadow-lg shadow-brand-500/10" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-brand text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">${annual ? (plan.price * 12 * 0.8 / 12).toFixed(2) : plan.price.toFixed(2)}</span>
                  <span className="text-muted-foreground ml-1">/mo</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className={`w-full ${plan.popular ? "" : "variant-outline"}`} variant={plan.popular ? "default" : "outline"} asChild>
                  <Link href="/register">{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-brand-600 to-purple-700 py-20">
        <div className="container text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to take control of your health?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Join thousands of women who are tracking their perimenopause journey with confidence.
          </p>
          <Button size="lg" variant="secondary" className="text-base" asChild>
            <Link href="/register">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </LandingLayout>
  );
}
