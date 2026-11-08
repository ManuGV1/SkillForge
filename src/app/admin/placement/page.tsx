"use client";

import React, { useState, useEffect, useMemo, FormEvent } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ShieldAlert,
  Loader2,
  Plus,
  Search,
  ArrowLeft,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Building2,
  BookOpenCheck,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  PlacementQuestion,
  PlacementCategoryKey,
  QuestionDifficulty,
} from "@/lib/placement/placementTypes";
import { PLACEMENT_CATEGORIES } from "@/lib/placement/placementData";

interface QuestionFormData {
  id?: string;
  categoryId: PlacementCategoryKey;
  subtopic: string;
  title: string;
  description: string;
  difficulty: QuestionDifficulty;
  type: "MCQ";
  options: string[];
  correctAnswer: number;
  explanation: string;
  companies: string;
  formulaOrTip: string;
}

const defaultFormData: QuestionFormData = {
  categoryId: "quantitative-aptitude",
  subtopic: "percentages-pl",
  title: "",
  description: "",
  difficulty: "EASY",
  type: "MCQ",
  options: ["", "", "", ""],
  correctAnswer: 0,
  explanation: "",
  companies: "TCS, Infosys",
  formulaOrTip: "",
};

export default function AdminPlacementPage() {
  const { data: session, status: authStatus } = useSession();

  const [questions, setQuestions] = useState<PlacementQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const [activeModal, setActiveModal] = useState<"create" | "edit" | "delete" | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<PlacementQuestion | null>(null);
  const [formData, setFormData] = useState<QuestionFormData>(defaultFormData);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  // Fetch placement questions
  const loadQuestions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/placement/questions");
      const json = await res.json();
      if (json.success && json.data?.questions) {
        setQuestions(json.data.questions);
      } else {
        setNotification({
          type: "error",
          message: json.error || "Failed to load placement questions",
        });
      }
    } catch {
      setNotification({
        type: "error",
        message: "Network error loading questions",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadQuestions();
    }
  }, [isAdmin]);

  const openCreateModal = () => {
    setFormData(defaultFormData);
    setActiveModal("create");
  };

  const openEditModal = (q: PlacementQuestion) => {
    setSelectedQuestion(q);
    setFormData({
      id: q.id,
      categoryId: q.categoryId,
      subtopic: q.subtopic,
      title: q.title,
      description: q.description,
      difficulty: q.difficulty,
      type: "MCQ",
      options: q.options && q.options.length >= 2 ? [...q.options] : ["", "", "", ""],
      correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
      explanation: q.explanation || "",
      companies: q.companies ? q.companies.join(", ") : "",
      formulaOrTip: q.formulaOrTip || "",
    });
    setActiveModal("edit");
  };

  const openDeleteModal = (q: PlacementQuestion) => {
    setSelectedQuestion(q);
    setActiveModal("delete");
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...formData.options];
    updated[index] = value;
    setFormData({ ...formData, options: updated });
  };

  const handleSubmitCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification(null);

    try {
      const payload = {
        categoryId: formData.categoryId,
        subtopic: formData.subtopic.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        difficulty: formData.difficulty,
        type: "MCQ",
        options: formData.options.map((o) => o.trim()).filter((o) => o.length > 0),
        correctAnswer: Number(formData.correctAnswer),
        explanation: formData.explanation.trim(),
        companies: formData.companies
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c.length > 0),
        formulaOrTip: formData.formulaOrTip.trim() || undefined,
      };

      const res = await fetch("/api/admin/placement/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setNotification({
          type: "success",
          message: "Placement question added successfully to database",
        });
        setActiveModal(null);
        loadQuestions();
      } else {
        setNotification({
          type: "error",
          message: json.error || "Failed to add question",
        });
      }
    } catch {
      setNotification({
        type: "error",
        message: "An unexpected error occurred while saving the question.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion) return;
    setSubmitting(true);
    setNotification(null);

    try {
      const payload = {
        categoryId: formData.categoryId,
        subtopic: formData.subtopic.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        difficulty: formData.difficulty,
        type: "MCQ",
        options: formData.options.map((o) => o.trim()).filter((o) => o.length > 0),
        correctAnswer: Number(formData.correctAnswer),
        explanation: formData.explanation.trim(),
        companies: formData.companies
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c.length > 0),
        formulaOrTip: formData.formulaOrTip.trim() || undefined,
      };

      const res = await fetch(`/api/admin/placement/questions/${selectedQuestion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setNotification({
          type: "success",
          message: "Placement question updated successfully in database",
        });
        setActiveModal(null);
        loadQuestions();
      } else {
        setNotification({
          type: "error",
          message: json.error || "Failed to update question",
        });
      }
    } catch {
      setNotification({
        type: "error",
        message: "An unexpected error occurred while updating the question.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedQuestion) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/placement/questions/${selectedQuestion.id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setNotification({
          type: "success",
          message: `Question '${selectedQuestion.title}' removed successfully`,
        });
        setActiveModal(null);
        loadQuestions();
      } else {
        setNotification({
          type: "error",
          message: json.error || "Failed to delete question",
        });
      }
    } catch {
      setNotification({
        type: "error",
        message: "Error deleting question",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered question view
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (selectedCategory !== "all" && q.categoryId !== selectedCategory) return false;
      if (selectedDifficulty !== "all" && q.difficulty !== selectedDifficulty) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = q.title.toLowerCase().includes(query);
        const matchesDesc = q.description.toLowerCase().includes(query);
        const matchesSubtopic = q.subtopic.toLowerCase().includes(query);
        const matchesCompany = q.companies?.some((c) => c.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesSubtopic && !matchesCompany) {
          return false;
        }
      }
      return true;
    });
  }, [questions, selectedCategory, selectedDifficulty, searchQuery]);

  // Category counts
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {
      "quantitative-aptitude": 0,
      "logical-reasoning": 0,
      "verbal-ability": 0,
      "dsa-coding": 0,
      "technical-fundamentals": 0,
    };
    questions.forEach((q) => {
      if (counts[q.categoryId] !== undefined) {
        counts[q.categoryId]++;
      }
    });
    return counts;
  }, [questions]);

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
            You must be logged in as an authorized Administrator to access placement question management.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-sm bg-primary text-bg-base font-sans text-xs font-semibold uppercase tracking-wider hover:bg-primary-dim transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/admin"
              className="px-5 py-2.5 rounded-sm border border-border-sharp text-text-dim font-sans text-xs font-semibold uppercase tracking-wider hover:text-text-main transition-colors"
            >
              Admin Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base py-10 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-border-sharp pb-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs font-mono text-text-sub hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Overview
          </Link>
          <span className="font-mono text-[10px] text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-sm">
            PLACEMENT MANAGEMENT • {session.user.role}
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-950/60 border border-purple-800/60 text-purple-400">
              <BookOpenCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-text-main tracking-tight flex items-center gap-2">
                Placement Question Bank
              </h1>
              <p className="text-xs text-text-dim mt-0.5">
                Manage curriculum questions, MCQ options, correct answers, formulas, and company tags.
              </p>
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-primary hover:bg-primary-dim text-bg-base font-sans text-xs font-bold uppercase tracking-wider transition-colors shadow-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Question
          </button>
        </div>

        {/* Notifications */}
        {notification && (
          <div
            className={`p-3.5 rounded-sm border flex items-center justify-between text-xs font-sans ${
              notification.type === "success"
                ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                : "bg-rose-950/40 border-rose-800/60 text-rose-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-text-dim hover:text-text-main"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-bg-surface border border-border-sharp p-3 rounded-sm text-center">
            <span className="font-mono text-[10px] text-text-dim uppercase block">Total</span>
            <span className="font-mono text-lg font-bold text-primary">{questions.length}</span>
          </div>
          <div className="bg-bg-surface border border-border-sharp p-3 rounded-sm text-center">
            <span className="font-mono text-[10px] text-text-dim uppercase block">Quant Apt</span>
            <span className="font-mono text-lg font-bold text-amber-400">
              {categoryStats["quantitative-aptitude"]}
            </span>
          </div>
          <div className="bg-bg-surface border border-border-sharp p-3 rounded-sm text-center">
            <span className="font-mono text-[10px] text-text-dim uppercase block">Logical</span>
            <span className="font-mono text-lg font-bold text-blue-400">
              {categoryStats["logical-reasoning"]}
            </span>
          </div>
          <div className="bg-bg-surface border border-border-sharp p-3 rounded-sm text-center">
            <span className="font-mono text-[10px] text-text-dim uppercase block">Verbal</span>
            <span className="font-mono text-lg font-bold text-emerald-400">
              {categoryStats["verbal-ability"]}
            </span>
          </div>
          <div className="bg-bg-surface border border-border-sharp p-3 rounded-sm text-center">
            <span className="font-mono text-[10px] text-text-dim uppercase block">DSA</span>
            <span className="font-mono text-lg font-bold text-purple-400">
              {categoryStats["dsa-coding"]}
            </span>
          </div>
          <div className="bg-bg-surface border border-border-sharp p-3 rounded-sm text-center">
            <span className="font-mono text-[10px] text-text-dim uppercase block">Core CS</span>
            <span className="font-mono text-lg font-bold text-cyan-400">
              {categoryStats["technical-fundamentals"]}
            </span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-bg-surface border border-border-sharp rounded-sm">
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-dim" />
            <input
              type="text"
              placeholder="Search by title, description, subtopic, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-base border border-border-sharp rounded-sm pl-9 pr-3 py-2 text-xs font-sans text-text-main placeholder:text-text-dim focus:outline-none focus:border-primary"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-bg-base border border-border-sharp rounded-sm px-3 py-2 text-xs font-sans text-text-main focus:outline-none focus:border-primary"
            >
              <option value="all">All Categories ({questions.length})</option>
              {PLACEMENT_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-bg-base border border-border-sharp rounded-sm px-3 py-2 text-xs font-sans text-text-main focus:outline-none focus:border-primary"
            >
              <option value="all">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
        </div>

        {/* Question Cards List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-text-sub">
            <span>
              Showing {filteredQuestions.length} of {questions.length} questions
            </span>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border-sharp rounded-sm bg-bg-surface/40">
              <p className="text-xs text-text-sub">No questions found matching your filter criteria.</p>
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const diffBadgeClass =
                q.difficulty === "EASY"
                  ? "text-emerald-400 bg-emerald-950/30 border-emerald-800/40"
                  : q.difficulty === "MEDIUM"
                  ? "text-amber-400 bg-amber-950/30 border-amber-800/40"
                  : "text-rose-400 bg-rose-950/30 border-rose-800/40";

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-sm border border-border-sharp bg-bg-surface hover:border-primary/40 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border text-text-dim bg-bg-base">
                          {q.id}
                        </span>
                        <span
                          className={`font-mono text-[9px] font-bold px-2 py-0.5 border rounded-sm uppercase tracking-wider ${diffBadgeClass}`}
                        >
                          {q.difficulty}
                        </span>
                        <span className="font-mono text-[10px] text-text-sub bg-bg-base border border-border-sharp px-2 py-0.5 rounded-sm">
                          {q.categoryId}
                        </span>
                        <span className="font-mono text-[10px] text-text-dim">
                          {q.subtopic}
                        </span>
                      </div>

                      <h3 className="font-display text-base font-semibold text-text-main">
                        {q.title}
                      </h3>
                      <p className="font-sans text-xs text-text-sub leading-relaxed">
                        {q.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-start flex-shrink-0">
                      <button
                        onClick={() => openEditModal(q)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm bg-bg-base hover:bg-bg-elevated border border-border-sharp text-text-main font-sans text-xs font-semibold uppercase tracking-wider transition-colors"
                        title="Edit question"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-primary" /> Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(q)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm bg-rose-950/30 hover:bg-rose-950/50 border border-rose-900/50 text-rose-400 font-sans text-xs font-semibold uppercase tracking-wider transition-colors"
                        title="Delete question"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Options Preview */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border-sharp/40">
                      {q.options.map((opt, idx) => {
                        const isCorrect = idx === Number(q.correctAnswer);
                        return (
                          <div
                            key={idx}
                            className={`p-2 rounded-sm border text-xs font-sans flex items-start gap-2 ${
                              isCorrect
                                ? "bg-emerald-950/20 border-emerald-800/60 text-emerald-300 font-medium"
                                : "bg-bg-base border-border-sharp text-text-sub"
                            }`}
                          >
                            <span
                              className={`flex items-center justify-center h-4 w-4 rounded-sm text-[10px] font-mono flex-shrink-0 ${
                                isCorrect
                                  ? "bg-emerald-800/60 text-emerald-300"
                                  : "bg-bg-surface border border-border-sharp text-text-dim"
                              }`}
                            >
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="flex-1 truncate">{opt}</span>
                            {isCorrect && (
                              <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Footer details */}
                  <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-text-dim pt-2 border-t border-border-sharp/30 gap-2">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-primary" />
                      <span>Asked in: {q.companies?.join(", ") || "General IT drives"}</span>
                    </div>
                    {q.formulaOrTip && (
                      <span className="truncate max-w-md text-text-dim italic">
                        Tip: {q.formulaOrTip}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal: Add or Edit Question */}
        {(activeModal === "create" || activeModal === "edit") && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-bg-surface border border-border-sharp rounded-sm shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-border-sharp px-5 py-4 bg-bg-base/60">
                <h2 className="font-display text-base font-bold text-text-main flex items-center gap-2">
                  <BookOpenCheck className="w-5 h-5 text-primary" />
                  {activeModal === "create" ? "Add New Placement Question" : `Edit Question: ${formData.id || ""}`}
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-sm border border-border-sharp text-text-dim hover:text-text-main"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={activeModal === "create" ? handleSubmitCreate : handleSubmitEdit}
                className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-sans"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-text-dim mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          categoryId: e.target.value as PlacementCategoryKey,
                        })
                      }
                      className="w-full bg-bg-base border border-border-sharp rounded-sm px-3 py-2 text-xs text-text-main focus:border-primary focus:outline-none"
                    >
                      {PLACEMENT_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase text-text-dim mb-1">
                      Subtopic Slug *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. percentages-pl, arrays-hashing"
                      value={formData.subtopic}
                      onChange={(e) => setFormData({ ...formData, subtopic: e.target.value })}
                      className="w-full bg-bg-base border border-border-sharp rounded-sm px-3 py-2 text-xs text-text-main focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase text-text-dim mb-1">
                      Difficulty *
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          difficulty: e.target.value as QuestionDifficulty,
                        })
                      }
                      className="w-full bg-bg-base border border-border-sharp rounded-sm px-3 py-2 text-xs text-text-main focus:border-primary focus:outline-none"
                    >
                      <option value="EASY">EASY</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HARD">HARD</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-text-dim mb-1">
                    Problem Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Successive Discounts and Net Price"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-bg-base border border-border-sharp rounded-sm px-3 py-2 text-xs text-text-main focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-text-dim mb-1">
                    Problem Statement (supports multi-line markdown/text) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter the full problem description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-bg-base border border-border-sharp rounded-sm px-3 py-2 text-xs text-text-main focus:border-primary focus:outline-none leading-relaxed"
                  />
                </div>

                {/* MCQ Options */}
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] uppercase text-text-dim">
                    4 Multiple Choice Options * (select radio button for correct answer)
                  </label>
                  <div className="space-y-2">
                    {formData.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 font-mono text-xs cursor-pointer">
                          <input
                            type="radio"
                            name="correctAnswerOption"
                            checked={formData.correctAnswer === idx}
                            onChange={() => setFormData({ ...formData, correctAnswer: idx })}
                            className="text-primary focus:ring-primary h-4 w-4"
                          />
                          <span className="font-bold text-text-sub">
                            {String.fromCharCode(65 + idx)}:
                          </span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                          value={opt}
                          onChange={(e) => handleOptionChange(idx, e.target.value)}
                          className="flex-1 bg-bg-base border border-border-sharp rounded-sm px-3 py-1.5 text-xs text-text-main focus:border-primary focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-text-dim mb-1">
                    Step-by-Step Explanation *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide detailed breakdown and derivation..."
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    className="w-full bg-bg-base border border-border-sharp rounded-sm px-3 py-2 text-xs text-text-main focus:border-primary focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-text-dim mb-1">
                      Asked In Companies (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TCS, Infosys, Amazon"
                      value={formData.companies}
                      onChange={(e) => setFormData({ ...formData, companies: e.target.value })}
                      className="w-full bg-bg-base border border-border-sharp rounded-sm px-3 py-2 text-xs text-text-main focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase text-text-dim mb-1">
                      Formula or Quick Tip (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Net Price = MP * (1 - d1) * (1 - d2)"
                      value={formData.formulaOrTip}
                      onChange={(e) => setFormData({ ...formData, formulaOrTip: e.target.value })}
                      className="w-full bg-bg-base border border-border-sharp rounded-sm px-3 py-2 text-xs text-text-main focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border-sharp flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-sm border border-border-sharp text-text-sub hover:text-text-main text-xs font-semibold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-sm bg-primary hover:bg-primary-dim text-bg-base text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {activeModal === "create" ? "Create Question" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Confirm Delete */}
        {activeModal === "delete" && selectedQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-bg-surface border border-rose-900/60 rounded-sm shadow-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                <h3 className="font-display text-base font-bold text-text-main">
                  Delete Placement Question?
                </h3>
              </div>
              <p className="font-sans text-xs text-text-sub leading-relaxed">
                Are you sure you want to delete question{" "}
                <strong className="text-text-main font-mono">&ldquo;{selectedQuestion.title}&rdquo;</strong>{" "}
                ({selectedQuestion.id})? This will deactivate it from the question pool.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-sm border border-border-sharp text-text-sub hover:text-text-main text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
