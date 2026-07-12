import React, { useState } from "react";
import { Terminal, Copy, Check, Info, Maximize2, Minimize2 } from "lucide-react";
import { ShellType } from "../types";

interface TerminalWindowProps {
  type: ShellType;
  command: string;
  output: string;
  explanation?: string;
  isLoading?: boolean;
}

export default function TerminalWindow({
  type,
  command,
  output,
  explanation,
  isLoading = false,
}: TerminalWindowProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
  }[type];

  return (
    <div
      id={`terminal-${type}`}
      className={`flex flex-col h-full rounded-xl overflow-hidden border ${shellTheme.border} ${shellTheme.glow} transition-all duration-300 bg-[#0d1117] ${
        isExpanded ? "fixed inset-4 z-50 shadow-2xl" : "relative shadow-md"
      }`}
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
          {/* Badge indicator */}
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${shellTheme.badge} uppercase tracking-wider`}>
            {type}
          </span>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Zminimalizuj" : "Maksymalizuj"}
            className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-md transition-colors"
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          {command && (
            <button
              onClick={handleCopy}
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
      <div className={`flex-1 p-4 font-mono text-xs md:text-sm overflow-y-auto min-h-[180px] max-h-[350px] ${shellTheme.bg} transition-all duration-200`}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-3 py-10">
            <div className="flex space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
            <p className="text-zinc-500 text-xs">Generowanie symulacji...</p>
          </div>
        ) : (
          <div className="space-y-3 leading-relaxed">
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
              {explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
