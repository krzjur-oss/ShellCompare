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
}

export type ActiveTab = "atlas" | "sandbox" | "concepts" | "help";
export type ShellType = "bash" | "cmd" | "powershell" | "zsh";
