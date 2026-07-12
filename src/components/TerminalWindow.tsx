import React, { useState } from "react";
import { Terminal, Copy, Check, Info, Maximize2, Minimize2, Eye, EyeOff, HelpCircle } from "lucide-react";
import { ShellType } from "../types";

interface TerminalWindowProps {
  key?: string;
  type: ShellType;
  command: string;
  output: string;
  explanation?: string;
  isLoading?: boolean;
  isFlashcardMode?: boolean;
}

export default function TerminalWindow({
  type,
  command,
  output,
  explanation,
  isLoading = false,
  isFlashcardMode = false,
}: TerminalWindowProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Błąd kopiowania:", err);
    }
  };

  // Theme-specific settings
  const shellTheme = {
    bash: {
      name: "Bash (GNU/Linux)",
      prompt: "user@linux:~$ ",
      bg: "bg-[#0c0c0c]",
      text: "text-emerald-400",
      accentText: "text-emerald-500",
      commandColor: "text-white",
      outputColor: "text-zinc-300",
      border: "border-emerald-950/40 focus-within:border-emerald-500/50",
      glow: "terminal-glow-bash",
      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    cmd: {
      name: "CMD (Wiersz poleceń Windows)",
      prompt: "C:\\Users\\Admin> ",
      bg: "bg-[#010101]",
      text: "text-zinc-100",
      accentText: "text-zinc-400",
      commandColor: "text-zinc-100 font-medium",
      outputColor: "text-zinc-300",
      border: "border-zinc-800 focus-within:border-zinc-400/50",
      glow: "terminal-glow-cmd",
      badge: "bg-zinc-800 text-zinc-300 border-zinc-700",
    },
    powershell: {
      name: "PowerShell",
      prompt: "PS C:\\Users\\Admin> ",
      bg: "bg-[#01172f]",
      text: "text-cyan-400",
      accentText: "text-yellow-400",
      commandColor: "text-white font-semibold",
      outputColor: "text-zinc-200",
      border: "border-blue-900/60 focus-within:border-blue-500/50",
      glow: "terminal-glow-powershell",
      badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    zsh: {
      name: "Zsh (macOS)",
      prompt: "macuser@macbook ~ % ",
      bg: "bg-[#0a0f1d]",
      text: "text-violet-400",
      accentText: "text-violet-500",
      commandColor: "text-white font-semibold",
      outputColor: "text-zinc-300",
      border: "border-violet-900/60 focus-within:border-violet-500/50",
      glow: "terminal-glow-zsh",
      badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    },
  }[type];

  const showContent = !isFlashcardMode || isRevealed;

  return (
    <div
      id={`terminal-${type}`}
      onClick={() => {
        if (isFlashcardMode && !isRevealed) {
          setIsRevealed(true);
        }
      }}
      className={`flex flex-col h-full rounded-xl overflow-hidden border transition-all duration-300 bg-[#0d1117] ${
        isFlashcardMode && !isRevealed
          ? "border-indigo-500/30 hover:border-indigo-500/60 shadow-md shadow-indigo-500/5 cursor-pointer hover:-translate-y-0.5"
          : `${shellTheme.border} ${shellTheme.glow}`
      } ${isExpanded ? "fixed inset-4 z-50 shadow-2xl" : "relative shadow-md"}`}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 select-none">
        {/* Linux-like or generic close/minimize dots */}
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/80 block"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500/80 block"></span>
          <span className="w-3 h-3 rounded-full bg-green-500/80 block"></span>
          <span className="text-xs text-zinc-400 font-mono ml-2 truncate max-w-[150px] md:max-w-none">
            {shellTheme.name}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Eye icon for flashcard toggle */}
          {isFlashcardMode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsRevealed(!isRevealed);
              }}
              title={isRevealed ? "Ukryj składnię (Fiszka)" : "Odkryj składnię (Fiszka)"}
              className="p-1 hover:bg-zinc-800 text-indigo-400 hover:text-indigo-300 rounded-md transition-colors"
            >
              {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          )}

          {/* Badge indicator */}
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${shellTheme.badge} uppercase tracking-wider`}>
            {type}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            title={isExpanded ? "Zminimalizuj" : "Maksymalizuj"}
            className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-md transition-colors"
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          {command && showContent && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className={`p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-md transition-colors flex items-center space-x-1`}
              title="Kopiuj polecenie"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-mono hidden md:inline">Skopiowano!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span className="text-[10px] font-mono hidden md:inline">Kopiuj</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Terminal Area */}
      <div className={`flex-1 flex flex-col font-mono text-xs md:text-sm overflow-y-auto min-h-[180px] max-h-[350px] ${shellTheme.bg} transition-all duration-200`}>
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-10">
            <div className="flex space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
            <p className="text-zinc-500 text-xs font-sans">Generowanie symulacji...</p>
          </div>
        ) : !showContent ? (
          /* FLASHCARD BACK SIDE */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-b from-slate-950/20 to-slate-950/60 min-h-[180px] animate-fadeIn">
            <div className="w-11 h-11 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-indigo-500/40 transition-transform duration-300">
              <HelpCircle className="text-indigo-400 animate-pulse" size={20} />
            </div>
            <p className="text-xs text-slate-300 font-sans max-w-[220px] mb-1 font-medium leading-relaxed">
              Spróbuj przypomnieć sobie polecenie dla tej powłoki
            </p>
            <p className="text-[10px] text-slate-500 font-sans max-w-[200px]">
              Kliknij w dowolnym miejscu tej karty, aby odsłonić składnię
            </p>
            <span className="text-[9px] font-mono text-indigo-400 font-bold tracking-wider uppercase bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 mt-3.5">
              Odkryj {type.toUpperCase()} 🎴
            </span>
          </div>
        ) : (
          /* NORMAL TERMINAL CONTENT */
          <div className="p-4 space-y-3 leading-relaxed">
            {/* Input command line */}
            <div className="flex items-start">
              <span className={`select-none ${shellTheme.text} shrink-0`}>
                {shellTheme.prompt}
              </span>
              <span className={`${shellTheme.commandColor} break-all ml-1`}>
                {command || <span className="text-zinc-600 italic">Brak polecenia</span>}
              </span>
              <span className={`w-1.5 h-4 ml-0.5 bg-zinc-400 animate-[pulse_0.8s_infinite] shrink-0 block self-center`}></span>
            </div>

            {/* Output screen */}
            {output && (
              <pre className={`p-2 rounded bg-black/30 overflow-x-auto whitespace-pre-wrap ${shellTheme.outputColor} leading-relaxed text-xs border border-zinc-900/40`}>
                {output}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Explanation Footer Bar */}
      {explanation && !isLoading && (
        <div className="bg-[#121824] border-t border-zinc-800 p-3 flex items-start space-x-2.5 select-text">
          <Info size={16} className="text-zinc-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide font-sans">
              Jak to działa i co oznacza?
            </h5>
            <p className="text-zinc-400 text-xs leading-relaxed font-sans">
              {showContent ? explanation : "Kliknij kartę powyżej, aby odkryć składnię i szczegółowe wyjaśnienie tej komendy."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
