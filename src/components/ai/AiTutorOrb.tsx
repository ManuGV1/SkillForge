"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  Brain,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  Mic,
  MicOff,
  Volume2,
} from "lucide-react";
import { useVoiceAgent } from "@/lib/ai/useVoiceAgent";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "skillforge_ai_tutor_chat_history";

export default function AiTutorOrb() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // Lazy state initialization from sessionStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (err) {
        console.error("[AiTutorOrb] Failed to load chat history:", err);
      }
    }
    return [];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoggedIn = status === "authenticated" && !!session?.user;

  // Helper to determine active page type
  const getPageType = (path: string): "roadmap" | "topic" | "dsa" | "dashboard" | "general" => {
    if (path.startsWith("/dsa")) return "dsa";
    if (path.startsWith("/roadmap")) return "roadmap";
    if (path.startsWith("/dashboard")) return "dashboard";
    return "general";
  };

  const defaultGreeting: Message = React.useMemo(
    () => ({
      role: "assistant",
      content: `Greetings **${session?.user?.name || "Student"}**! I am your **SkillForge AI Assistant & Tutor**.\n\nI can assist you with general questions in programming, mathematics, science, career guidance, and general knowledge, while keeping full context on your SkillForge learning journey!`,
    }),
    [session?.user?.name]
  );

  const handleSendTextMessage = useCallback(
    async (textToSend: string): Promise<string | void> => {
      if (!textToSend.trim()) return;

      setError(null);
      const userMessage: Message = { role: "user", content: textToSend };
      const baseList = messages.length > 0 ? messages : [defaultGreeting];
      const updatedMessages = [...baseList, userMessage];

      setMessages(updatedMessages);
      setLoading(true);

      try {
        const pageType = getPageType(pathname || "");
        const res = await fetch("/api/tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages,
            pageContext: {
              pageType,
              url: pathname,
            },
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch response");
        }

        const aiText = data.message || "No response received.";
        setMessages([
          ...updatedMessages,
          { role: "assistant", content: aiText },
        ]);

        if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
          setSuggestions(data.suggestions);
        }

        return aiText;
      } catch (err) {
        console.error("[AiTutorOrb] send error:", err);
        setError("Unable to connect to AI Tutor. Please try sending again.");
        const fallbackErr =
          "I encountered a temporary connection issue. Please verify your connection or click retry.";
        setMessages([
          ...updatedMessages,
          {
            role: "assistant",
            content: fallbackErr,
          },
        ]);
        return fallbackErr;
      } finally {
        setLoading(false);
      }
    },
    [messages, pathname, defaultGreeting]
  );

  // Real-time Voice Agent integration
  const {
    voiceState,
    isSupported: voiceSupported,
    errorMessage: voiceError,
    toggleVoiceMode,
    stopSpeaking,
  } = useVoiceAgent({
    onTranscript: (userVoiceText) => {
      setIsOpen(true); // Open drawer automatically when user speaks
      setInput(userVoiceText);
    },
    onSendTextMessage: handleSendTextMessage,
  });

  // Save chat history to sessionStorage whenever messages change
  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (err) {
        console.error("[AiTutorOrb] Failed to save chat history:", err);
      }
    }
  }, [messages]);

  // Auto-scroll to bottom of messages when open or messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading, voiceState]);

  // Listen for open-ai-tutor event from Navbar
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-ai-tutor", handleOpen);
    return () => window.removeEventListener("open-ai-tutor", handleOpen);
  }, []);

  if (!isLoggedIn) {
    return null;
  }

  const activeMessages = messages.length > 0 ? messages : [defaultGreeting];

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || loading) return;
    setInput("");
    await handleSendTextMessage(textToSend);
  };

  const handleClearHistory = () => {
    stopSpeaking();
    setMessages([]);
    setSuggestions([]);
    setError(null);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.error("[AiTutorOrb] Failed to clear storage:", err);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const defaultPrompts = [
    "What should I learn next?",
    "Explain async/await in JS",
    "Give me a DSA hint",
    "How to prepare for interviews?",
    "Explain standard deviation",
  ];

  const activeSuggestions = suggestions.length > 0 ? suggestions : defaultPrompts;

  return (
    <>
      {/* Floating Futuristic AI Orb Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 group flex items-center justify-center h-14 w-14 rounded-full bg-bg-surface border-2 transition-all duration-300 cursor-pointer focus:outline-none ${
          voiceState === "listening"
            ? "border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.7)]"
            : voiceState === "speaking"
            ? "border-success shadow-[0_0_30px_rgba(34,197,94,0.7)]"
            : voiceState === "thinking"
            ? "border-primary shadow-[0_0_30px_rgba(245,158,11,0.7)]"
            : "border-primary/60 shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:border-primary"
        }`}
        aria-label="Toggle SkillForge AI Tutor"
      >
        {/* Pulsing Outer Ring according to Voice State */}
        <span
          className={`absolute inset-0 rounded-full animate-ping pointer-events-none opacity-40 group-hover:opacity-75 ${
            voiceState === "listening"
              ? "bg-cyan-400/30"
              : voiceState === "speaking"
              ? "bg-success/30"
              : "bg-primary/20"
          }`}
        />

        {/* Inner Glow Backdrop */}
        <span className="absolute inset-1 rounded-full bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent pointer-events-none" />

        {/* Icon based on state */}
        {isOpen ? (
          <X className="h-6 w-6 text-primary relative z-10 transition-transform duration-200 rotate-90" />
        ) : voiceState === "listening" ? (
          <Mic className="h-6 w-6 text-cyan-400 relative z-10 animate-pulse" />
        ) : voiceState === "speaking" ? (
          <Volume2 className="h-6 w-6 text-success relative z-10 animate-bounce" />
        ) : voiceState === "thinking" ? (
          <Loader2 className="h-6 w-6 text-primary relative z-10 animate-spin" />
        ) : (
          <Sparkles className="h-6 w-6 text-primary relative z-10 animate-pulse" />
        )}

        {/* Status Dot */}
        <span
          className={`absolute top-1 right-1 h-3 w-3 rounded-full border-2 border-bg-base z-20 ${
            voiceState === "listening"
              ? "bg-cyan-400 animate-ping"
              : voiceState === "speaking"
              ? "bg-success animate-pulse"
              : voiceState === "thinking"
              ? "bg-primary animate-pulse"
              : "bg-success"
          }`}
        />
      </button>

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[440px] h-[580px] max-h-[80vh] z-50 flex flex-col bg-bg-surface border border-border-sharp rounded-md shadow-2xl overflow-hidden backdrop-blur-xl animate-fade-in font-sans">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-bg-base/90 border-b border-border-sharp">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-xs font-extrabold uppercase tracking-wider text-text-main">
                    SKILLFORGE AI TUTOR
                  </h3>
                  {voiceState === "listening" ? (
                    <span className="font-mono text-[9px] text-cyan-400 bg-cyan-950/40 border border-cyan-400/30 px-1.5 py-0.5 rounded-sm animate-pulse">
                      LISTENING
                    </span>
                  ) : voiceState === "speaking" ? (
                    <span className="font-mono text-[9px] text-success bg-success/10 border border-success/30 px-1.5 py-0.5 rounded-sm animate-pulse">
                      SPEAKING
                    </span>
                  ) : voiceState === "thinking" ? (
                    <span className="font-mono text-[9px] text-primary bg-primary/10 border border-primary/30 px-1.5 py-0.5 rounded-sm animate-pulse">
                      THINKING
                    </span>
                  ) : (
                    <span className="font-mono text-[9px] text-success bg-success/10 border border-success/30 px-1.5 py-0.5 rounded-sm">
                      ONLINE
                    </span>
                  )}
                </div>
                <p className="font-mono text-[10px] text-text-sub">
                  Gemini Live Voice • Code404 Engine
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Microphone Control */}
              {voiceSupported && (
                <button
                  onClick={toggleVoiceMode}
                  title={
                    voiceState === "listening"
                      ? "Stop Listening"
                      : voiceState === "speaking"
                      ? "Stop Speaking"
                      : "Start Voice Mode"
                  }
                  className={`p-1.5 rounded-sm transition-colors cursor-pointer border focus:outline-none ${
                    voiceState === "listening"
                      ? "bg-cyan-950/40 border-cyan-400/50 text-cyan-400 animate-pulse"
                      : voiceState === "speaking"
                      ? "bg-success/20 border-success/40 text-success"
                      : "border-border-sharp text-text-sub hover:text-primary hover:border-primary/40"
                  }`}
                >
                  {voiceState === "listening" ? (
                    <MicOff className="h-3.5 w-3.5" />
                  ) : (
                    <Mic className="h-3.5 w-3.5" />
                  )}
                </button>
              )}

              <button
                onClick={handleClearHistory}
                title="Clear Chat History"
                className="p-1.5 text-text-sub hover:text-text-main rounded-sm transition-colors focus:outline-none cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-text-sub hover:text-text-main rounded-sm transition-colors focus:outline-none cursor-pointer"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Error / Voice Error Banner */}
          {(error || voiceError) && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-950/30 border-b border-red-950/60 text-red-400 text-[11px] font-sans">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{error || voiceError}</span>
            </div>
          )}

          {/* Voice Indicator Banner */}
          {voiceState === "listening" && (
            <div className="flex items-center justify-between px-4 py-2 bg-cyan-950/20 border-b border-cyan-400/30 text-cyan-400 text-xs font-mono animate-pulse">
              <div className="flex items-center gap-2">
                <Mic className="h-3.5 w-3.5 animate-bounce" />
                <span>Listening... Speak your query clearly</span>
              </div>
              <button
                onClick={toggleVoiceMode}
                className="text-[10px] uppercase underline hover:text-text-main cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          {voiceState === "speaking" && (
            <div className="flex items-center justify-between px-4 py-2 bg-success/10 border-b border-success/30 text-success text-xs font-mono">
              <div className="flex items-center gap-2">
                <Volume2 className="h-3.5 w-3.5 animate-pulse" />
                <span>AI Tutor is speaking...</span>
              </div>
              <button
                onClick={stopSpeaking}
                className="text-[10px] uppercase underline hover:text-text-main cursor-pointer"
              >
                Stop
              </button>
            </div>
          )}

          {/* Messages Thread */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 text-xs leading-relaxed bg-bg-base/30">
            {activeMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3 rounded-sm space-y-2 ${
                    msg.role === "user"
                      ? "bg-primary text-bg-base font-semibold self-end"
                      : "bg-bg-base border border-border-sharp text-text-main"
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans text-xs">
                    {msg.content}
                  </div>
                </div>

                {msg.role === "user" && (
                  <div className="h-6 w-6 rounded-full bg-border-sharp flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-mono text-text-dim">
                    YOU
                  </div>
                )}
              </div>
            ))}

            {(loading || voiceState === "thinking") && (
              <div className="flex items-center gap-2 text-text-sub text-xs font-mono p-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                <span>AI Tutor is processing user context & query...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-bg-base/60 border-t border-border-sharp/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {activeSuggestions.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={loading || voiceState === "listening"}
                className="whitespace-nowrap font-mono text-[9px] text-text-dim bg-bg-surface hover:text-primary hover:border-primary/40 border border-border-sharp px-2.5 py-1 rounded-sm transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-bg-surface border-t border-border-sharp flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                voiceState === "listening"
                  ? "Listening to your voice..."
                  : "Ask your AI Tutor anything..."
              }
              disabled={loading || voiceState === "listening"}
              className="flex-grow bg-bg-base border border-border-sharp px-3 py-2 text-xs text-text-main rounded-sm focus:border-primary focus:outline-none placeholder:text-text-sub font-sans disabled:opacity-50"
            />

            {/* Mic Toggle Button in Input Bar */}
            {voiceSupported && (
              <button
                type="button"
                onClick={toggleVoiceMode}
                className={`p-2 rounded-sm border transition-colors cursor-pointer shrink-0 ${
                  voiceState === "listening"
                    ? "bg-cyan-950/50 border-cyan-400 text-cyan-400 animate-pulse"
                    : voiceState === "speaking"
                    ? "bg-success/20 border-success/40 text-success"
                    : "bg-bg-base border-border-sharp text-text-sub hover:text-primary hover:border-primary/40"
                }`}
                aria-label="Voice input"
              >
                {voiceState === "listening" ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </button>
            )}

            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading || voiceState === "listening"}
              className="bg-primary hover:bg-primary-dim text-bg-base p-2 rounded-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              aria-label="Send message"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
