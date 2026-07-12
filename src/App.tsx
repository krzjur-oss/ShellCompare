import React, { useState, useEffect } from "react";
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
  Code,
  Trophy,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Download,
  Smartphone,
  X
} from "lucide-react";
import { ATLAS_CATEGORIES, ATLAS_ITEMS } from "./data/atlasData";
import { ActiveTab, AtlasItem, CommandComparison, ConceptComparison, ShellType } from "./types";
import { INITIAL_SANDBOX_RESULT, INITIAL_CONCEPT_RESULT } from "./data/mockResponses";
import { offlineTranslateCommand, offlineGetConcept } from "./utils/offlineTranslator";
import TerminalWindow from "./components/TerminalWindow";

export default function App() {
  // Tab states
  const [activeTab, setActiveTab] = useState<ActiveTab>("atlas");
  
  // PWA Installation state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(true);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    setIsInIframe(window.self !== window.top);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if app is already running standalone
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstallBtn(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Show manual install guide modal if prompt is not supported (e.g. inside an iframe, Safari iOS, etc)
      setShowInstallModal(true);
      return;
    }
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User installation outcome: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    } catch (err) {
      console.warn("Native PWA prompt failed, opening fallback instructions:", err);
      setShowInstallModal(true);
    }
  };
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Selected item in Atlas
  const [selectedAtlasItem, setSelectedAtlasItem] = useState<AtlasItem>(ATLAS_ITEMS[0]);

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

  const [quizQuestion, setQuizQuestion] = useState<AtlasItem | null>(null);

  // Auto-reset flashcards state when changing atlas item or flashcard mode toggled
  useEffect(() => {
    setFlashcardResetKey(prev => prev + 1);
  }, [selectedAtlasItem, isFlashcardMode]);
  const [quizSourceShell, setQuizSourceShell] = useState<ShellType>("bash");
  const [quizTargetShell, setQuizTargetShell] = useState<ShellType>("powershell");
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [quizStreak, setQuizStreak] = useState(0);

  const startNewQuizQuestion = () => {
    if (ATLAS_ITEMS.length === 0) return;
    
    // Pick random item
    const randomIndex = Math.floor(Math.random() * ATLAS_ITEMS.length);
    const item = ATLAS_ITEMS[randomIndex];
    
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
    
    // Generate options
    const correctOption = item[target];
    const distractors = ATLAS_ITEMS
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

  // Filter atlas items based on search and category
  const filteredAtlasItems = ATLAS_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cmd.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.powershell.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  return (
    <div className="h-screen w-full flex flex-col bg-[#0F172A] text-slate-200 font-sans overflow-hidden">
      {/* HEADER */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between px-6 md:px-8 flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center font-display font-bold text-white shadow-lg shadow-blue-500/10">
            ST
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-display font-bold tracking-tight text-white flex items-center gap-2">
              ShellCompare
              <span className="bg-slate-800 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded text-blue-400 border border-slate-700">
                v1.3.0
              </span>
            </h1>
            <span className="text-[10px] text-slate-400 font-medium">Atlas & Komparator terminali w czasie rzeczywistym</span>
          </div>
        </div>

        {/* Global Tab Navigation */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab("atlas")}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "atlas"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen size={14} />
            <span className="hidden sm:inline">Atlas Komend</span>
          </button>
          <button
            onClick={() => setActiveTab("sandbox")}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "sandbox"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <TerminalIcon size={14} />
            <span className="hidden sm:inline">Komparator Live</span>
            <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1 rounded font-mono">AI</span>
          </button>
          <button
            onClick={() => setActiveTab("concepts")}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "concepts"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers size={14} />
            <span className="hidden sm:inline">Różnice Architektoniczne</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
          {showInstallBtn && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all border border-indigo-500/40 cursor-pointer animate-pulse"
              title="Zainstaluj jako aplikację na komputerze lub telefonie"
            >
              <Smartphone size={13} />
              <span>Zainstaluj Aplikację</span>
            </button>
          )}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] text-emerald-400 font-mono">Gemini 3.5 Flash Active</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* TAB 1: ATLAS KOMEND */}
        {activeTab === "atlas" && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar - Categories & Search */}
            <aside className="w-80 border-r border-slate-800 bg-slate-900/40 flex flex-col flex-shrink-0">
              <div className="p-4 border-b border-slate-800 space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Szukaj komendy lub opisu..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-colors"
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
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-1">
                    Kategorie Atlasu
                  </h3>
                  <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1">
                    {ATLAS_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center justify-between ${
                          selectedCategory === cat.id
                            ? "bg-blue-600/15 text-blue-300 border-l-2 border-blue-500 pl-2"
                            : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] font-mono bg-slate-950 text-slate-500 px-1 py-0.5 rounded">
                          {cat.id === "all" 
                            ? ATLAS_ITEMS.length 
                            : ATLAS_ITEMS.filter(i => i.category === cat.id).length
                          }
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Command List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-slate-950/20">
                <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>Dostępne artykuły ({filteredAtlasItems.length})</span>
                </div>
                {filteredAtlasItems.length > 0 ? (
                  filteredAtlasItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedAtlasItem(item)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all duration-150 flex flex-col gap-1 ${
                        selectedAtlasItem.id === item.id
                          ? "bg-slate-800 border-slate-700 shadow-md"
                          : "bg-slate-900/25 border-transparent hover:bg-slate-900/60"
                      }`}
                    >
                      <h4 className="text-xs font-semibold text-slate-200 font-display line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-mono bg-[#0c0c0c] text-emerald-400 px-1 py-0.2 rounded border border-emerald-950/40">
                          {item.bash.split(" ")[0]}
                        </span>
                        <span className="text-[9px] font-mono bg-[#010101] text-zinc-300 px-1 py-0.2 rounded border border-zinc-800">
                          {item.cmd.split(" ")[0]}
                        </span>
                        <span className="text-[9px] font-mono bg-[#01172f] text-cyan-400 px-1 py-0.2 rounded border border-blue-950/50">
                          {item.powershell.split(" ")[0]}
                        </span>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 self-start">
                  <button
                    onClick={() => {
                      setIsQuizMode(false);
                      setIsFlashcardMode(false);
                    }}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-2 ${
                      !isQuizMode && !isFlashcardMode
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                        : "text-slate-400 hover:text-slate-200"
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
                        : "text-slate-400 hover:text-slate-200"
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
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Trophy size={13} />
                    🎓 Tryb Quizu
                  </button>
                </div>

                {isQuizMode && (
                  <div className="flex items-center gap-4 bg-slate-900/60 px-4 py-1.5 rounded-lg border border-slate-800/80 text-xs font-mono self-start sm:self-auto">
                    <div className="flex items-center gap-1.5">
                      <Award size={13} className="text-yellow-500" />
                      <span className="text-slate-400">Wynik:</span>
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
                      className="text-slate-500 hover:text-slate-300 transition-colors pl-2 border-l border-slate-800"
                    >
                      <RotateCcw size={12} />
                    </button>
                  </div>
                )}
              </div>

              {!isQuizMode ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/40 pb-6">
                    <div className="space-y-1.5">
                      <span className="text-xs font-mono text-blue-500 uppercase tracking-widest font-bold">
                        Atlas Komend › {ATLAS_CATEGORIES.find(c => c.id === selectedAtlasItem.category)?.name.replace(/[^A-Za-z0-9óóóęąśłżźń ]/g, "").trim() || selectedAtlasItem.category}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
                        {selectedAtlasItem.title}
                      </h2>
                      <p className="text-slate-400 text-sm max-w-2xl">
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
                    <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-4 flex items-start gap-3 animate-fadeIn">
                      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 shrink-0">
                        <span className="text-lg">🎴</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Interaktywny Trening Fiszki</h4>
                        <p className="text-xs text-indigo-200 leading-relaxed">
                          Składnia poleceń została celowo ukryta. Spróbuj przypomnieć sobie, jak wygląda komenda dla wybranego zadania (<strong>{selectedAtlasItem.title}</strong>) w poszczególnych powłokach, a następnie kliknij odpowiednią kartę, aby sprawdzić swoją wiedzę i odsłonić detale!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Terminal Windows Comparison Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <TerminalWindow 
                      key={`${selectedAtlasItem.id}-${flashcardResetKey}-bash`}
                      type="bash" 
                      command={selectedAtlasItem.bash} 
                      output={`$ ${selectedAtlasItem.bash}\n# Wykonano pomyślnie. Plik/operacja przetworzona w środowisku POSIX.\n# Wynik symulowany:\n(Operacja wykonana w katalogu /home/user)`} 
                      explanation={`${selectedAtlasItem.title} w Bashu: Standard POSIX / Linux. Bardzo wydajne przetwarzanie tekstowe przy pomocy narzędzi systemowych.`} 
                      isFlashcardMode={isFlashcardMode}
                    />

                    <TerminalWindow 
                      key={`${selectedAtlasItem.id}-${flashcardResetKey}-zsh`}
                      type="zsh" 
                      command={selectedAtlasItem.zsh} 
                      output={`% ${selectedAtlasItem.zsh}\n# Wykonano pomyślnie w macOS / Zsh.\n# Środowisko zoptymalizowane pod macOS.\n# Wynik symulowany:\n(Operacja wykonana w katalogu /Users/macuser)`} 
                      explanation={`${selectedAtlasItem.title} w Zsh: Domyślna powłoka macOS (od Catalina). W pełni kompatybilna z Bashem, wzbogacona o ulepszenia interaktywne i zaawansowane autouzupełnianie.`} 
                      isFlashcardMode={isFlashcardMode}
                    />

                    <TerminalWindow 
                      key={`${selectedAtlasItem.id}-${flashcardResetKey}-cmd`}
                      type="cmd" 
                      command={selectedAtlasItem.cmd} 
                      output={`C:\\Users\\Admin> ${selectedAtlasItem.cmd}\n\n[CMD System Executed]\nMicrosoft Windows [Version 10.0.22631]`} 
                      explanation={`${selectedAtlasItem.title} w CMD: Klasyczny interpreter poleceń MS-DOS / Windows. Posiada ograniczoną składnię i słabe wsparcie dla typów.`} 
                      isFlashcardMode={isFlashcardMode}
                    />

                    <TerminalWindow 
                      key={`${selectedAtlasItem.id}-${flashcardResetKey}-powershell`}
                      type="powershell" 
                      command={selectedAtlasItem.powershell} 
                      output={`PS C:\\Users\\Admin> ${selectedAtlasItem.powershell}\n\nDirectory: C:\\Users\\Admin\\projekty\nMode                 LastWriteTime         Length Name\n----                 -------------         ------ ----`} 
                      explanation={`${selectedAtlasItem.title} w PowerShell: Nowoczesny interpreter oparty o obiekty .NET Core. Zwraca bogate dane zamiast czystego tekstu.`} 
                      isFlashcardMode={isFlashcardMode}
                    />
                  </div>

                  {/* Detailed Technical Insight */}
                  <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
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
                      <div className="space-y-3 bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Porównanie Szybkie</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between border-b border-slate-900 pb-1.5">
                            <span className="text-slate-400">Przenośność:</span>
                            <span className="text-emerald-400 font-medium">Bash (Wysoka)</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-900 pb-1.5">
                            <span className="text-slate-400">Typowanie danych:</span>
                            <span className="text-blue-400 font-medium">PowerShell (Obiektowe)</span>
                          </div>
                          <div className="flex justify-between pb-0.5">
                            <span className="text-slate-400">Kompaktowość:</span>
                            <span className="text-yellow-500 font-medium">Bash / CMD (Zwięzłe)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* QUIZ ACTIVE VIEW */
                quizQuestion && (
                  <div className="flex-1 flex flex-col gap-6 max-w-4xl mx-auto w-full py-2">
                    {/* Question Card */}
                    <div className="bg-slate-900/65 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                      
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">
                            Zadanie Quizowe
                          </span>
                        </div>
                        <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">
                          {ATLAS_CATEGORIES.find(c => c.id === quizQuestion.category)?.name || quizQuestion.category}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Opis zadania:</h3>
                          <p className="text-base md:text-lg text-white font-medium leading-relaxed font-display">
                            {quizQuestion.description}
                          </p>
                        </div>

                        {/* Source Command block */}
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400">
                              Znasz polecenie w powłoce: <strong className="text-slate-200 capitalize font-mono text-xs bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">{quizSourceShell}</strong>
                            </span>
                          </div>
                          <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs md:text-sm text-emerald-400 border border-slate-800 shadow-inner flex items-center justify-between">
                            <span>
                              <span className="text-slate-600 mr-2 select-none">
                                {quizSourceShell === "bash" ? "$" : quizSourceShell === "cmd" ? "C:\\>" : "PS>"}
                              </span>
                              {quizQuestion[quizSourceShell]}
                            </span>
                            <span className="text-[9px] uppercase font-bold text-slate-500 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
                              {quizSourceShell}
                            </span>
                          </div>
                        </div>

                        {/* Instruction for the player */}
                        <div className="pt-4 border-t border-slate-800/50 space-y-3">
                          <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                            <span>
                              Jak brzmi odpowiednik tego polecenia w powłoce:{" "}
                              <strong className="text-indigo-400 capitalize font-mono text-xs bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-900/30">
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
                              
                              let btnStyles = "bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/40";
                              if (isSelected) {
                                btnStyles = "bg-indigo-600/15 border-indigo-500/80 text-indigo-300 shadow-lg shadow-indigo-500/5";
                              }
                              
                              if (quizSubmitted) {
                                if (isCorrectAnswer) {
                                  btnStyles = "bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10 font-bold";
                                } else if (isSelected) {
                                  btnStyles = "bg-red-500/10 border-red-500 text-red-300 shadow-lg shadow-red-500/10";
                                } else {
                                  btnStyles = "bg-slate-950/20 border-slate-900 text-slate-500 opacity-50";
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
                                    <span className="text-[10px] bg-slate-900 text-slate-500 border border-slate-800 w-5 h-5 rounded-full flex items-center justify-center font-sans">
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
                      <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between gap-4">
                        <div className="text-xs text-slate-400">
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
                                  ❌ Ups! Poprawna to: <code className="bg-slate-950 px-1 py-0.5 rounded text-emerald-400 font-mono text-[11px]">{quizQuestion[quizTargetShell]}</code>
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
                              onClick={startNewQuizQuestion}
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
                      <div className="bg-slate-900/40 rounded-xl border border-slate-800/80 p-5 space-y-3 animate-fadeIn">
                        <div className="flex items-center gap-2 text-indigo-400 border-b border-slate-800/60 pb-2">
                          <Info size={14} />
                          <h4 className="text-xs font-bold uppercase tracking-wider font-display">
                            Wyjaśnienie i Filozofia
                          </h4>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {quizQuestion.explanation}
                        </p>
                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500">
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
            <div className="w-full md:w-96 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/30 flex flex-col flex-shrink-0 overflow-y-auto">
              <div className="p-5 space-y-5 flex-1">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-blue-400 font-bold uppercase tracking-wider">
                    <Sparkles size={14} className="animate-pulse" />
                    <span>Translator i Symulator Live</span>
                  </div>
                  <h2 className="text-xl font-display font-bold text-white">Komparator AI</h2>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Wpisz dowolne polecenie w jednym z systemów, lub po prostu opisz własnymi słowami po polsku, co chcesz osiągnąć. Gemini przetłumaczy intencję i zasymuluje wynik w czasie rzeczywistym.
                  </p>
                </div>

                {/* Form controls */}
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Wybierz wejście:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2">
                      {["Bash", "Zsh", "CMD", "PowerShell", "Opis słowny"].map((src) => (
                        <button
                          key={src}
                          onClick={() => setSandboxSource(src)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                            sandboxSource === src
                              ? "bg-blue-600/20 text-blue-300 border-blue-500/60"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                          } ${src === "Opis słowny" ? "col-span-2 sm:col-span-1 md:col-span-2" : ""}`}
                        >
                          {src}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Twoje polecenie lub intencja:
                    </label>
                    <textarea
                      value={sandboxInput}
                      onChange={(e) => setSandboxInput(e.target.value)}
                      placeholder={
                        sandboxSource === "Opis słowny" 
                          ? "np. znajdź pliki większe niż 100MB i usuń je" 
                          : "np. ping -c 5 google.com"
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition-colors resize-none h-28 leading-relaxed"
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
                <div className="space-y-2 pt-4 border-t border-slate-800/60">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
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
                        className="w-full text-left p-2 rounded bg-slate-950/60 border border-slate-800/40 hover:border-slate-700 transition-colors flex items-start gap-2"
                      >
                        <ChevronRight size={12} className="text-blue-500 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-semibold text-slate-300 font-display line-clamp-1">
                            {sug.title}
                          </p>
                          <p className="text-[9px] text-slate-500 truncate max-w-[240px]">
                            {sug.source} • {sug.input}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom system status in sidebar */}
              <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-[10px] text-slate-500 font-mono space-y-1">
                <div className="flex justify-between">
                  <span>Wykryte wejście:</span>
                  <span className="text-slate-300">{sandboxResult?.detectedSource || "Brak"}</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <TerminalWindow
                  type="bash"
                  command={sandboxResult?.bash.command || ""}
                  output={sandboxResult?.bash.output || ""}
                  explanation={sandboxResult?.bash.explanation}
                  isLoading={isSandboxLoading}
                />
                <TerminalWindow
                  type="zsh"
                  command={sandboxResult?.zsh?.command || ""}
                  output={sandboxResult?.zsh?.output || ""}
                  explanation={sandboxResult?.zsh?.explanation}
                  isLoading={isSandboxLoading}
                />
                <TerminalWindow
                  type="cmd"
                  command={sandboxResult?.cmd.command || ""}
                  output={sandboxResult?.cmd.output || ""}
                  explanation={sandboxResult?.cmd.explanation}
                  isLoading={isSandboxLoading}
                />
                <TerminalWindow
                  type="powershell"
                  command={sandboxResult?.powershell.command || ""}
                  output={sandboxResult?.powershell.output || ""}
                  explanation={sandboxResult?.powershell.explanation}
                  isLoading={isSandboxLoading}
                />
              </div>

              {/* Dynamic Comparison text generated by AI */}
              {sandboxResult && !isSandboxLoading && (
                <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Sparkles size={16} className="text-blue-400" />
                    <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-display">
                      Zasymulowane różnice architektoniczne i składniowe
                    </h3>
                  </div>
                  <div className="prose prose-sm prose-invert max-w-none text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {sandboxResult.comparisonMarkdown}
                  </div>
                </div>
              )}

              {!sandboxResult && !isSandboxLoading && (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-800/60 rounded-2xl">
                  <TerminalIcon className="text-slate-600 mb-3" size={36} />
                  <h3 className="font-display font-semibold text-slate-300 text-sm mb-1">Czekam na zapytanie...</h3>
                  <p className="text-xs text-slate-500 max-w-sm">
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
            <aside className="w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/30 flex flex-col flex-shrink-0">
              <div className="p-4 border-b border-slate-800">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Zrozumieć Różnice
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Pod maską każdego systemu leży zupełnie inna technologia. Wybierz pojęcie, aby przeanalizować fundamentalne rozbieżności.
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-slate-950/10">
                {conceptConcepts.map((con) => (
                  <button
                    key={con}
                    onClick={() => handleLoadConcept(con)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                      selectedConcept === con
                        ? "bg-blue-600/15 border-blue-500/50 text-blue-300 font-semibold"
                        : "bg-transparent border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                    }`}
                  >
                    {con}
                  </button>
                ))}
              </div>
              
              <div className="p-4 border-t border-slate-800 bg-slate-950/40">
                <div className="p-3 bg-blue-950/20 rounded-lg border border-blue-900/30 text-[11px] text-slate-400">
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
                  <div className="space-y-2 border-b border-slate-800 pb-5">
                    <span className="text-xs font-mono text-blue-500 uppercase font-bold tracking-widest">
                      Koncepcja i Teoria Systemowa
                    </span>
                    <h2 className="text-2xl font-display font-bold text-white">
                      {conceptResult.conceptName}
                    </h2>
                    <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                      {conceptResult.summary}
                    </p>
                  </div>

                  {/* Four pillars explanations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {/* Bash block */}
                    <div className="bg-[#0b0f19] border border-emerald-950/50 rounded-xl p-5 space-y-3 shadow-md flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-emerald-950/40 pb-2">
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">BASH (Linux)</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        </div>
                        <div className="prose prose-sm prose-invert text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {conceptResult.bashExplanation}
                        </div>
                      </div>
                    </div>

                    {/* Zsh block */}
                    <div className="bg-[#0b0f19] border border-violet-950/50 rounded-xl p-5 space-y-3 shadow-md flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-violet-950/40 pb-2">
                          <span className="text-xs font-bold text-violet-400 uppercase tracking-widest font-mono">ZSH (macOS)</span>
                          <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                        </div>
                        <div className="prose prose-sm prose-invert text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {conceptResult.zshExplanation}
                        </div>
                      </div>
                    </div>

                    {/* CMD block */}
                    <div className="bg-[#0b0f19] border border-zinc-800 rounded-xl p-5 space-y-3 shadow-md flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                          <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest font-mono">CMD (Windows)</span>
                          <span className="w-2 h-2 rounded-full bg-zinc-500"></span>
                        </div>
                        <div className="prose prose-sm prose-invert text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {conceptResult.cmdExplanation}
                        </div>
                      </div>
                    </div>

                    {/* PowerShell block */}
                    <div className="bg-[#0b0f19] border border-blue-900/40 rounded-xl p-5 space-y-3 shadow-md flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-blue-900/30 pb-2">
                          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest font-mono">POWERSHELL</span>
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        </div>
                        <div className="prose prose-sm prose-invert text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {conceptResult.powershellExplanation}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comparison Grid or Markdown Table */}
                  <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                      <Layers size={16} className="text-blue-400" />
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-display">
                        Tabela porównawcza mechanizmów
                      </h4>
                    </div>
                    <div className="prose prose-sm prose-invert text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {conceptResult.comparisonMarkdown}
                    </div>
                  </div>

                  {/* Pro tips checklist */}
                  <div className="bg-gradient-to-br from-slate-900 to-indigo-950/20 rounded-xl border border-blue-900/30 p-5 space-y-4">
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
                          className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60 text-xs text-slate-300 relative pl-8"
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
      </main>

      {/* FOOTER */}
      <footer className="h-12 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between px-6 md:px-8 text-[10px] text-slate-500 font-medium flex-shrink-0 z-10">
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

      {/* PWA MANUAL INSTALLATION MODAL */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="text-blue-400" size={18} />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Instalacja Aplikacji</h3>
              </div>
              <button 
                onClick={() => setShowInstallModal(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              {isInIframe && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-400 text-lg">⚠️</span>
                    <div className="space-y-1">
                      <h4 className="font-bold text-amber-300 font-sans">Wykryto tryb podglądu (Iframe)</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Przeglądarki internetowe blokują instalację aplikacji PWA bezpośrednio z okna podglądu AI Studio. Kliknij poniższy przycisk, aby otworzyć aplikację w osobnym oknie i natychmiast odblokować instalację:
                      </p>
                    </div>
                  </div>
                  <a
                    href={window.location.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <ExternalLink size={14} />
                    Otwórz w nowej karcie i zainstaluj
                  </a>
                </div>
              )}

              <p>
                Aplikacja <strong>ShellCompare</strong> wspiera technologię <strong>PWA (Progressive Web App)</strong>, umożliwiając działanie jako niezależny program na komputerze lub smartfonie (działa szybciej, bez pasków przeglądarki).
              </p>

              <div className="space-y-3">
                {/* Desktop */}
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60 space-y-1">
                  <span className="font-semibold text-blue-400 font-mono text-[10px] uppercase tracking-wider">💻 KOMPUTERY (Chrome, Edge, Opera, Safari)</span>
                  <p>W pasku adresu przeglądarki (po prawej stronie) kliknij ikonę instalacji <strong>(monitor ze strzałką)</strong> lub kliknij trzy kropki i wybierz <strong>"Zainstaluj aplikację ShellCompare"</strong>.</p>
                </div>

                {/* Android */}
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60 space-y-1">
                  <span className="font-semibold text-emerald-400 font-mono text-[10px] uppercase tracking-wider">🤖 SMARTFONY ANDROID</span>
                  <p>Kliknij ikonę menu (trzy kropki) w prawym górnym rogu przeglądarki Chrome i wybierz <strong>"Zainstaluj aplikację"</strong> lub <strong>"Dodaj do ekranu głównego"</strong>.</p>
                </div>

                {/* iOS */}
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/60 space-y-1">
                  <span className="font-semibold text-violet-400 font-mono text-[10px] uppercase tracking-wider">🍏 IPHONE & IPAD (Safari)</span>
                  <p>Kliknij przycisk <strong>"Udostępnij"</strong> (kwadrat z pionową strzałką) na dolnym pasku Safari, przewiń listę w dół i wybierz opcję <strong>"Dodaj do ekranu początkowego"</strong>.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-blue-500/5 p-2.5 rounded border border-blue-500/10">
                <Info size={14} className="text-blue-400 shrink-0" />
                <span>Jeśli przeglądasz aplikację wewnątrz podglądu AI Studio, otwórz ją w nowej karcie za pomocą przycisku w prawym górnym rogu, aby aktywować pełną instalację.</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowInstallModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Rozumiem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
