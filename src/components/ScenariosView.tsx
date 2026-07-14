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
  ArrowRight
} from "lucide-react";
import { CHALLENGES, localEvaluateChallenge } from "../data/scenariosData";
import { Challenge, ChallengeEvaluationResult, ShellType } from "../types";
import MarkdownRenderer from "./MarkdownRenderer";

interface ScenariosViewProps {
  terminalTheme: "dark" | "monokai" | "solarized";
}

export default function ScenariosView({ terminalTheme }: ScenariosViewProps) {
  // State for challenges
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(CHALLENGES[0]);
  const [selectedShell, setSelectedShell] = useState<ShellType>("bash");
  const [userCommand, setUserCommand] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<ChallengeEvaluationResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<"all" | "podstawowa" | "ponadpodstawowa">("all");

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
    return matchesSearch && matchesLevel;
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
      } else {
        // Fallback locally if server returns an error
        const localData = localEvaluateChallenge(selectedChallenge, selectedShell, userCommand.trim());
        setEvaluationResult(localData);
        handleCompletedState(localData.isCorrect);
      }
    } catch (error) {
      // Fallback locally if network fails
      const localData = localEvaluateChallenge(selectedChallenge, selectedShell, userCommand.trim());
      setEvaluationResult(localData);
      handleCompletedState(localData.isCorrect);
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
    }
  };

  // Preset quick solutions for students to test
  const handleInsertQuickTip = () => {
    if (selectedChallenge.solutions[selectedShell].length > 0) {
      // Grab a correct command and insert it with slight variations or guide them
      const sample = selectedChallenge.solutions[selectedShell][0];
      setUserCommand(sample);
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
      <aside className="w-80 border-r border-slate-800 bg-slate-900/40 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
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
              className="w-full bg-slate-950/70 text-xs text-slate-200 placeholder-slate-500 pl-8 pr-3 py-2 rounded-lg border border-slate-800 focus:border-blue-500/50 focus:outline-none transition-all"
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
                    ? "bg-blue-600/15 border-blue-500/50 text-blue-300 font-bold"
                    : "bg-slate-950/30 border-slate-800/80 text-slate-400 hover:text-slate-200"
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Challenge list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
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
                      ? "bg-blue-600/10 border-blue-500/40 text-white"
                      : "bg-transparent border-transparent hover:bg-slate-800/20 text-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <span className="font-bold text-xs tracking-tight text-slate-200 block line-clamp-1">
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
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 font-medium">
                    {challenge.goal}
                  </p>
                  <div className="flex items-center justify-between gap-1 mt-2.5 pt-1.5 border-t border-slate-800/40">
                    <span className={`text-[8px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                      challenge.level === "podstawowa"
                        ? "bg-emerald-950/50 text-emerald-400 border border-emerald-800/30"
                        : "bg-purple-950/50 text-purple-400 border border-purple-800/30"
                    }`}>
                      {challenge.level === "podstawowa" ? "Podst." : "Ponadp."}
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center py-8 px-4">
              <p className="text-xs text-slate-500">Brak wyzwań spełniających kryteria.</p>
            </div>
          )}
        </div>

        {/* Bottom stats / reset button */}
        <div className="p-4 border-t border-slate-800/70 bg-slate-950/30 flex items-center justify-between">
          <div className="text-[10px] text-slate-400 font-mono">
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
        <div className="bg-slate-900/60 border border-slate-800/70 rounded-xl p-5 md:p-6 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center gap-2.5">
            {getLevelBadge(selectedChallenge.level)}
            <span className="text-xs text-slate-500 font-mono">&bull; Wyzwanie Praktyczne</span>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
              {selectedChallenge.title}
            </h2>
            <p className="text-sm font-semibold text-blue-300">
              Cel: {selectedChallenge.goal}
            </p>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
            {selectedChallenge.description}
          </p>

          <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500 font-mono">
            <Info size={12} className="text-blue-500" />
            <span>Sprawdź się w różnych powłokach, aby zebrać maksymalną liczbę punktów!</span>
          </div>
        </div>

        {/* Workspace area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left / Input panel */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl overflow-hidden flex flex-col">
              
              {/* Shell selectors */}
              <div className="bg-slate-950 border-b border-slate-800/80 p-2 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider pl-2">
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
                            ? "bg-blue-600/15 border-blue-500/50 text-blue-300"
                            : "bg-slate-900/50 border-transparent text-slate-400 hover:text-slate-200"
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
              <div className="p-4 bg-slate-950 flex-1 flex flex-col space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Edytor polecenia ({selectedShell.toUpperCase()})</span>
                  <button
                    onClick={handleInsertQuickTip}
                    className="text-[10px] text-blue-400/80 hover:text-blue-300 transition-all underline"
                    title="Wstaw przykładową komendę"
                  >
                    Wpisz komendę pomocniczą
                  </button>
                </div>

                <div className="relative font-mono text-sm bg-slate-900 rounded-lg p-3 border border-slate-800/60 flex items-start gap-2.5">
                  <span className="text-slate-600 select-none">
                    {selectedShell === "powershell" ? "PS C:\\>" : selectedShell === "cmd" ? "C:\\>" : "$"}
                  </span>
                  <input
                    type="text"
                    value={userCommand}
                    onChange={(e) => setUserCommand(e.target.value)}
                    placeholder="Wpisz swoje polecenie systemowe tutaj..."
                    className="w-full bg-transparent text-slate-100 focus:outline-none placeholder-slate-600 font-mono resize-none py-0.5"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleEvaluate();
                      }
                    }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-500 max-w-[65%] leading-normal font-mono">
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
            <div className="bg-slate-900/30 border border-slate-800/40 rounded-xl p-4 flex gap-3 items-start">
              <HelpCircle size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-300">Wskazówki dla powłoki {selectedShell.toUpperCase()}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
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
                      className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all flex items-center justify-center gap-1.5"
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
                          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-xs text-blue-300 space-y-1.5">
                            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Zalecany wzorzec:</span>
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
                  className="bg-slate-900/20 border border-slate-800/60 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-3 min-h-[250px]"
                >
                  <Award size={36} className="text-slate-600 animate-pulse" />
                  <div className="space-y-1 max-w-[80%]">
                    <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Czekam na ocenę</h3>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Wpisz polecenie systemowe i kliknij <strong>"Oceń polecenie"</strong>, aby rzucić wyzwanie inteligentnej ocenie nauczyciela.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
