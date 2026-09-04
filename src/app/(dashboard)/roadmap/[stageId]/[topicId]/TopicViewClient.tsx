"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Save,
  Video,
  FileText,
  HelpCircle,
  Loader2,
  Check,
} from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
}

interface TopicData {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string | null;
  quizJson: string | null;
  position: number;
  stageId: string;
  stageTitle: string;
  careerPathTitle: string;
}

interface InitialProgress {
  isCompleted: boolean;
  notes: string;
}

export default function TopicViewClient({
  topic,
  initialProgress,
}: {
  topic: TopicData;
  initialProgress: InitialProgress;
}) {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(initialProgress.isCompleted);
  const [completing, setCompleting] = useState(false);

  const [notes, setNotes] = useState(initialProgress.notes);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSavedStatus, setNotesSavedStatus] = useState<string | null>(null);

  // Quiz state
  const quizzes: QuizQuestion[] = topic.quizJson
    ? JSON.parse(topic.quizJson)
    : [];
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Extract YouTube embed ID if valid
  const getEmbedUrl = (url: string | null) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  const embedUrl = getEmbedUrl(topic.youtubeUrl);

  const handleToggleComplete = async () => {
    setCompleting(true);
    try {
      const res = await fetch(`/api/roadmap/topic/${topic.id}/complete`, {
        method: "POST",
      });
      if (res.ok) {
        setIsCompleted(true);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCompleting(false);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    setNotesSavedStatus(null);
    try {
      const res = await fetch(`/api/roadmap/topic/${topic.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        setNotesSavedStatus("Notes saved successfully!");
        setTimeout(() => setNotesSavedStatus(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setNotesSavedStatus("Failed to save notes.");
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between border-b border-border-sharp pb-4">
        <Link
          href="/roadmap"
          className="inline-flex items-center gap-2 font-sans text-xs font-semibold text-text-sub hover:text-text-main transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-primary" />
          Back to Roadmap ({topic.stageTitle})
        </Link>

        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-success bg-success/10 border border-success/30 px-3 py-1 rounded-sm uppercase">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completed
            </span>
          ) : (
            <button
              onClick={handleToggleComplete}
              disabled={completing}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dim text-bg-base font-sans text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {completing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              Mark as Complete
            </button>
          )}
        </div>
      </div>

      {/* Topic Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-wider">
            {topic.careerPathTitle} • {topic.stageTitle}
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text-main">
          {topic.title}
        </h1>
        <p className="font-sans text-sm text-text-dim leading-relaxed">
          {topic.description}
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Video & Notes & Quiz */}
        <div className="lg:col-span-2 space-y-8">
          {/* YouTube Video Resource */}
          <div className="border border-border-sharp bg-bg-surface p-6 rounded-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border-sharp/40 pb-3">
              <div className="flex items-center gap-2.5">
                <Video className="h-5 w-5 text-red-500" />
                <h3 className="font-display text-sm font-bold text-text-main uppercase tracking-wider">
                  Recommended Video Tutorial
                </h3>
              </div>
              {topic.youtubeUrl && (
                <a
                  href={topic.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-sans text-xs text-primary hover:text-primary-dim transition-colors"
                >
                  Open on YouTube
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {embedUrl ? (
              <div className="relative w-full aspect-video bg-black rounded-sm overflow-hidden border border-border-sharp">
                <iframe
                  src={embedUrl}
                  title={topic.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : topic.youtubeUrl ? (
              <div className="p-6 bg-bg-base border border-border-sharp rounded-sm text-center space-y-3">
                <p className="font-sans text-xs text-text-dim">
                  Click below to watch the official learning material directly on YouTube.
                </p>
                <a
                  href={topic.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-bold uppercase tracking-wide px-5 py-2.5 rounded-sm transition-colors"
                >
                  <Video className="h-4 w-4" />
                  Watch Video Resource
                </a>
              </div>
            ) : (
              <div className="p-6 bg-bg-base border border-border-sharp rounded-sm text-center">
                <p className="font-sans text-xs text-text-sub">
                  Video resource coming soon for this topic.
                </p>
              </div>
            )}
          </div>

          {/* Optional Quizzes */}
          {quizzes.length > 0 && (
            <div className="border border-border-sharp bg-bg-surface p-6 rounded-sm space-y-6">
              <div className="flex items-center gap-2.5 border-b border-border-sharp/40 pb-3">
                <HelpCircle className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-display text-sm font-bold text-text-main uppercase tracking-wider">
                    Knowledge Check (Optional Quiz)
                  </h3>
                  <p className="font-sans text-xs text-text-sub">
                    Test your understanding before marking complete.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {quizzes.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-4 bg-bg-base border border-border-sharp rounded-sm space-y-3"
                  >
                    <p className="font-sans text-xs sm:text-sm font-semibold text-text-main">
                      {qIdx + 1}. {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = userAnswers[qIdx] === oIdx;
                        const isCorrect = q.answerIndex === oIdx;
                        let optionStyle = "border-border-sharp bg-bg-surface text-text-dim hover:border-text-sub";

                        if (quizSubmitted) {
                          if (isCorrect) {
                            optionStyle = "border-success bg-success/10 text-success font-semibold";
                          } else if (isSelected && !isCorrect) {
                            optionStyle = "border-red-500 bg-red-950/20 text-red-400";
                          }
                        } else if (isSelected) {
                          optionStyle = "border-primary bg-primary/10 text-primary font-semibold";
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={quizSubmitted}
                            onClick={() =>
                              setUserAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))
                            }
                            className={`w-full text-left p-3 border rounded-sm text-xs transition-all focus:outline-none flex items-center justify-between cursor-pointer ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && (
                              <Check className="h-4 w-4 text-success shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-2">
                  {!quizSubmitted ? (
                    <button
                      onClick={() => setQuizSubmitted(true)}
                      disabled={Object.keys(userAnswers).length === 0}
                      className="bg-primary hover:bg-primary-dim disabled:opacity-40 text-bg-base font-sans text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-sm transition-colors cursor-pointer"
                    >
                      Check Answers
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setUserAnswers({});
                      }}
                      className="border border-border-sharp hover:bg-bg-base text-text-dim font-sans text-xs font-semibold px-4 py-2 rounded-sm transition-colors cursor-pointer"
                    >
                      Reset Quiz
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: Personal Notes */}
        <div className="space-y-8">
          <div className="border border-border-sharp bg-bg-surface p-6 rounded-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border-sharp/40 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm font-bold text-text-main uppercase tracking-wider">
                  Personal Notes
                </h3>
              </div>
              <span className="font-mono text-[9px] text-text-sub uppercase">
                Optional
              </span>
            </div>

            <p className="font-sans text-xs text-text-dim">
              Jot down code snippets, key concepts, or reminders for this topic.
            </p>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your study notes here..."
              rows={12}
              className="w-full bg-bg-base border border-border-sharp focus:border-primary text-text-main font-mono text-xs p-3 rounded-sm focus:outline-none resize-none"
            />

            {notesSavedStatus && (
              <p className="font-sans text-xs text-primary font-medium">
                {notesSavedStatus}
              </p>
            )}

            <button
              onClick={handleSaveNotes}
              disabled={savingNotes}
              className="w-full inline-flex items-center justify-center gap-2 border border-border-sharp hover:bg-bg-elevated text-text-main font-sans text-xs font-bold uppercase tracking-wider py-2.5 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {savingNotes ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5 text-primary" />
              )}
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
