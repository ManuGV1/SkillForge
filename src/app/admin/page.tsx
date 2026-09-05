"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  LifeBuoy,
  Users,
  ArrowRight,
  Loader2,
  Lock,
  Activity,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { data: session, status: authStatus } = useSession();

  const [stats, setStats] = useState({
    totalSupportTickets: 0,
    openSupportTickets: 0,
    totalUsers: 0,
    adminCount: 0,
    totalVisits: 0,
    todayVisits: 0,
  });

  const [loading, setLoading] = useState(false);

  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (!isAdmin) return;

    let isMounted = true;

    Promise.all([
      fetch("/api/admin/support").then((res) => res.json()).catch(() => ({})),
      fetch("/api/admin/users").then((res) => res.json()).catch(() => ({})),
      fetch("/api/admin/analytics?range=30d").then((res) => res.json()).catch(() => ({})),
    ])
      .then(([supportRes, usersRes, analyticsRes]) => {
        if (!isMounted) return;

        const tickets = supportRes.success ? supportRes.data || [] : [];
        const users = usersRes.success ? usersRes.data?.users || [] : [];
        const analyticsSummary = analyticsRes.success ? analyticsRes.data?.summary : null;

        setStats({
          totalSupportTickets: tickets.length,
          openSupportTickets: tickets.filter((t: { status: string }) => t.status === "OPEN").length,
          totalUsers: users.length,
          adminCount: users.filter(
            (u: { role?: { name?: string } }) =>
              u.role?.name === "ADMIN" || u.role?.name === "SUPER_ADMIN"
          ).length,
          totalVisits: analyticsSummary?.totalVisits || 0,
          todayVisits: analyticsSummary?.todayVisits || 0,
        });
      })
      .catch((err) => {
        console.error("Error loading admin stats:", err);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  if (authStatus === "loading" || loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

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
            You must be logged in as an authorized Code404 Administrator (`ADMIN` or `SUPER_ADMIN`) to access the admin portal.
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

  return (
    <div className="min-h-screen bg-bg-base py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-border-sharp pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-text-main tracking-tight flex items-center gap-2">
                Code404 Admin System
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                  {session.user.role}
                </span>
              </h1>
              <p className="text-xs text-text-dim mt-0.5">
                Authenticated Operator: <strong className="text-text-main font-mono">{session.user.email}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Visitor Analytics Card */}
          <div className="bg-bg-surface border border-border-sharp rounded-xl p-6 hover:border-primary/50 transition-all shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="p-2.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-primary">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-full">
                  {stats.todayVisits} Today
                </span>
              </div>

              <div>
                <h2 className="text-lg font-display font-bold text-text-main">
                  Visitor Analytics
                </h2>
                <p className="text-xs text-text-dim mt-1 leading-relaxed">
                  Real-time privacy-conscious traffic telemetry, unique visitor tracking, member vs anonymous activity, and page view metrics.
                </p>
              </div>

              <div className="pt-2 text-xs font-mono text-text-sub flex items-center gap-4 border-t border-border-sharp/40">
                <span>Total 30d Visits: <strong className="text-text-main">{stats.totalVisits}</strong></span>
              </div>
            </div>

            <Link
              href="/admin/analytics"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-sm bg-primary text-bg-base font-sans text-xs font-semibold uppercase tracking-wider hover:bg-primary-dim transition-colors"
            >
              Open Analytics
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Support Portal Card */}
          <div className="bg-bg-surface border border-border-sharp rounded-xl p-6 hover:border-primary/50 transition-all shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="p-2.5 rounded-lg bg-blue-950/60 border border-blue-800/60 text-blue-400">
                  <LifeBuoy className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-full">
                  {stats.openSupportTickets} Open Requests
                </span>
              </div>

              <div>
                <h2 className="text-lg font-display font-bold text-text-main">
                  Contact Support Requests
                </h2>
                <p className="text-xs text-text-dim mt-1 leading-relaxed">
                  View every support request submitted to <strong className="text-text-main">support.code404@gmail.com</strong>, inspect message details, and update status (OPEN, IN_PROGRESS, RESOLVED, CLOSED).
                </p>
              </div>

              <div className="pt-2 text-xs font-mono text-text-sub flex items-center gap-4 border-t border-border-sharp/40">
                <span>Total Tickets: <strong className="text-text-main">{stats.totalSupportTickets}</strong></span>
              </div>
            </div>

            <Link
              href="/admin/support"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-sm bg-bg-base border border-border-sharp text-text-main hover:border-primary font-sans text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Open Support Dashboard
              <ArrowRight className="w-4 h-4 text-primary" />
            </Link>
          </div>

          {/* User & Admin Management Card */}
          <div className="bg-bg-surface border border-border-sharp rounded-xl p-6 hover:border-primary/50 transition-all shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
                  <Users className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full">
                  {stats.adminCount} Administrators
                </span>
              </div>

              <div>
                <h2 className="text-lg font-display font-bold text-text-main">
                  Admin Account Management
                </h2>
                <p className="text-xs text-text-dim mt-1 leading-relaxed">
                  Manage platform roles and bootstrap secure ADMIN accounts with bcrypt hashing. SUPER_ADMIN accounts can create admins.
                </p>
              </div>

              <div className="pt-2 text-xs font-mono text-text-sub flex items-center gap-4 border-t border-border-sharp/40">
                <span>Platform Users: <strong className="text-text-main">{stats.totalUsers}</strong></span>
              </div>
            </div>

            <Link
              href="/admin/users"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-sm bg-bg-base border border-border-sharp text-text-main hover:border-primary font-sans text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Manage Admin Accounts
              <ArrowRight className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>

        {/* Security Overview Card */}
        <div className="bg-bg-surface/60 border border-border-sharp/80 rounded-xl p-6 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-text-main flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            Server-Side Authorization & Enforcement Rules
          </h3>
          <ul className="text-xs text-text-dim space-y-1.5 list-disc list-inside">
            <li>All <code className="text-primary font-mono">/api/admin/*</code> endpoints enforce server-side role validation.</li>
            <li>Users cannot promote themselves during registration or profile updates.</li>
            <li>Standard <strong className="text-text-main">ADMIN</strong> accounts are strictly forbidden from creating or assigning <strong className="text-text-main">SUPER_ADMIN</strong> roles.</li>
            <li>Passwords are hashed using bcrypt with salt rounds before storing in PostgreSQL.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
