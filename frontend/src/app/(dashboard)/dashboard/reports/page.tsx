"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FileText, Download, FileDown, Eye, Calendar, Clock, Plus } from "lucide-react";

interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  size: string;
  status: "ready" | "generating";
}

const defaultReports: Report[] = [
  { id: "1", title: "Monthly Summary - December 2023", type: "PDF", date: "2024-01-01", size: "2.4 MB", status: "ready" },
  { id: "2", title: "Symptom Analysis Q4 2023", type: "PDF", date: "2023-12-31", size: "1.8 MB", status: "ready" },
  { id: "3", title: "Doctor Visit Report - Jan 2024", type: "PDF", date: "2024-01-15", size: "3.1 MB", status: "ready" },
  { id: "4", title: "Data Export - Full History", type: "CSV", date: "2024-01-10", size: "856 KB", status: "ready" },
  { id: "5", title: "Mood & Sleep Correlation", type: "PDF", date: "2024-01-08", size: "1.2 MB", status: "ready" },
];

export default function ReportsPage() {
  const [reports, setReports] = useState(defaultReports);
  const [dateRange, setDateRange] = useState("30d");
  const [reportType, setReportType] = useState("pdf");
  const [generating, setGenerating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const newReport: Report = {
        id: String(Date.now()),
        title: `${reportType.toUpperCase()} Report - ${new Date().toLocaleDateString()}`,
        type: reportType.toUpperCase(),
        date: new Date().toISOString().split("T")[0],
        size: reportType === "pdf" ? "2.1 MB" : "450 KB",
        status: "ready",
      };
      setReports((prev) => [newReport, ...prev]);
      setDialogOpen(false);
      toast.success("Report generated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (report: Report) => {
    toast.success(`Downloading ${report.title}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground mt-1">Generate and download doctor-ready reports from your data.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
                <DialogDescription>Create a comprehensive report from your tracked data.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                      <SelectItem value="6mo">Last 6 months</SelectItem>
                      <SelectItem value="12mo">Last 12 months</SelectItem>
                      <SelectItem value="all">All time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF - Doctor Report</SelectItem>
                      <SelectItem value="csv">CSV - Data Export</SelectItem>
                      <SelectItem value="json">JSON - Raw Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleGenerate} disabled={generating}>
                  {generating ? "Generating..." : "Generate"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-8 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950/20 dark:to-purple-950/20 border-brand-200 dark:border-brand-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-brand-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-brand-800 dark:text-brand-300">Doctor-Ready Reports</p>
                <p className="text-sm text-brand-600 dark:text-brand-400 mt-1">
                  Your reports are formatted for healthcare providers. They include symptom trends, mood patterns, sleep analysis,
                  and key correlations. Download and share with your doctor for more informed appointments.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-center p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900 mr-4">
                  <FileText className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{report.title}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {report.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {report.size}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">{report.type}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleDownload(report)}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4">
          <p className="text-xs text-amber-800 dark:text-amber-200">
            <strong>Medical Disclaimer:</strong> Reports are generated from your self-tracked data and are for informational purposes. They are not a substitute for professional medical advice, diagnosis, or treatment. Always review with your healthcare provider.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
