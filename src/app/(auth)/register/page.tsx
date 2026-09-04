"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Lock, Mail, User, ArrowRight, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-bg-base relative overflow-hidden">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
          <p className="font-sans text-sm text-text-dim">
            {status === "loading" ? "Verifying authentication..." : "Redirecting to dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side checks
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong during registration");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/login?email=${encodeURIComponent(email)}`);
        }, 2000);
      }
    } catch {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-bg-base relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.03),transparent_60%)] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 bg-bg-surface border border-border-sharp p-8 rounded-sm relative z-10">
        {/* Branding header */}
        <div className="text-center space-y-2">
          <span className="font-mono text-[9px] tracking-widest text-primary uppercase font-bold">
            Create Account
          </span>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-text-main uppercase">
            Join SkillForge
          </h2>
          <p className="font-sans text-xs text-text-dim">
            Start your journey from learning to getting hired.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3.5 bg-red-950/20 border border-red-950/60 rounded-sm text-red-400 text-xs font-sans">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2.5 p-3.5 bg-success/15 border border-success/40 rounded-sm text-success text-xs font-sans animate-fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Account created successfully! Redirecting to login...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-xs font-mono text-text-dim uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-4 w-4 text-text-sub" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Karan Sharma"
                  className="block w-full bg-bg-base border border-border-sharp px-3 py-2.5 pl-10 text-sm text-text-main rounded-sm focus:border-primary focus:outline-none placeholder:text-text-sub transition-colors duration-150 font-sans"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-mono text-text-dim uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-text-sub" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="karan@email.com"
                  className="block w-full bg-bg-base border border-border-sharp px-3 py-2.5 pl-10 text-sm text-text-main rounded-sm focus:border-primary focus:outline-none placeholder:text-text-sub transition-colors duration-150 font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-mono text-text-dim uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-text-sub" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full bg-bg-base border border-border-sharp px-3 py-2.5 pl-10 text-sm text-text-main rounded-sm focus:border-primary focus:outline-none placeholder:text-text-sub transition-colors duration-150 font-sans"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-xs font-mono text-text-dim uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-text-sub" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full bg-bg-base border border-border-sharp px-3 py-2.5 pl-10 text-sm text-text-main rounded-sm focus:border-primary focus:outline-none placeholder:text-text-sub transition-colors duration-150 font-sans"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full inline-flex items-center justify-center bg-primary hover:bg-primary-dim text-bg-base font-sans text-xs font-bold tracking-wide uppercase py-3.5 rounded-sm transition-colors duration-150 gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Register
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-border-sharp/40">
          <p className="font-sans text-xs text-text-sub">
            Already have an account?{" "}
            <a href="/login" className="font-semibold text-primary hover:text-primary-dim transition-colors">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
