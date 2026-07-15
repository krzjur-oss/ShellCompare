export interface ShellDetails {
  command: string;
  output: string;
  explanation: string;
}

export interface CommandComparison {
  bash: ShellDetails;
  cmd: ShellDetails;
  powershell: ShellDetails;
  zsh: ShellDetails;
  detectedSource: string;
  comparisonMarkdown: string;
}

export interface ConceptComparison {
  conceptName: string;
  summary: string;
  bashExplanation: string;
  cmdExplanation: string;
  powershellExplanation: string;
  zshExplanation: string;
  comparisonMarkdown: string;
  proTips: string[];
}

export interface AtlasItem {
  id: string;
  title: string;
  category: string;
  description: string;
  bash: string;
  cmd: string;
  powershell: string;
  zsh: string;
  explanation: string;
  detailedComparison?: string;
  level?: "podstawowa" | "ponadpodstawowa";
}

export type ActiveTab = "atlas" | "sandbox" | "concepts" | "help" | "scenarios" | "about";
export type ShellType = "bash" | "cmd" | "powershell" | "zsh";
export type TerminalTheme = "dark" | "monokai" | "solarized";

export interface Challenge {
  id: string;
  title: string;
  goal: string;
  description: string;
  level: "podstawowa" | "ponadpodstawowa";
  category?: string;
  solutions: {
    bash: string[];
    cmd: string[];
    powershell: string[];
    zsh: string[];
  };
  tips: string;
  dangerExplanation?: string;
}

export interface ChallengeEvaluationResult {
  isCorrect: boolean;
  feedback: string;
  alternative: string;
  isOffline?: boolean;
}

