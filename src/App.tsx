import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Terminal as TerminalIcon, 
  Settings, 
  Search, 
  RefreshCw, 
  Play, 
  HelpCircle, 
  ArrowRight, 
  Cpu, 
  Layers, 
  ShieldAlert, 
  Sparkles,
  Info,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Code,
  Trophy,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Download,
  Smartphone,
  X,
  Wifi,
  WifiOff,
  Github
} from "lucide-react";
import { ATLAS_CATEGORIES, ATLAS_ITEMS } from "./data/atlasData";
import { SYNTAX_COMPARISON_DATA, getDetailedRowData } from "./data/syntaxComparison";
import { ActiveTab, AtlasItem, CommandComparison, ConceptComparison, ShellType, TerminalTheme } from "./types";
import { INITIAL_SANDBOX_RESULT, INITIAL_CONCEPT_RESULT } from "./data/mockResponses";
import { offlineTranslateCommand, offlineGetConcept } from "./utils/offlineTranslator";
import TerminalWindow from "./components/TerminalWindow";
import HighlightedInput from "./components/HighlightedInput";
import MarkdownRenderer from "./components/MarkdownRenderer";
import ScenariosView from "./components/ScenariosView";

const appThemes = {
  dark: {
    bg: "bg-[#0b0f19] text-slate-200",
    headerBg: "bg-slate-900/95 border-slate-800",
    sidebarBg: "bg-slate-900/40 border-slate-800",
    cardBg: "bg-[#0b0f19]/80 border-slate-800",
    cardBgSolid: "bg-slate-900 border-slate-800",
    border: "border-slate-800",
    textMuted: "text-slate-400",
    textTitle: "text-white",
    tabActive: "bg-blue-600 text-white shadow-md shadow-blue-500/15",
    tabInactive: "text-slate-400 hover:text-slate-200",
    inputBg: "bg-slate-950 border-slate-800",
    kbdBg: "bg-slate-900/60 text-slate-400 border-slate-800",
    innerCard: "bg-slate-950/40 border-slate-800/50",
    badgeBg: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    difficultyAll: "bg-purple-600 text-white shadow-sm font-bold",
    accentText: "text-blue-400",
    accentHover: "hover:bg-slate-800/40 hover:text-slate-200",
    activeCategory: "bg-blue-600/15 text-blue-300 border-l-2 border-blue-500 pl-2",
    scrollbar: "scrollbar-dark",
    badgeGeneral: "bg-slate-800 text-blue-400 border-slate-700",
    activeItem: "bg-slate-800 border-slate-700 shadow-md",
    inactiveItem: "bg-slate-900/25 border-transparent hover:bg-slate-900/60",
    subBg: "bg-[#0b0f19]/60",
    subBgSolid: "bg-slate-950/50",
    interactiveActive: "bg-blue-600/15 border-blue-500/50 text-blue-300 font-bold",
    interactiveInactive: "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200",
    gradientHeaderBg: "bg-[#0b0f19]/80 border-slate-800",
    gradientColor: "text-blue-500",
    badgeSuccess: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    badgeWarning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    badgePurple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    quizPaneBg: "bg-[#0b0f19]/80 border-slate-800",
    dashedBorder: "border-slate-800/60",
  },
  monokai: {
    bg: "bg-[#191916] text-[#f8f8f2]",
    headerBg: "bg-[#272822]/95 border-[#3e3d32]",
    sidebarBg: "bg-[#272822]/40 border-[#3e3d32]",
    cardBg: "bg-[#272822]/80 border-[#3e3d32]",
    cardBgSolid: "bg-[#272822] border-[#3e3d32]",
    border: "border-[#3e3d32]",
    textMuted: "text-[#75715e]",
    textTitle: "text-[#f92672]",
    tabActive: "bg-[#a6e22e] text-black shadow-md shadow-[#a6e22e]/15 font-bold",
    tabInactive: "text-[#f8f8f2]/60 hover:text-[#f8f8f2]",
    inputBg: "bg-[#1e1e1a] border-[#49483e]",
    kbdBg: "bg-[#272822]/60 text-[#75715e] border-[#49483e]",
    innerCard: "bg-[#272822]/40 border-[#49483e]/50",
    badgeBg: "bg-[#ae81ff]/10 text-[#ae81ff] border-[#ae81ff]/20",
    difficultyAll: "bg-[#a6e22e] text-black shadow-sm font-bold",
    accentText: "text-[#66d9ef]",
    accentHover: "hover:bg-[#272822]/40 hover:text-[#f8f8f2]",
    activeCategory: "bg-[#a6e22e]/15 text-[#a6e22e] border-l-2 border-[#a6e22e] pl-2",
    scrollbar: "scrollbar-monokai",
    badgeGeneral: "bg-[#272822] text-[#66d9ef] border-[#49483e]",
    activeItem: "bg-[#272822] border-[#a6e22e]/40 shadow-md",
    inactiveItem: "bg-[#1e1e1a]/25 border-transparent hover:bg-[#272822]/60",
    subBg: "bg-[#191916]/60",
    subBgSolid: "bg-[#272822]/50",
    interactiveActive: "bg-[#a6e22e]/15 border-[#a6e22e]/50 text-[#a6e22e] font-bold",
    interactiveInactive: "bg-[#1e1e1a]/40 border-[#3e3d32]/80 text-[#75715e] hover:bg-[#272822]/40 hover:text-[#f8f8f2]",
    gradientHeaderBg: "bg-[#272822]/80 border-[#3e3d32]",
    gradientColor: "text-[#f92672]",
    badgeSuccess: "bg-[#a6e22e]/10 text-[#a6e22e] border-[#a6e22e]/20",
    badgeWarning: "bg-[#e6db74]/10 text-[#e6db74] border-[#e6db74]/20",
    badgePurple: "bg-[#ae81ff]/10 text-[#ae81ff] border-[#ae81ff]/20",
    quizPaneBg: "bg-[#272822]/80 border-[#3e3d32]",
    dashedBorder: "border-[#49483e]/60",
  },
  solarized: {
    bg: "bg-[#001f27] text-[#93a1a1]",
    headerBg: "bg-[#002b36]/95 border-[#073642]",
    sidebarBg: "bg-[#002b36]/40 border-[#073642]",
    cardBg: "bg-[#002b36]/80 border-[#073642]",
    cardBgSolid: "bg-[#002b36] border-[#073642]",
    border: "border-[#073642]",
    textMuted: "text-[#586e75]",
    textTitle: "text-[#268bd2]",
    tabActive: "bg-[#2aa198] text-white shadow-md shadow-[#2aa198]/15 font-bold",
    tabInactive: "text-[#93a1a1]/60 hover:text-[#e0e0e0]",
    inputBg: "bg-[#001f27] border-[#073642]",
    kbdBg: "bg-[#002b36]/60 text-[#586e75] border-[#073642]",
    innerCard: "bg-[#002b36]/40 border-[#073642]/50",
    badgeBg: "bg-[#b58900]/10 text-[#b58900] border-[#b58900]/20",
    difficultyAll: "bg-[#2aa198] text-white shadow-sm font-bold",
    accentText: "text-[#2aa198]",
    accentHover: "hover:bg-[#002b36]/40 hover:text-[#e0e0e0]",
    activeCategory: "bg-[#2aa198]/15 text-[#2aa198] border-l-2 border-[#2aa198] pl-2",
    scrollbar: "scrollbar-solarized",
    badgeGeneral: "bg-[#002b36] text-[#268bd2] border-[#073642]",
    activeItem: "bg-[#002b36] border-[#2aa198]/40 shadow-md",
    inactiveItem: "bg-[#001f27]/25 border-transparent hover:bg-[#002b36]/60",
    subBg: "bg-[#001f27]/60",
    subBgSolid: "bg-[#002b36]/50",
    interactiveActive: "bg-[#2aa198]/15 border-[#2aa198]/50 text-[#2aa198] font-bold",
    interactiveInactive: "bg-[#001f27]/40 border-[#073642]/80 text-[#586e75] hover:bg-[#002b36]/40 hover:text-[#93a1a1]",
    gradientHeaderBg: "bg-[#002b36]/80 border-[#073642]",
    gradientColor: "text-[#268bd2]",
    badgeSuccess: "bg-[#859900]/10 text-[#859900] border-[#859900]/20",
    badgeWarning: "bg-[#b58900]/10 text-[#b58900] border-[#b58900]/20",
    badgePurple: "bg-[#d33682]/10 text-[#d33682] border-[#d33682]/20",
    quizPaneBg: "bg-[#002b36]/80 border-[#073642]",
    dashedBorder: "border-[#073642]/60",
  },
};

