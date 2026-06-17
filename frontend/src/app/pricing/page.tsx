"use client";

import { useState } from "react";
import Link from "next/link";
import { LandingLayout } from "@/components/layout/LandingLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Star, Heart, ArrowRight } from "lucide-react";

interface PlanFeature {
  name: string;
  basic: boolean | string;
  premium: boolean | string;
  premiumPlus: boolean | string;
}

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

const comparisonFeatures: PlanFeature[] = [
  { name: "Daily symptom tracking", basic: true, premium: true, premiumPlus: true },
  { name: "Vindi Score calculation", basic: true, premium: true, premiumPlus: true },
  { name: "Basic analytics", basic: true, premium: true, premiumPlus: true },
  { name: "AI-powered insights", basic: false, premium: true, premiumPlus: true },
  { name: "Unlimited data history", basic: false, premium: true, premiumPlus: true },
  { name: "Doctor-ready PDF reports", basic: false, premium: true, premiumPlus: true },
  { name: "Mood-sleep correlation", basic: false, premium: true, premiumPlus: true },
  { name: "Symptom heatmap", basic: false, premium: true, premiumPlus: true },
  { name: "Intervention tracking", basic: false, premium: false, premiumPlus: true },
  { name: "Community access", basic: false, premium: false, premiumPlus: true },
  { name: "Export (CSV, JSON)", basic: false, premium: false, premiumPlus: true },
  { name: "Health coach chat", basic: false, premium: false, premiumPlus: true },
  { name: "Family sharing", basic: false, premium: false, premiumPlus: true },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <LandingLayout>
      <section className="container py-20 lg:py-28">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            <Heart className="h-3.5 w-3.5 mr-1.5 text-brand-500" />
            Simple, transparent pricing
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Choose the plan that&apos;s right for you</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Start free and upgrade as you need more features. All plans include a 14-day free trial.
          </p>
          <Tabs defaultValue="monthly" className="w-fit mx-auto" onValueChange={(v) => setAnnual(v === "annual")}>
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="annual">Annual <Badge variant="success" className="ml-1 text-[10px]">Save 20%</Badge></TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative border-2 flex flex-col ${plan.popular ? "border-brand-500 shadow-lg shadow-brand-500/10 scale-105" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-brand text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-3">
                  <span className="text-4xl font-bold">
                    ${annual ? (plan.price * 12 * 0.8 / 12).toFixed(2) : plan.price.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground ml-1">/mo</span>
                </div>
                {annual && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ${(plan.price * 12 * 0.8).toFixed(2)} billed annually
                  </p>
                )}
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
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
                <Button className={`w-full ${plan.popular ? "" : ""}`} variant={plan.popular ? "default" : "outline"} size="lg" asChild>
                  <Link href="/register">
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Compare all features</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 pr-4 font-medium">Feature</th>
                  <th className="text-center py-4 px-4 font-medium">Basic</th>
                  <th className="text-center py-4 px-4 font-medium text-brand-600">Premium</th>
                  <th className="text-center py-4 px-4 font-medium">Premium Plus</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature) => (
                  <tr key={feature.name} className="border-b last:border-0">
                    <td className="py-3 pr-4 text-sm">{feature.name}</td>
                    <td className="text-center py-3 px-4">
                      {typeof feature.basic === "boolean" ? (
                        feature.basic ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <span className="text-muted-foreground">&mdash;</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">{feature.basic}</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {typeof feature.premium === "boolean" ? (
                        feature.premium ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <span className="text-muted-foreground">&mdash;</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">{feature.premium}</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {typeof feature.premiumPlus === "boolean" ? (
                        feature.premiumPlus ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <span className="text-muted-foreground">&mdash;</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">{feature.premiumPlus}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">All plans include a 14-day free trial. No credit card required.</p>
          <Button size="lg" asChild>
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
