"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  ArrowLeft,
  Loader2,
  Mail,
  Lock,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from "lucide-react";

interface UserItem {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  role: {
    id: string;
    name: string;
    description: string | null;
  } | null;
}

export default function AdminUsersPage() {
  const { data: session, status: authStatus } = useSession();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Admin Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    targetRole: "ADMIN" as "ADMIN" | "SUPER_ADMIN",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (!isAdmin) return;

    let isMounted = true;

    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success) {
          setUsers(data.data.users || []);
        } else {
          setError(data.error || "Failed to load user list.");
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
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

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters.";
    }
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      errs.email = "Please enter a valid email address.";
    }
    if (!formData.password || formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create administrator account.");
      }

      setSubmitSuccess(`Successfully created ${data.data.role} account for ${data.data.email}`);

      // Refresh list
      setUsers((prev) => [
        {
          id: data.data.id,
          name: data.data.name,
          email: data.data.email,
          createdAt: data.data.createdAt,
          role: {
            id: "",
            name: data.data.role,
            description: null,
          },
        },
        ...prev,
      ]);

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        targetRole: "ADMIN",
      });
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
            You must be logged in as an authorized Code404 Administrator (`ADMIN` or `SUPER_ADMIN`) to manage administrator accounts.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-sm bg-primary text-bg-base font-sans text-xs font-semibold uppercase tracking-wider hover:bg-primary-dim transition-colors"
            >
              Sign In as Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="border-b border-border-sharp pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-text-sub hover:text-primary transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Admin Portal
            </Link>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-text-main tracking-tight flex items-center gap-2">
                  Admin Account Management
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                    {session.user.role}
                  </span>
                </h1>
                <p className="text-xs text-text-dim mt-0.5">
                  Manage platform administrators and create new accounts securely with bcrypt password hashing.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Admin Form */}
          <div className="lg:col-span-1">
            <div className="bg-bg-surface border border-border-sharp rounded-xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2 border-b border-border-sharp pb-3">
                <UserPlus className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-display font-bold uppercase tracking-wider text-text-main">
                  Create Admin Account
                </h2>
              </div>

              {submitError && (
                <div className="p-3 rounded bg-red-950/40 border border-red-900/60 text-red-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              {submitSuccess && (
                <div className="p-3 rounded bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              <form onSubmit={handleCreateAdmin} className="space-y-4" noValidate>
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-[11px] font-mono uppercase tracking-wider text-text-main">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-3.5 h-3.5 absolute left-3 top-3 text-text-sub" />
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (formErrors.name) setFormErrors({ ...formErrors, name: "" });
                      }}
                      placeholder="e.g. Admin Operator"
                      className={`w-full pl-9 pr-3 py-2 bg-bg-base border ${
                        formErrors.name ? "border-red-500" : "border-border-sharp"
                      } rounded-sm text-xs text-text-main focus:outline-none focus:border-primary`}
                    />
                  </div>
                  {formErrors.name && <p className="text-[10px] text-red-400">{formErrors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-[11px] font-mono uppercase tracking-wider text-text-main">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-text-sub" />
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (formErrors.email) setFormErrors({ ...formErrors, email: "" });
                      }}
                      placeholder="e.g. admin@code404.dev"
                      className={`w-full pl-9 pr-3 py-2 bg-bg-base border ${
                        formErrors.email ? "border-red-500" : "border-border-sharp"
                      } rounded-sm text-xs text-text-main focus:outline-none focus:border-primary`}
                    />
                  </div>
                  {formErrors.email && <p className="text-[10px] text-red-400">{formErrors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-[11px] font-mono uppercase tracking-wider text-text-main">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-text-sub" />
                    <input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        if (formErrors.password) setFormErrors({ ...formErrors, password: "" });
                      }}
                      placeholder="Minimum 6 characters"
                      className={`w-full pl-9 pr-3 py-2 bg-bg-base border ${
                        formErrors.password ? "border-red-500" : "border-border-sharp"
                      } rounded-sm text-xs text-text-main focus:outline-none focus:border-primary`}
                    />
                  </div>
                  {formErrors.password && <p className="text-[10px] text-red-400">{formErrors.password}</p>}
                </div>

                {/* Role Selection */}
                <div className="space-y-1.5">
                  <label htmlFor="targetRole" className="block text-[11px] font-mono uppercase tracking-wider text-text-main">
                    Assigned Role
                  </label>
                  <select
                    id="targetRole"
                    value={formData.targetRole}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetRole: e.target.value as "ADMIN" | "SUPER_ADMIN",
                      })
                    }
                    className="w-full px-3 py-2 bg-bg-base border border-border-sharp rounded-sm text-xs text-text-main focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="ADMIN">ADMIN (Standard Admin)</option>
                    {isSuperAdmin && (
                      <option value="SUPER_ADMIN">SUPER_ADMIN (Root System Owner)</option>
                    )}
                  </select>
                  {!isSuperAdmin && (
                    <p className="text-[10px] text-text-sub font-mono">
                      Note: Only SUPER_ADMIN accounts can create SUPER_ADMIN accounts.
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-sm bg-primary text-bg-base font-sans text-xs font-semibold uppercase tracking-wider hover:bg-primary-dim transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-sm mt-4"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Create Admin Account
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* User & Admin List */}
          <div className="lg:col-span-2">
            <div className="bg-bg-surface border border-border-sharp rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border-sharp flex justify-between items-center bg-bg-base/40">
                <h2 className="text-sm font-display font-bold uppercase tracking-wider text-text-main flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Platform Users & Roles ({users.length})
                </h2>
              </div>

              {error && (
                <div className="p-3 bg-red-950/40 border-b border-red-900/60 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="bg-bg-base/80 border-b border-border-sharp text-text-sub font-mono uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Created Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-sharp/40 text-text-main">
                    {users.map((u) => {
                      const roleName = u.role?.name || "STUDENT";
                      const isSuper = roleName === "SUPER_ADMIN";
                      const isAdminRole = roleName === "ADMIN";

                      return (
                        <tr key={u.id} className="hover:bg-bg-base/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-text-main">{u.name || "Unnamed User"}</div>
                            <div className="text-text-sub font-mono text-[11px]">{u.email}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            {isSuper ? (
                              <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800 text-purple-300">
                                <ShieldCheck className="w-3 h-3" />
                                SUPER_ADMIN
                              </span>
                            ) : isAdminRole ? (
                              <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300">
                                <ShieldCheck className="w-3 h-3" />
                                ADMIN
                              </span>
                            ) : (
                              <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-bg-base border border-border-sharp text-text-dim">
                                {roleName}
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-text-dim whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-text-sub" />
                              {new Date(u.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
