"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Activity,
  Users,
  UserCheck,
  UserX,
  Globe,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Bot,
  ShieldAlert,
  Loader2,
  ArrowLeft,
  RefreshCw,
  TrendingUp,
  BarChart3,
  Flame,
  Sparkles,
} from "lucide-react";

interface VisitRecord {
  id: string;
  visitorId: string;
  path: string;
  referrer: string | null;
  deviceType: string | null;
  browser: string | null;
  os: string | null;
  userId: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
}

interface AnalyticsData {
  summary: {
    totalVisits: number;
    uniqueVisitors: number;
    memberVisits: number;
    anonymousVisits: number;
    todayVisits: number;
    weekVisits: number;
    monthVisits: number;
  };
  timeline: Array<{
    date: string;
    label: string;
    total: number;
    members: number;
    anonymous: number;
  }>;
  topPages: Array<{
    path: string;
    count: number;
  }>;
  deviceStats: Array<{
    name: string;
    count: number;
  }>;
  browserStats: Array<{
    name: string;
    count: number;
  }>;
  osStats: Array<{
    name: string;
    count: number;
  }>;
  recentVisits: VisitRecord[];
}

export default function AdminAnalyticsPage() {
  const { data: session, status: authStatus } = useSession();

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [range, setRange] = useState<"today" | "7d" | "30d" | "all">("30d");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (!isAdmin) return;

    let isMounted = true;

    fetch(`/api/admin/analytics?range=${range}`)
      .then((res) => res.json())
      .then((json) => {
        if (!isMounted) return;
        if (json.success) {
          setData(json.data);
          setError(null);
        } else {
          setError(json.error || "Failed to load analytics data.");
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(msg);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
          setRefreshing(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isAdmin, range]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetch(`/api/admin/analytics?range=${range}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json.data);
          setError(null);
        } else {
          setError(json.error || "Failed to load analytics data.");
        }
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(msg);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  if (authStatus === "loading" || (loading && !data)) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
          <p className="text-xs font-mono text-text-dim uppercase tracking-wider">
            Loading Visitor Analytics...
          </p>
        </div>
      </div>
    );
  }

  // Access Control Guard
  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
        <div className="bg-bg-surface border border-red-900/40 rounded-xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-red-950/50 border border-red-900/60 text-red-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-display font-bold text-text-main">
            Access Restricted
          </h1>
          <p className="text-xs text-text-dim leading-relaxed">
            You must be signed in with an authorized Administrator account (`ADMIN` or `SUPER_ADMIN`) to view platform analytics.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-sm bg-primary text-bg-base font-sans text-xs font-semibold uppercase tracking-wider hover:bg-primary-dim transition-colors"
            >
              Sign In as Admin
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-sm border border-border-sharp text-text-dim font-sans text-xs font-semibold uppercase tracking-wider hover:text-text-main transition-colors"
            >
              Home Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const summary = data?.summary || {
    totalVisits: 0,
    uniqueVisitors: 0,
    memberVisits: 0,
    anonymousVisits: 0,
    todayVisits: 0,
    weekVisits: 0,
    monthVisits: 0,
  };

  const memberPercentage =
    summary.totalVisits > 0
      ? Math.round((summary.memberVisits / summary.totalVisits) * 100)
      : 0;

  const anonymousPercentage =
    summary.totalVisits > 0
      ? Math.round((summary.anonymousVisits / summary.totalVisits) * 100)
      : 0;

  const maxTimelineTotal = Math.max(
    ...(data?.timeline.map((t) => t.total) || [1]),
    1
  );

  return (
    <div className="min-h-screen bg-bg-base py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-text-dim">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
            <span>/</span>
            <span className="text-text-main font-semibold">Visitor Analytics</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-sharp pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-primary">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-display font-bold text-text-main tracking-tight flex items-center gap-2.5">
                    SkillForge Analytics
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
                      LIVE METRICS
                    </span>
                  </h1>
                  <p className="text-xs text-text-dim">
                    Privacy-first visitor traffic, session distributions, and member engagement statistics.
                  </p>
                </div>
              </div>
            </div>

            {/* Time Filter Tabs & Refresh */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex p-1 rounded-lg bg-bg-surface border border-border-sharp">
                {(
                  [
                    { id: "today", label: "Today" },
                    { id: "7d", label: "7 Days" },
                    { id: "30d", label: "30 Days" },
                    { id: "all", label: "All Time" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setRange(tab.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
                      range === tab.id
                        ? "bg-primary text-bg-base font-semibold shadow-sm"
                        : "text-text-dim hover:text-text-main hover:bg-bg-elevated"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-bg-surface border border-border-sharp text-xs font-mono text-text-dim hover:text-text-main hover:border-primary/50 transition-colors cursor-pointer disabled:opacity-50"
                title="Refresh Analytics Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-primary" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-900/60 text-red-300 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={handleRefresh}
              className="font-mono underline text-red-200 hover:text-white"
            >
              Retry
            </button>
          </div>
        )}

        {/* 1. Primary Metrics Cards (4 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Visits */}
          <div className="bg-bg-surface border border-border-sharp rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between text-text-sub">
              <span className="text-xs font-mono uppercase tracking-wider">Total Visits</span>
              <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-display font-bold text-text-main">
                {summary.totalVisits.toLocaleString()}
              </div>
              <p className="text-[11px] text-text-dim mt-1 flex items-center gap-1">
                <Globe className="w-3 h-3 text-text-sub" />
                Aggregated page views
              </p>
            </div>
          </div>

          {/* Unique Visitors */}
          <div className="bg-bg-surface border border-border-sharp rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between text-text-sub">
              <span className="text-xs font-mono uppercase tracking-wider">Unique Visitors</span>
              <div className="p-2 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/60">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-display font-bold text-text-main">
                {summary.uniqueVisitors.toLocaleString()}
              </div>
              <p className="text-[11px] text-text-dim mt-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-400" />
                Privacy-safe distinct visitors
              </p>
            </div>
          </div>

          {/* Member Visits */}
          <div className="bg-bg-surface border border-border-sharp rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between text-text-sub">
              <span className="text-xs font-mono uppercase tracking-wider">Member Visits</span>
              <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-display font-bold text-emerald-400">
                {summary.memberVisits.toLocaleString()}
              </div>
              <p className="text-[11px] text-text-dim mt-1 flex items-center gap-1">
                <span className="font-mono text-emerald-400 font-semibold">{memberPercentage}%</span> of total traffic
              </p>
            </div>
          </div>

          {/* Anonymous Visits */}
          <div className="bg-bg-surface border border-border-sharp rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between text-text-sub">
              <span className="text-xs font-mono uppercase tracking-wider">Anonymous Visits</span>
              <div className="p-2 rounded-lg bg-purple-950/60 text-purple-400 border border-purple-800/60">
                <UserX className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-display font-bold text-text-main">
                {summary.anonymousVisits.toLocaleString()}
              </div>
              <p className="text-[11px] text-text-dim mt-1 flex items-center gap-1">
                <span className="font-mono text-purple-400 font-semibold">{anonymousPercentage}%</span> of total traffic
              </p>
            </div>
          </div>
        </div>

        {/* 2. Quick Period Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-bg-surface/80 border border-border-sharp rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-text-sub uppercase">Today</span>
              <div className="text-xl font-display font-bold text-text-main mt-0.5">
                {summary.todayVisits.toLocaleString()}
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono font-semibold">
              Today
            </span>
          </div>

          <div className="bg-bg-surface/80 border border-border-sharp rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-text-sub uppercase">This Week (7d)</span>
              <div className="text-xl font-display font-bold text-text-main mt-0.5">
                {summary.weekVisits.toLocaleString()}
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-400 text-[10px] font-mono font-semibold">
              7 Days
            </span>
          </div>

          <div className="bg-bg-surface/80 border border-border-sharp rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-text-sub uppercase">This Month (30d)</span>
              <div className="text-xl font-display font-bold text-text-main mt-0.5">
                {summary.monthVisits.toLocaleString()}
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[10px] font-mono font-semibold">
              30 Days
            </span>
          </div>
        </div>

        {/* 3. Visits Over Time Chart */}
        <div className="bg-bg-surface border border-border-sharp rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-display font-bold text-text-main flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Visits Over Time
              </h2>
              <p className="text-xs text-text-dim mt-0.5">
                Daily traffic volume breakdown across members and anonymous visitors.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" />
                <span className="text-text-dim">Members</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-border-sharp inline-block" />
                <span className="text-text-dim">Anonymous</span>
              </div>
            </div>
          </div>

          {/* Visual Chart Bars */}
          {data?.timeline && data.timeline.length > 0 ? (
            <div className="space-y-2">
              <div className="h-48 w-full flex items-end gap-1.5 sm:gap-2 pt-6 pb-2 border-b border-border-sharp overflow-x-auto">
                {data.timeline.map((item, idx) => {
                  const heightPercent = Math.max(
                    Math.round((item.total / maxTimelineTotal) * 100),
                    item.total > 0 ? 8 : 2
                  );
                  const memberRatio = item.total > 0 ? (item.members / item.total) * 100 : 0;
                  const anonRatio = item.total > 0 ? (item.anonymous / item.total) * 100 : 0;

                  return (
                    <div
                      key={item.date || idx}
                      className="flex-1 min-w-[20px] max-w-[48px] h-full flex flex-col justify-end items-center group relative cursor-pointer"
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 bg-bg-elevated border border-border-sharp px-2.5 py-1.5 rounded shadow-xl text-center whitespace-nowrap">
                        <div className="text-[10px] font-mono text-text-dim">{item.label}</div>
                        <div className="text-xs font-mono font-bold text-text-main">
                          {item.total} visits
                        </div>
                        <div className="text-[9px] font-mono text-emerald-400">
                          {item.members} members / {item.anonymous} anon
                        </div>
                      </div>

                      {/* Stacked Bar */}
                      <div
                        className="w-full rounded-t-sm flex flex-col overflow-hidden transition-all group-hover:brightness-125"
                        style={{ height: `${heightPercent}%` }}
                      >
                        {item.total === 0 ? (
                          <div className="w-full h-full bg-border-sharp/40 rounded-t-sm" />
                        ) : (
                          <>
                            {item.members > 0 && (
                              <div
                                className="w-full bg-primary"
                                style={{ height: `${memberRatio}%` }}
                              />
                            )}
                            {item.anonymous > 0 && (
                              <div
                                className="w-full bg-zinc-700"
                                style={{ height: `${anonRatio}%` }}
                              />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X Axis Labels */}
              <div className="flex items-center justify-between text-[10px] font-mono text-text-sub px-1 pt-1">
                <span>{data.timeline[0]?.label || "Start"}</span>
                <span className="hidden sm:inline">
                  {data.timeline[Math.floor(data.timeline.length / 2)]?.label || ""}
                </span>
                <span>{data.timeline[data.timeline.length - 1]?.label || "Today"}</span>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs font-mono text-text-sub">
              No visit activity recorded for this period yet.
            </div>
          )}
        </div>

        {/* 4. Two Column Layout: Top Pages & Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Top Visited Pages (7 columns) */}
          <div className="lg:col-span-7 bg-bg-surface border border-border-sharp rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-display font-bold text-text-main flex items-center gap-2">
                  <Flame className="w-4 h-4 text-primary" />
                  Most Visited Pages
                </h2>
                <p className="text-xs text-text-dim mt-0.5">
                  Popular routes and destinations across the platform.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              {data?.topPages && data.topPages.length > 0 ? (
                data.topPages.map((page, idx) => {
                  const percentage =
                    summary.totalVisits > 0
                      ? Math.round((page.count / summary.totalVisits) * 100)
                      : 0;

                  return (
                    <div
                      key={page.path || idx}
                      className="bg-bg-base/60 border border-border-sharp/80 rounded-lg p-3 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="text-[10px] font-mono text-text-sub w-4">
                            #{idx + 1}
                          </span>
                          <span className="font-mono text-text-main font-semibold truncate">
                            {page.path}
                          </span>
                        </div>
                        <div className="font-mono text-xs text-text-dim shrink-0">
                          <strong className="text-text-main">{page.count.toLocaleString()}</strong> visits
                          <span className="text-text-sub ml-1.5">({percentage}%)</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${Math.max(percentage, 3)}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs font-mono text-text-sub">
                  No page visit data recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Device & Client Demographics (5 columns) */}
          <div className="lg:col-span-5 bg-bg-surface border border-border-sharp rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-display font-bold text-text-main flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Visitor Demographics
              </h2>
              <p className="text-xs text-text-dim mt-0.5">
                Aggregated device and browser families (no intrusive tracking).
              </p>
            </div>

            {/* Devices */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono text-text-sub uppercase tracking-wider">
                Device Types
              </span>
              <div className="grid grid-cols-2 gap-2">
                {data?.deviceStats && data.deviceStats.length > 0 ? (
                  data.deviceStats.map((d) => (
                    <div
                      key={d.name}
                      className="bg-bg-base/60 border border-border-sharp/80 rounded-lg p-3 flex items-center gap-2.5"
                    >
                      <div className="p-1.5 rounded bg-bg-elevated text-primary">
                        {d.name.toLowerCase() === "mobile" ? (
                          <Smartphone className="w-4 h-4" />
                        ) : d.name.toLowerCase() === "tablet" ? (
                          <Tablet className="w-4 h-4" />
                        ) : d.name.toLowerCase() === "bot" ? (
                          <Bot className="w-4 h-4" />
                        ) : (
                          <Monitor className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-text-main capitalize">
                          {d.name}
                        </div>
                        <div className="text-[10px] font-mono text-text-sub">
                          {d.count} visits
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-xs font-mono text-text-sub py-2">
                    No device data
                  </div>
                )}
              </div>
            </div>

            {/* Browsers & OS */}
            <div className="space-y-3 pt-2 border-t border-border-sharp/60">
              <span className="text-[11px] font-mono text-text-sub uppercase tracking-wider">
                Top Browsers & Systems
              </span>
              <div className="space-y-2">
                {data?.browserStats && data.browserStats.slice(0, 4).map((b) => (
                  <div
                    key={b.name}
                    className="flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-text-dim">{b.name}</span>
                    <span className="text-text-main font-semibold">{b.count} visits</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5. Recent Visit Activity Stream */}
        <div className="bg-bg-surface border border-border-sharp rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-display font-bold text-text-main flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Recent Visit Activity
              </h2>
              <p className="text-xs text-text-dim mt-0.5">
                Real-time chronological log of recent visitor interactions.
              </p>
            </div>
            <span className="text-xs font-mono text-text-sub">
              Showing latest {data?.recentVisits?.length || 0} visits
            </span>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border-sharp text-text-sub">
                  <th className="pb-3 font-medium">Visitor / Member</th>
                  <th className="pb-3 font-medium">Page Visited</th>
                  <th className="pb-3 font-medium hidden sm:table-cell">Client Info</th>
                  <th className="pb-3 font-medium text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-sharp/40">
                {data?.recentVisits && data.recentVisits.length > 0 ? (
                  data.recentVisits.map((v) => {
                    const isMember = !!v.user;
                    const dateObj = new Date(v.createdAt);
                    const formattedTime = dateObj.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    });
                    const formattedDate = dateObj.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });

                    return (
                      <tr key={v.id} className="hover:bg-bg-elevated/40 transition-colors">
                        <td className="py-3 pr-4">
                          {isMember ? (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                              <div className="truncate max-w-[160px] sm:max-w-[200px]">
                                <div className="text-text-main font-semibold truncate">
                                  {v.user?.name || "Member"}
                                </div>
                                <div className="text-[10px] text-text-sub truncate">
                                  {v.user?.email}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-zinc-600 shrink-0" />
                              <div className="text-text-dim">
                                <span>Anonymous Visitor</span>
                                <div className="text-[9px] text-text-sub truncate font-mono">
                                  {v.visitorId.slice(0, 12)}...
                                </div>
                              </div>
                            </div>
                          )}
                        </td>

                        <td className="py-3 pr-4">
                          <span className="px-2 py-0.5 rounded bg-bg-base border border-border-sharp text-text-main">
                            {v.path}
                          </span>
                        </td>

                        <td className="py-3 pr-4 hidden sm:table-cell text-text-dim">
                          <span className="text-[11px]">
                            {v.deviceType || "Desktop"} • {v.browser || "Browser"} • {v.os || "OS"}
                          </span>
                        </td>

                        <td className="py-3 text-right text-text-sub whitespace-nowrap">
                          <div>{formattedTime}</div>
                          <div className="text-[10px] text-zinc-500">{formattedDate}</div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-text-sub">
                      No visits recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
