"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { PlacementQuestion } from "@/lib/placement/placementTypes";

interface QuestionPracticeModalProps {
  question: PlacementQuestion | null;
  allQuestions: PlacementQuestion[];
  isSolved: boolean;
  isBookmarked: boolean;
  onClose: () => void;
  onSelectQuestion: (question: PlacementQuestion) => void;
  onSolveQuestion: (questionId: string, isCorrect: boolean) => void;
  onToggleBookmark: (questionId: string) => void;
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
}: QuestionPracticeModalProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  if (!question) return null;

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          selectedAnswerIndex: selectedOption,
        }),
      });

      const data = await res.json();
      setSubmitted(true);
      setShowExplanation(true);
      const isCorrect = data.isCorrect ?? (selectedOption === question.correctAnswer);
      onSolveQuestion(question.id, isCorrect);
    } catch {
      setSubmitted(true);
      setShowExplanation(true);
      const isCorrect = selectedOption === question.correctAnswer;
      onSolveQuestion(question.id, isCorrect);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-bg-surface border border-border-sharp rounded-sm shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-border-sharp px-5 py-4 bg-bg-base/60">
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
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
          {/* Question Title & Description */}
          <div className="space-y-3">
            <h2 className="font-display text-lg font-bold text-text-main leading-snug">
              {question.title}
            </h2>
            <div className="font-sans text-sm text-text-sub whitespace-pre-line leading-relaxed bg-bg-base/40 p-4 rounded-sm border border-border-sharp/40">
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

          {/* Options List */}
          {question.options && question.options.length > 0 && (
            <div className="space-y-2.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-text-sub font-semibold">
                Select Your Answer
              </span>
              <div className="space-y-2">
                {question.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === question.correctAnswer;

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
                Step-by-Step Explanation
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
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null || isSubmitting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-primary hover:bg-primary-dim text-bg-base font-sans text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Checking..." : "Submit Answer"}
              </button>
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
