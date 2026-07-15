import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles, 
  HelpCircle, 
  Play, 
  BookOpen, 
  Info,
  ChevronRight,
  Terminal as TerminalIcon,
  Flame,
  ArrowRight,
  X
} from "lucide-react";
import { CHALLENGES, localEvaluateChallenge } from "../data/scenariosData";
import { Challenge, ChallengeEvaluationResult, ShellType } from "../types";
import MarkdownRenderer from "./MarkdownRenderer";

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message: string;
}

interface ScenariosViewProps {
  terminalTheme: "dark" | "monokai" | "solarized";
}

const appThemes = {
  dark: {
    bg: "bg-slate-950",
    textTitle: "text-slate-100",
    textMuted: "text-slate-400",
    border: "border-slate-800",
    dashedBorder: "border-slate-800/60",
    sidebarBg: "bg-slate-900/40",
    cardBg: "bg-slate-900/60",
    innerCard: "bg-[#0b0f19]/60 border-slate-800/60",
    inputBg: "bg-slate-950",
    subBgSolid: "bg-slate-950/10",
    badgeGeneral: "bg-blue-950/20 border-blue-900/30 text-slate-400",
    tabActive: "bg-blue-600/20 text-blue-300 border-blue-500/60",
    activeCategory: "bg-blue-600/10 border-blue-500/40 text-white",
    accentHover: "hover:bg-slate-800/20",
  },
  monokai: {
    bg: "bg-[#1e1e1e]",
    textTitle: "text-[#f8f8f2]",
    textMuted: "text-[#a0a0a0]",
    border: "border-[#383830]",
    dashedBorder: "border-[#383830]/80",
    sidebarBg: "bg-[#272822]/40",
    cardBg: "bg-[#272822]/60",
    innerCard: "bg-[#1e1e1e]/60 border-[#383830]/60",
    inputBg: "bg-[#1e1e1e]",
    subBgSolid: "bg-[#1e1e1e]/10",
    badgeGeneral: "bg-[#75715e]/15 border-[#75715e]/30 text-[#f8f8f2]/70",
    tabActive: "bg-[#a6e22e]/15 text-[#a6e22e] border-[#a6e22e]/40",
    activeCategory: "bg-[#a6e22e]/10 border-[#a6e22e]/30 text-[#f8f8f2]",
    accentHover: "hover:bg-[#272822]/30",
  },
  solarized: {
    bg: "bg-[#fdf6e3]",
    textTitle: "text-[#073642]",
    textMuted: "text-[#657b83]",
    border: "border-[#eee8d5]",
    dashedBorder: "border-[#93a1a1]/40",
    sidebarBg: "bg-[#eee8d5]/30",
    cardBg: "bg-[#eee8d5]/50",
    innerCard: "bg-[#fdf6e3]/80 border-[#93a1a1]/30",
    inputBg: "bg-[#fdf6e3]",
    subBgSolid: "bg-[#fdf6e3]/30",
    badgeGeneral: "bg-[#b58900]/10 border-[#b58900]/30 text-[#073642]/80",
    tabActive: "bg-[#268bd2]/15 text-[#268bd2] border-[#268bd2]/40",
    activeCategory: "bg-[#268bd2]/10 border-[#268bd2]/30 text-[#073642]",
    accentHover: "hover:bg-[#eee8d5]/45",
  },
};

