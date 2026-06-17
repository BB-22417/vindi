"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Shield, Users, DollarSign, TrendingUp, AlertTriangle, Search } from "lucide-react";

const revenueData = [
  { month: "Jan", revenue: 12000, subscribers: 1200 },
  { month: "Feb", revenue: 15000, subscribers: 1500 },
  { month: "Mar", revenue: 18000, subscribers: 1800 },
  { month: "Apr", revenue: 22000, subscribers: 2100 },
  { month: "May", revenue: 25000, subscribers: 2400 },
  { month: "Jun", revenue: 28000, subscribers: 2700 },
];

const users = [
  { id: "1", name: "Jane Smith", email: "jane@example.com", plan: "premium", status: "active", joined: "2024-01-15" },
  { id: "2", name: "Sarah Johnson", email: "sarah@example.com", plan: "basic", status: "active", joined: "2024-01-20" },
  { id: "3", name: "Emily Davis", email: "emily@example.com", plan: "premium_plus", status: "active", joined: "2024-02-01" },
  { id: "4", name: "Lisa Brown", email: "lisa@example.com", plan: "free", status: "inactive", joined: "2024-02-10" },
  { id: "5", name: "Maria Garcia", email: "maria@example.com", plan: "premium", status: "active", joined: "2024-03-05" },
];

const moderationQueue = [
  { id: "1", author: "Anonymous", content: "Has anyone tried...", category: "Questions", reports: 2, status: "pending" },
  { id: "2", author: "User123", content: "Check out this product...", category: "Tips", reports: 5, status: "flagged" },
];

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ProtectedRoute adminOnly>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-8 w-8 text-amber-500" />
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Platform management and analytics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-green-500">$28,000</CardTitle>
                <CardDescription>MRR</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-blue-500">$336,000</CardTitle>
                <CardDescription>ARR</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-purple-500">5.2%</CardTitle>
                <CardDescription>Churn Rate</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-brand-500">$245</CardTitle>
                <CardDescription>LTV</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Tabs defaultValue="analytics" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="moderation">Moderation</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Revenue & Growth</CardTitle>
                  <CardDescription>Monthly recurring revenue and subscriber growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs text-muted-foreground" />
                        <YAxis yAxisId="left" className="text-xs text-muted-foreground" />
                        <YAxis yAxisId="right" orientation="right" className="text-xs text-muted-foreground" />
                        <RechartTooltip
                          contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                        />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue ($)" />
                        <Line yAxisId="right" type="monotone" dataKey="subscribers" stroke="#8b5cf6" strokeWidth={2} name="Subscribers" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Plan Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { plan: "Free", count: 850 },
                          { plan: "Basic", count: 620 },
                          { plan: "Premium", count: 890 },
                          { plan: "Premium+", count: 340 },
                        ]} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis type="number" className="text-xs text-muted-foreground" />
                          <YAxis dataKey="plan" type="category" className="text-xs text-muted-foreground" />
                          <RechartTooltip />
                          <Bar dataKey="count" fill="#ec4899" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: "Total Users", value: "2,847", change: "+12%", positive: true },
                      { label: "Active Users (DAU)", value: "1,234", change: "+8%", positive: true },
                      { label: "Avg Session", value: "8m 42s", change: "+3%", positive: true },
                      { label: "Conversion Rate", value: "18.5%", change: "+2.1%", positive: true },
                      { label: "Support Tickets", value: "47", change: "-15%", positive: true },
                    ].map((metric) => (
                      <div key={metric.label} className="flex items-center justify-between">
                        <span className="text-sm">{metric.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{metric.value}</span>
                          <Badge variant={metric.positive ? "success" : "destructive"} className="text-[10px]">
                            {metric.change}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">User Management</CardTitle>
                      <CardDescription>Manage platform users</CardDescription>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search users..." className="pl-9 w-64" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">{user.plan}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.status === "active" ? "success" : "secondary"} className="capitalize">
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.joined}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">Edit</Button>
                              <Select defaultValue="">
                                <SelectTrigger className="w-24 h-8 text-xs">
                                  <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">User</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="moderation">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Content Moderation</CardTitle>
                  <CardDescription>Review reported community content</CardDescription>
                </CardHeader>
                <CardContent>
                  {moderationQueue.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                      <p>No items in moderation queue</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {moderationQueue.map((item) => (
                        <div key={item.id} className="flex items-start justify-between p-4 border rounded-lg">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{item.author}</span>
                              <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                              <Badge variant="warning" className="text-xs">{item.reports} reports</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.content}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Approve</Button>
                            <Button size="sm" variant="destructive">Remove</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
