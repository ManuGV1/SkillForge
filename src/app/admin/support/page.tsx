"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  LifeBuoy,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  User,
  Mail,
  Calendar,
  ChevronDown,
  ShieldAlert,
  Loader2,
  ArrowLeft,
  MessageSquare,
  Sparkles,
} from "lucide-react";

interface SupportRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
}

export default function AdminSupportPage() {
  const { data: session, status: authStatus } = useSession();

  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);

  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  const fetchSupportRequests = useCallback(async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) {
      setLoading(true);
    }
    setError(null);
    try {
      const res = await fetch("/api/admin/support");
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load support requests.");
      }

      setRequests(data.data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    let isMounted = true;

    fetch("/api/admin/support")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success) {
          setRequests(data.data || []);
        } else {
          setError(data.error || "Failed to load support requests.");
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      });

    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/support/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update status.");
      }

      setRequests((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus as SupportRequest["status"] } : item
        )
      );

      if (selectedRequest?.id === id) {
        setSelectedRequest((prev) =>
          prev ? { ...prev, status: newStatus as SupportRequest["status"] } : null
        );
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (authStatus === "loading") {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
        <div className="bg-bg-surface border border-red-900/40 rounded-xl p-8 max-w-md w-full text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-950/50 border border-red-900/60 text-red-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-display font-bold text-text-main">
            Access Restricted
          </h1>
          <p className="text-xs text-text-dim leading-relaxed">
            You must be logged in as a Code404 Administrator (`ADMIN` or `SUPER_ADMIN`) to view the support portal dashboard.
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

  // Filtered requests
  const filteredRequests = requests.filter((item) => {
    const matchesFilter =
      statusFilter === "ALL" || item.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const counts = {
    total: requests.length,
    open: requests.filter((r) => r.status === "OPEN").length,
    inProgress: requests.filter((r) => r.status === "IN_PROGRESS").length,
    resolved: requests.filter((r) => r.status === "RESOLVED" || r.status === "CLOSED").length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-amber-950/60 border border-amber-800/80 text-amber-300">
            <AlertCircle className="w-3 h-3" />
            OPEN
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-blue-950/60 border border-blue-800/80 text-blue-300">
            <Clock className="w-3 h-3" />
            IN PROGRESS
          </span>
        );
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-950/60 border border-emerald-800/80 text-emerald-300">
            <CheckCircle2 className="w-3 h-3" />
            RESOLVED
          </span>
        );
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-gray-900 border border-gray-700 text-gray-400">
            <XCircle className="w-3 h-3" />
            CLOSED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg-base py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-sharp pb-6">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-text-sub hover:text-primary transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-text-main tracking-tight flex items-center gap-2">
                  Code404 Admin Support Portal
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                    ADMIN VIEW
                  </span>
                </h1>
                <p className="text-xs text-text-dim mt-0.5">
                  Target Notification Inbox: <strong className="text-text-main font-mono">support.code404@gmail.com</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchSupportRequests()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-bg-surface border border-border-sharp text-text-main rounded-sm text-xs font-semibold hover:border-primary transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh Tickets
            </button>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-bg-surface border border-border-sharp rounded-lg p-5">
            <div className="text-xs font-mono uppercase text-text-sub">Total Tickets</div>
            <div className="text-2xl font-display font-bold text-text-main mt-1">{counts.total}</div>
          </div>

          <div className="bg-bg-surface border border-amber-900/40 rounded-lg p-5">
            <div className="text-xs font-mono uppercase text-amber-400">Open Tickets</div>
            <div className="text-2xl font-display font-bold text-amber-300 mt-1">{counts.open}</div>
          </div>

          <div className="bg-bg-surface border border-blue-900/40 rounded-lg p-5">
            <div className="text-xs font-mono uppercase text-blue-400">In Progress</div>
            <div className="text-2xl font-display font-bold text-blue-300 mt-1">{counts.inProgress}</div>
          </div>

          <div className="bg-bg-surface border border-emerald-900/40 rounded-lg p-5">
            <div className="text-xs font-mono uppercase text-emerald-400">Resolved / Closed</div>
            <div className="text-2xl font-display font-bold text-emerald-300 mt-1">{counts.resolved}</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-bg-surface border border-border-sharp rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-text-sub" />
            <input
              type="text"
              placeholder="Search by name, email, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-bg-base border border-border-sharp rounded-sm text-xs text-text-main focus:outline-none focus:border-primary placeholder-text-sub"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-3.5 h-3.5 text-text-sub mr-1 shrink-0" />
            {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-sm font-mono text-[11px] uppercase tracking-wider transition-colors shrink-0 cursor-pointer ${
                  statusFilter === st
                    ? "bg-primary text-bg-base font-semibold"
                    : "bg-bg-base border border-border-sharp/60 text-text-dim hover:text-text-main"
                }`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Ticket List Table / Cards */}
        {loading ? (
          <div className="bg-bg-surface border border-border-sharp rounded-xl p-12 text-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
            <p className="text-sm font-sans text-text-dim">Loading support tickets from database...</p>
          </div>
        ) : error ? (
          <div className="bg-bg-surface border border-red-900/60 rounded-xl p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
            <p className="text-sm text-red-300">{error}</p>
            <button
              onClick={() => fetchSupportRequests(true)}
              className="px-4 py-2 rounded-sm bg-primary text-bg-base text-xs font-semibold uppercase tracking-wider"
            >
              Retry
            </button>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-bg-surface border border-border-sharp rounded-xl p-12 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-text-sub mx-auto" />
            <h3 className="text-base font-display font-semibold text-text-main">
              No Support Tickets Found
            </h3>
            <p className="text-xs text-text-dim">
              {searchQuery || statusFilter !== "ALL"
                ? "No support requests match your current search or filter criteria."
                : "No support requests have been submitted yet."}
            </p>
          </div>
        ) : (
          <div className="bg-bg-surface border border-border-sharp rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="bg-bg-base/80 border-b border-border-sharp text-text-sub font-mono uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Submitter</th>
                    <th className="py-3.5 px-4">Subject</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-sharp/40 text-text-main">
                  {filteredRequests.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-bg-base/40 transition-colors"
                    >
                      {/* Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-text-dim">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-text-sub" />
                          <span>
                            {new Date(item.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="text-text-sub font-mono text-[10px]">
                            {new Date(item.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Submitter */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-text-main">{item.name}</div>
                        <div className="flex items-center gap-1 text-[11px] text-text-sub mt-0.5">
                          <Mail className="w-3 h-3" />
                          <a href={`mailto:${item.email}`} className="hover:text-primary">
                            {item.email}
                          </a>
                        </div>
                        {item.userId && (
                          <span className="inline-block mt-1 font-mono text-[9px] uppercase px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
                            Registered User
                          </span>
                        )}
                      </td>

                      {/* Subject */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="font-medium text-text-main truncate">{item.subject}</div>
                        <div className="text-text-dim text-[11px] truncate mt-0.5 max-w-sm">
                          {item.message}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 whitespace-nowrap text-right space-x-2">
                        {/* View Details Modal Trigger */}
                        <button
                          onClick={() => setSelectedRequest(item)}
                          className="px-2.5 py-1.5 rounded-sm border border-border-sharp text-text-dim hover:text-text-main hover:border-primary text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          View Details
                        </button>

                        {/* Status Change Selector */}
                        <div className="inline-block relative">
                          <select
                            disabled={updatingId === item.id}
                            value={item.status}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            className="appearance-none pl-2.5 pr-6 py-1 rounded-sm bg-bg-base border border-border-sharp text-xs text-text-main focus:outline-none focus:border-primary cursor-pointer disabled:opacity-50"
                          >
                            <option value="OPEN">Mark OPEN</option>
                            <option value="IN_PROGRESS">Mark IN PROGRESS</option>
                            <option value="RESOLVED">Mark RESOLVED</option>
                            <option value="CLOSED">Mark CLOSED</option>
                          </select>
                          <ChevronDown className="w-3 h-3 text-text-sub absolute right-1.5 top-2 pointer-events-none" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ticket Details Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="bg-bg-surface border border-border-sharp rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-border-sharp pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-text-sub uppercase">
                      Ticket ID: {selectedRequest.id}
                    </span>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                  <h2 className="text-xl font-display font-bold text-text-main">
                    {selectedRequest.subject}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-1 rounded-sm border border-border-sharp text-text-sub hover:text-text-main hover:bg-bg-base transition-colors cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Submitter Details */}
              <div className="bg-bg-base border border-border-sharp/60 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-text-sub font-mono uppercase text-[10px] block mb-0.5">
                    Submitter Name
                  </span>
                  <div className="font-semibold text-text-main flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-primary" />
                    {selectedRequest.name}
                  </div>
                </div>

                <div>
                  <span className="text-text-sub font-mono uppercase text-[10px] block mb-0.5">
                    Email Address
                  </span>
                  <div className="font-semibold text-text-main flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    <a href={`mailto:${selectedRequest.email}`} className="text-primary hover:underline">
                      {selectedRequest.email}
                    </a>
                  </div>
                </div>

                <div>
                  <span className="text-text-sub font-mono uppercase text-[10px] block mb-0.5">
                    Submitted Date & Time
                  </span>
                  <div className="text-text-main flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-text-sub" />
                    {new Date(selectedRequest.createdAt).toLocaleString()}
                  </div>
                </div>

                <div>
                  <span className="text-text-sub font-mono uppercase text-[10px] block mb-0.5">
                    User Account Status
                  </span>
                  <div className="text-text-main">
                    {selectedRequest.userId ? (
                      <span className="text-emerald-400 font-medium">Registered User (ID: {selectedRequest.userId.slice(0, 8)})</span>
                    ) : (
                      <span className="text-text-dim">Guest Submitter</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-text-sub flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-primary" />
                  Message Content
                </h3>
                <div className="bg-bg-base border border-border-sharp p-4 rounded-lg font-sans text-sm text-text-main leading-relaxed whitespace-pre-wrap">
                  {selectedRequest.message}
                </div>
              </div>

              {/* Status Update Action Footer */}
              <div className="border-t border-border-sharp pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-text-sub font-mono">Update Status:</span>
                  <select
                    disabled={updatingId === selectedRequest.id}
                    value={selectedRequest.status}
                    onChange={(e) => handleStatusChange(selectedRequest.id, e.target.value)}
                    className="px-3 py-1.5 rounded-sm bg-bg-base border border-border-sharp text-xs text-text-main focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <a
                    href={`mailto:${selectedRequest.email}?subject=Re: [Code404 Support #${selectedRequest.id.slice(0, 8)}] ${selectedRequest.subject}`}
                    className="w-full sm:w-auto px-4 py-2 rounded-sm bg-primary text-bg-base font-sans text-xs font-semibold uppercase tracking-wider hover:bg-primary-dim transition-colors text-center inline-flex items-center justify-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Reply via Email
                  </a>

                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="w-full sm:w-auto px-4 py-2 rounded-sm border border-border-sharp text-text-dim hover:text-text-main font-sans text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
