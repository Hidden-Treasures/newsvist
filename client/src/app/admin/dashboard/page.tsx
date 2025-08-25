"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CreateNewsForm from "@/components/forms/CreateNews";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// icons
import {
  Calendar,
  CheckCircle2,
  FileText,
  Filter,
  Flag,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  Video,
} from "lucide-react";

// charts (recharts)
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";

// motion
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@headlessui/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDashboardStats, useRecentArticles } from "@/hooks/useAdmin";

const moderationQueue = [
  {
    id: "m1",
    type: "Comment",
    reason: "Hate speech",
    by: "guest-3881",
    on: "Aug 19, 10:01",
  },
  {
    id: "m2",
    type: "Article",
    reason: "Copyright claim",
    by: "DMCA Bot",
    on: "Aug 19, 09:27",
  },
  {
    id: "m3",
    type: "Comment",
    reason: "Spam",
    by: "guest-2019",
    on: "Aug 19, 08:45",
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [openCreate, setOpenCreate] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const { data: recentArticles = [], isLoading: articlesLoading } =
    useRecentArticles();

  const { data, isLoading, isError } = useDashboardStats();

  const stats = data?.stats ?? {
    totalArticles: 0,
    drafts: 0,
    liveEvents: 0,
    reported: 0,
    monthTrend: [],
  };

  // keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if ((e.key === "a" || e.key === "A") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setOpenCreate(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* Main content */}
      <main className="space-y-6">
        {/* Quick actions + search (mobile) */}
        <div className="flex md:hidden items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              ref={searchRef}
              placeholder="Search…"
              className="pl-9 bg-slate-800/60 border-slate-700"
            />
          </div>
          <Button onClick={() => setOpenCreate(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              title: "Total Articles",
              value: stats.totalArticles.toLocaleString(),
              icon: FileText,
            },
            {
              title: "Drafts",
              value: stats.drafts.toLocaleString(),
              icon: Pencil,
            },
            {
              title: "Live Events",
              value: stats.liveEvents.toString(),
              icon: Video,
            },
            {
              title: "Reported",
              value: stats.reported.toString(),
              icon: Flag,
            },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="bg-slate-900/60 border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    {kpi.title}
                  </CardTitle>
                  <kpi.icon className="w-4 h-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? "—" : kpi.value.toLocaleString()}
                  </div>
                  {isError && (
                    <p className="text-xs text-red-500">Error loading stats</p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    Last 24h · auto-updates
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* Traffic/Publishing Trends */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle>Publishing Trend (last 2 weeks)</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.monthTrend}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="fillArea" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#22c55e"
                        stopOpacity={0.35}
                      />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="d" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "#0b1220",
                      border: "1px solid #1f2937",
                    }}
                    labelStyle={{ color: "#cbd5e1" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#22c55e"
                    fillOpacity={1}
                    fill="url(#fillArea)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Quick Actions</CardTitle>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={() => setOpenCreate(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Article
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => router.push("/admin/live")}
              >
                Start Live Event
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/admin/media")}
              >
                Upload Media
              </Button>
              <div className="pt-1">
                <Label className="text-xs text-slate-400">
                  Auto-publish to social
                </Label>
                <div className="flex items-center justify-between rounded-xl border border-slate-800 p-3 mt-1">
                  <div className="text-sm">Share to X / Facebook</div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tables */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="xl:col-span-2 bg-slate-900/60 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Articles</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2 text-gray-500">
                  <Filter className="w-4 h-4" /> Filter
                </Button>
                <Button
                  onClick={() => router.push("/admin/news-management/articles")}
                  variant="secondary"
                >
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {articlesLoading ? (
                <p className="text-gray-400">Loading...</p>
              ) : (
                <div className="rounded-xl border border-slate-800 overflow-hidden md:overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Author
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Category
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Created
                        </TableHead>
                        <TableHead className="text-right">Views</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentArticles.map((a) => (
                        <TableRow key={a.id} className="hover:bg-slate-800/40">
                          <TableCell className="font-medium truncate max-w-[220px]">
                            {a.title}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {a.author}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <Badge variant="secondary" className="rounded-full">
                              {a.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`rounded-full ${
                                a.status === "Published"
                                  ? "bg-emerald-600"
                                  : a.status === "Draft"
                                  ? "bg-slate-600"
                                  : "bg-blue-600"
                              }`}
                            >
                              {a.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-slate-400">
                            {a.createdAt}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {a.views.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Moderation Queue</CardTitle>
              <Button variant="ghost" size="icon">
                <Flag className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {moderationQueue.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-start justify-between rounded-xl border border-slate-800 p-3"
                  >
                    {/* Left side */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm flex-wrap">
                        <Badge variant="outline" className="rounded-full">
                          {m.type}
                        </Badge>
                        <span className="text-slate-300 truncate">
                          {m.reason}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        by {m.by} · {m.on}
                      </div>
                    </div>

                    {/* Action buttons (icons only) */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="outline" size="icon" title="Resolve">
                        <CheckCircle2 className="w-4 h-4" color="gray" />
                      </Button>
                      <Button variant="destructive" size="icon" title="Remove">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Scheduling / Draft composer */}
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto">
            <TabsTrigger
              value="schedule"
              className="data-[state=active]:bg-slate-800"
            >
              Schedule
            </TabsTrigger>
            <TabsTrigger
              value="quick-draft"
              className="data-[state=active]:bg-slate-800"
            >
              Quick Draft
            </TabsTrigger>
          </TabsList>
          <TabsContent value="schedule" className="mt-4">
            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader>
                <CardTitle>Schedule an Article</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 grid gap-3">
                  <Input
                    placeholder="Headline"
                    className="bg-slate-800/60 border-slate-700"
                  />
                  <Textarea
                    placeholder="Short description"
                    className="min-h-[120px] bg-slate-800/60 border-slate-700"
                  />
                </div>
                <div className="grid gap-3">
                  <Label>Publish date/time</Label>
                  <Input
                    type="datetime-local"
                    className="bg-slate-800/60 border-slate-700"
                  />
                  <Label>Category</Label>
                  <Input
                    placeholder="e.g. Politics"
                    className="bg-slate-800/60 border-slate-700"
                  />
                  <Button className="mt-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="quick-draft" className="mt-4">
            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader>
                <CardTitle>Quick Draft</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Input
                  placeholder="Title"
                  className="bg-slate-800/60 border-slate-700"
                />
                <Textarea
                  placeholder="What’s the story?"
                  className="min-h-[160px] bg-slate-800/60 border-slate-700"
                />
                <div className="flex items-center gap-2">
                  <Button>
                    <SaveIcon className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button variant="secondary">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Media
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent
          className="w-full max-w-[95vw] md:max-w-4xl lg:max-w-6xl h-[90vh] md:h-auto md:max-h-[85vh] overflow-y-auto hide-scrollbar bg-slate-950 border border-slate-800 rounded-xl p-5 md:p-8 shadow-lg flex flex-col gap-4
    "
        >
          <DialogHeader className="flex flex-col gap-2 sticky top-0 bg-slate-950 z-10">
            <DialogTitle className="text-xl md:text-2xl font-bold text-white">
              Create a News Article
            </DialogTitle>
            <DialogDescription className="text-sm md:text-base text-gray-400">
              Fill the form below and submit to publish or save as draft.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 mt-4">
            <CreateNewsForm />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Small inline icon to avoid another import
function SaveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l3 3v13a2 2 0 0 1-2 2Z" />
      <path d="M7 3v8h10" />
    </svg>
  );
}
