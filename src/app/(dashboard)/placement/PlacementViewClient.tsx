"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
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
  Lock,
  LogIn,
  UserPlus,
  Timer,
  Shuffle,
  Clock,
  Award,
  Flame,
  Check,
} from "lucide-react";
import {
  PlacementCategory,
  PlacementQuestion,
  CompanyTrack,
  PlacementCategoryKey,
  QuestionDifficulty,
  MockTestResult,
} from "@/lib/placement/placementTypes";
import QuestionPracticeModal from "@/components/placement/QuestionPracticeModal";
import PlacementMockTestModal from "@/components/placement/PlacementMockTestModal";

/** Maximum number of question submissions allowed for guest users */
const GUEST_ATTEMPT_LIMIT = 3;
const GUEST_ATTEMPTS_KEY = "skillforge_guest_placement_attempts";

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
  initialQuestionId?: string | null;
  initialGuestAttempts?: number;
  initialSolvedQuestionIds?: string[];
}

type TabKey = "explore" | "topic-wise" | "personalized" | "mock-tests" | "mixed-practice";

export default function PlacementViewClient({
  categories,
  companies,
  initialQuestions,
  initialReadiness,
  userProfile,
  isAuthenticated,
  initialQuestionId,
  initialGuestAttempts = 0,
  initialSolvedQuestionIds = [],
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

  // Guest attempt tracking (persisted in sessionStorage and synced with server cookie)
  const [guestAttemptsUsed, setGuestAttemptsUsed] = useState<number>(initialGuestAttempts);

  // Whether to show the full-screen auth gate modal (4th attempt)
  const [showAuthGateModal, setShowAuthGateModal] = useState<boolean>(false);

  // The question that triggered the auth gate (so we can return to it after sign-in)
  const [pendingQuestion, setPendingQuestion] = useState<PlacementQuestion | null>(null);

  // Active Timed Mock Test state
  const [activeMockTest, setActiveMockTest] = useState<{
    isOpen: boolean;
    title: string;
    questions: PlacementQuestion[];
    durationMinutes: number;
    negativeMarking: number;
  } | null>(null);

  // Mixed Practice filters & options
  const [mixedDifficulty, setMixedDifficulty] = useState<string>("all");
  const [mixedSeed, setMixedSeed] = useState<number>(1);

  // Auto-open question if specified via URL or prop (e.g. after authentication)
  useEffect(() => {
    const targetId =
      initialQuestionId ||
      (typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("question") ||
          new URLSearchParams(window.location.search).get("q")
        : null);

    if (targetId) {
      const targetQ = initialQuestions.find((q) => q.id === targetId);
      if (targetQ) {
        setActiveQuestion(targetQ);
      }
    }
  }, [initialQuestionId, initialQuestions]);

  // Load local storage progress and guest attempt counter, merging with server-persisted solved IDs
  useEffect(() => {
    Promise.resolve().then(() => {
      try {
        const nextSolved = new Set<string>(initialSolvedQuestionIds || []);
        const savedSolved = localStorage.getItem("skillforge_placement_solved");
        if (savedSolved) {
          const parsed = JSON.parse(savedSolved);
          if (Array.isArray(parsed)) {
            parsed.forEach((id: string) => nextSolved.add(id));
          }
        }
        setSolvedIds(nextSolved);

        const savedBookmarks = localStorage.getItem("skillforge_placement_bookmarks");
        if (savedBookmarks) {
          setBookmarkedIds(new Set(JSON.parse(savedBookmarks)));
        }
        // Load guest attempt count from sessionStorage and cookie
        if (!isAuthenticated) {
          let count = initialGuestAttempts || 0;
          const savedAttempts = sessionStorage.getItem(GUEST_ATTEMPTS_KEY);
          if (savedAttempts) {
            count = Math.max(count, parseInt(savedAttempts, 10) || 0);
          }
          if (typeof document !== "undefined") {
            const match = document.cookie.match(/(?:^|;\s*)guest_placement_attempts=([^;]*)/);
            if (match) {
              count = Math.max(count, parseInt(decodeURIComponent(match[1]), 10) || 0);
            }
          }
          setGuestAttemptsUsed(count);
        }
      } catch (e) {
        console.error("Error reading localStorage:", e);
      }
    });
  }, [isAuthenticated, initialGuestAttempts, initialSolvedQuestionIds]);

  const handleSolveQuestion = (
    questionId: string,
    isCorrect: boolean,
    backendAttempts?: number,
    serverSolvedIds?: string[]
  ) => {
    const nextSolved = new Set(solvedIds);
    if (isCorrect) {
      nextSolved.add(questionId);
    }
    if (serverSolvedIds && Array.isArray(serverSolvedIds)) {
      serverSolvedIds.forEach((id) => nextSolved.add(id));
    }
    setSolvedIds(nextSolved);
    try {
      localStorage.setItem(
        "skillforge_placement_solved",
        JSON.stringify(Array.from(nextSolved))
      );
    } catch (e) {
      console.error(e);
    }

    // Track guest attempt count
    if (!isAuthenticated) {
      const next = typeof backendAttempts === "number" ? backendAttempts : guestAttemptsUsed + 1;
      setGuestAttemptsUsed(next);
      try {
        sessionStorage.setItem(GUEST_ATTEMPTS_KEY, String(next));
      } catch {}
    }

    if (isCorrect) {
      setReadiness((prev) => ({
        ...prev,
        overall: Math.min(100, prev.overall + 2),
      }));
    }
  };

  /**
   * Opens the practice modal for a question.
   * For guests: if they've used all attempts, show the auth gate modal instead.
   */
  const openQuestion = (q: PlacementQuestion) => {
    if (!isAuthenticated && guestAttemptsUsed >= GUEST_ATTEMPT_LIMIT) {
      setPendingQuestion(q);
      setShowAuthGateModal(true);
      return;
    }
    setActiveQuestion(q);
    // Keep URL in sync with selected question so bookmarks/refresh keep question
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("question", q.id);
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  };

  const handleCloseModal = () => {
    setActiveQuestion(null);
    setPendingQuestion(null);
    if (typeof window !== "undefined" && window.location.search.includes("question")) {
      const url = new URL(window.location.href);
      url.searchParams.delete("question");
      url.searchParams.delete("q");
      window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
    }
  };

  /** Called from inside QuestionPracticeModal when backend returns 403 guest limit */
  const handleInModalSignIn = () => {
    setPendingQuestion(activeQuestion);
    setShowAuthGateModal(true);
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

  // Map categories to user readiness scores
  const categoryReadinessMap = useMemo<
    Record<PlacementCategoryKey, { name: string; score: number }>
  >(
    () => ({
      "quantitative-aptitude": {
        name: "Quantitative Aptitude",
        score: readiness.aptitude,
      },
      "logical-reasoning": {
        name: "Logical Reasoning",
        score: readiness.logical,
      },
      "verbal-ability": {
        name: "Verbal Ability",
        score: readiness.verbal,
      },
      "dsa-coding": {
        name: "DSA & Algorithms",
        score: readiness.dsa,
      },
      "technical-fundamentals": {
        name: "Core CS",
        score: readiness.coreCs,
      },
    }),
    [readiness]
  );

  // Rank categories from lowest readiness (weakest) to highest
  const sortedWeakCategories = useMemo(() => {
    return (Object.keys(categoryReadinessMap) as PlacementCategoryKey[])
      .map((k) => ({ id: k, ...categoryReadinessMap[k] }))
      .sort((a, b) => a.score - b.score);
  }, [categoryReadinessMap]);

  // Personalized Problem Recommendations:
  // Dynamically ranks unsolved questions prioritising user's weakest categories and target company
  const personalizedRecommendations = useMemo(() => {
    const unsolved = initialQuestions.filter((q) => !solvedIds.has(q.id));
    const targetGoal = (userProfile?.careerGoal || "").toLowerCase();

    const scored = unsolved.map((q) => {
      const catInfo = categoryReadinessMap[q.categoryId];
      const catScore = catInfo?.score ?? 50;

      // Base weight: inversely proportional to readiness (lower score = higher priority)
      let score = (100 - catScore) * 2;

      // Target company match boost
      let companyMatch = false;
      if (targetGoal && q.companies) {
        companyMatch = q.companies.some((comp) =>
          targetGoal.includes(comp.toLowerCase())
        );
        if (companyMatch) score += 40;
      }

      // Difficulty calibration according to mastery
      if (catScore < 50) {
        if (q.difficulty === "EASY") score += 30;
        else if (q.difficulty === "MEDIUM") score += 20;
        else score += 5;
      } else if (catScore <= 75) {
        if (q.difficulty === "MEDIUM") score += 30;
        else if (q.difficulty === "HARD") score += 25;
        else score += 10;
      } else {
        if (q.difficulty === "HARD") score += 35;
        else if (q.difficulty === "MEDIUM") score += 20;
        else score += 5;
      }

      let reason = `Weak Area Focus: ${catInfo?.name || q.categoryId} (${catScore}%)`;
      if (companyMatch) {
        reason = `Target Track Match: ${catInfo?.name || q.categoryId}`;
      } else if (catScore < 45) {
        reason = `Critical Skill Gap: ${catInfo?.name || q.categoryId} (${catScore}%)`;
      }

      return {
        question: q,
        score,
        reason,
        catScore,
        categoryName: catInfo?.name || q.categoryId,
      };
    });

    scored.sort((a, b) => b.score - a.score);

    // Fallback if all questions are solved: provide review recommendations
    if (scored.length === 0 && initialQuestions.length > 0) {
      return initialQuestions.slice(0, 4).map((q) => ({
        question: q,
        score: 0,
        reason: "Review & Refine: Previously mastered problem",
        catScore: categoryReadinessMap[q.categoryId]?.score ?? 50,
        categoryName: categoryReadinessMap[q.categoryId]?.name || q.categoryId,
      }));
    }

    return scored.slice(0, 4);
  }, [initialQuestions, solvedIds, categoryReadinessMap, userProfile]);

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
      {/* Guest attempt notice banner */}
      {!isAuthenticated && (
        <div className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-sm border text-xs font-sans ${
          guestAttemptsUsed >= GUEST_ATTEMPT_LIMIT
            ? "border-primary/40 bg-primary/5 text-text-sub"
            : "border-border-sharp bg-bg-surface text-text-sub"
        }`}>
          <span className="flex items-center gap-2">
            <Lock className={`h-3.5 w-3.5 flex-shrink-0 ${guestAttemptsUsed >= GUEST_ATTEMPT_LIMIT ? "text-primary" : "text-text-dim"}`} />
            {guestAttemptsUsed >= GUEST_ATTEMPT_LIMIT ? (
              <span>
                Guest limit reached.{" "}
                <span className="font-semibold text-primary">Sign in to unlock unlimited practice.</span>
              </span>
            ) : (
              <span>
                Guest mode:{" "}
                <span className="font-semibold text-text-main">{GUEST_ATTEMPT_LIMIT - guestAttemptsUsed} of {GUEST_ATTEMPT_LIMIT}</span> free submissions remaining. Browse all questions freely.
              </span>
            )}
          </span>
          <a
            href={`/login?callbackUrl=${encodeURIComponent("/placement")}`}
            className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-sm bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-sans text-[10px] font-semibold uppercase tracking-wider transition-colors"
          >
            <LogIn className="h-3 w-3" />
            Sign In
          </a>
        </div>
      )}

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

        <button
          onClick={() => setActiveTab("mock-tests")}
          className={`flex items-center gap-2 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider border-b-2 transition-all -mb-[1px] ${
            activeTab === "mock-tests"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-text-sub hover:text-text-main"
          }`}
        >
          <Timer className="h-4 w-4" />
          Timed Mock Tests
        </button>

        <button
          onClick={() => setActiveTab("mixed-practice")}
          className={`flex items-center gap-2 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider border-b-2 transition-all -mb-[1px] ${
            activeTab === "mixed-practice"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-text-sub hover:text-text-main"
          }`}
        >
          <Shuffle className="h-4 w-4" />
          Mixed Practice
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
                        onClick={() => openQuestion(q)}
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
                        onClick={() => openQuestion(q)}
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-display text-sm font-semibold tracking-wider text-text-main uppercase flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" /> Personalized Problem Recommendations
                </h3>
                <p className="font-sans text-xs text-text-sub mt-0.5">
                  Algorithmically ranked based on your lowest readiness sectors (
                  <span className="text-primary font-semibold">
                    {sortedWeakCategories[0]?.name} {sortedWeakCategories[0]?.score}%
                  </span>
                  {sortedWeakCategories[1] && (
                    <span>
                      , {sortedWeakCategories[1]?.name} {sortedWeakCategories[1]?.score}%
                    </span>
                  )}
                  ) and difficulty calibration.
                </p>
              </div>
              <span className="font-mono text-[10px] px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20 self-start sm:self-auto">
                Weak-Category Prioritization Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalizedRecommendations.map(({ question: q, reason }) => (
                <div
                  key={q.id}
                  className="p-4 rounded-sm border border-border-sharp bg-bg-surface space-y-2 flex flex-col justify-between hover:border-primary/40 transition-all shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-1.5">
                      <div className="flex items-center gap-1.5">
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
                      <span className="font-mono text-[9px] text-primary/90 bg-primary/10 border border-primary/25 px-1.5 py-0.5 rounded-sm flex items-center gap-1">
                        <Sparkles className="h-2.5 w-2.5" />
                        {reason}
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
                      onClick={() => openQuestion(q)}
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

      {/* TAB 4: TIMED MOCK TESTS */}
      {activeTab === "mock-tests" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-sm border border-primary/30 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-primary" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                  Standard Placement OA Simulation Engine
                </span>
              </div>
              <h2 className="font-display text-lg font-bold text-text-main">
                Timed Mock Assessments & Negative Marking
              </h2>
              <p className="font-sans text-xs text-text-sub max-w-2xl">
                Experience realistic campus hiring assessment conditions: countdown timer with auto-submit, interactive question navigation palette, mark for review, negative marking (-0.25 per wrong answer), and instant result analysis breakdown.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Full Assessment */}
            <div className="p-5 rounded-sm border border-border-sharp bg-bg-surface hover:border-primary/50 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-sm uppercase font-bold">
                    Comprehensive OA
                  </span>
                  <span className="font-mono text-xs text-text-dim flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-text-sub" /> 25 Mins
                  </span>
                </div>
                <h3 className="font-display text-base font-bold text-text-main">
                  Full Placement Mock Assessment
                </h3>
                <p className="font-sans text-xs text-text-sub leading-relaxed">
                  20 questions balanced across Quantitative Aptitude, Logical Reasoning, Verbal Ability, DSA, and Core CS Fundamentals.
                </p>
                <div className="pt-2 flex items-center gap-2 font-mono text-[11px] text-text-sub">
                  <span>Questions: <strong>20</strong></span>
                  <span>•</span>
                  <span>Marking: <strong className="text-emerald-400">+1.0</strong> / <strong className="text-rose-400">-0.25</strong></span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  // Pick balanced set across categories
                  const quant = initialQuestions.filter((q) => q.categoryId === "quantitative-aptitude").slice(0, 5);
                  const lr = initialQuestions.filter((q) => q.categoryId === "logical-reasoning").slice(0, 5);
                  const verbal = initialQuestions.filter((q) => q.categoryId === "verbal-ability").slice(0, 4);
                  const dsa = initialQuestions.filter((q) => q.categoryId === "dsa-coding").slice(0, 3);
                  const core = initialQuestions.filter((q) => q.categoryId === "technical-fundamentals").slice(0, 3);
                  const mockSet = [...quant, ...lr, ...verbal, ...dsa, ...core];

                  setActiveMockTest({
                    isOpen: true,
                    title: "Full Placement Mock Assessment",
                    questions: mockSet.length > 0 ? mockSet : initialQuestions.slice(0, 20),
                    durationMinutes: 25,
                    negativeMarking: 0.25,
                  });
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-primary hover:bg-primary-dim text-bg-base font-sans text-xs font-bold uppercase tracking-wider transition-all"
              >
                Start Assessment <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* 2. Quant & DI Sprint */}
            <div className="p-5 rounded-sm border border-border-sharp bg-bg-surface hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-amber-400 bg-amber-950/30 border border-amber-800/40 px-2 py-0.5 rounded-sm uppercase font-bold">
                    Arithmetic & Charts
                  </span>
                  <span className="font-mono text-xs text-text-dim flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-text-sub" /> 15 Mins
                  </span>
                </div>
                <h3 className="font-display text-base font-bold text-text-main">
                  Quantitative Aptitude & DI Sprint
                </h3>
                <p className="font-sans text-xs text-text-sub leading-relaxed">
                  12 high-yield questions covering Number System, LCM/HCF, Percentages, Time & Work, Speed, and Data Interpretation graphs.
                </p>
                <div className="pt-2 flex items-center gap-2 font-mono text-[11px] text-text-sub">
                  <span>Questions: <strong>12</strong></span>
                  <span>•</span>
                  <span>Marking: <strong className="text-emerald-400">+1.0</strong> / <strong className="text-rose-400">-0.25</strong></span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const quantSet = initialQuestions.filter((q) => q.categoryId === "quantitative-aptitude").slice(0, 12);
                  setActiveMockTest({
                    isOpen: true,
                    title: "Quantitative Aptitude & DI Sprint",
                    questions: quantSet,
                    durationMinutes: 15,
                    negativeMarking: 0.25,
                  });
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-amber-500 hover:bg-amber-400 text-bg-base font-sans text-xs font-bold uppercase tracking-wider transition-all"
              >
                Start Quant Sprint <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* 3. Logical Reasoning Speed Test */}
            <div className="p-5 rounded-sm border border-border-sharp bg-bg-surface hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-blue-400 bg-blue-950/30 border border-blue-800/40 px-2 py-0.5 rounded-sm uppercase font-bold">
                    Deduction & Logic
                  </span>
                  <span className="font-mono text-xs text-text-dim flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-text-sub" /> 12 Mins
                  </span>
                </div>
                <h3 className="font-display text-base font-bold text-text-main">
                  Logical Reasoning Speed Test
                </h3>
                <p className="font-sans text-xs text-text-sub leading-relaxed">
                  10 questions spanning Syllogisms, Seating Arrangements, Blood Relations, Directions, Clocks, and Calendars.
                </p>
                <div className="pt-2 flex items-center gap-2 font-mono text-[11px] text-text-sub">
                  <span>Questions: <strong>10</strong></span>
                  <span>•</span>
                  <span>Marking: <strong className="text-emerald-400">+1.0</strong> / <strong className="text-rose-400">-0.25</strong></span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const lrSet = initialQuestions.filter((q) => q.categoryId === "logical-reasoning").slice(0, 10);
                  setActiveMockTest({
                    isOpen: true,
                    title: "Logical Reasoning Speed Test",
                    questions: lrSet,
                    durationMinutes: 12,
                    negativeMarking: 0.25,
                  });
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-bold uppercase tracking-wider transition-all"
              >
                Start Reasoning Test <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* 4. DSA & Technical Screening */}
            <div className="p-5 rounded-sm border border-border-sharp bg-bg-surface hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-purple-400 bg-purple-950/30 border border-purple-800/40 px-2 py-0.5 rounded-sm uppercase font-bold">
                    Algorithms & Core
                  </span>
                  <span className="font-mono text-xs text-text-dim flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-text-sub" /> 15 Mins
                  </span>
                </div>
                <h3 className="font-display text-base font-bold text-text-main">
                  DSA & Technical Screening
                </h3>
                <p className="font-sans text-xs text-text-sub leading-relaxed">
                  10 technical screening questions covering Arrays, Two Pointers, Trees, Dynamic Programming, OS, and DBMS.
                </p>
                <div className="pt-2 flex items-center gap-2 font-mono text-[11px] text-text-sub">
                  <span>Questions: <strong>10</strong></span>
                  <span>•</span>
                  <span>Marking: <strong className="text-emerald-400">+1.0</strong> / <strong className="text-rose-400">-0.25</strong></span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const dsaQ = initialQuestions.filter((q) => q.categoryId === "dsa-coding").slice(0, 6);
                  const coreQ = initialQuestions.filter((q) => q.categoryId === "technical-fundamentals").slice(0, 4);
                  setActiveMockTest({
                    isOpen: true,
                    title: "DSA & Technical Screening",
                    questions: [...dsaQ, ...coreQ],
                    durationMinutes: 15,
                    negativeMarking: 0.25,
                  });
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-purple-600 hover:bg-purple-500 text-white font-sans text-xs font-bold uppercase tracking-wider transition-all"
              >
                Start Tech Screening <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* 5. Verbal Ability Proficiency */}
            <div className="p-5 rounded-sm border border-border-sharp bg-bg-surface hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 px-2 py-0.5 rounded-sm uppercase font-bold">
                    Language & Grammar
                  </span>
                  <span className="font-mono text-xs text-text-dim flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-text-sub" /> 10 Mins
                  </span>
                </div>
                <h3 className="font-display text-base font-bold text-text-main">
                  Verbal Ability Proficiency
                </h3>
                <p className="font-sans text-xs text-text-sub leading-relaxed">
                  10 questions assessing Sentence Correction, Error Spotting, Reading Comprehension, Synonyms, and Antonyms.
                </p>
                <div className="pt-2 flex items-center gap-2 font-mono text-[11px] text-text-sub">
                  <span>Questions: <strong>10</strong></span>
                  <span>•</span>
                  <span>Marking: <strong className="text-emerald-400">+1.0</strong> / <strong className="text-rose-400">-0.25</strong></span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const verbalSet = initialQuestions.filter((q) => q.categoryId === "verbal-ability").slice(0, 10);
                  setActiveMockTest({
                    isOpen: true,
                    title: "Verbal Ability Proficiency",
                    questions: verbalSet,
                    durationMinutes: 10,
                    negativeMarking: 0.25,
                  });
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-bold uppercase tracking-wider transition-all"
              >
                Start Verbal Test <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MIXED PRACTICE */}
      {activeTab === "mixed-practice" && (() => {
        // Compute pseudo-random mixed question set based on difficulty and seed
        const mixedQuestions = initialQuestions
          .filter((q) => mixedDifficulty === "all" || q.difficulty === mixedDifficulty)
          .slice()
          .sort((a, b) => {
            // deterministic pseudo-shuffle based on question id and seed
            const hashA = (a.id.charCodeAt(0) * 31 + a.id.charCodeAt(a.id.length - 1)) * mixedSeed;
            const hashB = (b.id.charCodeAt(0) * 31 + b.id.charCodeAt(b.id.length - 1)) * mixedSeed;
            return (hashA % 100) - (hashB % 100);
          })
          .slice(0, 15);

        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header / Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border-sharp pb-4 gap-4">
              <div>
                <h2 className="font-display text-lg font-bold text-text-main uppercase flex items-center gap-2">
                  <Shuffle className="h-5 w-5 text-primary" />
                  Mixed Practice Mode
                </h2>
                <p className="font-sans text-xs text-text-sub">
                  Practice questions randomly selected across Quantitative, Logical, Verbal, DSA, and Core CS.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Difficulty selector */}
                <div className="flex items-center gap-1 bg-bg-surface p-1 rounded-sm border border-border-sharp text-xs">
                  {(["all", "EASY", "MEDIUM", "HARD"] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setMixedDifficulty(diff)}
                      className={`px-2.5 py-1 rounded-xs font-mono text-[10px] uppercase font-bold transition-colors ${
                        mixedDifficulty === diff
                          ? "bg-primary text-bg-base"
                          : "text-text-sub hover:text-text-main"
                      }`}
                    >
                      {diff === "all" ? "All Levels" : diff}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setMixedSeed((prev) => prev + 1)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-border-sharp bg-bg-surface hover:bg-bg-elevated text-text-main font-sans text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reshuffle
                </button>
              </div>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mixedQuestions.map((q) => {
                const isSolved = solvedIds.has(q.id);
                const isBookmarked = bookmarkedIds.has(q.id);

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-sm border border-border-sharp bg-bg-surface hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-mono text-[9px] font-bold px-2 py-0.5 border rounded-sm uppercase tracking-wider ${getDifficultyBadge(
                              q.difficulty
                            )}`}
                          >
                            {q.difficulty}
                          </span>
                          <span className="font-mono text-[10px] text-text-sub border border-border-sharp px-1.5 py-0.5 rounded-sm">
                            {q.categoryId.replace(/-/g, " ")}
                          </span>
                        </div>
                        {isSolved && (
                          <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
                            <Check className="h-3 w-3" /> Solved
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-sm font-bold text-text-main leading-snug">
                        {q.title}
                      </h3>
                      <p className="font-sans text-xs text-text-sub line-clamp-2 leading-relaxed">
                        {q.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border-sharp/40 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-text-dim">
                        {q.subtopic.replace(/-/g, " ")}
                      </span>
                      <button
                        type="button"
                        onClick={() => openQuestion(q)}
                        className="flex items-center gap-1 font-sans text-xs font-semibold text-primary hover:text-primary-dim uppercase tracking-wider"
                      >
                        Solve <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Interactive Practice Modal */}
      {activeQuestion && (
        <QuestionPracticeModal
          question={activeQuestion}
          allQuestions={filteredQuestions}
          isSolved={solvedIds.has(activeQuestion.id)}
          isBookmarked={bookmarkedIds.has(activeQuestion.id)}
          onClose={handleCloseModal}
          onSelectQuestion={(q) => openQuestion(q)}
          onSolveQuestion={handleSolveQuestion}
          onToggleBookmark={handleToggleBookmark}
          isGuestLimited={!isAuthenticated && guestAttemptsUsed >= GUEST_ATTEMPT_LIMIT}
          onSignInClick={handleInModalSignIn}
          guestAttemptsUsed={guestAttemptsUsed}
        />
      )}

      {/* Timed Mock Test Assessment Modal */}
      {activeMockTest && (
        <PlacementMockTestModal
          isOpen={activeMockTest.isOpen}
          onClose={() => setActiveMockTest(null)}
          questions={activeMockTest.questions}
          testTitle={activeMockTest.title}
          durationMinutes={activeMockTest.durationMinutes}
          negativeMarking={activeMockTest.negativeMarking}
          isAuthenticated={isAuthenticated}
          onTestCompleted={(result) => {
            // Update local readiness based on performance
            setReadiness((prev) => ({
              ...prev,
              overall: Math.min(100, Math.max(prev.overall, Math.round(result.accuracy))),
            }));
          }}
        />
      )}

      {/* Full-screen Auth Gate Modal (shown on 4th guest attempt) */}
      {showAuthGateModal && (() => {
        const targetQId = pendingQuestion?.id || activeQuestion?.id;
        const returnUrl = targetQId
          ? `/placement?question=${encodeURIComponent(targetQId)}`
          : "/placement";
        const loginUrl = `/login?callbackUrl=${encodeURIComponent(returnUrl)}`;
        const registerUrl = `/register?callbackUrl=${encodeURIComponent(returnUrl)}`;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-bg-surface border border-border-sharp rounded-sm shadow-2xl p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center">
                  <div className="p-3 rounded-sm bg-primary/10 border border-primary/30">
                    <Lock className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <div>
                  <span className="font-mono text-[9px] tracking-widest text-primary uppercase font-bold">
                    Practice Limit Reached
                  </span>
                  <h2 className="mt-1 font-display text-xl font-extrabold tracking-tight text-text-main uppercase">
                    Unlock Full Access
                  </h2>
                </div>
                <p className="font-sans text-sm text-text-sub leading-relaxed">
                  You&apos;ve used all{" "}
                  <span className="text-primary font-semibold">3 free guest attempts</span>.{" "}
                  Sign in or create a free account to unlock unlimited practice across all{" "}
                  <span className="font-semibold text-text-main">{initialQuestions.length} placement questions</span>.
                </p>
              </div>

              {/* Benefits list */}
              <ul className="space-y-2 text-xs font-sans text-text-sub">
                {[
                  "Unlimited practice across all 5 categories",
                  "Persistent progress tracking & readiness score",
                  "Bookmarks and solved history saved to your account",
                  "Personalized recommendations based on weaknesses",
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <a
                  href={loginUrl}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-sm bg-primary hover:bg-primary-dim text-bg-base font-sans text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In to Continue
                </a>
                <a
                  href={registerUrl}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-sm bg-bg-base hover:bg-bg-elevated border border-border-sharp text-text-main font-sans text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  <UserPlus className="h-4 w-4" />
                  Create Free Account
                </a>
                <button
                  onClick={() => {
                    setShowAuthGateModal(false);
                    // If there's a pending question, still open the modal in guest-limited mode
                    if (pendingQuestion) {
                      setActiveQuestion(pendingQuestion);
                      setPendingQuestion(null);
                    }
                  }}
                  className="w-full text-center font-mono text-[10px] text-text-dim hover:text-text-sub transition-colors py-1"
                >
                  Continue browsing as guest
                </button>
              </div>

              <p className="font-mono text-[10px] text-text-dim text-center">
                Free forever — no credit card required
              </p>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
