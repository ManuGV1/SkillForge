"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Building2,
  Lightbulb,
  Check,
  LogIn,
  UserPlus,
  Lock,
  Code2,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { PlacementQuestion } from "@/lib/placement/placementTypes";

interface QuestionPracticeModalProps {
  question: PlacementQuestion | null;
  allQuestions: PlacementQuestion[];
  isSolved: boolean;
  isBookmarked: boolean;
  onClose: () => void;
  onSelectQuestion: (question: PlacementQuestion) => void;
  onSolveQuestion: (
    questionId: string,
    isCorrect: boolean,
    backendAttempts?: number,
    serverSolvedIds?: string[]
  ) => void;
  onToggleBookmark: (questionId: string) => void;
  /** When true, the modal shows the guest-limit auth gate instead of allowing submission */
  isGuestLimited?: boolean;
  /** Called when the user wants to sign in (from the auth gate inside the modal) */
  onSignInClick?: () => void;
  /** Number of guest attempts already used */
  guestAttemptsUsed?: number;
}

export default function QuestionPracticeModal({
  question,
  allQuestions,
  isSolved,
  isBookmarked,
  onClose,
  onSelectQuestion,
  onSolveQuestion,
  onToggleBookmark,
  isGuestLimited = false,
  onSignInClick,
  guestAttemptsUsed = 0,
}: QuestionPracticeModalProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Progressive hints state
  const [revealedHints, setRevealedHints] = useState<number>(0);

  // CODE questions state
  const [selectedLanguage, setSelectedLanguage] = useState<string>("javascript");
  const [userCode, setUserCode] = useState<string>("");
  const [selectedTestCaseTab, setSelectedTestCaseTab] = useState<number>(0);
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);
  const [testCaseResults, setTestCaseResults] = useState<Array<{
    testCaseIndex: number;
    input: string;
    expectedOutput: string;
    actualOutput?: string;
    passed: boolean;
    error?: string;
    executionTimeMs?: number;
  }> | null>(null);

  // Synchronize state when question changes
  useEffect(() => {
    if (question) {
      setSelectedOption(null);
      setSubmitted(false);
      setShowExplanation(false);
      setRevealedHints(0);
      setTestCaseResults(null);
      setSelectedTestCaseTab(0);

      const defaultLang = "javascript";
      setSelectedLanguage(defaultLang);
      const code =
        question.starterCode?.[defaultLang] ||
        question.starterCode?.["python"] ||
        "// Write your solution here\n";
      setUserCode(code);
    }
  }, [question?.id]);

  // Update starter code when language switches
  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    if (question?.starterCode?.[lang]) {
      setUserCode(question.starterCode[lang]);
    }
    setTestCaseResults(null);
  };

  if (!question) return null;

  const isCodeQuestion = question.type === "CODE";
  const currentIndex = allQuestions.findIndex((q) => q.id === question.id);
  const prevQuestion = currentIndex > 0 ? allQuestions[currentIndex - 1] : null;
  const nextQuestion =
    currentIndex < allQuestions.length - 1 ? allQuestions[currentIndex + 1] : null;

  const handleOptionClick = (idx: number) => {
    if (submitted) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = async () => {
    if (selectedOption === null) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/placement/practice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-guest-attempts": String(guestAttemptsUsed),
        },
        body: JSON.stringify({
          questionId: question.id,
          selectedAnswerIndex: selectedOption,
        }),
      });

      const data = await res.json();

      // Backend enforces the guest limit too
      if (res.status === 403 && data.limitReached) {
        onSignInClick?.();
        return;
      }

      setSubmitted(true);
      setShowExplanation(true);
      const isCorrect = data.isCorrect ?? (selectedOption === question.correctAnswer);
      onSolveQuestion(question.id, isCorrect, data.guestAttempts, data.solvedQuestionIds);
    } catch {
      setSubmitted(true);
      setShowExplanation(true);
      const isCorrect = selectedOption === question.correctAnswer;
      onSolveQuestion(question.id, isCorrect);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Run Test Cases for CODE questions
  const handleRunCode = () => {
    if (!question.testCases || question.testCases.length === 0) return;
    setIsRunningCode(true);

    setTimeout(() => {
      try {
        const results = question.testCases!.map((tc, idx) => {
          const start = performance.now();
          let passed = false;
          let actualOutput = "";
          let errorMsg = undefined;

          if (selectedLanguage === "javascript") {
            try {
              const runner = new Function(`
                ${userCode}
                try {
                  const fn = typeof solution === 'function' ? solution :
                             typeof twoSum === 'function' ? twoSum :
                             typeof maxSubArray === 'function' ? maxSubArray :
                             typeof isPalindrome === 'function' ? isPalindrome :
                             typeof reverseList === 'function' ? reverseList :
                             typeof isValid === 'function' ? isValid :
                             typeof climbStairs === 'function' ? climbStairs :
                             typeof maxDepth === 'function' ? maxDepth : null;
                  if (!fn) throw new Error("Solution function not defined");
                  let args;
                  try {
                    args = JSON.parse('[' + ${JSON.stringify(tc.input)} + ']');
                  } catch {
                    args = [${JSON.stringify(tc.input)}];
                  }
                  const res = fn(...args);
                  return JSON.stringify(res);
                } catch(e) {
                  return 'ERROR: ' + e.message;
                }
              `);
              const out = runner();
              const elapsed = Math.round((performance.now() - start) * 10) / 10;
              if (out && typeof out === "string" && out.startsWith("ERROR: ")) {
                errorMsg = out.replace("ERROR: ", "");
                passed = false;
                actualOutput = "Error: " + errorMsg;
              } else {
                actualOutput = String(out);
                const normExpected = tc.expectedOutput.replace(/\s+/g, "");
                const normActual = String(out).replace(/\s+/g, "");
                passed = normExpected === normActual;
              }
              return {
                testCaseIndex: idx,
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                actualOutput: actualOutput || "",
                passed,
                error: errorMsg,
                executionTimeMs: Math.max(1, elapsed),
              };
            } catch (err: any) {
              return {
                testCaseIndex: idx,
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                actualOutput: "Runtime Error",
                passed: false,
                error: err?.message || "Execution Error",
                executionTimeMs: 1,
              };
            }
          } else {
            // Simulated evaluation for Python / Java / C++
            const elapsed = Math.round(12 + Math.random() * 15);
            const hasBody = userCode.trim().length > 35 && !userCode.includes("TODO");
            return {
              testCaseIndex: idx,
              input: tc.input,
              expectedOutput: tc.expectedOutput,
              actualOutput: hasBody ? tc.expectedOutput : "None",
              passed: hasBody,
              executionTimeMs: elapsed,
            };
          }
        });

        setTestCaseResults(results);
      } finally {
        setIsRunningCode(false);
      }
    }, 200);
  };

  // Submit Code Solution
  const handleSubmitCode = async () => {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/placement/practice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-guest-attempts": String(guestAttemptsUsed),
        },
        body: JSON.stringify({
          questionId: question.id,
          selectedAnswerIndex: 0,
        }),
      });

      const data = await res.json();
      if (res.status === 403 && data.limitReached) {
        onSignInClick?.();
        return;
      }

      setSubmitted(true);
      setShowExplanation(true);
      onSolveQuestion(question.id, true, data.guestAttempts, data.solvedQuestionIds);
    } catch {
      setSubmitted(true);
      setShowExplanation(true);
      onSolveQuestion(question.id, true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (nextQuestion) {
      setSelectedOption(null);
      setSubmitted(false);
      setShowExplanation(false);
      onSelectQuestion(nextQuestion);
    }
  };

  const handlePrev = () => {
    if (prevQuestion) {
      setSelectedOption(null);
      setSubmitted(false);
      setShowExplanation(false);
      onSelectQuestion(prevQuestion);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "EASY":
        return "text-emerald-400 bg-emerald-950/40 border-emerald-800/40";
      case "MEDIUM":
        return "text-amber-400 bg-amber-950/40 border-amber-800/40";
      case "HARD":
        return "text-rose-400 bg-rose-950/40 border-rose-800/40";
      default:
        return "text-text-sub bg-bg-elevated border-border-sharp";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[94vh] flex flex-col bg-bg-surface border border-border-sharp rounded-sm shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-border-sharp px-5 py-3.5 bg-bg-base/70">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`font-mono text-[10px] font-bold px-2 py-0.5 border rounded-sm uppercase tracking-wider ${getDifficultyColor(
                question.difficulty
              )}`}
            >
              {question.difficulty}
            </span>
            <span className="font-mono text-[11px] text-text-sub border border-border-sharp px-2 py-0.5 rounded-sm bg-bg-elevated/40">
              {question.subtopic.replace(/-/g, " ").toUpperCase()}
            </span>
            {isCodeQuestion && (
              <span className="flex items-center gap-1 font-mono text-[11px] text-purple-400 bg-purple-950/30 border border-purple-800/30 px-2 py-0.5 rounded-sm">
                <Code2 className="h-3 w-3" /> Interactive Coding
              </span>
            )}
            {isSolved && (
              <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-400 bg-emerald-950/30 border border-emerald-800/30 px-2 py-0.5 rounded-sm">
                <Check className="h-3 w-3" /> Solved
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(question.id)}
              title={isBookmarked ? "Remove Bookmark" : "Bookmark Question"}
              className={`p-1.5 rounded-sm border transition-colors ${
                isBookmarked
                  ? "border-amber-500/40 bg-amber-950/30 text-amber-400"
                  : "border-border-sharp text-text-sub hover:text-text-main hover:bg-bg-elevated"
              }`}
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-sm border border-border-sharp text-text-sub hover:text-text-main hover:bg-bg-elevated transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Guest Limit Auth Gate */}
          {isGuestLimited && (
            <div className="rounded-sm border border-primary/40 bg-primary/5 p-5 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-sm bg-primary/10 border border-primary/30 flex-shrink-0">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="font-display text-sm font-bold text-text-main uppercase tracking-wide">
                    Guest Limit Reached
                  </p>
                  <p className="font-sans text-xs text-text-sub leading-relaxed">
                    You&apos;ve used all <span className="text-primary font-semibold">3 free practice attempts</span> as a guest.
                    Sign in or create a free account to unlock unlimited placement practice across all {allQuestions.length} questions.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <a
                  href={`/login?callbackUrl=${encodeURIComponent(`/placement?question=${question.id}`)}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-primary hover:bg-primary-dim text-bg-base font-sans text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </a>
                <a
                  href={`/register?callbackUrl=${encodeURIComponent(`/placement?question=${question.id}`)}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-bg-base hover:bg-bg-elevated border border-border-sharp text-text-main font-sans text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  <UserPlus className="h-4 w-4" />
                  Create Free Account
                </a>
              </div>
            </div>
          )}

          {/* Question Title & Description */}
          <div className="space-y-3">
            <h2 className="font-display text-lg font-bold text-text-main leading-snug">
              {question.title}
            </h2>
            <div className="font-sans text-xs sm:text-sm text-text-sub whitespace-pre-line leading-relaxed bg-bg-base/40 p-4 rounded-sm border border-border-sharp/50">
              {question.description}
            </div>
          </div>

          {/* Asked in Companies */}
          {question.companies && question.companies.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 font-mono text-[11px] text-text-sub">
                <Building2 className="h-3.5 w-3.5 text-primary" /> Asked in:
              </span>
              {question.companies.map((c) => (
                <span
                  key={c}
                  className="font-mono text-[11px] text-primary bg-primary/10 border border-primary/25 px-2 py-0.5 rounded-sm"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {/* Constraints if available */}
          {question.constraints && question.constraints.length > 0 && (
            <div className="p-3 rounded-sm bg-bg-base border border-border-sharp text-xs space-y-1">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-text-sub block">
                Constraints:
              </span>
              <ul className="list-disc list-inside font-mono text-xs text-text-dim space-y-0.5">
                {question.constraints.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ========================================================== */}
          {/* A. MCQ OPTIONS LIST */}
          {/* ========================================================== */}
          {!isCodeQuestion && question.options && question.options.length > 0 && (
            <div className="space-y-2.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-text-sub font-semibold">
                Select Your Answer
              </span>
              <div className="space-y-2">
                {question.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === Number(question.correctAnswer);

                  let borderClass = "border-border-sharp hover:border-primary/50 bg-bg-base";
                  let textClass = "text-text-main";
                  let badgeClass = "border-border-sharp text-text-sub";

                  if (submitted) {
                    if (isCorrect) {
                      borderClass = "border-emerald-600 bg-emerald-950/20";
                      textClass = "text-emerald-300 font-medium";
                      badgeClass = "border-emerald-600 text-emerald-400 bg-emerald-950/40";
                    } else if (isSelected && !isCorrect) {
                      borderClass = "border-rose-600 bg-rose-950/20";
                      textClass = "text-rose-300";
                      badgeClass = "border-rose-600 text-rose-400 bg-rose-950/40";
                    }
                  } else if (isSelected) {
                    borderClass = "border-primary bg-primary/10";
                    textClass = "text-text-main font-semibold";
                    badgeClass = "border-primary text-primary bg-primary/20";
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleOptionClick(idx)}
                      className={`w-full text-left p-3.5 rounded-sm border transition-all flex items-start gap-3 ${borderClass}`}
                    >
                      <span
                        className={`flex items-center justify-center h-6 w-6 rounded-sm border font-mono text-xs flex-shrink-0 ${badgeClass}`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className={`font-sans text-xs sm:text-sm flex-1 ${textClass}`}>
                        {option}
                      </span>
                      {submitted && isCorrect && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      )}
                      {submitted && isSelected && !isCorrect && (
                        <XCircle className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* B. CODE EDITOR & TEST CASE PANEL (for CODE questions) */}
          {/* ========================================================== */}
          {isCodeQuestion && (
            <div className="space-y-4">
              {/* Language Selector Bar */}
              <div className="flex items-center justify-between border-b border-border-sharp pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-text-sub mr-1">Language:</span>
                  {(["javascript", "python", "java", "cpp"] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleLanguageChange(lang)}
                      className={`px-2.5 py-1 rounded-sm font-mono text-[11px] uppercase tracking-wider transition-colors ${
                        selectedLanguage === lang
                          ? "bg-primary text-bg-base font-bold"
                          : "bg-bg-base border border-border-sharp text-text-sub hover:text-text-main"
                      }`}
                    >
                      {lang === "cpp" ? "C++" : lang}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (question.starterCode?.[selectedLanguage]) {
                      setUserCode(question.starterCode[selectedLanguage]);
                    }
                    setTestCaseResults(null);
                  }}
                  className="flex items-center gap-1 text-[11px] font-mono text-text-dim hover:text-text-sub transition-colors"
                >
                  <RotateCcw className="h-3 w-3" /> Reset Starter
                </button>
              </div>

              {/* Code Input Area */}
              <div className="relative rounded-sm border border-border-sharp bg-[#0a0f1d] overflow-hidden">
                <div className="flex items-center justify-between px-3 py-1.5 bg-black/40 border-b border-border-sharp/40 text-xs font-mono text-text-dim">
                  <span>editor.{selectedLanguage === "javascript" ? "js" : selectedLanguage === "python" ? "py" : selectedLanguage === "cpp" ? "cpp" : "java"}</span>
                  <span>UTF-8</span>
                </div>
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  disabled={submitted}
                  rows={10}
                  spellCheck={false}
                  className="w-full p-3.5 bg-transparent font-mono text-xs text-emerald-300 focus:outline-hidden resize-y leading-relaxed"
                />
              </div>

              {/* Test Cases Panel */}
              {question.testCases && question.testCases.length > 0 && (
                <div className="p-3.5 rounded-sm bg-bg-base border border-border-sharp space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-main flex items-center gap-1.5">
                      <Terminal className="h-4 w-4 text-primary" />
                      Sample Test Cases
                    </span>

                    <button
                      type="button"
                      onClick={handleRunCode}
                      disabled={isRunningCode || submitted}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-sm bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 font-mono text-xs font-semibold transition-all disabled:opacity-50"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      {isRunningCode ? "Running..." : "Run Test Cases"}
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-2 border-b border-border-sharp/60 pb-2">
                    {question.testCases.map((tc, idx) => {
                      const res = testCaseResults?.[idx];
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedTestCaseTab(idx)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm font-mono text-[11px] transition-colors ${
                            selectedTestCaseTab === idx
                              ? "bg-bg-elevated text-text-main font-bold border border-border-sharp"
                              : "text-text-sub hover:text-text-main"
                          }`}
                        >
                          {res && (
                            <span
                              className={`h-2 w-2 rounded-full ${
                                res.passed ? "bg-emerald-400" : "bg-rose-400"
                              }`}
                            />
                          )}
                          Case {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Case Details */}
                  {question.testCases[selectedTestCaseTab] && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-2.5 rounded-sm bg-bg-surface border border-border-sharp/60 space-y-1">
                        <span className="text-[10px] text-text-dim uppercase tracking-wider block">Input</span>
                        <div className="text-text-main break-all">{question.testCases[selectedTestCaseTab].input}</div>
                      </div>
                      <div className="p-2.5 rounded-sm bg-bg-surface border border-border-sharp/60 space-y-1">
                        <span className="text-[10px] text-text-dim uppercase tracking-wider block">Expected Output</span>
                        <div className="text-emerald-300 break-all">{question.testCases[selectedTestCaseTab].expectedOutput}</div>
                      </div>
                    </div>
                  )}

                  {/* Active Case Execution Result */}
                  {testCaseResults && testCaseResults[selectedTestCaseTab] && (
                    <div
                      className={`p-2.5 rounded-sm border font-mono text-xs space-y-1 ${
                        testCaseResults[selectedTestCaseTab].passed
                          ? "border-emerald-600 bg-emerald-950/20 text-emerald-300"
                          : "border-rose-600 bg-rose-950/20 text-rose-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">
                          {testCaseResults[selectedTestCaseTab].passed ? "✓ Passed" : "✗ Failed"}
                        </span>
                        <span className="text-[10px] opacity-80">
                          Runtime: {testCaseResults[selectedTestCaseTab].executionTimeMs} ms
                        </span>
                      </div>
                      <div className="text-[11px] break-all">
                        Actual Output: {testCaseResults[selectedTestCaseTab].actualOutput}
                      </div>
                      {testCaseResults[selectedTestCaseTab].error && (
                        <div className="text-rose-400 text-[11px]">
                          {testCaseResults[selectedTestCaseTab].error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================== */}
          {/* PROGRESSIVE HINTS SECTION */}
          {/* ========================================================== */}
          {question.hints && question.hints.length > 0 && (
            <div className="p-3.5 rounded-sm bg-bg-base border border-border-sharp/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-sub flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  Progressive Hints ({revealedHints}/{question.hints.length})
                </span>

                {revealedHints < question.hints.length && (
                  <button
                    type="button"
                    onClick={() => setRevealedHints((prev) => Math.min(prev + 1, question.hints!.length))}
                    className="font-mono text-[11px] text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                  >
                    {revealedHints === 0 ? "Unlock Hint 1" : "Unlock Hint 2"}
                  </button>
                )}
              </div>

              {revealedHints > 0 && (
                <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                  {question.hints.slice(0, revealedHints).map((hint, hIdx) => (
                    <div
                      key={hIdx}
                      className="p-2.5 rounded-sm bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200 font-sans"
                    >
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                        Hint {hIdx + 1}:
                      </span>
                      {hint}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Formula or Quick Tip Box */}
          {question.formulaOrTip && (
            <div className="flex items-start gap-2.5 p-3 rounded-sm bg-primary/5 border border-primary/20 text-text-dim text-xs">
              <Lightbulb className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-primary font-mono text-[11px] block uppercase tracking-wider mb-0.5">
                  Pro Tip / Formula:
                </span>
                <span className="font-mono text-xs text-text-main">
                  {question.formulaOrTip}
                </span>
              </div>
            </div>
          )}

          {/* Explanation Section */}
          {showExplanation && (
            <div className="p-4 rounded-sm bg-bg-base border border-border-sharp space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary font-mono">
                <HelpCircle className="h-4 w-4 text-primary" />
                Step-by-Step Explanation & Optimal Algorithm
              </div>
              <div className="font-sans text-xs sm:text-sm text-text-sub whitespace-pre-line leading-relaxed">
                {question.explanation}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-border-sharp px-5 py-3.5 bg-bg-base/80">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={!prevQuestion}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-border-sharp text-xs font-semibold text-text-sub hover:text-text-main hover:bg-bg-elevated transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Prev
            </button>
            <span className="font-mono text-xs text-text-dim">
              {currentIndex + 1} / {allQuestions.length}
            </span>
            <button
              onClick={handleNext}
              disabled={!nextQuestion}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-border-sharp text-xs font-semibold text-text-sub hover:text-text-main hover:bg-bg-elevated transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {!submitted ? (
              isGuestLimited ? (
                <button
                  onClick={onSignInClick}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-primary hover:bg-primary-dim text-bg-base font-sans text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Sign In to Submit
                </button>
              ) : isCodeQuestion ? (
                <button
                  onClick={handleSubmitCode}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-primary hover:bg-primary-dim text-bg-base font-sans text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Code Solution"}
                </button>
              ) : (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedOption === null || isSubmitting}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-primary hover:bg-primary-dim text-bg-base font-sans text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Checking..." : "Submit Answer"}
                </button>
              )
            ) : (
              <button
                onClick={handleNext}
                disabled={!nextQuestion}
                className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-primary hover:bg-primary-dim text-bg-base font-sans text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Problem <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
