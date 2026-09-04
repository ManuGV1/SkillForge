"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Mail,
  User,
  MessageSquare,
  FileText,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LifeBuoy,
  ArrowLeft,
  Headphones,
} from "lucide-react";

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function SupportPage() {
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    id: string;
    createdAt: string;
  } | null>(null);

  const effectiveName =
    formData.name !== "" ? formData.name : (session?.user?.name || "");
  const effectiveEmail =
    formData.email !== "" ? formData.email : (session?.user?.email || "");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!effectiveName.trim() || effectiveName.trim().length < 2) {
      newErrors.name = "Please enter your full name (at least 2 characters).";
    }

    if (
      !effectiveEmail.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(effectiveEmail.trim())
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters long.";
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message =
        "Please describe your issue in detail (at least 10 characters).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          name: effectiveName,
          email: effectiveEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send support request.");
      }

      setSuccessData({
        id: data.data.id,
        createdAt: data.data.createdAt,
      });

      // Reset form message and subject
      setFormData((prev) => ({
        ...prev,
        subject: "",
        message: "",
      }));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-text-sub hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to SkillForge
          </Link>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <LifeBuoy className="w-6 h-6" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-text-main tracking-tight">
                Code404 Contact Support
              </h1>
              <p className="text-sm text-text-dim mt-1 font-sans">
                Have questions, technical issues, or platform feedback? Reach out directly to the Code404 team.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Info Card */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-bg-surface border border-border-sharp rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-display font-semibold uppercase tracking-wider text-text-main mb-4 flex items-center gap-2">
                <Headphones className="w-4 h-4 text-primary" />
                Support Channels
              </h2>

              <div className="space-y-4 font-sans text-xs text-text-dim">
                <div>
                  <div className="text-text-sub font-mono uppercase text-[10px] tracking-wider mb-1">
                    Dedicated Support Email
                  </div>
                  <a
                    href="mailto:support.code404@gmail.com"
                    className="text-primary hover:underline font-medium text-sm break-all"
                  >
                    support.code404@gmail.com
                  </a>
                </div>

                <div className="border-t border-border-sharp/40 pt-3">
                  <div className="text-text-sub font-mono uppercase text-[10px] tracking-wider mb-1">
                    Response Window
                  </div>
                  <p className="text-text-main">
                    Within 24 business hours. Every ticket is logged directly to our database.
                  </p>
                </div>

                <div className="border-t border-border-sharp/40 pt-3">
                  <div className="text-text-sub font-mono uppercase text-[10px] tracking-wider mb-1">
                    Development Team
                  </div>
                  <p className="text-text-main">
                    Code404 Engineering & Hackathon Team
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-bg-surface/50 border border-border-sharp/60 rounded-xl p-5">
              <h3 className="text-xs font-mono uppercase tracking-wider text-text-sub mb-2">
                Submission Tips
              </h3>
              <ul className="text-xs text-text-dim space-y-1.5 list-disc list-inside">
                <li>Include details of the course or feature.</li>
                <li>Describe error messages or symptoms.</li>
                <li>Logged-in requests are automatically linked.</li>
              </ul>
            </div>
          </div>

          {/* Form / Success Container */}
          <div className="lg:col-span-2">
            <div className="bg-bg-surface border border-border-sharp rounded-xl p-6 sm:p-8 shadow-md">
              {successData ? (
                /* Success Confirmation View */
                <div className="py-8 px-4 text-center space-y-6 animate-fade-in">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/15 border border-success/30 text-success mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-display font-bold text-text-main">
                      Support Request Submitted!
                    </h2>
                    <p className="text-sm text-text-dim max-w-md mx-auto">
                      Thank you for contacting Code404 Support. Your request has been securely recorded and dispatched to our support team.
                    </p>
                  </div>

                  <div className="bg-bg-base border border-border-sharp rounded-lg p-4 max-w-sm mx-auto text-left font-mono text-xs space-y-2">
                    <div className="flex justify-between text-text-sub">
                      <span>Ticket Reference:</span>
                      <span className="text-primary font-bold">{successData.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between text-text-sub">
                      <span>Target Email:</span>
                      <span className="text-text-main">support.code404@gmail.com</span>
                    </div>
                    <div className="flex justify-between text-text-sub">
                      <span>Submitted At:</span>
                      <span className="text-text-main">
                        {new Date(successData.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => setSuccessData(null)}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-sm bg-primary text-bg-base font-sans text-xs font-semibold uppercase tracking-wider hover:bg-primary-dim transition-colors cursor-pointer"
                    >
                      Submit Another Request
                    </button>

                    <Link
                      href={session ? "/dashboard" : "/"}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-sm border border-border-sharp text-text-dim hover:text-text-main font-sans text-xs font-semibold uppercase tracking-wider transition-colors text-center"
                    >
                      Return to Platform
                    </Link>
                  </div>
                </div>
              ) : (
                /* Contact Form View */
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {submitError && (
                    <div className="p-4 rounded-lg bg-red-950/40 border border-red-900/60 text-red-300 text-sm flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold block">Submission Error</strong>
                        <span>{submitError}</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-text-main">
                        Your Name <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-sub">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={effectiveName}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (errors.name) setErrors({ ...errors, name: undefined });
                          }}
                          placeholder="e.g. Alex Johnson"
                          className={`w-full pl-9 pr-4 py-2.5 bg-bg-base border ${
                            errors.name ? "border-red-500" : "border-border-sharp"
                          } rounded-sm text-sm text-text-main placeholder-text-sub focus:outline-none focus:border-primary transition-colors`}
                        />
                      </div>
                      {errors.name && <p className="text-xs text-red-400 font-sans mt-1">{errors.name}</p>}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-text-main">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-sub">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={effectiveEmail}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: undefined });
                          }}
                          placeholder="e.g. alex@example.com"
                          className={`w-full pl-9 pr-4 py-2.5 bg-bg-base border ${
                            errors.email ? "border-red-500" : "border-border-sharp"
                          } rounded-sm text-sm text-text-main placeholder-text-sub focus:outline-none focus:border-primary transition-colors`}
                        />
                      </div>
                      {errors.email && <p className="text-xs text-red-400 font-sans mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-xs font-mono uppercase tracking-wider text-text-main">
                      Subject / Topic <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-sub">
                        <FileText className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={(e) => {
                          setFormData({ ...formData, subject: e.target.value });
                          if (errors.subject) setErrors({ ...errors, subject: undefined });
                        }}
                        placeholder="e.g. DSA Sandbox code submission issue"
                        className={`w-full pl-9 pr-4 py-2.5 bg-bg-base border ${
                          errors.subject ? "border-red-500" : "border-border-sharp"
                        } rounded-sm text-sm text-text-main placeholder-text-sub focus:outline-none focus:border-primary transition-colors`}
                      />
                    </div>
                    {errors.subject && <p className="text-xs text-red-400 font-sans mt-1">{errors.subject}</p>}
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-text-main">
                      Message / Issue Details <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 flex items-start pointer-events-none text-text-sub">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => {
                          setFormData({ ...formData, message: e.target.value });
                          if (errors.message) setErrors({ ...errors, message: undefined });
                        }}
                        placeholder="Please describe what you experienced, what expected behavior was, or any specific questions..."
                        className={`w-full pl-9 pr-4 py-2.5 bg-bg-base border ${
                          errors.message ? "border-red-500" : "border-border-sharp"
                        } rounded-sm text-sm text-text-main placeholder-text-sub focus:outline-none focus:border-primary transition-colors resize-y`}
                      />
                    </div>
                    {errors.message && <p className="text-xs text-red-400 font-sans mt-1">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex items-center justify-between">
                    <p className="text-xs text-text-sub font-mono">
                      Submitting to: <span className="text-text-main">support.code404@gmail.com</span>
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-bg-base font-sans text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-primary-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Support Request
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
