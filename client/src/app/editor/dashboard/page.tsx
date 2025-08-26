"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import { motion } from "framer-motion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Flag,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Video,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  useEditorDashboardStats,
  useEditorRecentArticles,
} from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateNewsForm from "@/components/forms/CreateNews";
import LiveEventsModal from "@/components/modals/liveEvent";
import UploadMediaModal from "@/components/modals/uploadMedia";

const page = () => {
  const router = useRouter();
  const [openCreate, setOpenCreate] = useState(false);
  const [openLive, setOpenLive] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const { data: recentArticles = [], isLoading: articlesLoading } =
    useEditorRecentArticles();

  const { data, isLoading, isError } = useEditorDashboardStats();

  const stats = data?.stats ?? {
    totalArticles: 0,
    drafts: 0,
    liveEvents: 0,
    reported: 0,
    monthTrend: [],
  };

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
      <main className="space-y-6">
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
                onClick={() => setOpenLive(true)}
              >
                Start Live Event
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setOpenUpload(true)}
              >
                Upload Media
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Tables */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="xl:col-span-2 bg-slate-900/60 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Articles</CardTitle>
              <div className="flex items-center gap-2">
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
        </section>
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
      <LiveEventsModal open={openLive} setOpen={setOpenLive} />
      <UploadMediaModal open={openUpload} setOpen={setOpenUpload} />
    </>
  );
};

export default page;
