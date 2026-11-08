"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  BookmarkCheck,
  AlertTriangle,
  RotateCcw,
  Award,
  BarChart3,
  Check,
  Layers,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  PlacementQuestion,
  MockTestQuestionState,
  MockTestResult,
  PlacementCategoryKey,
} from "@/lib/placement/placementTypes";

interface PlacementMockTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: PlacementQuestion[];
  testTitle?: string;
  durationMinutes?: number;
  negativeMarking?: number;
  isAuthenticated?: boolean;
  onTestCompleted?: (result: MockTestResult) => void;
}

export default function PlacementMockTestModal({
  isOpen,
  onClose,
  questions,
  testTitle = "Placement Assessment Mock Test",
  durationMinutes = 20,
  negativeMarking = 0.25,
  isAuthenticated = false,
  onTestCompleted,
}: PlacementMockTestModalProps) {
  // Test phases: "START" | "IN_PROGRESS" | "RESULT"
  const [phase, setPhase] = useState<"START" | "IN_PROGRESS" | "RESULT">("START");
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  // Question state dictionary keyed by questionId
  const [questionStates, setQuestionStates] = useState<Record<string, MockTestQuestionState>>({});

  // Countdown timer state in seconds
  const [timeRemaining, setTimeRemaining] = useState<number>(durationMinutes * 60);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState<boolean>(false);
  const [result, setResult] = useState<MockTestResult | null>(null);

  // Review filter in results screen: "all" | "correct" | "incorrect" | "skipped"
  const [reviewFilter, setReviewFilter] = useState<"all" | "correct" | "incorrect" | "skipped">("all");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize question states when questions prop or modal opens
  useEffect(() => {
    if (isOpen && questions.length > 0) {
      const initialStates: Record<string, MockTestQuestionState> = {};
      questions.forEach((q) => {
        initialStates[q.id] = {
          questionId: q.id,
          selectedOption: null,
          status: "UNVISITED",
          timeSpentSeconds: 0,
        };
      });
      setQuestionStates(initialStates);
      setTimeRemaining(durationMinutes * 60);
      setCurrentIdx(0);
      setPhase("START");
      setShowSubmitConfirm(false);
      setResult(null);
    }
  }, [isOpen, questions, durationMinutes]);

  // Handle countdown timer during IN_PROGRESS
  useEffect(() => {
    if (phase === "IN_PROGRESS") {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleFinalSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  if (!isOpen || questions.length === 0) return null;

  const currentQ = questions[currentIdx];
  const currentState = questionStates[currentQ?.id] || {
    questionId: currentQ?.id,
    selectedOption: null,
    status: "UNVISITED",
    timeSpentSeconds: 0,
  };

  // Counts for the palette
  const answeredCount = Object.values(questionStates).filter(
    (s) => s.status === "ANSWERED" || s.status === "ANSWERED_MARKED"
  ).length;
  const markedCount = Object.values(questionStates).filter(
    (s) => s.status === "MARKED_FOR_REVIEW"
  ).length;
  const answeredMarkedCount = Object.values(questionStates).filter(
    (s) => s.status === "ANSWERED_MARKED"
  ).length;
  const unvisitedCount = questions.length - answeredCount - markedCount;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleStartTest = () => {
    setPhase("IN_PROGRESS");
    setTimeRemaining(durationMinutes * 60);
  };

  const handleOptionSelect = (optionIdx: number) => {
    if (phase !== "IN_PROGRESS") return;
    setQuestionStates((prev) => {
      const existing = prev[currentQ.id];
      const newStatus =
        existing?.status === "MARKED_FOR_REVIEW" || existing?.status === "ANSWERED_MARKED"
          ? "ANSWERED_MARKED"
          : "ANSWERED";

      return {
        ...prev,
        [currentQ.id]: {
          ...existing,
          selectedOption: optionIdx,
          status: newStatus,
        },
      };
    });
  };

  const handleClearSelection = () => {
    setQuestionStates((prev) => {
      const existing = prev[currentQ.id];
      return {
        ...prev,
        [currentQ.id]: {
          ...existing,
          selectedOption: null,
          status:
            existing?.status === "ANSWERED_MARKED"
              ? "MARKED_FOR_REVIEW"
              : "SKIPPED",
        },
      };
    });
  };

  const handleToggleMarkForReview = () => {
    setQuestionStates((prev) => {
      const existing = prev[currentQ.id];
      const hasAnswer = existing?.selectedOption !== null && existing?.selectedOption !== undefined;

      let nextStatus: MockTestQuestionState["status"] = "MARKED_FOR_REVIEW";
      if (existing?.status === "MARKED_FOR_REVIEW") {
        nextStatus = hasAnswer ? "ANSWERED" : "SKIPPED";
      } else if (existing?.status === "ANSWERED_MARKED") {
        nextStatus = "ANSWERED";
      } else {
        nextStatus = hasAnswer ? "ANSWERED_MARKED" : "MARKED_FOR_REVIEW";
      }

      return {
        ...prev,
        [currentQ.id]: {
          ...existing,
          status: nextStatus,
        },
      };
    });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleFinalSubmit = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowSubmitConfirm(false);

    const timeSpent = durationMinutes * 60 - timeRemaining;
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    const categoryStats: MockTestResult["categoryBreakdown"] = {};

    questions.forEach((q) => {
      const userState = questionStates[q.id];
      const selected = userState?.selectedOption;

      // Ensure category bucket exists
      if (!categoryStats[q.categoryId]) {
        categoryStats[q.categoryId] = {
          total: 0,
          correct: 0,
          incorrect: 0,
          score: 0,
        };
      }
      categoryStats[q.categoryId].total += 1;

      if (selected === null || selected === undefined) {
        skipped++;
      } else if (Number(selected) === Number(q.correctAnswer)) {
        correct++;
        categoryStats[q.categoryId].correct += 1;
        categoryStats[q.categoryId].score += 1;
      } else {
        incorrect++;
        categoryStats[q.categoryId].incorrect += 1;
        categoryStats[q.categoryId].score -= negativeMarking;
      }
    });

    const marksObtained = Math.max(0, Number((correct * 1 - incorrect * negativeMarking).toFixed(2)));
    const totalMarks = questions.length;
    const accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;

    const finalResult: MockTestResult = {
      totalQuestions: questions.length,
      attemptedCount: correct + incorrect,
      correctCount: correct,
      incorrectCount: incorrect,
      skippedCount: skipped,
      marksObtained,
      totalMarks,
      accuracy,
      timeSpentSeconds: timeSpent,
      categoryBreakdown: categoryStats,
    };

    setResult(finalResult);
    setPhase("RESULT");

    // Persist attempts if authenticated
    if (isAuthenticated) {
      questions.forEach(async (q) => {
        const state = questionStates[q.id];
        if (state?.selectedOption !== null && state?.selectedOption !== undefined) {
          try {
            await fetch("/api/placement/practice", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                questionId: q.id,
                selectedAnswerIndex: state.selectedOption,
              }),
            });
          } catch {
            // Silently fall back
          }
        }
      });
    }

    if (onTestCompleted) {
      onTestCompleted(finalResult);
    }
  };

  // Helper for Palette item style
  const getPaletteBtnStyle = (q: PlacementQuestion, idx: number) => {
    const s = questionStates[q.id]?.status || "UNVISITED";
    const isCurrent = idx === currentIdx;
    let base = "h-8 w-8 rounded-sm font-mono text-xs flex items-center justify-center font-bold transition-all border ";

    if (isCurrent) {
      base += "ring-2 ring-primary ring-offset-2 ring-offset-bg-base ";
    }

    switch (s) {
      case "ANSWERED":
        return base + "bg-emerald-600/30 border-emerald-500 text-emerald-300";
      case "MARKED_FOR_REVIEW":
        return base + "bg-amber-600/30 border-amber-500 text-amber-300";
      case "ANSWERED_MARKED":
        return base + "bg-purple-600/30 border-purple-500 text-purple-300";
      default:
        return base + "bg-bg-elevated/40 border-border-sharp text-text-sub hover:border-text-dim";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col bg-bg-surface border border-border-sharp rounded-sm shadow-2xl overflow-hidden">
        
        {/* ============================================================ */}
        {/* 1. START SCREEN */}
        {/* ============================================================ */}
        {phase === "START" && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 text-center max-w-2xl mx-auto space-y-6">
            <div className="p-4 rounded-full bg-primary/10 border border-primary/30 text-primary">
              <Timer className="h-10 w-10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-text-main">
                {testTitle}
              </h2>
              <p className="font-sans text-sm text-text-sub">
                Comprehensive timed mock assessment simulating real campus recruitment online assessments (TCS NQT, Infosys, Cognizant, Amazon OA).
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl text-left">
              <div className="p-3 rounded-sm bg-bg-base border border-border-sharp">
                <span className="font-mono text-[10px] text-text-dim uppercase tracking-wider block">Questions</span>
                <span className="font-display text-lg font-bold text-text-main">{questions.length}</span>
              </div>
              <div className="p-3 rounded-sm bg-bg-base border border-border-sharp">
                <span className="font-mono text-[10px] text-text-dim uppercase tracking-wider block">Duration</span>
                <span className="font-display text-lg font-bold text-text-main">{durationMinutes} Mins</span>
              </div>
              <div className="p-3 rounded-sm bg-bg-base border border-border-sharp">
                <span className="font-mono text-[10px] text-text-dim uppercase tracking-wider block">Marking</span>
                <span className="font-display text-lg font-bold text-emerald-400">+1.0 / -{negativeMarking}</span>
              </div>
              <div className="p-3 rounded-sm bg-bg-base border border-border-sharp">
                <span className="font-mono text-[10px] text-text-dim uppercase tracking-wider block">Sections</span>
                <span className="font-display text-lg font-bold text-primary">Mixed Topics</span>
              </div>
            </div>

            <div className="text-left w-full max-w-xl p-4 rounded-sm bg-bg-base/60 border border-border-sharp/80 space-y-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary block">
                Assessment Instructions:
              </span>
              <ul className="list-disc list-inside font-sans text-xs text-text-sub space-y-1">
                <li>Each question carries <strong>1 mark</strong>. Incorrect answers deduct <strong>{negativeMarking} mark</strong>.</li>
                <li>You can flag questions using &ldquo;Mark for Review&rdquo; and return to them anytime.</li>
                <li>Use the Question Palette on the right to navigate directly to any problem.</li>
                <li>The test will automatically submit when the countdown timer hits 00:00.</li>
              </ul>
            </div>

            <div className="flex items-center gap-3 w-full max-w-md pt-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-sm border border-border-sharp hover:bg-bg-elevated text-text-sub font-sans text-xs font-semibold uppercase tracking-wider transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleStartTest}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-primary hover:bg-primary-dim text-bg-base font-sans text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-primary/20"
              >
                Start Assessment <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 2. IN_PROGRESS ASSESSMENT SCREEN */}
        {/* ============================================================ */}
        {phase === "IN_PROGRESS" && (
          <div className="flex flex-col h-full">
            {/* Top Bar with Timer and Submit */}
            <div className="flex items-center justify-between border-b border-border-sharp px-4 sm:px-6 py-3 bg-bg-base/80">
              <div className="flex items-center gap-3">
                <span className="font-display text-sm sm:text-base font-bold text-text-main truncate max-w-[200px] sm:max-w-md">
                  {testTitle}
                </span>
                <span className="font-mono text-[11px] text-text-sub bg-bg-elevated px-2 py-0.5 rounded-sm border border-border-sharp">
                  Q {currentIdx + 1} of {questions.length}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Live Countdown Timer */}
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-sm border font-mono text-sm font-bold ${
                    timeRemaining < 120
                      ? "border-rose-500/50 bg-rose-950/30 text-rose-400 animate-pulse"
                      : timeRemaining < 300
                      ? "border-amber-500/50 bg-amber-950/30 text-amber-400"
                      : "border-primary/40 bg-primary/10 text-primary"
                  }`}
                >
                  <Timer className="h-4 w-4" />
                  <span>{formatTime(timeRemaining)}</span>
                </div>

                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  className="px-3.5 py-1.5 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Submit Test
                </button>
              </div>
            </div>

            {/* Main Area: Split between Question Content & Palette Sidebar */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Left: Active Question Area */}
              <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 space-y-5">
                {/* Question Info Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-sharp/40 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">
                      Question {currentIdx + 1}
                    </span>
                    <span className="font-mono text-[10px] text-text-dim border border-border-sharp px-1.5 py-0.5 rounded-sm uppercase">
                      {currentQ.categoryId.replace(/-/g, " ")}
                    </span>
                    <span className="font-mono text-[10px] text-text-dim border border-border-sharp px-1.5 py-0.5 rounded-sm uppercase">
                      {currentQ.subtopic.replace(/-/g, " ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-emerald-400">+1.0</span>
                    <span className="text-text-dim">/</span>
                    <span className="text-rose-400">-{negativeMarking}</span>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-3">
                  <h3 className="font-display text-base sm:text-lg font-bold text-text-main leading-snug">
                    {currentQ.title}
                  </h3>
                  <div className="font-sans text-xs sm:text-sm text-text-sub whitespace-pre-line leading-relaxed bg-bg-base/40 p-4 rounded-sm border border-border-sharp/50">
                    {currentQ.description}
                  </div>
                </div>

                {/* Options List */}
                {currentQ.options && currentQ.options.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-text-sub font-semibold">
                      Select an Option:
                    </span>
                    <div className="space-y-2">
                      {currentQ.options.map((opt, optIdx) => {
                        const isSelected = currentState.selectedOption === optIdx;

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleOptionSelect(optIdx)}
                            className={`w-full text-left p-3.5 rounded-sm border transition-all flex items-start gap-3 ${
                              isSelected
                                ? "border-primary bg-primary/10 shadow-sm"
                                : "border-border-sharp hover:border-primary/40 bg-bg-base hover:bg-bg-elevated/40"
                            }`}
                          >
                            <span
                              className={`flex items-center justify-center h-6 w-6 rounded-sm border font-mono text-xs flex-shrink-0 ${
                                isSelected
                                  ? "border-primary text-primary bg-primary/20 font-bold"
                                  : "border-border-sharp text-text-sub"
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span
                              className={`font-sans text-xs sm:text-sm flex-1 ${
                                isSelected ? "text-text-main font-semibold" : "text-text-sub"
                              }`}
                            >
                              {opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Question Navigation Palette */}
              <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border-sharp bg-bg-base/60 p-4 flex flex-col space-y-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-main">
                  Question Palette
                </span>

                {/* Palette Legends */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-sans text-text-sub">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-xs bg-emerald-600/40 border border-emerald-500" />
                    <span>Answered ({answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-xs bg-amber-600/40 border border-amber-500" />
                    <span>Review ({markedCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-xs bg-purple-600/40 border border-purple-500" />
                    <span>Ans + Rev ({answeredMarkedCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-xs bg-bg-elevated border border-border-sharp" />
                    <span>Unvisited ({unvisitedCount})</span>
                  </div>
                </div>

                {/* Number Grid */}
                <div className="flex-1 overflow-y-auto max-h-56 lg:max-h-none pr-1">
                  <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-4 gap-2">
                    {questions.map((q, idx) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentIdx(idx)}
                        className={getPaletteBtnStyle(q, idx)}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between border-t border-border-sharp px-4 sm:px-6 py-3 bg-bg-base/90">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearSelection}
                  disabled={currentState.selectedOption === null}
                  className="px-3 py-1.5 rounded-sm border border-border-sharp text-xs font-semibold text-text-sub hover:text-text-main hover:bg-bg-elevated transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Clear Selection
                </button>
                <button
                  type="button"
                  onClick={handleToggleMarkForReview}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-semibold transition-colors ${
                    currentState.status === "MARKED_FOR_REVIEW" ||
                    currentState.status === "ANSWERED_MARKED"
                      ? "border-amber-500 bg-amber-950/30 text-amber-300"
                      : "border-border-sharp text-text-sub hover:text-text-main hover:bg-bg-elevated"
                  }`}
                >
                  <BookmarkCheck className="h-3.5 w-3.5" />
                  {currentState.status === "MARKED_FOR_REVIEW" ||
                  currentState.status === "ANSWERED_MARKED"
                    ? "Marked"
                    : "Mark for Review"}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-sm border border-border-sharp text-xs font-semibold text-text-sub hover:text-text-main hover:bg-bg-elevated transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Prev
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentIdx === questions.length - 1}
                  className="flex items-center gap-1 px-4 py-1.5 rounded-sm bg-primary hover:bg-primary-dim text-bg-base font-sans text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SUBMISSION CONFIRMATION MODAL OVERLAY */}
        {/* ============================================================ */}
        {showSubmitConfirm && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-md p-6 rounded-sm bg-bg-surface border border-border-sharp shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-text-main">
                    Confirm Submission
                  </h4>
                  <p className="font-sans text-xs text-text-sub">
                    Are you ready to submit your assessment?
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-sm bg-bg-base border border-border-sharp grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="font-mono text-[10px] text-text-dim uppercase block">Answered</span>
                  <span className="font-mono text-base font-bold text-emerald-400">{answeredCount}</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-text-dim uppercase block">Marked</span>
                  <span className="font-mono text-base font-bold text-amber-400">{markedCount + answeredMarkedCount}</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-text-dim uppercase block">Unvisited</span>
                  <span className="font-mono text-base font-bold text-text-sub">{unvisitedCount}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitConfirm(false)}
                  className="px-4 py-2 rounded-sm border border-border-sharp hover:bg-bg-elevated text-text-sub font-sans text-xs font-semibold transition-all"
                >
                  Resume Test
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-4 py-2 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Confirm & Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. RESULT ANALYSIS DASHBOARD */}
        {/* ============================================================ */}
        {phase === "RESULT" && result && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-sharp px-6 py-4 bg-bg-base/80">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-text-main">
                    Assessment Performance Summary
                  </h3>
                  <span className="font-mono text-xs text-text-sub">
                    Time Spent: {Math.floor(result.timeSpentSeconds / 60)}m {result.timeSpentSeconds % 60}s
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-sm border border-border-sharp text-text-sub hover:text-text-main hover:bg-bg-elevated transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Result Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Score Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-sm bg-bg-base border border-border-sharp">
                  <span className="font-mono text-[10px] text-text-dim uppercase tracking-wider block">Score Obtained</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-display text-2xl font-bold text-primary">{result.marksObtained}</span>
                    <span className="font-mono text-xs text-text-sub">/ {result.totalMarks}</span>
                  </div>
                </div>

                <div className="p-4 rounded-sm bg-bg-base border border-border-sharp">
                  <span className="font-mono text-[10px] text-text-dim uppercase tracking-wider block">Accuracy</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-display text-2xl font-bold text-emerald-400">{result.accuracy}%</span>
                  </div>
                </div>

                <div className="p-4 rounded-sm bg-bg-base border border-border-sharp">
                  <span className="font-mono text-[10px] text-text-dim uppercase tracking-wider block">Correct / Wrong</span>
                  <div className="flex items-baseline gap-1.5 mt-1 font-mono text-base font-bold">
                    <span className="text-emerald-400">{result.correctCount}</span>
                    <span className="text-text-dim">/</span>
                    <span className="text-rose-400">{result.incorrectCount}</span>
                  </div>
                </div>

                <div className="p-4 rounded-sm bg-bg-base border border-border-sharp">
                  <span className="font-mono text-[10px] text-text-dim uppercase tracking-wider block">Skipped</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-display text-2xl font-bold text-text-sub">{result.skippedCount}</span>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="p-4 rounded-sm bg-bg-base border border-border-sharp space-y-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-main flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Category Performance Breakdown
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(result.categoryBreakdown).map(([catKey, stats]) => (
                    <div
                      key={catKey}
                      className="p-3 rounded-sm bg-bg-surface border border-border-sharp/80 space-y-1.5"
                    >
                      <span className="font-mono text-xs font-bold text-text-main uppercase block truncate">
                        {catKey.replace(/-/g, " ")}
                      </span>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-text-sub">
                          Correct: {stats.correct}/{stats.total}
                        </span>
                        <span className="text-primary font-bold">
                          Score: {stats.score > 0 ? `+${stats.score}` : stats.score}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${stats.total > 0 ? (stats.correct / stats.total) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solution Review Header & Filter */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-sharp pb-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-main flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4 text-primary" />
                    Detailed Question Review & Explanations
                  </span>

                  <div className="flex items-center gap-1.5">
                    {(["all", "correct", "incorrect", "skipped"] as const).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setReviewFilter(filter)}
                        className={`px-2.5 py-1 rounded-sm font-mono text-[11px] uppercase tracking-wider transition-colors ${
                          reviewFilter === filter
                            ? "bg-primary text-bg-base font-bold"
                            : "bg-bg-base border border-border-sharp text-text-sub hover:text-text-main"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtered Question Review List */}
                <div className="space-y-4">
                  {questions
                    .filter((q) => {
                      const userState = questionStates[q.id];
                      const selected = userState?.selectedOption;
                      const isCorrect = selected !== null && selected !== undefined && Number(selected) === Number(q.correctAnswer);
                      const isIncorrect = selected !== null && selected !== undefined && Number(selected) !== Number(q.correctAnswer);
                      const isSkipped = selected === null || selected === undefined;

                      if (reviewFilter === "correct") return isCorrect;
                      if (reviewFilter === "incorrect") return isIncorrect;
                      if (reviewFilter === "skipped") return isSkipped;
                      return true;
                    })
                    .map((q, idx) => {
                      const userState = questionStates[q.id];
                      const selected = userState?.selectedOption;
                      const isCorrect = selected !== null && selected !== undefined && Number(selected) === Number(q.correctAnswer);
                      const isSkipped = selected === null || selected === undefined;

                      return (
                        <div
                          key={q.id}
                          className="p-4 rounded-sm bg-bg-base border border-border-sharp space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {isCorrect ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                              ) : isSkipped ? (
                                <span className="h-4 w-4 rounded-full border border-border-sharp text-[10px] font-mono flex items-center justify-center text-text-dim">
                                  -
                                </span>
                              ) : (
                                <XCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
                              )}
                              <h4 className="font-display text-sm font-bold text-text-main">
                                {q.title}
                              </h4>
                            </div>

                            <span className="font-mono text-[10px] text-text-dim uppercase border border-border-sharp px-1.5 py-0.5 rounded-sm">
                              {q.subtopic.replace(/-/g, " ")}
                            </span>
                          </div>

                          <p className="font-sans text-xs text-text-sub whitespace-pre-line leading-relaxed">
                            {q.description}
                          </p>

                          {/* Options comparison */}
                          {q.options && (
                            <div className="space-y-1.5 pt-1">
                              {q.options.map((opt, optIdx) => {
                                const isUserChoice = selected === optIdx;
                                const isRightChoice = optIdx === Number(q.correctAnswer);

                                let optBorder = "border-border-sharp/40 text-text-dim bg-bg-surface/50";
                                if (isRightChoice) {
                                  optBorder = "border-emerald-600 bg-emerald-950/20 text-emerald-300 font-medium";
                                } else if (isUserChoice && !isRightChoice) {
                                  optBorder = "border-rose-600 bg-rose-950/20 text-rose-300 font-medium";
                                }

                                return (
                                  <div
                                    key={optIdx}
                                    className={`p-2 rounded-sm border text-xs flex items-center justify-between gap-2 ${optBorder}`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono font-bold">
                                        {String.fromCharCode(65 + optIdx)}.
                                      </span>
                                      <span>{opt}</span>
                                    </div>

                                    {isRightChoice && (
                                      <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-bold">
                                        Correct Answer
                                      </span>
                                    )}
                                    {isUserChoice && !isRightChoice && (
                                      <span className="font-mono text-[10px] text-rose-400 uppercase tracking-wider font-bold">
                                        Your Choice
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Explanation */}
                          <div className="p-3 rounded-sm bg-bg-surface border border-border-sharp/60 text-xs text-text-sub space-y-1">
                            <span className="font-mono text-[11px] font-bold text-primary block uppercase tracking-wider">
                              Solution Explanation:
                            </span>
                            <p className="whitespace-pre-line leading-relaxed">
                              {q.explanation}
                            </p>
                            {q.formulaOrTip && (
                              <p className="font-mono text-[11px] text-text-dim pt-1 border-t border-border-sharp/40 mt-1">
                                💡 Tip: {q.formulaOrTip}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border-sharp px-6 py-3 bg-bg-base/90">
              <button
                type="button"
                onClick={handleStartTest}
                className="flex items-center gap-1.5 px-4 py-2 rounded-sm border border-border-sharp hover:bg-bg-elevated text-text-main font-sans text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Retake Test
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-sm bg-primary hover:bg-primary-dim text-bg-base font-sans text-xs font-bold uppercase tracking-wider transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
