"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Compass,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  Bookmark,
  ArrowRight,
  TrendingUp,
  Target,
  Building2,
  Calculator,
  BrainCircuit,
  BookOpenCheck,
  Binary,
  Cpu,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import {
  PlacementCategory,
  PlacementQuestion,
  CompanyTrack,
  PlacementCategoryKey,
  QuestionDifficulty,
} from "@/lib/placement/placementTypes";
import QuestionPracticeModal from "@/components/placement/QuestionPracticeModal";

interface PlacementViewClientProps {
  categories: PlacementCategory[];
  companies: CompanyTrack[];
  initialQuestions: PlacementQuestion[];
  initialReadiness: {
    overall: number;
    aptitude: number;
    logical: number;
    verbal: number;
    dsa: number;
    coreCs: number;
  };
  userProfile?: {
    careerGoal: string | null;
    college: string | null;
    degree: string | null;
    branch: string | null;
    gradYear: number | null;
  } | null;
  isAuthenticated: boolean;
}

type TabKey = "explore" | "topic-wise" | "personalized";

export default function PlacementViewClient({
  categories,
  companies,
  initialQuestions,
  initialReadiness,
  userProfile,
  isAuthenticated,
}: PlacementViewClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("explore");

  // Filters for Explore All
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Solved & Bookmarked state (persisted in localStorage)
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Readiness score state
  const [readiness, setReadiness] = useState(initialReadiness);

  // Active Practice Modal Question
  const [activeQuestion, setActiveQuestion] = useState<PlacementQuestion | null>(null);

  // Load local storage progress
  useEffect(() => {
    Promise.resolve().then(() => {
      try {
        const savedSolved = localStorage.getItem("skillforge_placement_solved");
        if (savedSolved) {
          setSolvedIds(new Set(JSON.parse(savedSolved)));
        }
        const savedBookmarks = localStorage.getItem("skillforge_placement_bookmarks");
        if (savedBookmarks) {
          setBookmarkedIds(new Set(JSON.parse(savedBookmarks)));
        }
      } catch (e) {
        console.error("Error reading localStorage:", e);
      }
    });
  }, []);

  const handleSolveQuestion = (questionId: string, isCorrect: boolean) => {
    const nextSolved = new Set(solvedIds);
    nextSolved.add(questionId);
    setSolvedIds(nextSolved);
    try {
      localStorage.setItem(
        "skillforge_placement_solved",
        JSON.stringify(Array.from(nextSolved))
      );
    } catch (e) {
      console.error(e);
    }

    if (isCorrect) {
      setReadiness((prev) => ({
        ...prev,
        overall: Math.min(100, prev.overall + 2),
      }));
    }
  };

  const handleToggleBookmark = (questionId: string) => {
    const nextBookmarks = new Set(bookmarkedIds);
    if (nextBookmarks.has(questionId)) {
      nextBookmarks.delete(questionId);
    } else {
      nextBookmarks.add(questionId);
    }
    setBookmarkedIds(nextBookmarks);
    try {
      localStorage.setItem(
        "skillforge_placement_bookmarks",
        JSON.stringify(Array.from(nextBookmarks))
      );
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered questions in Explore All
  const filteredQuestions = useMemo(() => {
    return initialQuestions.filter((q) => {
      // Category match
      if (selectedCategory !== "all" && q.categoryId !== selectedCategory) {
        return false;
      }
      // Difficulty match
      if (selectedDifficulty !== "all" && q.difficulty !== selectedDifficulty) {
        return false;
      }
      // Company match
      if (
        selectedCompany !== "all" &&
        !q.companies.some((c) =>
          c.toLowerCase().includes(selectedCompany.toLowerCase())
        )
      ) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = q.title.toLowerCase().includes(query);
        const matchesDesc = q.description.toLowerCase().includes(query);
        const matchesSubtopic = q.subtopic.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesSubtopic) {
          return false;
        }
      }
      return true;
    });
  }, [
    initialQuestions,
    selectedCategory,
    selectedDifficulty,
    selectedCompany,
    searchQuery,
  ]);

  const getCategoryIcon = (id: PlacementCategoryKey) => {
    switch (id) {
      case "quantitative-aptitude":
        return <Calculator className="h-5 w-5 text-amber-400" />;
      case "logical-reasoning":
        return <BrainCircuit className="h-5 w-5 text-blue-400" />;
      case "verbal-ability":
        return <BookOpenCheck className="h-5 w-5 text-emerald-400" />;
      case "dsa-coding":
        return <Binary className="h-5 w-5 text-purple-400" />;
      case "technical-fundamentals":
        return <Cpu className="h-5 w-5 text-cyan-400" />;
      default:
        return <BookOpen className="h-5 w-5 text-primary" />;
    }
  };

  const getDifficultyBadge = (diff: QuestionDifficulty) => {
    switch (diff) {
      case "EASY":
        return "text-emerald-400 bg-emerald-950/40 border-emerald-800/40";
      case "MEDIUM":
        return "text-amber-400 bg-amber-950/40 border-amber-800/40";
      case "HARD":
        return "text-rose-400 bg-rose-950/40 border-rose-800/40";
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border-sharp pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-primary font-bold uppercase tracking-wider">
              CAREER & CAMPUS HIRING
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-primary border border-primary/20">
              PLACEMENT PREP
            </span>
            {!isAuthenticated && (
              <span className="font-mono text-[9px] text-text-sub border border-border-sharp px-2 py-0.5 rounded-sm bg-bg-surface">
                Guest Mode
              </span>
            )}
          </div>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-text-main uppercase">
            PLACEMENT PREPARATION
          </h1>
          <p className="mt-1 font-sans text-xs sm:text-sm text-text-sub max-w-2xl">
            Ace campus recruitments, online assessments, and technical interviews
            with curated practice across Aptitude, Reasoning, Verbal, DSA, and Core CS Fundamentals.
          </p>
        </div>

        {/* Global Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-sm border border-border-sharp bg-bg-surface text-center">
            <span className="block font-mono text-[10px] text-text-sub uppercase">Solved</span>
            <span className="font-mono text-base font-bold text-emerald-400">
              {solvedIds.size} <span className="text-xs text-text-dim">/ {initialQuestions.length}</span>
            </span>
          </div>
          <div className="px-4 py-2 rounded-sm border border-border-sharp bg-bg-surface text-center">
            <span className="block font-mono text-[10px] text-text-sub uppercase">Readiness</span>
            <span className="font-mono text-base font-bold text-primary">
              {readiness.overall}%
            </span>
          </div>
        </div>
      </div>

      {/* Main View Selector Tabs */}
      <div className="flex border-b border-border-sharp space-x-2">
        <button
          onClick={() => setActiveTab("explore")}
          className={`flex items-center gap-2 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider border-b-2 transition-all -mb-[1px] ${
            activeTab === "explore"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-text-sub hover:text-text-main"
          }`}
        >
          <Compass className="h-4 w-4" />
          Explore All ({initialQuestions.length})
        </button>

        <button
          onClick={() => setActiveTab("topic-wise")}
          className={`flex items-center gap-2 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider border-b-2 transition-all -mb-[1px] ${
            activeTab === "topic-wise"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-text-sub hover:text-text-main"
          }`}
        >
          <Layers className="h-4 w-4" />
          Topic-Wise Practice ({categories.length})
        </button>

        <button
          onClick={() => setActiveTab("personalized")}
          className={`flex items-center gap-2 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider border-b-2 transition-all -mb-[1px] ${
            activeTab === "personalized"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-text-sub hover:text-text-main"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Personalized Practice
        </button>
      </div>

      {/* TAB 1: EXPLORE ALL */}
      {activeTab === "explore" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Target Company Track Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-semibold text-text-sub uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-primary" /> Target Company Quick Filters:
              </span>
              {selectedCompany !== "all" && (
                <button
                  onClick={() => setSelectedCompany("all")}
                  className="font-mono text-[10px] text-text-sub hover:text-primary flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" /> Clear Company Filter
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedCompany("all")}
                className={`px-3 py-1.5 rounded-sm font-sans text-xs font-semibold whitespace-nowrap border transition-all ${
                  selectedCompany === "all"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border-sharp bg-bg-surface text-text-sub hover:text-text-main hover:bg-bg-elevated"
                }`}
              >
                All Companies
              </button>
              {companies.map((company) => (
                <button
                  key={company.id}
                  onClick={() =>
                    setSelectedCompany(
                      selectedCompany === company.logo ? "all" : company.logo
                    )
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm font-sans text-xs font-semibold whitespace-nowrap border transition-all ${
                    selectedCompany === company.logo
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border-sharp bg-bg-surface text-text-sub hover:text-text-main hover:bg-bg-elevated"
                  }`}
                >
                  <span className="font-mono text-[10px] bg-bg-base border border-border-sharp px-1.5 py-0.2 rounded-sm text-text-dim">
                    {company.logo}
                  </span>
                  <span>{company.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-bg-surface border border-border-sharp rounded-sm">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-dim" />
              <input
                type="text"
                placeholder="Search questions, subtopics, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-bg-base border border-border-sharp rounded-sm pl-9 pr-3 py-2 text-xs font-sans text-text-main placeholder:text-text-dim focus:outline-none focus:border-primary"
              />
            </div>

            {/* Category Select */}
            <div className="md:col-span-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-bg-base border border-border-sharp rounded-sm px-3 py-2 text-xs font-sans text-text-main focus:outline-none focus:border-primary"
              >
                <option value="all">All Categories ({initialQuestions.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({initialQuestions.filter((q) => q.categoryId === c.id).length})
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Select */}
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

          {/* Question List Header & Count */}
          <div className="flex items-center justify-between text-xs text-text-sub font-mono">
            <span>
              Showing {filteredQuestions.length} of {initialQuestions.length} problems
            </span>
            {bookmarkedIds.size > 0 && (
              <span className="flex items-center gap-1 text-amber-400">
                <Bookmark className="h-3.5 w-3.5 fill-current" /> {bookmarkedIds.size} Bookmarked
              </span>
            )}
          </div>

          {/* Questions Grid/List */}
          <div className="space-y-3">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border-sharp rounded-sm bg-bg-surface/40">
                <p className="font-sans text-sm text-text-sub">
                  No questions match your filter criteria.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedDifficulty("all");
                    setSelectedCompany("all");
                    setSearchQuery("");
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-primary text-bg-base font-sans text-xs font-semibold uppercase tracking-wider"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
                </button>
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const isSolved = solvedIds.has(q.id);
                const isBookmarked = bookmarkedIds.has(q.id);

                return (
                  <div
                    key={q.id}
                    className="p-4 sm:p-5 rounded-sm border border-border-sharp bg-bg-surface hover:border-primary/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`font-mono text-[9px] font-bold px-2 py-0.5 border rounded-sm uppercase tracking-wider ${getDifficultyBadge(
                            q.difficulty
                          )}`}
                        >
                          {q.difficulty}
                        </span>

                        <span className="font-mono text-[10px] text-text-sub bg-bg-base border border-border-sharp px-2 py-0.5 rounded-sm">
                          {q.subtopic.replace(/-/g, " ").toUpperCase()}
                        </span>

                        {isSolved && (
                          <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 px-2 py-0.5 rounded-sm">
                            <CheckCircle2 className="h-3 w-3" /> Solved
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => setActiveQuestion(q)}
                        className="font-display text-sm sm:text-base font-semibold text-text-main group-hover:text-primary cursor-pointer transition-colors"
                      >
                        {q.title}
                      </h3>

                      <p className="font-sans text-xs text-text-sub line-clamp-2">
                        {q.description}
                      </p>

                      {/* Company Tags */}
                      {q.companies && q.companies.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="font-mono text-[10px] text-text-dim">Asked in:</span>
                          {q.companies.map((c) => (
                            <span
                              key={c}
                              className="font-mono text-[10px] text-primary/90 bg-primary/5 border border-primary/20 px-1.5 py-0.2 rounded-sm"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                      <button
                        onClick={() => handleToggleBookmark(q.id)}
                        title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
                        className={`p-2 rounded-sm border transition-colors ${
                          isBookmarked
                            ? "border-amber-500/40 bg-amber-950/30 text-amber-400"
                            : "border-border-sharp text-text-sub hover:text-text-main hover:bg-bg-elevated"
                        }`}
                      >
                        <Bookmark
                          className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
                        />
                      </button>

                      <button
                        onClick={() => setActiveQuestion(q)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-sm bg-primary hover:bg-primary-dim text-bg-base font-sans text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        {isSolved ? "Practice Again" : "Solve Problem"}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TOPIC-WISE PRACTICE */}
      {activeTab === "topic-wise" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {categories.map((cat) => {
              const categoryQuestions = initialQuestions.filter(
                (q) => q.categoryId === cat.id
              );
              const solvedCount = categoryQuestions.filter((q) =>
                solvedIds.has(q.id)
              ).length;
              const progressPct =
                categoryQuestions.length > 0
                  ? Math.round((solvedCount / categoryQuestions.length) * 100)
                  : 0;

              return (
                <div
                  key={cat.id}
                  className="p-6 rounded-sm border border-border-sharp bg-bg-surface space-y-4 hover:border-border-sharp/80 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-sm bg-bg-base border border-border-sharp">
                          {getCategoryIcon(cat.id)}
                        </div>
                        <div>
                          <h3 className="font-display text-base font-bold text-text-main">
                            {cat.name}
                          </h3>
                          <span className="font-mono text-[10px] text-text-sub uppercase tracking-wider">
                            {categoryQuestions.length} Placement Questions
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold text-primary">
                        {progressPct}% Solved
                      </span>
                    </div>

                    <p className="font-sans text-xs text-text-sub leading-relaxed">
                      {cat.longDesc}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-bg-base h-1.5 rounded-full overflow-hidden border border-border-sharp/40">
                      <div
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    {/* Subtopics Pills */}
                    <div className="pt-2 space-y-1.5">
                      <span className="font-mono text-[10px] uppercase text-text-dim block tracking-wider">
                        Key Subtopics & Coverage:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.subtopics.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              setSearchQuery(sub.id);
                              setActiveTab("explore");
                            }}
                            className="font-mono text-[10px] px-2 py-1 rounded-sm bg-bg-base border border-border-sharp text-text-sub hover:text-primary hover:border-primary/40 transition-colors"
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border-sharp/60 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-text-dim">
                      {solvedCount} / {categoryQuestions.length} Completed
                    </span>

                    <button
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setActiveTab("explore");
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-bg-base hover:bg-bg-elevated border border-border-sharp text-text-main font-sans text-xs font-semibold uppercase tracking-wider transition-colors"
                    >
                      Practice Topic <ArrowRight className="h-3 w-3 text-primary" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PERSONALIZED PRACTICE */}
      {activeTab === "personalized" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Student Profile & Placement Target Header */}
          <div className="p-6 rounded-sm border border-border-sharp bg-bg-surface">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-primary uppercase tracking-wider font-semibold">
                  PLACEMENT READINESS PROFILE
                </span>
                <h2 className="font-display text-lg font-bold text-text-main">
                  {userProfile?.careerGoal
                    ? `Target Track: ${userProfile.careerGoal}`
                    : "Software Engineer Placement Track"}
                </h2>
                <p className="font-sans text-xs text-text-sub">
                  College: {userProfile?.college || "SkillForge Campus"} • Grad Year:{" "}
                  {userProfile?.gradYear || "2025/2026"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-bg-base border border-border-sharp rounded-sm text-center">
                  <span className="font-mono text-[10px] text-text-sub block uppercase">
                    Composite Score
                  </span>
                  <span className="font-mono text-xl font-extrabold text-primary">
                    {readiness.overall} / 100
                  </span>
                </div>
              </div>
            </div>

            {/* Category Readiness Breakdown Bars */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-3 bg-bg-base border border-border-sharp rounded-sm space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-sans text-text-sub">Quantitative</span>
                  <span className="font-mono font-bold text-amber-400">
                    {readiness.aptitude}%
                  </span>
                </div>
                <div className="w-full bg-bg-elevated h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full"
                    style={{ width: `${readiness.aptitude}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-bg-base border border-border-sharp rounded-sm space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-sans text-text-sub">Logical Reasoning</span>
                  <span className="font-mono font-bold text-blue-400">
                    {readiness.logical}%
                  </span>
                </div>
                <div className="w-full bg-bg-elevated h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-400 h-full"
                    style={{ width: `${readiness.logical}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-bg-base border border-border-sharp rounded-sm space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-sans text-text-sub">Verbal Ability</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {readiness.verbal}%
                  </span>
                </div>
                <div className="w-full bg-bg-elevated h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full"
                    style={{ width: `${readiness.verbal}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-bg-base border border-border-sharp rounded-sm space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-sans text-text-sub">DSA & Algorithms</span>
                  <span className="font-mono font-bold text-purple-400">
                    {readiness.dsa}%
                  </span>
                </div>
                <div className="w-full bg-bg-elevated h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-400 h-full"
                    style={{ width: `${readiness.dsa}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-bg-base border border-border-sharp rounded-sm space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-sans text-text-sub">Core CS (OS/DBMS)</span>
                  <span className="font-mono font-bold text-cyan-400">
                    {readiness.coreCs}%
                  </span>
                </div>
                <div className="w-full bg-bg-elevated h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full"
                    style={{ width: `${readiness.coreCs}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Practice for Today */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold tracking-wider text-text-main uppercase flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Recommended Next Problems
              </h3>
              <span className="font-mono text-xs text-text-dim">
                Curated based on your weakest readiness sectors
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {initialQuestions
                .filter((q) => !solvedIds.has(q.id))
                .slice(0, 4)
                .map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-sm border border-border-sharp bg-bg-surface space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-mono text-[9px] font-bold px-2 py-0.5 border rounded-sm uppercase tracking-wider ${getDifficultyBadge(
                            q.difficulty
                          )}`}
                        >
                          {q.difficulty}
                        </span>
                        <span className="font-mono text-[10px] text-text-sub">
                          {q.subtopic.replace(/-/g, " ").toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-display text-sm font-semibold text-text-main">
                        {q.title}
                      </h4>
                      <p className="font-sans text-xs text-text-sub line-clamp-2">
                        {q.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border-sharp/40 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-text-dim">
                        {q.companies?.slice(0, 2).join(", ")}
                      </span>
                      <button
                        onClick={() => setActiveQuestion(q)}
                        className="flex items-center gap-1 font-sans text-xs font-semibold text-primary hover:text-primary-dim uppercase tracking-wider"
                      >
                        Solve Now <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Target Company Roadmaps */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-semibold tracking-wider text-text-main uppercase flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Target Company Cutoffs & Stages
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {companies.slice(0, 3).map((comp) => (
                <div
                  key={comp.id}
                  className="p-4 rounded-sm border border-border-sharp bg-bg-surface space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-bold text-text-main">
                      {comp.name}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 px-1.5 py-0.5 rounded-sm">
                      Cutoff: {comp.averageAptitudeCutoff}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-text-sub">
                    {comp.description}
                  </p>
                  <div className="space-y-1 pt-1">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-text-dim block">
                      Recruitment Stages:
                    </span>
                    <ul className="list-disc list-inside font-sans text-[11px] text-text-sub space-y-0.5">
                      {comp.hiringStages.map((stg, i) => (
                        <li key={i}>{stg}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Practice Modal */}
      {activeQuestion && (
        <QuestionPracticeModal
          question={activeQuestion}
          allQuestions={filteredQuestions}
          isSolved={solvedIds.has(activeQuestion.id)}
          isBookmarked={bookmarkedIds.has(activeQuestion.id)}
          onClose={() => setActiveQuestion(null)}
          onSelectQuestion={(q) => setActiveQuestion(q)}
          onSolveQuestion={handleSolveQuestion}
          onToggleBookmark={handleToggleBookmark}
        />
      )}
    </div>
  );
}