export default function App() {
  // Tab states
  const [activeTab, setActiveTab] = useState<ActiveTab>("atlas");
  
  // Connection status (Online/Offline)
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Global Keyboard Shortcuts for tab navigation (Alt+A, Alt+S, Alt+C, Alt+W, Alt+I)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const key = e.key.toLowerCase();
        if (key === "a") {
          e.preventDefault();
          setActiveTab("atlas");
        } else if (key === "s") {
          e.preventDefault();
          setActiveTab("sandbox");
        } else if (key === "c") {
          e.preventDefault();
          setActiveTab("concepts");
        } else if (key === "w") {
          e.preventDefault();
          setActiveTab("scenarios");
        } else if (key === "i") {
          e.preventDefault();
          setActiveTab("about");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState<"all" | "podstawowa" | "ponadpodstawowa">("all");

  // Selected item in Atlas
  const [selectedAtlasItem, setSelectedAtlasItem] = useState<AtlasItem>(ATLAS_ITEMS[0]);
  const [expandedSyntaxRow, setExpandedSyntaxRow] = useState<'command' | 'flags' | 'args' | 'returnValue' | null>(null);

  // Sandbox states
  const [sandboxInput, setSandboxInput] = useState("ls -la");
  const [sandboxSource, setSandboxSource] = useState<string>("Bash");
  const [sandboxResult, setSandboxResult] = useState<CommandComparison | null>(INITIAL_SANDBOX_RESULT);
  const [isSandboxLoading, setIsSandboxLoading] = useState(false);
  const [sandboxError, setSandboxError] = useState<string | null>(null);

  // Concept states
  const [selectedConcept, setSelectedConcept] = useState<string>("Potoki (Pipelines)");
  const [conceptResult, setConceptResult] = useState<ConceptComparison | null>(INITIAL_CONCEPT_RESULT);
  const [isConceptLoading, setIsConceptLoading] = useState(false);
  const [conceptError, setConceptError] = useState<string | null>(null);

  // Quiz states
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [flashcardResetKey, setFlashcardResetKey] = useState(0);
  const [terminalTheme, setTerminalTheme] = useState<TerminalTheme>("dark");

  const [quizQuestion, setQuizQuestion] = useState<AtlasItem | null>(null);

  // Auto-reset flashcards state when changing atlas item or flashcard mode toggled
  useEffect(() => {
    setFlashcardResetKey(prev => prev + 1);
    setExpandedSyntaxRow(null); // Reset expanded table row on change
  }, [selectedAtlasItem, isFlashcardMode]);
  const [quizSourceShell, setQuizSourceShell] = useState<ShellType>("bash");
  const [quizTargetShell, setQuizTargetShell] = useState<ShellType>("powershell");
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [quizStreak, setQuizStreak] = useState(0);
  const [quizDifficulty, setQuizDifficulty] = useState<"all" | "podstawowa" | "ponadpodstawowa">("all");

  const startNewQuizQuestion = (difficultyOverride?: "all" | "podstawowa" | "ponadpodstawowa") => {
    if (ATLAS_ITEMS.length === 0) return;
    
    const activeDifficulty = difficultyOverride !== undefined ? difficultyOverride : quizDifficulty;

    // Filter items based on selected difficulty
    const pool = ATLAS_ITEMS.filter(item => {
      if (activeDifficulty === "all") return true;
      if (activeDifficulty === "podstawowa") return item.level === "podstawowa" || !item.level;
      if (activeDifficulty === "ponadpodstawowa") return item.level === "ponadpodstawowa";
      return true;
    });

    if (pool.length === 0) return;
    
    // Pick random item from filtered pool
    const randomIndex = Math.floor(Math.random() * pool.length);
    const item = pool[randomIndex];
    
    // Pick random source shell and target shell (different)
    const shells: ShellType[] = ["bash", "cmd", "powershell"];
    const source = shells[Math.floor(Math.random() * shells.length)];
    const remainingShells = shells.filter(s => s !== source);
    const target = remainingShells[Math.floor(Math.random() * remainingShells.length)];
    
    setQuizQuestion(item);
    setQuizSourceShell(source);
    setQuizTargetShell(target);
    setQuizSelectedOption(null);
    setQuizSubmitted(false);
    
    // Generate options using pool or full ATLAS_ITEMS if pool has too few items
    const correctOption = item[target];
    const distractorSource = pool.length >= 4 ? pool : ATLAS_ITEMS;
    const distractors = distractorSource
      .filter(i => i.id !== item.id)
      .map(i => i[target]);
    
    // Shuffle distractors and pick 3 unique distractors if possible
    const uniqueDistractors = Array.from(new Set(distractors))
      .filter(d => d !== correctOption);
    
    const chosenDistractors = uniqueDistractors
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    // If we have fewer than 3 distractors, fill in
    while (chosenDistractors.length < 3) {
      chosenDistractors.push("placeholder-" + Math.random());
    }
    
    const allOptions = [correctOption, ...chosenDistractors].sort(() => 0.5 - Math.random());
    setQuizOptions(allOptions);
  };

  const handleQuizSubmit = () => {
    if (!quizSelectedOption || !quizQuestion || quizSubmitted) return;
    
    const correctOption = quizQuestion[quizTargetShell];
    const isCorrect = quizSelectedOption === correctOption;
    
    setQuizSubmitted(true);
    setQuizScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    
    if (isCorrect) {
      setQuizStreak(prev => prev + 1);
    } else {
      setQuizStreak(0);
    }
  };

  // Helper to render detailed collapsible panels for the comparison table
  const renderRowDetails = (rowType: 'command' | 'flags' | 'args' | 'returnValue') => {
    const details = getDetailedRowData(selectedAtlasItem.id, rowType);
    
    const platforms = [
      {
        key: 'bash',
        name: 'Bash (POSIX)',
        colorClass: 'text-emerald-400',
        bgClass: 'bg-emerald-950/20 border-emerald-500/15',
        badgeClass: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40',
        btnClass: 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border-emerald-800/40',
        data: details.bash
      },
      {
        key: 'cmd',
        name: 'CMD (Windows DOS)',
        colorClass: 'text-zinc-300',
        bgClass: 'bg-slate-900/40 border-slate-800/80',
        badgeClass: 'bg-slate-900/50 text-slate-300 border-slate-700/50',
        btnClass: 'bg-slate-900/60 hover:bg-slate-800/60 text-slate-200 border-slate-700/50',
        data: details.cmd
      },
      {
        key: 'powershell',
        name: 'PowerShell (.NET)',
        colorClass: 'text-cyan-400',
        bgClass: 'bg-cyan-950/20 border-cyan-500/15',
        badgeClass: 'bg-cyan-950/40 text-cyan-300 border-cyan-800/40',
        btnClass: 'bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border-cyan-800/40',
        data: details.powershell
      }
    ];

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="overflow-hidden"
      >
        <div className="py-3 px-4 bg-slate-950/70 rounded-lg border border-slate-800/60 space-y-3">
          <div className="text-[10px] font-bold text-slate-400 flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <Info size={12} className="text-blue-400" />
              <span>SZCZEGÓŁOWA ANALIZA ELEMENTU:</span>
              <span className="text-slate-200 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800/60 font-mono text-[9px]">
                {selectedAtlasItem.title} &rarr; {
                  rowType === 'command' ? 'Polecenie bazowe' :
                  rowType === 'flags' ? 'Flagi i przełączniki' :
                  rowType === 'args' ? 'Przekazywane argumenty' : 'Zwracana wartość / Efekt'
                }
              </span>
            </div>
            <span className="text-[9px] text-slate-500 font-medium">Kliknij wiersz ponownie, aby zwinąć</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {platforms.map((platform) => (
              <div key={platform.key} className={`rounded-md border p-3 flex flex-col justify-between space-y-3 transition-colors ${platform.bgClass}`}>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold tracking-wide ${platform.colorClass}`}>
                      {platform.name}
                    </span>
                    <span className={`text-[8.5px] font-semibold px-1 py-0.2 rounded border font-mono ${platform.badgeClass}`}>
                      {platform.key.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[10.5px] leading-relaxed text-slate-300 font-normal">
                    {platform.data.desc}
                  </p>
                </div>

                <a 
                  href={platform.data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className={`w-full py-1 px-2 rounded text-[9.5px] font-semibold flex items-center justify-center gap-1.5 border transition-all ${platform.btnClass}`}
                >
                  <ExternalLink size={10.5} />
                  <span>Dokumentacja zewnętrzna</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  // Quick suggestions for Sandbox
  const sandboxSuggestions = [
    { title: "Zastąp słowo w pliku", input: "Zastąp słowo 'błąd' słowem 'naprawiono' w pliku logs.txt", source: "Opis słowny" },
    { title: "Pętla od 1 do 10", input: "Napisz pętlę wyświetlającą liczby od 1 do 10", source: "Opis słowny" },
    { title: "Filtrowanie i liczenie procesów", input: "ps aux | grep node | wc -l", source: "Bash" },
    { title: "Kopiowanie z warunkiem", input: "Copy-Item *.log D:\\Backup -Force", source: "PowerShell" },
    { title: "Cykliczny ping z zapisem", input: "ping google.com > ping_results.txt", source: "CMD" }
  ];

  // Predefined concepts
  const conceptConcepts = [
    "Potoki (Pipelines)",
    "Zmienne środowiskowe",
    "Skryptowanie i Pętle",
    "Przekierowania strumieni (stdout/stderr)",
    "Uprawnienia i Bezpieczeństwo plików",
    "Zarządzanie procesami i sygnały"
  ];

  // Filter atlas items based on search, category and school level
  const filteredAtlasItems = ATLAS_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || item.level === selectedLevel;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cmd.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.powershell.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  // Auto-select first item when filtered list changes and current item is not in it
  useEffect(() => {
    if (filteredAtlasItems.length > 0 && !filteredAtlasItems.some(i => i.id === selectedAtlasItem.id)) {
      setSelectedAtlasItem(filteredAtlasItems[0]);
    }
  }, [filteredAtlasItems, selectedAtlasItem]);

  // Handle live translation inside Sandbox
  const handleTranslate = async (overrideInput?: string, overrideSource?: string) => {
    const inputToUse = overrideInput || sandboxInput;
    const sourceToUse = overrideSource || sandboxSource;

    if (!inputToUse.trim()) return;

    setIsSandboxLoading(true);
    setSandboxError(null);

    try {
      const response = await fetch("/api/translate-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: inputToUse, sourceShell: sourceToUse }),
      });

      if (!response.ok) {
        throw new Error("Błąd sieci lub brak serwera.");
      }

      const data = await response.json();
      setSandboxResult(data);
    } catch (err: any) {
      console.warn("Serwer niedostępny, przełączanie na tłumaczenie offline (lokalne)...", err);
      // Seamless static fallback for GitHub Pages / static environments
      try {
        const localData = offlineTranslateCommand(inputToUse, sourceToUse);
        setSandboxResult(localData);
      } catch (fallbackErr) {
        setSandboxError("Nie udało się przetłumaczyć polecenia.");
      }
    } finally {
      setIsSandboxLoading(false);
    }
  };

  // Load selected concept details
  const handleLoadConcept = async (conceptName: string) => {
    setSelectedConcept(conceptName);
    setIsConceptLoading(true);
    setConceptError(null);

    try {
      const response = await fetch("/api/compare-concept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept: conceptName }),
      });

      if (!response.ok) {
        throw new Error("Błąd sieci lub brak serwera.");
      }

      const data = await response.json();
      setConceptResult(data);
    } catch (err: any) {
      console.warn("Serwer niedostępny, ładowanie pojęcia z lokalnej bazy...", err);
      // Seamless static fallback for GitHub Pages / static environments
      try {
        const localData = offlineGetConcept(conceptName);
        setConceptResult(localData);
      } catch (fallbackErr) {
        setConceptError("Błąd podczas ładowania pojęcia teoretycznego.");
      }
    } finally {
      setIsConceptLoading(false);
    }
  };

  // Quick action: load Atlas item into Sandbox
  const handleLoadIntoSandbox = (item: AtlasItem) => {
    setSandboxInput(item.bash);
    setSandboxSource("Bash");
    setActiveTab("sandbox");
    handleTranslate(item.bash, "Bash");
  };

  const t = appThemes[terminalTheme] || appThemes.dark;

  return (
    <div className={`h-screen w-full flex flex-col ${t.bg} font-sans overflow-hidden transition-all duration-200`}>
      {/* HEADER */}
      <header className={`h-16 border-b ${t.border} ${t.headerBg} flex items-center justify-between px-6 md:px-8 flex-shrink-0 z-10 transition-all duration-200`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center font-display font-bold text-white shadow-lg shadow-blue-500/10">
            ST
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-display font-bold tracking-tight text-white flex items-center gap-2">
              ShellCompare
              <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border transition-all duration-200 ${t.badgeGeneral}`}>
                v1.3.0
              </span>
            </h1>
            <span className={`text-[10px] font-medium transition-all duration-200 ${t.textMuted}`}>Atlas & Komparator terminali w czasie rzeczywistym</span>
          </div>
        </div>

        {/* Global Tab Navigation */}
        <div className={`flex p-1 rounded-lg border gap-1 flex-wrap md:flex-nowrap transition-all duration-200 ${t.inputBg}`}>
          <button
            onClick={() => setActiveTab("atlas")}
            title="Atlas Komend [Alt+A]"
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap group ${
              activeTab === "atlas" ? t.tabActive : t.tabInactive
            }`}
          >
            <BookOpen size={14} />
            <span className="hidden sm:inline">Atlas Komend</span>
          </button>
          <button
            onClick={() => setActiveTab("sandbox")}
            title="Komparator Live [Alt+S]"
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap group ${
              activeTab === "sandbox" ? t.tabActive : t.tabInactive
            }`}
          >
            <TerminalIcon size={14} />
            <span className="hidden sm:inline">Komparator Live</span>
            <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1 rounded font-mono">AI</span>
          </button>
          <button
            onClick={() => setActiveTab("concepts")}
            title="Różnice Architektoniczne [Alt+C]"
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap group ${
              activeTab === "concepts" ? t.tabActive : t.tabInactive
            }`}
          >
            <Layers size={14} />
            <span className="hidden sm:inline">Różnice Architektoniczne</span>
          </button>
          <button
            onClick={() => setActiveTab("scenarios")}
            title="Scenariusze i Wyzwania [Alt+W]"
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap group ${
              activeTab === "scenarios" ? t.tabActive : t.tabInactive
            }`}
          >
            <Cpu size={14} />
            <span className="hidden sm:inline">Scenariusze</span>
            <span className="bg-amber-500/20 text-amber-400 text-[9px] px-1 rounded font-mono">Wyzwania</span>
          </button>
          <button
            onClick={() => setActiveTab("about")}
            title="O programie i Regulamin [Alt+I]"
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap group ${
              activeTab === "about" ? t.tabActive : t.tabInactive
            }`}
          >
            <Info size={14} />
            <span className="hidden sm:inline">O programie</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
          {/* Terminal Theme Toggle */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all focus-within:border-blue-500/50 ${t.inputBg}`}>
            <span className={`text-[10px] font-mono hidden sm:inline ${t.textMuted}`}>Motyw:</span>
            <select
              value={terminalTheme}
              onChange={(e) => setTerminalTheme(e.target.value as TerminalTheme)}
              className="bg-transparent text-[10px] font-mono text-white focus:outline-none cursor-pointer border-none py-0.5"
              title="Zmień motyw całego programu (Dark, Monokai, Solarized)"
            >
              <option value="dark" className="bg-slate-900 text-slate-200">Dark</option>
              <option value="monokai" className="bg-slate-900 text-slate-200">Monokai</option>
              <option value="solarized" className="bg-slate-900 text-slate-200">Solarized</option>
            </select>
          </div>

          <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded border transition-all ${t.inputBg}`}>
            <Wifi size={11} className="text-blue-400" />
            <span className="text-[10px] font-mono text-blue-400 font-medium">Atlas Offline Ready</span>
          </div>

          {isOnline ? (
            <div className={`hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded border transition-all ${t.inputBg}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-emerald-400 font-mono">Gemini 3.5 Flash Active</span>
            </div>
          ) : (
            <div className={`hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded border text-amber-400 transition-all ${t.inputBg}`}>
              <WifiOff size={11} className="text-amber-400 animate-pulse" />
              <span className="text-[10px] font-mono">Tryb Offline: Silnik Lokalny</span>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* TAB 1: ATLAS KOMEND */}
        {activeTab === "atlas" && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar - Categories & Search */}
            <aside className={`w-80 border-r ${t.border} ${t.sidebarBg} flex flex-col flex-shrink-0 transition-all duration-200`}>
              <div className={`p-4 border-b ${t.border} space-y-3`}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Szukaj komendy lub opisu..."
                    className={`w-full ${t.inputBg} border ${t.border} rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-colors`}
                  />
                  <Search size={14} className="absolute left-3 top-3 text-slate-500" />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")} 
                      className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Category selectors */}
                <div className="space-y-1">
                  <h3 className={`text-[10px] font-bold ${t.textMuted} uppercase tracking-wider px-2 mb-1`}>
                    Kategorie Atlasu
                  </h3>
                  <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1">
                    {ATLAS_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center justify-between ${
                          selectedCategory === cat.id
                            ? t.activeCategory
                            : `${t.textMuted} ${t.accentHover}`
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className={`text-[10px] font-mono ${t.inputBg} ${t.textMuted} px-1 py-0.5 rounded border ${t.border}`}>
                          {cat.id === "all" 
                            ? ATLAS_ITEMS.length 
                            : ATLAS_ITEMS.filter(i => i.category === cat.id).length
                          }
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Educational Level selector */}
                <div className={`space-y-1.5 pt-2.5 border-t ${t.border}`}>
                  <h3 className={`text-[10px] font-bold ${t.textMuted} uppercase tracking-wider px-2 mb-1`}>
                    Poziom Edukacyjny
                  </h3>
                  <div className="grid grid-cols-3 gap-1 px-1">
                    {[
                      { id: "all", label: "Wszystkie" },
                      { id: "podstawowa", label: "Podst." },
                      { id: "ponadpodstawowa", label: "Ponadp." }
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        onClick={() => setSelectedLevel(lvl.id as any)}
                        title={lvl.id === "all" ? "Wszystkie poziomy" : lvl.id === "podstawowa" ? "Szkoła Podstawowa" : "Szkoła Ponadpodstawowa"}
                        className={`px-1.5 py-1.5 rounded-lg text-[10px] font-semibold tracking-tight transition-all text-center border ${
                          selectedLevel === lvl.id
                            ? t.interactiveActive
                            : t.interactiveInactive
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Command List */}
              <div className={`flex-1 overflow-y-auto p-3 space-y-1 ${t.subBgSolid}`}>
                <div className={`flex items-center justify-between px-2 py-1 text-[10px] font-bold ${t.textMuted} uppercase tracking-wider`}>
                  <span>Dostępne artykuły ({filteredAtlasItems.length})</span>
                </div>
                {filteredAtlasItems.length > 0 ? (
                  filteredAtlasItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedAtlasItem(item)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all duration-150 flex flex-col gap-1 ${
                        selectedAtlasItem.id === item.id
                          ? t.activeItem
                          : t.inactiveItem
                      }`}
                    >
                      <h4 className={`text-xs font-semibold font-display line-clamp-1 ${selectedAtlasItem.id === item.id ? "text-white" : t.textTitle}`}>
                        {item.title}
                      </h4>
                      <p className={`text-[11px] line-clamp-1 ${selectedAtlasItem.id === item.id ? "text-slate-300" : t.textMuted}`}>
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between gap-1 mt-1 pt-1 border-t border-slate-800/30">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono bg-[#0c0c0c] text-emerald-400 px-1 py-0.2 rounded border border-emerald-950/40">
                            {item.bash.split(" ")[0]}
                          </span>
                          <span className="text-[9px] font-mono bg-[#010101] text-zinc-300 px-1 py-0.2 rounded border border-zinc-800">
                            {item.cmd.split(" ")[0]}
                          </span>
                        </div>
                        {item.level && (
                          <span className={`text-[8px] px-1 py-0.2 rounded font-bold uppercase tracking-wider ${
                            item.level === "podstawowa"
                              ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                              : "bg-purple-950/60 text-purple-400 border border-purple-800/40"
                          }`}>
                            {item.level === "podstawowa" ? "Podst." : "Ponadp."}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 space-y-2">
                    <HelpCircle className="mx-auto text-slate-600" size={24} />
                    <p className="text-xs">Brak wyników wyszukiwania.</p>
                  </div>
                )}
              </div>

              {/* Sidebar Footer Tip */}
              <div className="p-4 border-t border-slate-800 bg-slate-950/40">
                <div className="p-3 bg-gradient-to-br from-slate-900 to-slate-950 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-1.5 text-[10px] text-blue-400 font-bold mb-1 uppercase tracking-wider">
                    <Sparkles size={10} />
                    <span>Wskazówka Architekta</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    PowerShell 7+ implementuje pod maską ustandaryzowane aliasy takie jak <code className="text-blue-300 font-mono">ls</code> czy <code className="text-blue-300 font-mono">rm</code>, ułatwiając migrację programistom Linuksa.
                  </p>
                </div>
              </div>
            </aside>

            {/* Right Pane - Visual Details & Comparison Grid or Quiz Mode */}
            <section className="flex-1 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto bg-slate-950/10">
              {/* Header Selector to switch between Details and Quiz */}
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${t.border} pb-4`}>
                <div className={`flex p-1 rounded-lg border self-start ${t.inputBg}`}>
                  <button
                    onClick={() => {
                      setIsQuizMode(false);
                      setIsFlashcardMode(false);
                    }}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-2 ${
                      !isQuizMode && !isFlashcardMode
                        ? t.tabActive
                        : `${t.textMuted} ${t.accentHover}`
                    }`}
                  >
                    <BookOpen size={13} />
                    Szczegóły Komendy
                  </button>
                  <button
                    onClick={() => {
                      setIsQuizMode(false);
                      setIsFlashcardMode(true);
                    }}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-2 ${
                      !isQuizMode && isFlashcardMode
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/15"
                        : `${t.textMuted} ${t.accentHover}`
                    }`}
                  >
                    <span className="text-xs">🎴</span>
                    Fiszki (Flashcards)
                  </button>
                  <button
                    onClick={() => {
                      setIsQuizMode(true);
                      setIsFlashcardMode(false);
                      if (!quizQuestion) {
                        startNewQuizQuestion();
                      }
                    }}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-2 ${
                      isQuizMode
                        ? "bg-purple-600 text-white shadow-md shadow-purple-500/15"
                        : `${t.textMuted} ${t.accentHover}`
                    }`}
                  >
                    <Trophy size={13} />
                    🎓 Tryb Quizu
                  </button>
                </div>

                {isQuizMode && (
                  <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
                    {/* Difficulty selector */}
                    <div className={`flex items-center gap-1.5 p-1 rounded-lg border text-xs ${t.inputBg}`}>
                      <span className={`${t.textMuted} font-mono text-[9px] uppercase tracking-wider px-1.5 select-none`}>Trudność:</span>
                      <div className="flex gap-1">
                        {[
                          { id: "all", label: "Wszystkie" },
                          { id: "podstawowa", label: "Podstawowy" },
                          { id: "ponadpodstawowa", label: "Ponadpodstawowy" }
                        ].map((lvl) => (
                          <button
                            key={lvl.id}
                            onClick={() => {
                              setQuizDifficulty(lvl.id as any);
                              startNewQuizQuestion(lvl.id as any);
                            }}
                            className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all whitespace-nowrap ${
                              quizDifficulty === lvl.id
                                ? t.tabActive
                                : `${t.textMuted} ${t.accentHover}`
                            }`}
                          >
                            {lvl.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Score/Streak tracker */}
                    <div className={`flex items-center gap-4 px-4 py-2 rounded-lg border text-xs font-mono ${t.inputBg}`}>
                      <div className="flex items-center gap-1.5">
                        <Award size={13} className="text-yellow-500" />
                        <span className={t.textMuted}>Wynik:</span>
                        <span className="text-emerald-400 font-bold">{quizScore.correct}/{quizScore.total}</span>
                      </div>
                      {quizStreak > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="animate-pulse">🔥</span>
                          <span className="text-orange-400 font-bold">{quizStreak}</span>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setQuizScore({ correct: 0, total: 0 });
                          setQuizStreak(0);
                          startNewQuizQuestion();
                        }}
                        title="Resetuj statystyki"
                        className={`hover:text-slate-300 transition-colors pl-2 border-l ${t.border} ${t.textMuted}`}
                      >
                        <RotateCcw size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {!isQuizMode ? (
                <>
                  <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 border-b ${t.border} pb-6`}>
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                        <span className={`${t.accentText} uppercase tracking-widest font-bold`}>
                          Atlas Komend › {ATLAS_CATEGORIES.find(c => c.id === selectedAtlasItem.category)?.name.replace(/[^A-Za-z0-9óóóęąśłżźń ]/g, "").trim() || selectedAtlasItem.category}
                        </span>
                        {selectedAtlasItem.level && (
                          <>
                            <span className={`${t.textMuted} font-normal`}>&bull;</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              selectedAtlasItem.level === "podstawowa"
                                ? "bg-emerald-950/70 text-emerald-400 border border-emerald-800/40"
                                : "bg-purple-950/70 text-purple-400 border border-purple-800/40"
                            }`}>
                              Poziom: {selectedAtlasItem.level === "podstawowa" ? "Szkoła Podstawowa" : "Szkoła Ponadpodstawowa"}
                            </span>
                          </>
                        )}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
                        {selectedAtlasItem.title}
                      </h2>
                      <p className={`${t.textMuted} text-sm max-w-2xl`}>
                        {selectedAtlasItem.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLoadIntoSandbox(selectedAtlasItem)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/10 transition-colors"
                      >
                        <TerminalIcon size={14} />
                        Załaduj do Komparatora Live
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>

                  {isFlashcardMode && (
                    <div className={`border rounded-xl p-4 flex items-start gap-3 animate-fadeIn ${t.badgeGeneral}`}>
                      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 shrink-0">
                        <span className="text-lg">🎴</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Interaktywny Trening Fiszki</h4>
                        <p className={`text-xs leading-relaxed ${t.textMuted}`}>
                          Składnia poleceń została celowo ukryta. Spróbuj przypomnieć sobie, jak wygląda komenda dla wybranego zadania (<strong>{selectedAtlasItem.title}</strong>) w poszczególnych powłokach, a następnie kliknij odpowiednią kartę, aby sprawdzić swoją wiedzę i odsłonić detale!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Terminal Windows Comparison Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <TerminalWindow 
                      key={`${selectedAtlasItem.id}-${flashcardResetKey}-bash`}
                      type="bash" 
                      command={selectedAtlasItem.bash} 
                      output={`$ ${selectedAtlasItem.bash}\n# Wykonano pomyślnie. Plik/operacja przetworzona w środowisku POSIX.\n# Wynik symulowany:\n(Operacja wykonana w katalogu /home/user)`} 
                      explanation={`${selectedAtlasItem.title} w Bashu: Standard POSIX / Linux. Bardzo wydajne przetwarzanie tekstowe przy pomocy narzędzi systemowych.`} 
                      isFlashcardMode={isFlashcardMode}
                      theme={terminalTheme}
                    />

                    <TerminalWindow 
                      key={`${selectedAtlasItem.id}-${flashcardResetKey}-zsh`}
                      type="zsh" 
                      command={selectedAtlasItem.zsh} 
                      output={`% ${selectedAtlasItem.zsh}\n# Wykonano pomyślnie w macOS / Zsh.\n# Środowisko zoptymalizowane pod macOS.\n# Wynik symulowany:\n(Operacja wykonana w katalogu /Users/macuser)`} 
                      explanation={`${selectedAtlasItem.title} w Zsh: Domyślna powłoka macOS (od Catalina). W pełni kompatybilna z Bashem, wzbogacona o ulepszenia interaktywne i zaawansowane autouzupełnianie.`} 
                      isFlashcardMode={isFlashcardMode}
                      theme={terminalTheme}
                    />

                    <TerminalWindow 
                      key={`${selectedAtlasItem.id}-${flashcardResetKey}-cmd`}
                      type="cmd" 
                      command={selectedAtlasItem.cmd} 
                      output={`C:\\Users\\Admin> ${selectedAtlasItem.cmd}\n\n[CMD System Executed]\nMicrosoft Windows [Version 10.0.22631]`} 
                      explanation={`${selectedAtlasItem.title} w CMD: Klasyczny interpreter poleceń MS-DOS / Windows. Posiada ograniczoną składnię i słabe wsparcie dla typów.`} 
                      isFlashcardMode={isFlashcardMode}
                      theme={terminalTheme}
                    />

                    <TerminalWindow 
                      key={`${selectedAtlasItem.id}-${flashcardResetKey}-powershell`}
                      type="powershell" 
                      command={selectedAtlasItem.powershell} 
                      output={`PS C:\\Users\\Admin> ${selectedAtlasItem.powershell}\n\nDirectory: C:\\Users\\Admin\\projekty\nMode                 LastWriteTime         Length Name\n----                 -------------         ------ ----`} 
                      explanation={`${selectedAtlasItem.title} w PowerShell: Nowoczesny interpreter oparty o obiekty .NET Core. Zwraca bogate dane zamiast czystego tekstu.`} 
                      isFlashcardMode={isFlashcardMode}
                      theme={terminalTheme}
                    />
                  </div>

                  {/* Detailed Technical Insight */}
                  <div className={`rounded-xl border p-5 space-y-4 transition-all duration-200 ${t.cardBg}`}>
                    <div className={`flex items-center gap-2 border-b ${t.border} pb-3`}>
                      <Layers size={18} className="text-blue-400" />
                      <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-display">
                        Analiza architektury i różnic
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
                      <div className="space-y-3">
                        <p>
                          <strong>Filozofia działania:</strong> {selectedAtlasItem.explanation}
                        </p>
                        <p>
                          Zauważ, że podczas gdy <strong>Bash</strong> dąży do prostoty i traktuje wszystko jako strumień tekstu, <strong>PowerShell</strong> wymusza podejście strukturalne (obiektowe). Ułatwia to automatyzację, lecz wymaga zapoznania się ze specyficzną, dłuższą składnią poleceń typu <em>Verb-Noun</em>.
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg border transition-all duration-200 ${t.innerCard}`}>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Porównanie Szybkie</h4>
                        <div className="space-y-2">
                          <div className={`flex justify-between border-b pb-1.5 ${t.border}`}>
                            <span className={t.textMuted}>Przenośność:</span>
                            <span className="text-emerald-400 font-medium">Bash (Wysoka)</span>
                          </div>
                          <div className={`flex justify-between border-b pb-1.5 ${t.border}`}>
                            <span className={t.textMuted}>Typowanie danych:</span>
                            <span className="text-blue-400 font-medium">PowerShell (Obiektowe)</span>
                          </div>
                          <div className="flex justify-between pb-0.5">
                            <span className={t.textMuted}>Kompaktowość:</span>
                            <span className="text-yellow-500 font-medium">Bash / CMD (Zwięzłe)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Visual Comparison Table for Flags and Arguments */}
                    {SYNTAX_COMPARISON_DATA[selectedAtlasItem.id] && (
                      <div className={`pt-4 border-t ${t.border} space-y-3`}>
                        <div className="flex justify-between items-center flex-wrap gap-2 pb-1">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            <Code size={13} className="text-blue-400" />
                            <span>Zestawienie flag i argumentów polecenia</span>
                          </div>
                          <span className={`text-[9.5px] text-slate-500 font-semibold flex items-center gap-1 px-2 py-0.5 rounded border ${t.inputBg}`}>
                            <Sparkles size={10} className="text-yellow-500 animate-pulse" />
                            Kliknij dowolny wiersz tabeli, aby rozwinąć szczegóły i dokumentację!
                          </span>
                        </div>
                        
                        <div className={`overflow-x-auto rounded-lg border ${t.innerCard}`}>
                          <table className="w-full text-left border-collapse text-[11px] min-w-[600px]">
                            <thead>
                              <tr className={`border-b ${t.border} ${t.textMuted} font-bold uppercase tracking-wider text-[10px] ${t.subBgSolid}`}>
                                <th className={`p-2.5 w-1/5 border-r ${t.border}`}>Element</th>
                                <th className="p-2.5 w-[26%] text-emerald-400 border-r border-slate-800/60 font-mono">Bash (POSIX)</th>
                                <th className="p-2.5 w-[26%] text-zinc-300 border-r border-slate-800/60 font-mono">CMD (DOS)</th>
                                <th className="p-2.5 w-[28%] text-cyan-400 font-mono">PowerShell (.NET)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/40 text-slate-300">
                              {/* Row 1: Command */}
                              <tr 
                                className={`cursor-pointer select-none transition-colors hover:bg-slate-900/35 group ${expandedSyntaxRow === 'command' ? 'bg-slate-900/15' : ''}`}
                                onClick={() => setExpandedSyntaxRow(expandedSyntaxRow === 'command' ? null : 'command')}
                              >
                                <td className="p-2.5 font-semibold text-slate-400 border-r border-slate-800/60 bg-slate-900/10">
                                  <div className="flex items-center justify-between gap-1.5">
                                    <span>Polecenie bazowe</span>
                                    {expandedSyntaxRow === 'command' ? (
                                      <ChevronUp size={12} className="text-blue-400 shrink-0" />
                                    ) : (
                                      <ChevronDown size={12} className="text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
                                    )}
                                  </div>
                                </td>
                                <td className="p-2.5 font-mono text-emerald-300 border-r border-slate-800/60 bg-emerald-950/5">
                                  {SYNTAX_COMPARISON_DATA[selectedAtlasItem.id].bash.command}
                                </td>
                                <td className="p-2.5 font-mono text-slate-200 border-r border-slate-800/60 bg-slate-950/10">
                                  {SYNTAX_COMPARISON_DATA[selectedAtlasItem.id].cmd.command}
                                </td>
                                <td className="p-2.5 font-mono text-cyan-300 bg-cyan-950/5">
                                  {SYNTAX_COMPARISON_DATA[selectedAtlasItem.id].powershell.command}
                                </td>
                              </tr>
                              {expandedSyntaxRow === 'command' && (
                                <tr className="bg-slate-950/30 border-b border-slate-800/80">
                                  <td colSpan={4} className="p-2.5">
                                    {renderRowDetails('command')}
                                  </td>
                                </tr>
                              )}

                              {/* Row 2: Flags */}
                              <tr 
                                className={`cursor-pointer select-none transition-colors hover:bg-slate-900/35 group ${expandedSyntaxRow === 'flags' ? 'bg-slate-900/15' : ''}`}
                                onClick={() => setExpandedSyntaxRow(expandedSyntaxRow === 'flags' ? null : 'flags')}
                              >
                                <td className="p-2.5 font-semibold text-slate-400 border-r border-slate-800/60 bg-slate-900/10">
                                  <div className="flex items-center justify-between gap-1.5">
                                    <span>Flagi i przełączniki</span>
                                    {expandedSyntaxRow === 'flags' ? (
                                      <ChevronUp size={12} className="text-blue-400 shrink-0" />
                                    ) : (
                                      <ChevronDown size={12} className="text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
                                    )}
                                  </div>
                                </td>
                                <td className="p-2.5 text-slate-300 border-r border-slate-800/60 font-mono text-[10.5px]">
                                  {SYNTAX_COMPARISON_DATA[selectedAtlasItem.id].bash.flags}
                                </td>
                                <td className="p-2.5 text-slate-300 border-r border-slate-800/60 font-mono text-[10.5px]">
                                  {SYNTAX_COMPARISON_DATA[selectedAtlasItem.id].cmd.flags}
                                </td>
                                <td className="p-2.5 text-slate-300 font-mono text-[10.5px]">
                                  {SYNTAX_COMPARISON_DATA[selectedAtlasItem.id].powershell.flags}
                                </td>
                              </tr>
                              {expandedSyntaxRow === 'flags' && (
                                <tr className="bg-slate-950/30 border-b border-slate-800/80">
                                  <td colSpan={4} className="p-2.5">
                                    {renderRowDetails('flags')}
                                  </td>
                                </tr>
                              )}

                              {/* Row 3: Args */}
                              <tr 
                                className={`cursor-pointer select-none transition-colors hover:bg-slate-900/35 group ${expandedSyntaxRow === 'args' ? 'bg-slate-900/15' : ''}`}
                                onClick={() => setExpandedSyntaxRow(expandedSyntaxRow === 'args' ? null : 'args')}
                              >
                                <td className="p-2.5 font-semibold text-slate-400 border-r border-slate-800/60 bg-slate-900/10">
                                  <div className="flex items-center justify-between gap-1.5">
                                    <span>Przekazywane argumenty</span>
                                    {expandedSyntaxRow === 'args' ? (
                                      <ChevronUp size={12} className="text-blue-400 shrink-0" />
                                    ) : (
                                      <ChevronDown size={12} className="text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
                                    )}
                                  </div>
                                </td>
                                <td className="p-2.5 text-slate-300 border-r border-slate-800/60 font-mono text-[10.5px]">
                                  {SYNTAX_COMPARISON_DATA[selectedAtlasItem.id].bash.args}
                                </td>
                                <td className="p-2.5 text-slate-300 border-r border-slate-800/60 font-mono text-[10.5px]">
                                  {SYNTAX_COMPARISON_DATA[selectedAtlasItem.id].cmd.args}
                                </td>
                                <td className="p-2.5 text-slate-300 font-mono text-[10.5px]">
                                  {SYNTAX_COMPARISON_DATA[selectedAtlasItem.id].powershell.args}
                                </td>
                              </tr>
                              {expandedSyntaxRow === 'args' && (
                                <tr className="bg-slate-950/30 border-b border-slate-800/80">
                                  <td colSpan={4} className="p-2.5">
                                    {renderRowDetails('args')}
                                  </td>
                                </tr>
                              )}

                              {/* Row 4: ReturnValue */}
                              <tr 
                                className={`cursor-pointer select-none transition-colors hover:bg-slate-900/35 group ${expandedSyntaxRow === 'returnValue' ? 'bg-slate-900/15' : ''}`}
                                onClick={() => setExpandedSyntaxRow(expandedSyntaxRow === 'returnValue' ? null : 'returnValue')}
                              >
                                <td className="p-2.5 font-semibold text-slate-400 border-r border-slate-800/60 bg-slate-900/10">
                                  <div className="flex items-center justify-between gap-1.5">
                                    <span>Zwracana wartość / Efekt</span>
                                    {expandedSyntaxRow === 'returnValue' ? (
                                      <ChevronUp size={12} className="text-blue-400 shrink-0" />
                                    ) : (
                                      <ChevronDown size={12} className="text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
                                    )}
                                  </div>
                                </td>
                                <td className="p-2.5 text-slate-300 border-r border-slate-800/60 leading-relaxed text-[10.5px]">
                                  {SYNTAX_COMPARISON_DATA[selectedAtlasItem.id].bash.returnValue}
                                </td>
                                <td className="p-2.5 text-slate-300 border-r border-slate-800/60 leading-relaxed text-[10.5px]">
                                  {SYNTAX_COMPARISON_DATA[selectedAtlasItem.id].cmd.returnValue}
                                </td>
                                <td className="p-2.5 text-slate-300 leading-relaxed text-[10.5px]">
                                  {SYNTAX_COMPARISON_DATA[selectedAtlasItem.id].powershell.returnValue}
                                </td>
                              </tr>
                              {expandedSyntaxRow === 'returnValue' && (
                                <tr className="bg-slate-950/30 border-b border-slate-800/80">
                                  <td colSpan={4} className="p-2.5">
                                    {renderRowDetails('returnValue')}
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* QUIZ ACTIVE VIEW */
                quizQuestion && (
                  <div className="flex-1 flex flex-col gap-6 max-w-4xl mx-auto w-full py-2">
                    {/* Question Card */}
                    <div className={`rounded-2xl border p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden transition-all duration-200 ${t.cardBg}`}>
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                      
                      <div className={`flex items-center justify-between border-b ${t.border} pb-4`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">
                            Zadanie Quizowe
                          </span>
                          <span className={`${t.textMuted} font-normal select-none`}>&bull;</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider font-mono ${
                            quizQuestion.level === "podstawowa" || !quizQuestion.level
                              ? "bg-emerald-950/70 text-emerald-400 border border-emerald-800/40"
                              : "bg-purple-950/70 text-purple-400 border border-purple-800/40"
                          }`}>
                            {quizQuestion.level === "podstawowa" || !quizQuestion.level ? "Podstawowy" : "Ponadpodstawowy"}
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono ${t.badgeGeneral} px-2 py-0.5 rounded border`}>
                          {ATLAS_CATEGORIES.find(c => c.id === quizQuestion.category)?.name || quizQuestion.category}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <h3 className={`text-xs font-bold ${t.textMuted} uppercase tracking-wider`}>Opis zadania:</h3>
                          <p className="text-base md:text-lg text-white font-medium leading-relaxed font-display">
                            {quizQuestion.description}
                          </p>
                        </div>

                        {/* Source Command block */}
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs ${t.textMuted}`}>
                              Znasz polecenie w powłoce: <strong className={`text-slate-200 capitalize font-mono text-xs ${t.inputBg} px-1.5 py-0.5 rounded border ${t.border}`}>{quizSourceShell}</strong>
                            </span>
                          </div>
                          <div className={`${t.innerCard} rounded-xl p-4 font-mono text-xs md:text-sm text-emerald-400 border shadow-inner flex items-center justify-between`}>
                            <span>
                              <span className={`${t.textMuted} mr-2 select-none`}>
                                {quizSourceShell === "bash" ? "$" : quizSourceShell === "cmd" ? "C:\\>" : "PS>"}
                              </span>
                              {quizQuestion[quizSourceShell]}
                            </span>
                            <span className={`text-[9px] uppercase font-bold ${t.textMuted} ${t.inputBg} px-1.5 py-0.5 rounded border ${t.border}`}>
                              {quizSourceShell}
                            </span>
                          </div>
                        </div>

                        {/* Instruction for the player */}
                        <div className={`pt-4 border-t ${t.border} space-y-3`}>
                          <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                            <span>
                              Jak brzmi odpowiednik tego polecenia w powłoce:{" "}
                              <strong className={`text-indigo-400 capitalize font-mono text-xs ${t.badgeGeneral} px-2 py-0.5 rounded border`}>
                                {quizTargetShell === "bash" ? "Bash" : quizTargetShell === "cmd" ? "Command Prompt (CMD)" : "PowerShell"}
                              </strong>
                              ?
                            </span>
                          </div>

                          {/* Options grid */}
                          <div className="grid grid-cols-1 gap-3 pt-1">
                            {quizOptions.map((option, idx) => {
                              const isSelected = quizSelectedOption === option;
                              const isCorrectAnswer = option === quizQuestion[quizTargetShell];
                              
                              let btnStyles = `${t.inputBg} ${t.border} ${t.textMuted} hover:border-slate-700 hover:bg-slate-900/40`;
                              if (isSelected) {
                                btnStyles = "bg-indigo-600/15 border-indigo-500/80 text-indigo-300 shadow-lg shadow-indigo-500/5";
                              }
                              
                              if (quizSubmitted) {
                                if (isCorrectAnswer) {
                                  btnStyles = "bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10 font-bold";
                                } else if (isSelected) {
                                  btnStyles = "bg-red-500/10 border-red-500 text-red-300 shadow-lg shadow-red-500/10";
                                } else {
                                  btnStyles = `${t.inputBg} ${t.border} text-slate-500 opacity-50`;
                                }
                              }

                              return (
                                <button
                                  key={idx}
                                  disabled={quizSubmitted}
                                  onClick={() => setQuizSelectedOption(option)}
                                  className={`w-full text-left p-3.5 rounded-xl border text-xs font-mono flex items-center justify-between transition-all duration-150 ${btnStyles}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className={`text-[10px] ${t.innerCard} ${t.textMuted} border ${t.border} w-5 h-5 rounded-full flex items-center justify-center font-sans`}>
                                      {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span>{option}</span>
                                  </div>

                                  {quizSubmitted && (
                                    <span>
                                      {isCorrectAnswer ? (
                                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                      ) : isSelected ? (
                                        <XCircle size={16} className="text-red-400 shrink-0" />
                                      ) : null}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Controls Area */}
                      <div className={`pt-4 border-t ${t.border} flex items-center justify-between gap-4`}>
                        <div className={`text-xs ${t.textMuted}`}>
                          {!quizSubmitted && quizSelectedOption && (
                            <span className="text-indigo-400 animate-pulse font-medium">Wybrano odpowiedź. Kliknij sprawdź!</span>
                          )}
                          {!quizSubmitted && !quizSelectedOption && (
                            <span>Wybierz jedną z opcji powyżej.</span>
                          )}
                          {quizSubmitted && (
                            <span className="font-semibold text-xs">
                              {quizSelectedOption === quizQuestion[quizTargetShell] ? (
                                <span className="text-emerald-400 flex items-center gap-1.5">
                                  🎉 Doskonale! Poprawna odpowiedź.
                                </span>
                              ) : (
                                <span className="text-red-400 flex items-center gap-1.5">
                                  ❌ Ups! Poprawna to: <code className={`bg-slate-950 px-1 py-0.5 rounded text-emerald-400 font-mono text-[11px]`}>{quizQuestion[quizTargetShell]}</code>
                                </span>
                              )}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2 shrink-0">
                          {!quizSubmitted ? (
                            <button
                              onClick={handleQuizSubmit}
                              disabled={!quizSelectedOption}
                              className="px-5 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white shadow-lg shadow-indigo-600/15 transition-all cursor-pointer disabled:cursor-not-allowed"
                            >
                              Sprawdź odpowiedź
                            </button>
                          ) : (
                            <button
                              onClick={() => startNewQuizQuestion()}
                              className="px-5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/15 transition-all flex items-center gap-1.5"
                            >
                              Następne pytanie
                              <ArrowRight size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Explanatory insights shown after submission */}
                    {quizSubmitted && (
                      <div className={`rounded-xl border p-5 space-y-3 animate-fadeIn transition-all duration-200 ${t.cardBg}`}>
                        <div className={`flex items-center gap-2 text-indigo-400 border-b ${t.border} pb-2`}>
                          <Info size={14} />
                          <h4 className="text-xs font-bold uppercase tracking-wider font-display">
                            Wyjaśnienie i Filozofia
                          </h4>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {quizQuestion.explanation}
                        </p>
                        <div className="pt-2 flex items-center justify-between">
                          <span className={`text-[10px] ${t.textMuted}`}>
                            Komenda: <strong>{quizQuestion.title}</strong>
                          </span>
                          <button
                            onClick={() => {
                              setSelectedAtlasItem(quizQuestion);
                              setIsQuizMode(false);
                            }}
                            className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                          >
                            Wyświetl pełną kartę w Atlasie
                            <ChevronRight size={10} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </section>
          </div>
        )}

        {/* TAB 2: KOMPARATOR LIVE (SANDBOX) */}
        {activeTab === "sandbox" && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Input & Control Panel */}
            <div className={`w-full md:w-96 border-b md:border-b-0 md:border-r ${t.border} ${t.sidebarBg} flex flex-col flex-shrink-0 overflow-y-auto transition-all duration-200`}>
              <div className="p-5 space-y-5 flex-1">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-blue-400 font-bold uppercase tracking-wider">
                    <Sparkles size={14} className="animate-pulse" />
                    <span>Translator i Symulator Live</span>
                  </div>
                  <h2 className="text-xl font-display font-bold text-white">Komparator AI</h2>
                  <p className={`${t.textMuted} text-xs leading-relaxed`}>
                    Wpisz dowolne polecenie w jednym z systemów, lub po prostu opisz własnymi słowami po polsku, co chcesz osiągnąć. Gemini przetłumaczy intencję i zasymuluje wynik w czasie rzeczywistym.
                  </p>
                </div>

                {/* Form controls */}
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className={`text-[11px] font-bold ${t.textMuted} uppercase tracking-wider block`}>
                      Wybierz wejście:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2">
                      {["Bash", "Zsh", "CMD", "PowerShell", "Opis słowny"].map((src) => (
                        <button
                          key={src}
                          onClick={() => setSandboxSource(src)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                            sandboxSource === src
                              ? t.tabActive
                              : `${t.inputBg} ${t.border} ${t.textMuted} ${t.accentHover}`
                          } ${src === "Opis słowny" ? "col-span-2 sm:col-span-1 md:col-span-2" : ""}`}
                        >
                          {src}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className={`text-[11px] font-bold ${t.textMuted} uppercase tracking-wider block`}>
                        Twoje polecenie lub intencja:
                      </label>
                      <span className={`text-[9px] font-semibold ${t.textMuted} ${t.inputBg} px-1.5 py-0.5 rounded border ${t.border} font-mono`}>
                        Ctrl + Enter
                      </span>
                    </div>
                    <HighlightedInput
                      value={sandboxInput}
                      onChange={setSandboxInput}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                          e.preventDefault();
                          if (!isSandboxLoading && sandboxInput.trim()) {
                            handleTranslate();
                          }
                        }
                      }}
                      placeholder={
                        sandboxSource === "Opis słowny" 
                          ? "np. znajdź pliki większe niż 100MB i usuń je" 
                          : "np. ping -c 5 google.com"
                      }
                      isPolish={sandboxSource === "Opis słowny"}
                    />
                  </div>

                  <button
                    onClick={() => handleTranslate()}
                    disabled={isSandboxLoading || !sandboxInput.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
                  >
                    {isSandboxLoading ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        Analizowanie...
                      </>
                    ) : (
                      <>
                        <Play size={14} fill="currentColor" />
                        Porównaj i symuluj
                      </>
                    )}
                  </button>
                </div>

                {/* Suggestions block */}
                <div className={`space-y-2 pt-4 border-t ${t.border}`}>
                  <h3 className={`text-[11px] font-bold ${t.textMuted} uppercase tracking-wider block`}>
                    Ciekawe scenariusze do testu:
                  </h3>
                  <div className="space-y-1.5">
                    {sandboxSuggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSandboxInput(sug.input);
                          setSandboxSource(sug.source);
                          handleTranslate(sug.input, sug.source);
                        }}
                        className={`w-full text-left p-2 rounded border transition-colors flex items-start gap-2 ${t.innerCard} hover:border-slate-700`}
                      >
                        <ChevronRight size={12} className="text-blue-500 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <p className={`text-[11px] font-semibold font-display line-clamp-1 ${t.textTitle}`}>
                            {sug.title}
                          </p>
                          <p className={`text-[9px] truncate max-w-[240px] ${t.textMuted}`}>
                            {sug.source} • {sug.input}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom system status in sidebar */}
              <div className={`p-4 border-t bg-slate-950/40 text-[10px] font-mono space-y-1 ${t.border} ${t.textMuted}`}>
                <div className="flex justify-between">
                  <span>Wykryte wejście:</span>
                  <span className={t.textTitle}>{sandboxResult?.detectedSource || "Brak"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status AI:</span>
                  <span className="text-emerald-400">Gotowy do translacji</span>
                </div>
              </div>
            </div>

            {/* Simulated Terminals Area */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col gap-6 bg-slate-950/15">
              {sandboxError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start space-x-3 text-xs text-red-200">
                  <ShieldAlert className="text-red-400 shrink-0 mt-0.5" size={16} />
                  <div className="space-y-1">
                    <p className="font-semibold">Błąd podczas pobierania danych</p>
                    <p className="opacity-90">{sandboxError}</p>
                    <p className="text-[10px] text-red-400 italic">
                      Upewnij się, że klucz GEMINI_API_KEY jest prawidłowo ustawiony w panelu boczny Secrets i spróbuj ponownie.
                    </p>
                  </div>
                </div>
              )}

              {/* Live Terminal outputs */}
              <div className="flex flex-col lg:flex-row gap-5 w-full min-w-0">
                <div className="flex-1 min-w-0 w-full">
                  <TerminalWindow
                    type="bash"
                    command={sandboxResult?.bash.command || ""}
                    output={sandboxResult?.bash.output || ""}
                    explanation={sandboxResult?.bash.explanation}
                    isLoading={isSandboxLoading}
                    theme={terminalTheme}
                  />
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <TerminalWindow
                    type="zsh"
                    command={sandboxResult?.zsh?.command || ""}
                    output={sandboxResult?.zsh?.output || ""}
                    explanation={sandboxResult?.zsh?.explanation}
                    isLoading={isSandboxLoading}
                    theme={terminalTheme}
                  />
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <TerminalWindow
                    type="cmd"
                    command={sandboxResult?.cmd.command || ""}
                    output={sandboxResult?.cmd.output || ""}
                    explanation={sandboxResult?.cmd.explanation}
                    isLoading={isSandboxLoading}
                    theme={terminalTheme}
                  />
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <TerminalWindow
                    type="powershell"
                    command={sandboxResult?.powershell.command || ""}
                    output={sandboxResult?.powershell.output || ""}
                    explanation={sandboxResult?.powershell.explanation}
                    isLoading={isSandboxLoading}
                    theme={terminalTheme}
                  />
                </div>
              </div>

              {/* Dynamic Comparison text generated by AI */}
              {sandboxResult && !isSandboxLoading && (
                <div className={`rounded-xl border p-5 space-y-4 ${t.cardBg}`}>
                  <div className={`flex items-center gap-2 border-b ${t.border} pb-3`}>
                    <Sparkles size={16} className="text-blue-400" />
                    <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-display">
                      Zasymulowane różnice architektoniczne i składniowe
                    </h3>
                  </div>
                  <div className="max-w-none">
                    <MarkdownRenderer content={sandboxResult.comparisonMarkdown} />
                  </div>
                </div>
              )}

              {!sandboxResult && !isSandboxLoading && (
                <div className={`flex-1 flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-2xl ${t.dashedBorder}`}>
                  <TerminalIcon className={`${t.textMuted} mb-3`} size={36} />
                  <h3 className={`font-display font-semibold text-sm mb-1 ${t.textTitle}`}>Czekam na zapytanie...</h3>
                  <p className={`text-xs max-w-sm ${t.textMuted}`}>
                    Wpisz komendę po lewej stronie i kliknij <strong className="text-blue-400">Porównaj i symuluj</strong>, aby wygenerować unikalny widok terminali.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ROŻNICE ARCHITEKTONICZNE / KONCEPCJE */}
        {activeTab === "concepts" && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar with Concepts */}
            <aside className={`w-80 border-b md:border-b-0 md:border-r ${t.border} ${t.sidebarBg} flex flex-col flex-shrink-0 transition-all duration-200`}>
              <div className={`p-4 border-b ${t.border}`}>
                <h3 className={`text-xs font-bold ${t.textMuted} uppercase tracking-wider mb-2`}>
                  Zrozumieć Różnice
                </h3>
                <p className={`text-[11px] leading-relaxed ${t.textMuted}`}>
                  Pod maską każdego systemu leży zupełnie inna technologia. Wybierz pojęcie, aby przeanalizować fundamentalne rozbieżności.
                </p>
              </div>
              <div className={`flex-1 overflow-y-auto p-3 space-y-1 ${t.subBgSolid}`}>
                {conceptConcepts.map((con) => (
                  <button
                    key={con}
                    onClick={() => handleLoadConcept(con)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                      selectedConcept === con
                        ? t.activeCategory
                        : `bg-transparent border-transparent ${t.textMuted} ${t.accentHover}`
                    }`}
                  >
                    {con}
                  </button>
                ))}
              </div>
              
              <div className={`p-4 border-t bg-slate-950/40 ${t.border}`}>
                <div className={`p-3 rounded-lg border text-[11px] ${t.badgeGeneral}`}>
                  <span className="font-bold text-blue-400 block mb-1">Filozofia Potoku (Pipe):</span>
                  <strong>Linux:</strong> bajty tekstowe są przesyłane z lewej na prawą.<br />
                  <strong>Windows PS:</strong> kompletne, silnie typowane obiekty przechodzą dalej.
                </div>
              </div>
            </aside>

            {/* Deep Concept analysis page */}
            <section className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-950/10 space-y-6">
              {isConceptLoading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <RefreshCw className="animate-spin text-blue-500" size={32} />
                  <p className="text-xs text-slate-400 font-mono">Generowanie zaawansowanego porównania systemowego...</p>
                </div>
              ) : conceptError ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-xs text-red-200">
                  <p className="font-semibold">Nie udało się wygenerować teorii dla: {selectedConcept}</p>
                  <p className="opacity-90">{conceptError}</p>
                </div>
              ) : conceptResult ? (
                <div className="space-y-6">
                  {/* Concept Summary Header */}
                  <div className={`space-y-2 border-b ${t.border} pb-5`}>
                    <span className="text-xs font-mono text-blue-500 uppercase font-bold tracking-widest">
                      Koncepcja i Teoria Systemowa
                    </span>
                    <h2 className="text-2xl font-display font-bold text-white">
                      {conceptResult.conceptName}
                    </h2>
                    <p className={`${t.textMuted} text-sm leading-relaxed max-w-3xl`}>
                      {conceptResult.summary}
                    </p>
                  </div>

                  {/* Four pillars explanations */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Bash block */}
                    <div className={`border rounded-xl p-5 space-y-3 shadow-md flex flex-col justify-between transition-all duration-200 ${t.cardBg}`}>
                      <div className="space-y-3">
                        <div className={`flex items-center justify-between border-b pb-2 ${t.border}`}>
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">BASH (Linux)</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        </div>
                        <div>
                          <MarkdownRenderer content={conceptResult.bashExplanation} />
                        </div>
                      </div>
                    </div>

                    {/* Zsh block */}
                    <div className={`border rounded-xl p-5 space-y-3 shadow-md flex flex-col justify-between transition-all duration-200 ${t.cardBg}`}>
                      <div className="space-y-3">
                        <div className={`flex items-center justify-between border-b pb-2 ${t.border}`}>
                          <span className="text-xs font-bold text-violet-400 uppercase tracking-widest font-mono">ZSH (macOS)</span>
                          <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                        </div>
                        <div>
                          <MarkdownRenderer content={conceptResult.zshExplanation} />
                        </div>
                      </div>
                    </div>

                    {/* CMD block */}
                    <div className={`border rounded-xl p-5 space-y-3 shadow-md flex flex-col justify-between transition-all duration-200 ${t.cardBg}`}>
                      <div className="space-y-3">
                        <div className={`flex items-center justify-between border-b pb-2 ${t.border}`}>
                          <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest font-mono">CMD (Windows)</span>
                          <span className="w-2 h-2 rounded-full bg-zinc-500"></span>
                        </div>
                        <div>
                          <MarkdownRenderer content={conceptResult.cmdExplanation} />
                        </div>
                      </div>
                    </div>

                    {/* PowerShell block */}
                    <div className={`border rounded-xl p-5 space-y-3 shadow-md flex flex-col justify-between transition-all duration-200 ${t.cardBg}`}>
                      <div className="space-y-3">
                        <div className={`flex items-center justify-between border-b pb-2 ${t.border}`}>
                          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest font-mono">POWERSHELL</span>
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        </div>
                        <div>
                          <MarkdownRenderer content={conceptResult.powershellExplanation} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comparison Grid or Markdown Table */}
                  <div className={`rounded-xl border p-5 space-y-4 transition-all duration-200 ${t.cardBg}`}>
                    <div className={`flex items-center gap-2 border-b ${t.border} pb-3`}>
                      <Layers size={16} className="text-blue-400" />
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-display">
                        Tabela porównawcza mechanizmów
                      </h4>
                    </div>
                    <div>
                      <MarkdownRenderer content={conceptResult.comparisonMarkdown} />
                    </div>
                  </div>

                  {/* Pro tips checklist */}
                  <div className={`rounded-xl border p-5 space-y-4 transition-all duration-200 ${t.innerCard}`}>
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-yellow-400 animate-pulse" />
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-display">
                        Porady eksperta: Przejście między systemami
                      </h4>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {conceptResult.proTips.map((tip, idx) => (
                        <li 
                          key={idx}
                          className={`p-3 rounded-lg border text-xs text-slate-300 relative pl-8 ${t.inputBg} ${t.border}`}
                        >
                          <span className="absolute left-3 top-3.5 w-2.5 h-2.5 bg-blue-500/30 text-blue-400 border border-blue-500/50 rounded-full flex items-center justify-center font-bold text-[8px]">
                            {idx + 1}
                          </span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <p className="text-xs">Wybierz pojęcie po lewej, aby wyświetlić analizę.</p>
                </div>
              )}
            </section>
          </div>
        )}

        {/* TAB 4: SCENARIUSZE */}
        {activeTab === "scenarios" && (
          <ScenariosView terminalTheme={terminalTheme} />
        )}

        {/* TAB 5: O PROGRAMIE */}
        {activeTab === "about" && (
          <div className={`flex-1 w-full min-w-0 p-6 md:p-8 overflow-y-auto space-y-8 ${t.subBgSolid}`}>
            {/* Header section with elegant gradients */}
            <div className={`relative overflow-hidden rounded-2xl border p-6 md:p-8 space-y-4 transition-all duration-200 ${t.border} ${t.cardBg}`}>
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-blue-500 uppercase font-bold tracking-widest">
                  Dokumentacja i Informacje Prawne
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
                  <Info className="text-blue-500 shrink-0" size={28} />
                  O programie ShellCompare
                </h2>
                <p className={`text-sm max-w-4xl leading-relaxed ${t.textMuted}`}>
                  Interaktywna platforma edukacyjna dedykowana pasjonatom technologii, studentom oraz profesjonalistom pragnącym zgłębić tajniki wieloplatformowej administracji systemami.
                </p>
              </div>
            </div>

            {/* Bento Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Opis programu (Col span 7) */}
              <div className={`md:col-span-7 border rounded-xl p-6 md:p-8 space-y-5 shadow-lg relative overflow-hidden flex flex-col justify-between transition-all duration-200 ${t.cardBg} ${t.border}`}>
                <div className="space-y-4">
                  <div className={`flex items-center gap-3 border-b pb-3 ${t.border}`}>
                    <BookOpen size={18} className="text-blue-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                      Opis Projektu
                    </h3>
                  </div>
                  <div className={`text-xs md:text-sm leading-relaxed space-y-4 ${t.textMuted}`}>
                    <p>
                      <strong>ShellCompare</strong> to zaawansowane narzędzie edukacyjne, którego celem jest ułatwienie zrozumienia różnic i podobieństw między najpopularniejszymi interpreterami poleceń. Aplikacja zestawia ze sobą powłoki z różnych środowisk operacyjnych: <strong>Bash (Linux)</strong>, <strong>Zsh (macOS)</strong>, klasyczny wiersz poleceń <strong>CMD (Windows)</strong> oraz obiektowy <strong>PowerShell</strong>.
                    </p>
                    <p>
                      Platforma została zaprojektowana w architekturze hybrydowej. Wykorzystuje zaawansowany serwerowy model sztucznej inteligencji (<strong>Gemini 3.5 Flash</strong>) do dynamicznego tłumaczenia intencji słownych na gotowe skrypty oraz dogłębnej analizy architektonicznej. Jednocześnie posiada pełen <strong>lokalny silnik oceny offline</strong>, który działa bez dostępu do sieci internetowej, gwarantując ciągłość nauki w każdych warunkach.
                    </p>
                    <p>
                      Dzięki połączeniu interaktywnego atlasu komend, komparatora live, bazy różnic koncepcyjnych oraz praktycznych wyzwań i scenariuszy z systemem nagród (streaków), użytkownicy mogą krok po kroku opanować trudną sztukę administrowania różnorodnymi systemami.
                    </p>
                  </div>
                </div>

                <div className={`pt-4 border-t mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center ${t.border}`}>
                  <div className={`p-2 rounded-lg border ${t.innerCard}`}>
                    <span className="block text-xs font-bold text-blue-400 font-mono">100%</span>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold ${t.textMuted}`}>Offline Ready</span>
                  </div>
                  <div className={`p-2 rounded-lg border ${t.innerCard}`}>
                    <span className="block text-xs font-bold text-emerald-400 font-mono">PWA</span>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold ${t.textMuted}`}>Instalowalne</span>
                  </div>
                  <div className={`p-2 rounded-lg border ${t.innerCard}`}>
                    <span className="block text-xs font-bold text-amber-400 font-mono">Gemini</span>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold ${t.textMuted}`}>AI Powered</span>
                  </div>
                  <div className={`p-2 rounded-lg border ${t.innerCard}`}>
                    <span className="block text-xs font-bold text-violet-400 font-mono">Bash/Zsh/CMD/PS</span>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold ${t.textMuted}`}>Multi-Shell</span>
                  </div>
                </div>
              </div>

              {/* Informacje o Autorze (Col span 5) */}
              <div className={`md:col-span-5 border rounded-xl p-6 md:p-8 space-y-5 shadow-lg relative overflow-hidden flex flex-col justify-between transition-all duration-200 ${t.cardBg} ${t.border}`}>
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="space-y-4">
                  <div className={`flex items-center gap-3 border-b pb-3 ${t.border}`}>
                    <Award size={18} className="text-yellow-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                      O Autorze
                    </h3>
                  </div>

                  <div className={`flex items-center gap-4 p-4 rounded-xl border ${t.innerCard}`}>
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-lg font-display shrink-0 border-2 border-slate-700 shadow-inner">
                      KJ
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-display">mgr Krzysztof Jureczek</h4>
                      <p className="text-[11px] text-blue-400 font-mono">Nauczyciel, Dydaktyk & Pasjonat Systemów</p>
                    </div>
                  </div>

                  <div className={`text-xs md:text-sm leading-relaxed space-y-3 ${t.textMuted}`}>
                    <p>
                      Inżynier, starszy wykładowca i doświadczony pedagog z wieloletnim stażem dydaktycznym. Specjalizuje się w architekturze systemów operacyjnych, teorii powłok systemowych oraz metodologii efektywnego nauczania technologii informatycznych.
                    </p>
                    <p>
                      Projekt <strong>ShellCompare</strong> powstał jako autorska inicjatywa edukacyjna mająca na celu uproszczenie procesu przyswajania wiedzy o komendach i ujednolicenie nauki systemów Linux oraz Windows.
                    </p>
                  </div>
                </div>

                <div className={`pt-4 border-t mt-6 text-[10px] font-mono flex justify-between items-center ${t.border} ${t.textMuted}`}>
                  <span>Profil GitHub</span>
                  <a 
                    href="https://github.com/KrzJur" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Github size={12} />
                    github.com/KrzJur
                  </a>
                </div>
              </div>

              {/* Regulamin (Col span 6) */}
              <div className={`md:col-span-6 border rounded-xl p-6 md:p-8 space-y-4 shadow-lg transition-all duration-200 ${t.cardBg} ${t.border}`}>
                <div className={`flex items-center gap-3 border-b pb-3 ${t.border}`}>
                  <Code size={18} className="text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                    Regulamin Korzystania
                  </h3>
                </div>

                <div className={`text-xs md:text-sm leading-relaxed ${t.textMuted}`}>
                  <p className="mb-3 text-slate-400 text-xs font-semibold">
                    Zasady i warunki użytkowania platformy edukacyjnej ShellCompare:
                  </p>
                  <ol className={`list-decimal list-inside space-y-2.5 text-xs ${t.textMuted}`}>
                    <li>
                      <span className="font-semibold text-white">Cel edukacyjny:</span> Aplikacja służy wyłącznie celom szkoleniowym, naukowym oraz osobistemu rozwojowi wiedzy w dziedzinie technologii IT.
                    </li>
                    <li>
                      <span className="font-semibold text-white">Dobrowolność i brak opłat:</span> Korzystanie z wszelkich zasobów platformy (atlasu komend, wyzwań oraz symulatora sandbox) jest w pełni darmowe.
                    </li>
                    <li>
                      <span className="font-semibold text-white">Symulacja działania:</span> Wyniki poleceń oraz opisy zachowania systemów generowane są w celach poglądowych. Autor dokłada wszelkich starań, aby były rzetelne, ale nie gwarantuje identycznego zachowania na fizycznych systemach produkcyjnych.
                    </li>
                    <li>
                      <span className="font-semibold text-white">Bezpieczeństwo i odpowiedzialność:</span> Autor platformy nie ponosi odpowiedzialności za ewentualne szkody, utratę danych bądź awarie sprzętowe powstałe w wyniku samodzielnego uruchomienia przedstawionych poleceń na rzeczywistych serwerach lub stacjach roboczych użytkownika.
                    </li>
                    <li>
                      <span className="font-semibold text-white">Poszanowanie integralności:</span> Zabrania się podejmowania działania mających na celu przeciążenie, uszkodzenie bądź zakłócenie działania infrastruktury serwerowej aplikacji.
                    </li>
                  </ol>
                </div>
              </div>

              {/* Licencja (Col span 6) */}
              <div className={`md:col-span-6 border rounded-xl p-6 md:p-8 space-y-4 shadow-lg relative overflow-hidden transition-all duration-200 ${t.cardBg} ${t.border}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/[0.02] rounded-full blur-2xl pointer-events-none"></div>

                <div className={`flex items-center gap-3 border-b pb-3 ${t.border}`}>
                  <XCircle size={18} className="text-rose-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                    Licencja i Prawa Autorskie
                  </h3>
                </div>

                <div className={`text-xs md:text-sm leading-relaxed space-y-3.5 ${t.textMuted}`}>
                  <div className={`p-3 rounded-lg border text-rose-300 text-xs flex items-start gap-2.5 ${t.innerCard} border-rose-500/20`}>
                    <XCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block mb-0.5">Ścisła Licencja Dydaktyczna (Ograniczona):</strong>
                      Wszystkie materiały, baza wiedzy, opisy, kody źródłowe oraz interfejs graficzny aplikacji ShellCompare stanowią wyłączną własność intelektualną autora.
                    </div>
                  </div>

                  <p className="text-xs">
                    Oprogramowanie udostępniane jest <strong>wyłącznie do osobistego użytku edukacyjnego</strong>.
                  </p>

                  <div className={`p-3 rounded-lg border text-xs space-y-1.5 font-mono ${t.innerCard} ${t.border}`}>
                    <p className="text-rose-400 font-semibold text-[10px] uppercase tracking-wider">Kategorycznie zabrania się:</p>
                    <ul className="list-disc list-inside space-y-1 text-[11px]">
                      <li>Kopiowania, powielania bądź dekompilacji kodu źródłowego,</li>
                      <li>Modyfikowania kodu lub tworzenia na jego bazie dzieł zależnych,</li>
                      <li>Wykorzystywania komercyjnego, odsprzedaży lub dystrybucji,</li>
                      <li>Używania w płatnych szkoleniach i kursach bez zgody.</li>
                    </ul>
                  </div>

                  <p className="text-xs italic">
                    Naruszenie powyższych warunków bez uprzedniej, jednoznacznej i <strong>pisemnej zgody autora (mgr. Krzysztofa Jureczka)</strong> pociąga za sobą pełną odpowiedzialność cywilną oraz karną.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className={`h-12 border-t flex items-center justify-between px-6 md:px-8 text-[10px] font-medium flex-shrink-0 z-10 transition-all duration-200 ${t.border} ${t.sidebarBg} ${t.textMuted}`}>
        <div className="flex items-center gap-4 md:gap-8">
          <span>Środowisko: <span className="text-green-500 text-[9px] uppercase font-bold tracking-tighter">Online sandbox</span></span>
          <span className="hidden md:inline">Wybrane silniki: <span className="text-slate-400">Ubuntu 22.04 LTS / PowerShell Core 7.4 / Win11 CMD</span></span>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>Systemy zsynchronizowane</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
