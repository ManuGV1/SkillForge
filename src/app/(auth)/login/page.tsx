"use client";

import React, { useState, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const { status, update } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("error") ? "Authentication failed" : null
  );
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, callbackUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (res?.error) {
        setError("Invalid email or password combination");
        setLoading(false);
      } else {
        setIsSuccess(true);
        await update();
        window.location.href = callbackUrl;
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      await signIn("google", {
        callbackUrl,
      });
    } catch (err) {
      console.error(err);
      setError("Unable to sign in with Google. Please try again.");
      setGoogleLoading(false);
    }
  };

  if (status === "loading" || status === "authenticated" || isSuccess) {
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

  return (
    <div className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-bg-base relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.03),transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 bg-bg-surface border border-border-sharp p-8 rounded-sm relative z-10">
        {/* Branding header */}
        <div className="text-center space-y-2">
          <span className="font-mono text-[9px] tracking-widest text-primary uppercase font-bold">
            Secure Gateway
          </span>

          <h2 className="font-display text-2xl font-extrabold tracking-tight text-text-main uppercase">
            Sign In to SkillForge
          </h2>

          <p className="font-sans text-xs text-text-dim">
            Enter your credentials to access your dashboard.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 bg-red-950/20 border border-red-950/60 rounded-sm text-red-400 text-xs font-sans">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Email / Password Login */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-mono text-text-dim uppercase tracking-wider"
              >
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
                  placeholder="name@email.com"
                  className="block w-full bg-bg-base border border-border-sharp px-3 py-2.5 pl-10 text-sm text-text-main rounded-sm focus:border-primary focus:outline-none placeholder:text-text-sub transition-colors duration-150 font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-xs font-mono text-text-dim uppercase tracking-wider"
                >
                  Password
                </label>

                <a
                  href="#"
                  className="text-[10px] font-mono text-primary hover:text-primary-dim transition-colors"
                >
                  FORGOT PASSWORD?
                </a>
              </div>

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
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full inline-flex items-center justify-center bg-primary hover:bg-primary-dim text-bg-base font-sans text-xs font-bold tracking-wide uppercase py-3.5 rounded-sm transition-colors duration-150 gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-sharp/40" />
          </div>

          <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-widest">
            <span className="bg-bg-surface px-3 text-text-sub">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          className="w-full inline-flex items-center justify-center gap-3 bg-bg-base hover:bg-bg-elevated border border-border-sharp text-text-main font-sans text-xs font-semibold py-3.5 rounded-sm transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {googleLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Connecting to Google...
            </>
          ) : (
            <>
              <span className="text-base font-bold">G</span>
              Continue with Google
            </>
          )}
        </button>

        {/* Register */}
        <div className="text-center pt-4 border-t border-border-sharp/40">
          <p className="font-sans text-xs text-text-sub">
            New to SkillForge?{" "}
            <a
              href="/register"
              className="font-semibold text-primary hover:text-primary-dim transition-colors"
            >
              Create an Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-grow flex items-center justify-center py-20 px-4">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}