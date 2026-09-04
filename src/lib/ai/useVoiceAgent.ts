"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type VoiceState = "idle" | "listening" | "thinking" | "speaking" | "error";

export interface UseVoiceAgentOptions {
  onTranscript?: (text: string) => void;
  onAiResponse?: (text: string) => void;
  onSendTextMessage: (text: string) => Promise<string | void>;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export function useVoiceAgent({
  onTranscript,
  onAiResponse,
  onSendTextMessage,
}: UseVoiceAgentOptions) {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Lazy state initialization to satisfy React 19 hook rules
  const [isSupported] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const hasSpeech = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    const hasSynthesis = "speechSynthesis" in window;
    return hasSpeech && hasSynthesis;
  });

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthesisRef.current = window.speechSynthesis;
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    if (voiceState === "speaking") {
      setVoiceState("idle");
    }
  }, [voiceState]);

  const speakText = useCallback(
    (text: string) => {
      if (!synthesisRef.current) return;

      synthesisRef.current.cancel(); // Stop any ongoing speech
      setVoiceState("speaking");

      // Strip Markdown headers/code fences for cleaner natural speech synthesis
      const cleanText = text
        .replace(/```[\s\S]*?```/g, " [code snippet] ")
        .replace(/[#*`_~]/g, "")
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Select natural English voice if available
      const voices = synthesisRef.current.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("Daniel"))
      ) || voices.find((v) => v.lang.startsWith("en"));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        setVoiceState("idle");
      };

      utterance.onerror = (err) => {
        console.error("[useVoiceAgent] SpeechSynthesis error:", err);
        setVoiceState("idle");
      };

      synthesisRef.current.speak(utterance);
    },
    []
  );

  const processUserSpeech = useCallback(
    async (transcriptText: string) => {
      if (!transcriptText.trim()) {
        setVoiceState("idle");
        return;
      }

      if (onTranscript) {
        onTranscript(transcriptText);
      }

      setVoiceState("thinking");

      try {
        const responseText = await onSendTextMessage(transcriptText);
        if (responseText) {
          if (onAiResponse) {
            onAiResponse(responseText);
          }
          speakText(responseText);
        } else {
          setVoiceState("idle");
        }
      } catch (err) {
        console.error("[useVoiceAgent] processUserSpeech error:", err);
        setErrorMessage("Failed to get AI response.");
        setVoiceState("error");
        setTimeout(() => setVoiceState("idle"), 3000);
      }
    },
    [onTranscript, onAiResponse, onSendTextMessage, speakText]
  );

  const startListening = useCallback(async () => {
    stopSpeaking();
    setErrorMessage(null);

    if (typeof window === "undefined") return;

    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setErrorMessage("Speech recognition is not supported in this browser.");
      setVoiceState("error");
      return;
    }

    // Request explicit microphone permission from browser via getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Permission granted — stop temporary tracks so SpeechRecognition can use mic
        stream.getTracks().forEach((track) => track.stop());
      } catch (err) {
        console.error("[useVoiceAgent] getUserMedia permission error:", err);
        setErrorMessage(
          "Microphone access blocked. Please allow microphone permissions in your browser site settings."
        );
        setVoiceState("error");
        setTimeout(() => setVoiceState("idle"), 4000);
        return;
      }
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setVoiceState("listening");
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0]?.[0]?.transcript || "";
        processUserSpeech(transcript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("[useVoiceAgent] SpeechRecognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setErrorMessage(
            "Microphone access blocked. Please allow microphone permissions in your browser address bar."
          );
          setVoiceState("error");
          setTimeout(() => setVoiceState("idle"), 4000);
        } else if (event.error !== "no-speech") {
          setErrorMessage(`Microphone error: ${event.error}`);
          setVoiceState("error");
          setTimeout(() => setVoiceState("idle"), 3000);
        } else {
          setVoiceState("idle");
        }
      };

      recognition.onend = () => {
        if (voiceState === "listening") {
          setVoiceState("idle");
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("[useVoiceAgent] Failed to start recognition:", err);
      setErrorMessage("Microphone access failed. Please try again.");
      setVoiceState("error");
      setTimeout(() => setVoiceState("idle"), 3000);
    }
  }, [stopSpeaking, processUserSpeech, voiceState]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }
    setVoiceState("idle");
  }, []);

  const toggleVoiceMode = useCallback(() => {
    if (voiceState === "listening") {
      stopListening();
    } else if (voiceState === "speaking") {
      stopSpeaking();
    } else {
      startListening();
    }
  }, [voiceState, startListening, stopListening, stopSpeaking]);

  return {
    voiceState,
    isSupported,
    errorMessage,
    startListening,
    stopListening,
    stopSpeaking,
    toggleVoiceMode,
  };
}