export default function ScenariosView({ terminalTheme }: ScenariosViewProps) {
  const t = appThemes[terminalTheme || "dark"] || appThemes.dark;
  // State for challenges
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(CHALLENGES[0]);
  const [selectedShell, setSelectedShell] = useState<ShellType>("bash");
  const [userCommand, setUserCommand] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<ChallengeEvaluationResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<"all" | "podstawowa" | "ponadpodstawowa">("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "ogolne" | "bezpieczenstwo">("all");

  // Toast notifications state
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: "success" | "error" | "info", title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    
    // Auto remove after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Streak & Completed list (stored in localStorage)
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const savedCompleted = localStorage.getItem("shellcompare_completed_challenges");
    const savedStreak = localStorage.getItem("shellcompare_challenge_streak");
    if (savedCompleted) {
      try {
        setCompletedChallenges(JSON.parse(savedCompleted));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedStreak) {
      setStreak(parseInt(savedStreak, 10) || 0);
    }
  }, []);

  // Filtered challenges
  const filteredChallenges = CHALLENGES.filter((c) => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.goal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === "all" || c.level === levelFilter;
    
    const challengeCategory = c.category || "ogolne";
    const matchesCategory = categoryFilter === "all" || challengeCategory === categoryFilter;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  // When selected challenge or shell changes, reset input & evaluation
  useEffect(() => {
    setUserCommand("");
    setEvaluationResult(null);
    setShowSolution(false);
  }, [selectedChallenge, selectedShell]);

  // Evaluate user command
  const handleEvaluate = async () => {
    if (!userCommand.trim()) return;

    setIsEvaluating(true);
    setEvaluationResult(null);
    setShowSolution(false);

    try {
      // First, try to call the real backend Gemini endpoint
      const response = await fetch("/api/evaluate-challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challengeGoal: selectedChallenge.goal,
          shell: selectedShell,
          userCommand: userCommand.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setEvaluationResult(data);
        handleCompletedState(data.isCorrect);

        if (data.isCorrect) {
          addToast("success", "Sukces! 🎉", `Zadanie '${selectedChallenge.title}' zostało zaliczone dla powłoki ${selectedShell.toUpperCase()}!`);
        } else {
          addToast("error", "Błędne polecenie ❌", "Twoje polecenie nie wykonuje poprawnie celu wyzwania.");
        }
      } else {
        // Fallback locally if server returns an error
        const localData = localEvaluateChallenge(selectedChallenge, selectedShell, userCommand.trim());
        setEvaluationResult(localData);
        handleCompletedState(localData.isCorrect);

        if (localData.isCorrect) {
          addToast("success", "Sukces (offline)! 🎉", `Zadanie '${selectedChallenge.title}' zostało zaliczone offline dla powłoki ${selectedShell.toUpperCase()}!`);
        } else {
          addToast("error", "Błędne polecenie ❌", "Twoje polecenie nie wykonuje poprawnie celu wyzwania.");
        }
      }
    } catch (error) {
      // Fallback locally if network fails
      const localData = localEvaluateChallenge(selectedChallenge, selectedShell, userCommand.trim());
      setEvaluationResult(localData);
      handleCompletedState(localData.isCorrect);

      addToast("info", "Tryb lokalny 🔌", "Użyto lokalnego silnika oceny z powodu problemów z siecią.");
      if (localData.isCorrect) {
        addToast("success", "Sukces (offline)! 🎉", `Zadanie '${selectedChallenge.title}' zostało zaliczone offline dla powłoki ${selectedShell.toUpperCase()}!`);
      } else {
        addToast("error", "Błędne polecenie ❌", "Twoje polecenie nie wykonuje poprawnie celu wyzwania.");
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCompletedState = (isCorrect: boolean) => {
    if (isCorrect) {
      const challengeKey = `${selectedChallenge.id}-${selectedShell}`;
      if (!completedChallenges.includes(challengeKey)) {
        const updated = [...completedChallenges, challengeKey];
        setCompletedChallenges(updated);
        localStorage.setItem("shellcompare_completed_challenges", JSON.stringify(updated));
        
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem("shellcompare_challenge_streak", newStreak.toString());
      }
    } else {
      // Optional: reset streak on incorrect answer, or keep it. Let's keep it friendly for students!
    }
  };

  const handleResetProgress = () => {
    if (window.confirm("Czy na pewno chcesz zresetować swoje postępy i punkty?")) {
      setCompletedChallenges([]);
      setStreak(0);
      localStorage.removeItem("shellcompare_completed_challenges");
      localStorage.removeItem("shellcompare_challenge_streak");
      addToast("info", "Postępy zresetowane 🔄", "Twoje postępy w wyzwaniach zostały pomyślnie zresetowane.");
    }
  };

  // Preset quick solutions for students to test
  const handleInsertQuickTip = () => {
    if (selectedChallenge.solutions[selectedShell].length > 0) {
      // Grab a correct command and insert it with slight variations or guide them
      const sample = selectedChallenge.solutions[selectedShell][0];
      setUserCommand(sample);
      addToast("info", "Wskazówka wprowadzona 💡", `Wpisano przykładową komendę dla powłoki ${selectedShell.toUpperCase()}.`);
    }
  };

  // Styled helper for level badge
  const getLevelBadge = (level: "podstawowa" | "ponadpodstawowa") => {
    return level === "podstawowa" ? (
      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-950/70 text-emerald-400 border border-emerald-800/40">
        Szkoła Podstawowa
      </span>
    ) : (
      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-purple-950/70 text-purple-400 border border-purple-800/40">
        Szkoła Ponadpodstawowa
      </span>
    );
  };

  const getShellColorClasses = (shell: ShellType) => {
    switch (shell) {
      case "bash":
        return { text: "text-emerald-400", bg: "bg-emerald-950/15", border: "border-emerald-500/30" };
      case "zsh":
        return { text: "text-amber-400", bg: "bg-amber-950/15", border: "border-amber-500/30" };
      case "cmd":
        return { text: "text-zinc-300", bg: "bg-slate-900", border: "border-slate-700" };
      case "powershell":
        return { text: "text-cyan-400", bg: "bg-blue-950/25", border: "border-blue-500/30" };
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar - Challenge List */}
      <aside className={`w-80 border-r ${t.border} ${t.sidebarBg} flex flex-col flex-shrink-0 transition-all duration-200`}>
        <div className={`p-4 border-b ${t.border} space-y-3`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-mono ${t.textMuted} uppercase tracking-wider`}>
              Wyzwania i Scenariusze
            </span>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/30">
              <Flame size={12} className="fill-amber-400 animate-pulse" />
              <span>Streak: {streak}</span>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Filtruj wyzwania..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${t.inputBg} text-xs ${t.textTitle} placeholder-slate-500 pl-8 pr-3 py-2 rounded-lg border ${t.border} focus:border-blue-500/50 focus:outline-none transition-all`}
            />
            <span className="absolute left-2.5 top-2.5 text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>

          {/* Educational level filters */}
          <div className="grid grid-cols-3 gap-1 pt-1">
            {[
              { id: "all", label: "Wszystkie" },
              { id: "podstawowa", label: "Podst." },
              { id: "ponadpodstawowa", label: "Ponadp." }
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setLevelFilter(lvl.id as any)}
                className={`px-1 py-1 rounded text-[10px] font-semibold text-center border transition-all ${
                  levelFilter === lvl.id
                    ? t.tabActive
                    : `${t.inputBg} ${t.border} ${t.textMuted} ${t.accentHover}`
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          {/* Category filters */}
          <div className="flex flex-col gap-1.5 pt-1.5 border-t border-slate-800/30">
            <span className={`text-[9px] font-mono uppercase tracking-wider ${t.textMuted}`}>
              Kategoria:
            </span>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: "all", label: "Wszystkie" },
                { id: "ogolne", label: "Ogólne" },
                { id: "bezpieczenstwo", label: "Tarcza" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id as any)}
                  className={`px-1 py-1 rounded text-[9px] font-semibold text-center border transition-all truncate ${
                    categoryFilter === cat.id
                      ? t.tabActive
                      : `${t.inputBg} ${t.border} ${t.textMuted} ${t.accentHover}`
                  }`}
                  title={cat.id === "bezpieczenstwo" ? "Bezpieczeństwo" : cat.label}
                >
                  {cat.id === "bezpieczenstwo" ? "Tarcza" : cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Challenge list */}
        <div className={`flex-1 overflow-y-auto p-2 space-y-1 ${t.subBgSolid}`}>
          {filteredChallenges.length > 0 ? (
            filteredChallenges.map((challenge) => {
              // Check how many shells are completed for this challenge
              const completedCount = ["bash", "zsh", "cmd", "powershell"].filter(sh => 
                completedChallenges.includes(`${challenge.id}-${sh}`)
              ).length;

              const isFullyCompleted = completedCount === 4;

              return (
                <button
                  key={challenge.id}
                  onClick={() => setSelectedChallenge(challenge)}
                  className={`w-full text-left p-3 rounded-lg transition-all border ${
                    selectedChallenge.id === challenge.id
                      ? t.activeCategory
                      : `bg-transparent border-transparent ${t.accentHover} ${t.textMuted}`
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <span className={`font-bold text-xs tracking-tight block line-clamp-1 ${t.textTitle}`}>
                      {challenge.title}
                    </span>
                    {isFullyCompleted ? (
                      <span className="text-[9px] bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 rounded-full px-1.5 py-0.2 font-bold flex items-center gap-0.5 flex-shrink-0">
                        ✓ 4/4
                      </span>
                    ) : completedCount > 0 ? (
                      <span className="text-[9px] bg-blue-950/80 text-blue-400 border border-blue-800/50 rounded-full px-1.5 py-0.2 font-bold flex items-center gap-0.5 flex-shrink-0">
                        {completedCount}/4
                      </span>
                    ) : null}
                  </div>
                  <p className={`text-[11px] line-clamp-1 mt-1 font-medium ${t.textMuted}`}>
                    {challenge.goal}
                  </p>
                  <div className={`flex items-center justify-between gap-1 mt-2.5 pt-1.5 border-t ${t.border}`}>
                    <span className={`text-[8px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                      challenge.level === "podstawowa"
                        ? "bg-emerald-950/50 text-emerald-400 border border-emerald-800/30"
                        : "bg-purple-950/50 text-purple-400 border border-purple-800/30"
                    }`}>
                      {challenge.level === "podstawowa" ? "Podst." : "Ponadp."}
                    </span>
                    <span className={`text-[8px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                      challenge.category === "bezpieczenstwo"
                        ? "bg-rose-950/50 text-rose-400 border border-rose-800/30"
                        : "bg-blue-950/50 text-blue-400 border border-blue-800/30"
                    }`}>
                      {challenge.category === "bezpieczenstwo" ? "Bezpiecz." : "Ogólne"}
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center py-8 px-4">
              <p className={`text-xs ${t.textMuted}`}>Brak wyzwań spełniających kryteria.</p>
            </div>
          )}
        </div>

        {/* Bottom stats / reset button */}
        <div className={`p-4 border-t bg-slate-950/30 flex items-center justify-between ${t.border}`}>
          <div className={`text-[10px] font-mono ${t.textMuted}`}>
            Ukończone powłoki: <strong className="text-emerald-400">{completedChallenges.length}</strong>
          </div>
          {completedChallenges.length > 0 && (
            <button
              onClick={handleResetProgress}
              className="text-[9px] font-semibold text-rose-400/80 hover:text-rose-300 transition-all uppercase tracking-wider flex items-center gap-1"
            >
              <RotateCcw size={10} />
              Reset
            </button>
          )}
        </div>
      </aside>

      {/* Main panel */}
      <div className="flex-1 bg-slate-950/15 flex flex-col overflow-y-auto p-6 md:p-8 space-y-6">
        {/* Header card with current Challenge */}
        <div className={`border rounded-xl p-5 md:p-6 space-y-4 shadow-xl transition-all duration-200 ${t.cardBg} ${t.border}`}>
          <div className="flex flex-wrap items-center gap-2.5">
            {getLevelBadge(selectedChallenge.level)}
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              selectedChallenge.category === "bezpieczenstwo"
                ? "bg-rose-950/70 text-rose-400 border border-rose-800/40"
                : "bg-blue-950/70 text-blue-400 border border-blue-800/40"
            }`}>
              Kategoria: {selectedChallenge.category === "bezpieczenstwo" ? "Bezpieczeństwo" : "Ogólne"}
            </span>
            <span className={`text-xs font-mono ${t.textMuted}`}>&bull; Wyzwanie Praktyczne</span>
          </div>

          <div className="space-y-1.5">
            <h2 className={`text-xl md:text-2xl font-display font-bold tracking-tight flex items-center gap-2 ${t.textTitle}`}>
              {selectedChallenge.title}
            </h2>
            <p className="text-sm font-semibold text-blue-300">
              Cel: {selectedChallenge.goal}
            </p>
          </div>

          <p className={`text-xs leading-relaxed max-w-3xl ${t.textMuted}`}>
            {selectedChallenge.description}
          </p>

          <div className={`flex items-center gap-2 pt-2 text-[11px] font-mono ${t.textMuted}`}>
            <Info size={12} className="text-blue-500" />
            <span>Sprawdź się w różnych powłokach, aby zebrać maksymalną liczbę punktów!</span>
          </div>
        </div>

        {/* Workspace area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left / Input panel */}
          <div className="lg:col-span-7 space-y-4">
            <div className={`border rounded-xl overflow-hidden flex flex-col transition-all duration-200 ${t.cardBg} ${t.border}`}>
              
              {/* Shell selectors */}
              <div className={`border-b p-2 flex items-center justify-between ${t.inputBg} ${t.border}`}>
                <span className={`text-[10px] font-mono uppercase tracking-wider pl-2 ${t.textMuted}`}>
                  Wybierz Powłokę docelową:
                </span>
                <div className="flex gap-1">
                  {(["bash", "zsh", "cmd", "powershell"] as ShellType[]).map((sh) => {
                    const isCompleted = completedChallenges.includes(`${selectedChallenge.id}-${sh}`);
                    return (
                      <button
                        key={sh}
                        onClick={() => setSelectedShell(sh)}
                        className={`px-3 py-1 text-[10px] font-mono font-bold rounded uppercase border transition-all ${
                          selectedShell === sh
                            ? t.tabActive
                            : `${t.inputBg} ${t.border} ${t.textMuted} ${t.accentHover}`
                        }`}
                      >
                        {sh === "powershell" ? "PS" : sh}
                        {isCompleted && <span className="ml-1 text-emerald-400">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Terminal code editor area */}
              <div className="p-4 bg-slate-950/40 flex-1 flex flex-col space-y-3">
                <div className={`flex items-center justify-between text-xs font-mono ${t.textMuted}`}>
                  <span>Edytor polecenia ({selectedShell.toUpperCase()})</span>
                  <button
                    onClick={handleInsertQuickTip}
                    className="text-[10px] text-blue-400/80 hover:text-blue-300 transition-all underline"
                    title="Wstaw przykładową komendę"
                  >
                    Wpisz komendę pomocniczą
                  </button>
                </div>

                <div className={`relative font-mono text-sm rounded-lg p-3 border flex items-start gap-2.5 ${t.inputBg} ${t.border}`}>
                  <span className={`${t.textMuted} select-none`}>
                    {selectedShell === "powershell" ? "PS C:\\>" : selectedShell === "cmd" ? "C:\\>" : "$"}
                  </span>
                  <input
                    type="text"
                    value={userCommand}
                    onChange={(e) => setUserCommand(e.target.value)}
                    placeholder="Wpisz swoje polecenie systemowe tutaj..."
                    className={`w-full bg-transparent focus:outline-none placeholder-slate-600 font-mono resize-none py-0.5 ${t.textTitle}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleEvaluate();
                      }
                    }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className={`text-[10px] max-w-[65%] leading-normal font-mono ${t.textMuted}`}>
                    Wciśnij Enter lub kliknij przycisk po prawej, aby ocenić.
                  </span>
                  <button
                    onClick={handleEvaluate}
                    disabled={isEvaluating || !userCommand.trim()}
                    className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg ${
                      !userCommand.trim()
                        ? "bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800"
                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/10 cursor-pointer"
                    }`}
                  >
                    {isEvaluating ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Nauczyciel ocenia...
                      </>
                    ) : (
                      <>
                        <Play size={12} className="fill-white" />
                        Oceń polecenie
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Static tip card */}
            <div className={`border rounded-xl p-4 flex gap-3 items-start ${t.innerCard}`}>
              <HelpCircle size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <h4 className={`text-xs font-bold ${t.textTitle}`}>Wskazówki dla powłoki {selectedShell.toUpperCase()}</h4>
                <p className={`text-[11px] leading-relaxed ${t.textMuted}`}>
                  {selectedChallenge.tips}
                </p>
              </div>
            </div>
          </div>

          {/* Right / Feedback panel */}
          <div className="lg:col-span-5 space-y-4">
            <AnimatePresence mode="wait">
              {evaluationResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`border rounded-xl p-5 md:p-6 space-y-4 shadow-xl ${
                    evaluationResult.isCorrect
                      ? "bg-emerald-950/20 border-emerald-500/30 text-slate-200"
                      : "bg-rose-950/20 border-rose-500/30 text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/40">
                    {evaluationResult.isCorrect ? (
                      <CheckCircle2 size={22} className="text-emerald-400" />
                    ) : (
                      <XCircle size={22} className="text-rose-400" />
                    )}
                    <h3 className="font-bold text-sm">
                      {evaluationResult.isCorrect ? "POLECONIE POPRAWNE!" : "WYKRYTO BŁĘDY / BRAKI"}
                    </h3>
                  </div>

                  <div className="text-xs leading-relaxed space-y-2">
                    <p className="font-medium text-slate-300">
                      Ocena nauczyciela:
                    </p>
                    <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/30 text-[11px] font-mono whitespace-pre-line text-slate-300 leading-normal">
                      {evaluationResult.feedback}
                    </div>
                  </div>

                  {evaluationResult.isCorrect && (
                    <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-lg p-3 flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
                      <Sparkles size={14} className="animate-pulse" />
                      <span>Ukończono to zadanie dla shella {selectedShell.toUpperCase()}! Punkty zostały zapisane.</span>
                    </div>
                  )}

                  {/* Toggle solution button */}
                  <div className="pt-2">
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className={`w-full py-2 px-3 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${t.inputBg} ${t.border} ${t.textTitle} hover:bg-slate-800/70`}
                    >
                      <BookOpen size={12} />
                      {showSolution ? "Ukryj wzorzec" : "Pokaż wzorcowe polecenie"}
                    </button>

                    <AnimatePresence>
                      {showSolution && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-2.5"
                        >
                          <div className={`p-3 rounded-lg border font-mono text-xs text-blue-300 space-y-1.5 ${t.inputBg} ${t.border}`}>
                            <span className={`text-[9px] uppercase font-bold tracking-wider block ${t.textMuted}`}>Zalecany wzorzec:</span>
                            <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-200">
                              {evaluationResult.alternative || selectedChallenge.solutions[selectedShell][0]}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-3 min-h-[250px] ${t.cardBg} ${t.dashedBorder}`}
                >
                  <Award size={36} className={`${t.textMuted} animate-pulse`} />
                  <div className="space-y-1 max-w-[80%]">
                    <h3 className={`font-bold text-xs uppercase tracking-wider ${t.textTitle}`}>Czekam na ocenę</h3>
                    <p className={`text-[11px] leading-normal ${t.textMuted}`}>
                      Wpisz polecenie systemowe i kliknij <strong>"Oceń polecenie"</strong>, aby rzucić wyzwanie inteligentnej ocenie nauczyciela.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Toast Notification Area */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all ${
                toast.type === "success"
                  ? "bg-slate-900/95 border-emerald-500/30 shadow-emerald-500/5 text-slate-100"
                  : toast.type === "error"
                  ? "bg-slate-900/95 border-rose-500/30 shadow-rose-500/5 text-slate-100"
                  : "bg-slate-900/95 border-blue-500/30 shadow-blue-500/5 text-slate-100"
              }`}
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {toast.type === "error" && <XCircle className="w-5 h-5 text-rose-400" />}
                {toast.type === "info" && <Info className="w-5 h-5 text-blue-400" />}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-0.5">
                <h4 className="text-xs font-bold font-sans tracking-tight text-slate-200">
                  {toast.title}
                </h4>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  {toast.message}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-slate-500 hover:text-slate-200 p-0.5 rounded transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
