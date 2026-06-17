"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { User, Shield, Bell, CreditCard, Receipt, LogOut, Trash2, Save } from "lucide-react";

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reminderCheckin, setReminderCheckin] = useState(true);
  const [reminderMedication, setReminderMedication] = useState(true);
  const [reminderExercise, setReminderExercise] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleProfileSave = () => {
    updateUser({ name });
    toast.success("Profile updated successfully");
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in both password fields");
      return;
    }
    toast.success("Password changed successfully");
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleNotificationSave = () => {
    toast.success("Notification preferences saved");
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion is not available in demo mode");
  };

  const subscriptionTiers = [
    { tier: "free", label: "Free", price: "$0", features: ["Basic tracking", "7-day history"] },
    { tier: "basic", label: "Basic", price: "$3.99/mo", features: ["Full tracking", "30-day history"] },
    { tier: "premium", label: "Premium", price: "$9.99/mo", features: ["AI insights", "Unlimited history", "Doctor reports"] },
    { tier: "premium_plus", label: "Premium Plus", price: "$19.99/mo", features: ["Everything + community", "Health coach"] },
  ];

  const currentTier = user?.subscriptionTier || "free";

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account, preferences, and subscription.</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" />Profile</TabsTrigger>
            <TabsTrigger value="account"><Shield className="h-4 w-4 mr-2" />Account</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2" />Notifications</TabsTrigger>
            <TabsTrigger value="subscription"><CreditCard className="h-4 w-4 mr-2" />Subscription</TabsTrigger>
            <TabsTrigger value="billing"><Receipt className="h-4 w-4 mr-2" />Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input type="tel" placeholder="+1 (555) 123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleProfileSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Change Password</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handlePasswordChange}>
                  <Save className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-red-200 dark:border-red-900">
              <CardHeader>
                <CardTitle className="text-lg text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. All your data will be permanently removed.
                </p>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notification Preferences</CardTitle>
                <CardDescription>Choose what reminders you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Push Reminders</h3>
                  <div className="flex items-center justify-between">
                    <Label>Daily check-in reminder</Label>
                    <Switch checked={reminderCheckin} onCheckedChange={setReminderCheckin} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <Label>Medication reminders</Label>
                    <Switch checked={reminderMedication} onCheckedChange={setReminderMedication} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <Label>Exercise reminders</Label>
                    <Switch checked={reminderExercise} onCheckedChange={setReminderExercise} />
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Email Notifications</h3>
                  <div className="flex items-center justify-between">
                    <Label>Weekly insights summary</Label>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleNotificationSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Plan</CardTitle>
                <CardDescription>You are currently on the {currentTier} plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {subscriptionTiers.map((tier) => {
                    const isActive = tier.tier === currentTier;
                    const isUpgrade =
                      ["free", "basic", "premium", "premium_plus"].indexOf(tier.tier) >
                      ["free", "basic", "premium", "premium_plus"].indexOf(currentTier as string);
                    return (
                      <Card key={tier.tier} className={`border-2 ${isActive ? "border-brand-500" : ""}`}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{tier.label}</CardTitle>
                            {isActive && <Badge>Current</Badge>}
                          </div>
                          <p className="text-2xl font-bold mt-2">{tier.price}</p>
                        </CardHeader>
                        <CardContent className="pb-4">
                          <ul className="space-y-1">
                            {tier.features.map((f) => (
                              <li key={f} className="text-xs text-muted-foreground">- {f}</li>
                            ))}
                          </ul>
                        </CardContent>
                        <CardFooter>
                          {!isActive && (
                            <Button variant={isUpgrade ? "default" : "outline"} className="w-full" size="sm">
                              {isUpgrade ? "Upgrade" : "Downgrade"}
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Payment Methods</CardTitle>
                <CardDescription>Manage your payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-14 items-center justify-center rounded border bg-muted">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Visa ending in 4242</p>
                      <p className="text-xs text-muted-foreground">Expires 12/26</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Default</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Billing History</CardTitle>
                <CardDescription>View your past invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: "Jan 1, 2024", amount: "$9.99", status: "Paid", invoice: "INV-001" },
                    { date: "Dec 1, 2023", amount: "$9.99", status: "Paid", invoice: "INV-002" },
                    { date: "Nov 1, 2023", amount: "$9.99", status: "Paid", invoice: "INV-003" },
                  ].map((bill) => (
                    <div key={bill.invoice} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{bill.date}</p>
                        <p className="text-xs text-muted-foreground">{bill.invoice}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="success" className="text-[10px]">{bill.status}</Badge>
                        <span className="text-sm font-medium">{bill.amount}</span>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
