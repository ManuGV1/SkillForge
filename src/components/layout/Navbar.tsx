"use client";

import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  Menu,
  X,
  ArrowRight,
  LogOut,
  User,
  LayoutDashboard,
  Map,
  Code,
  Sparkles,
  LifeBuoy,
  Activity,
  FileText,
  Briefcase,
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  const publicLinks = [
    { label: "Discover", href: "/#paths" },
    { label: "Journey", href: "/#journey" },
    { label: "Courses", href: "/#courses" },
    { label: "Practice", href: "/#practice" },
    { label: "Projects", href: "/#projects" },
    { label: "Placement", href: "/placement" },
    { label: "Resume", href: "/resume" },
    { label: "About", href: "/about" },
  ];

  const handleOpenAiTutor = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-ai-tutor"));
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-sharp bg-bg-base/70 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          {/* Logo Brand Group */}
          <Link
            href="/"
            className="group flex flex-col items-start justify-center focus:outline-none"
          >
            <span className="font-display text-xl font-bold tracking-tight text-text-main transition-colors duration-200 group-hover:text-primary">
              SKILLFORGE
            </span>

            <span className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-text-sub transition-colors duration-200 group-hover:text-text-dim">
              by code404
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden space-x-6 md:flex lg:space-x-8">
            {!isLoggedIn ? (
              publicLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-sans text-xs font-medium text-text-dim transition-colors duration-150 hover:text-text-main lg:text-sm"
                >
                  {link.label}
                </a>
              ))
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 font-sans text-xs font-semibold text-text-dim transition-colors duration-150 hover:text-text-main lg:text-sm"
                >
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                  Dashboard
                </Link>

                <Link
                  href="/roadmap"
                  className="flex items-center gap-1.5 font-sans text-xs font-semibold text-text-dim transition-colors duration-150 hover:text-text-main lg:text-sm"
                >
                  <Map className="h-4 w-4 text-text-sub" />
                  Roadmap
                </Link>

                <Link
                  href="/dsa"
                  className="flex items-center gap-1.5 font-sans text-xs font-semibold text-text-dim transition-colors duration-150 hover:text-text-main lg:text-sm"
                >
                  <Code className="h-4 w-4 text-text-sub" />
                  DSA Sandbox
                </Link>

                <Link
                  href="/placement"
                  className="flex items-center gap-1.5 font-sans text-xs font-semibold text-text-dim transition-colors duration-150 hover:text-text-main lg:text-sm"
                >
                  <Briefcase className="h-4 w-4 text-text-sub" />
                  Placement
                </Link>

                <Link
                  href="/resume"
                  className="flex items-center gap-1.5 font-sans text-xs font-semibold text-text-dim transition-colors duration-150 hover:text-text-main lg:text-sm"
                >
                  <FileText className="h-4 w-4 text-text-sub" />
                  Resume
                </Link>

                <button
                  onClick={handleOpenAiTutor}
                  className="flex items-center gap-1.5 border-0 bg-transparent font-sans text-xs font-semibold text-primary transition-colors duration-150 hover:text-primary-dim cursor-pointer lg:text-sm focus:outline-none"
                >
                  <Sparkles className="h-4 w-4 animate-pulse text-primary" />
                  AI Tutor
                </button>

                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 font-sans text-xs font-semibold text-text-dim transition-colors duration-150 hover:text-text-main lg:text-sm"
                >
                  <User className="h-4 w-4 text-text-sub" />
                  Profile
                </Link>

                {isAdmin && (
                  <>
                    <Link
                      href="/admin/analytics"
                      className="flex items-center gap-1.5 font-sans text-xs font-semibold text-amber-400 transition-colors duration-150 hover:text-amber-300 lg:text-sm"
                    >
                      <Activity className="h-4 w-4 text-amber-400" />
                      Analytics
                    </Link>
                    <Link
                      href="/admin/support"
                      className="flex items-center gap-1.5 font-sans text-xs font-semibold text-emerald-400 transition-colors duration-150 hover:text-emerald-300 lg:text-sm"
                    >
                      <LifeBuoy className="h-4 w-4 text-emerald-400" />
                      Admin Support
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Action CTAs */}
          <div className="hidden items-center space-x-4 md:flex">
            {isLoggedIn ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex cursor-pointer items-center gap-1.5 border border-border-sharp px-3 py-1.5 rounded-sm font-sans text-xs font-semibold text-text-dim transition-colors duration-150 hover:border-red-950/60 hover:text-red-400 focus:outline-none"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 font-sans text-xs font-semibold text-text-dim transition-colors duration-150 hover:text-text-main"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-1.5 rounded-sm bg-primary px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-wide text-bg-base transition-colors duration-150 hover:bg-primary-dim focus:outline-none"
                >
                  Get Started
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-sm p-2 text-text-dim hover:bg-bg-surface hover:text-text-main focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="animate-fade-in border-b border-border-sharp bg-bg-surface/95 backdrop-blur-lg md:hidden">
          <div className="space-y-1 px-4 pb-6 pt-3 sm:px-6">
            {!isLoggedIn ? (
              <>
                {publicLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block border-b border-border-sharp/40 py-3 font-sans text-base font-medium text-text-dim hover:text-text-main last:border-0"
                  >
                    {link.label}
                  </a>
                ))}

                <div className="flex flex-col gap-3 pt-6">
                  <a
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full rounded-sm bg-bg-base/50 py-3 text-center font-sans text-sm font-medium text-text-dim hover:text-text-main"
                  >
                    Sign In
                  </a>

                  <a
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary py-3 font-sans text-sm font-semibold uppercase tracking-wide text-bg-base hover:bg-primary-dim"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex w-full items-center gap-3 rounded-sm bg-bg-base/50 px-4 py-3 font-sans text-sm font-semibold text-text-main hover:bg-bg-elevated"
                >
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                  Dashboard
                </Link>

                <Link
                  href="/roadmap"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex w-full items-center gap-3 rounded-sm bg-bg-base/50 px-4 py-3 font-sans text-sm font-semibold text-text-main hover:bg-bg-elevated"
                >
                  <Map className="h-4 w-4 text-text-sub" />
                  Roadmap
                </Link>

                <Link
                  href="/dsa"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex w-full items-center gap-3 rounded-sm bg-bg-base/50 px-4 py-3 font-sans text-sm font-semibold text-text-main hover:bg-bg-elevated"
                >
                  <Code className="h-4 w-4 text-text-sub" />
                  DSA Sandbox
                </Link>

                <Link
                  href="/placement"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex w-full items-center gap-3 rounded-sm bg-bg-base/50 px-4 py-3 font-sans text-sm font-semibold text-text-main hover:bg-bg-elevated"
                >
                  <Briefcase className="h-4 w-4 text-text-sub" />
                  Placement Preparation
                </Link>

                <Link
                  href="/resume"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex w-full items-center gap-3 rounded-sm bg-bg-base/50 px-4 py-3 font-sans text-sm font-semibold text-text-main hover:bg-bg-elevated"
                >
                  <FileText className="h-4 w-4 text-text-sub" />
                  Placement Resume
                </Link>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleOpenAiTutor();
                  }}
                  className="inline-flex w-full items-center gap-3 rounded-sm bg-primary/10 border border-primary/30 px-4 py-3 font-sans text-sm font-semibold text-primary hover:bg-primary/20 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  AI Tutor
                </button>

                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex w-full items-center gap-3 rounded-sm bg-bg-base/50 px-4 py-3 font-sans text-sm font-semibold text-text-main hover:bg-bg-elevated"
                >
                  <User className="h-4 w-4 text-text-sub" />
                  Profile
                </Link>

                {isAdmin && (
                  <>
                    <Link
                      href="/admin/analytics"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex w-full items-center gap-3 rounded-sm bg-amber-950/20 border border-amber-800/40 px-4 py-3 font-sans text-sm font-semibold text-amber-400 hover:bg-amber-950/40"
                    >
                      <Activity className="h-4 w-4 text-amber-400" />
                      Visitor Analytics
                    </Link>

                    <Link
                      href="/admin/support"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex w-full items-center gap-3 rounded-sm bg-emerald-950/20 border border-emerald-800/40 px-4 py-3 font-sans text-sm font-semibold text-emerald-400 hover:bg-emerald-950/40"
                    >
                      <LifeBuoy className="h-4 w-4 text-emerald-400" />
                      Admin Support
                    </Link>
                  </>
                )}

                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-red-950/40 bg-red-950/20 py-3 font-sans text-sm font-semibold text-red-400 hover:bg-red-950/40 cursor-pointer mt-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}