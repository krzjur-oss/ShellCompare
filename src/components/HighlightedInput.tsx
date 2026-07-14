import React, { useRef, useEffect } from "react";

interface HighlightedInputProps {
  value: string;
  onChange: (val: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  isPolish?: boolean;
}

/**
 * Parses and highlights a shell command or Polish description using regex.
 * Generates React elements with Tailwind CSS colors for high-contrast highlighting.
 */
export function highlightCommand(text: string, isPolish: boolean): React.ReactNode[] {
  if (!text) return [];

  if (isPolish) {
    // Actionable keywords in Polish text for descriptive input mode
    const polishRegex = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b(?:znajdź|szukaj|usuń|wyświetl|skopiuj|stwórz|utwórz|zmień|pokaż|wypisz|filtruj|sprawdź|zapisz|pobierz|uruchom|katalog|plik|pliki|folder|foldery|tekst|proces|procesy|sieć|port|porty|użytkownik|użytkownicy|uprawnienia|rozmiar|nazwa|data|czas|kopia)\b)|(\b\d+\b)/gi;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = polishRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const [matchedText, stringGroup, keywordGroup, numberGroup] = match;

      if (stringGroup) {
        parts.push(
          <span key={`string-${key++}`} className="text-amber-400">
            {matchedText}
          </span>
        );
      } else if (keywordGroup) {
        parts.push(
          <span key={`keyword-${key++}`} className="text-blue-400 font-semibold">
            {matchedText}
          </span>
        );
      } else if (numberGroup) {
        parts.push(
          <span key={`number-${key++}`} className="text-yellow-500 font-mono">
            {matchedText}
          </span>
        );
      }

      lastIndex = polishRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  }

  // Shell command tokenizing regex:
  // 1. Comments: #... (for unix) or ::... or REM ... (for cmd)
  // 2. Strings: "..." or '...'
  // 3. Flags: -la, --all, /s, /p
  // 4. Operators: &&, ||, |, >, >>, <, ;, &, etc.
  // 5. Variables: $foo, %foo%
  // 6. Numbers: \b\d+\b
  const tokenRegex = /(#.*|::.*|^(?:rem|REM)\b.*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(-[a-zA-Z0-9_-]+|--[a-zA-Z0-9_-]+|\/[a-zA-Z0-9_?]+)|(&&|\|\||\||>>|>\s*|<<|<\s*|;|&=)|(\$[a-zA-Z0-9_]+|%[a-zA-Z0-9_]+%)|(\b\d+\b)/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  interface MatchResult {
    text: string;
    index: number;
    type: "comment" | "string" | "flag" | "operator" | "variable" | "number";
  }

  const matches: MatchResult[] = [];
  while ((match = tokenRegex.exec(text)) !== null) {
    let type: MatchResult["type"] = "comment";
    if (match[1]) type = "comment";
    else if (match[2]) type = "string";
    else if (match[3]) type = "flag";
    else if (match[4]) type = "operator";
    else if (match[5]) type = "variable";
    else if (match[6]) type = "number";

    matches.push({
      text: match[0],
      index: match.index,
      type,
    });
  }

  let currentPos = 0;

  const processNormalText = (str: string, baseIndex: number) => {
    const subParts: React.ReactNode[] = [];
    const wordRegex = /(\b[a-zA-Z0-9_-]+\b)/g;
    let subLastIndex = 0;
    let subMatch;

    const isStartOfCommand = text.substring(0, baseIndex).trim() === "";

    while ((subMatch = wordRegex.exec(str)) !== null) {
      if (subMatch.index > subLastIndex) {
        subParts.push(str.substring(subLastIndex, subMatch.index));
      }

      const word = subMatch[0];
      const wordAbsoluteIndex = baseIndex + subMatch.index;
      
      const textBeforeWord = text.substring(0, wordAbsoluteIndex).trim();
      const isAfterOperator = /[;|&&|\|\||\||>]$/.test(textBeforeWord);

      if ((isStartOfCommand && subMatch.index === 0) || isAfterOperator) {
        subParts.push(
          <span key={`cmd-${key++}`} className="text-emerald-400 font-bold">
            {word}
          </span>
        );
      } else {
        subParts.push(word);
      }

      subLastIndex = wordRegex.lastIndex;
    }

    if (subLastIndex < str.length) {
      subParts.push(str.substring(subLastIndex));
    }

    return subParts;
  };

  for (const m of matches) {
    if (m.index > currentPos) {
      const normalText = text.substring(currentPos, m.index);
      parts.push(...processNormalText(normalText, currentPos));
    }

    if (m.type === "comment") {
      parts.push(
        <span key={`tok-${key++}`} className="text-slate-500 italic">
          {m.text}
        </span>
      );
    } else if (m.type === "string") {
      parts.push(
        <span key={`tok-${key++}`} className="text-amber-400">
          {m.text}
        </span>
      );
    } else if (m.type === "flag") {
      parts.push(
        <span key={`tok-${key++}`} className="text-cyan-400 font-semibold">
          {m.text}
        </span>
      );
    } else if (m.type === "operator") {
      parts.push(
        <span key={`tok-${key++}`} className="text-pink-500 font-bold">
          {m.text}
        </span>
      );
    } else if (m.type === "variable") {
      parts.push(
        <span key={`tok-${key++}`} className="text-purple-400 font-medium">
          {m.text}
        </span>
      );
    } else if (m.type === "number") {
      parts.push(
        <span key={`tok-${key++}`} className="text-yellow-500 font-mono">
          {m.text}
        </span>
      );
    }

    currentPos = m.index + m.text.length;
  }

  if (currentPos < text.length) {
    const normalText = text.substring(currentPos);
    parts.push(...processNormalText(normalText, currentPos));
  }

  return parts;
}

export default function HighlightedInput({
  value,
  onChange,
  onKeyDown,
  placeholder,
  isPolish = false,
}: HighlightedInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Synchronize scroll position of backdrop with textarea
  const handleScroll = () => {
    if (textareaRef.current && backdropRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
      backdropRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  useEffect(() => {
    handleScroll();
  }, [value]);

  return (
    <div id="highlighted-input-container" className="relative w-full h-28 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden focus-within:border-blue-500/60 transition-colors">
      {/* Backdrop containing highlighted syntax */}
      <div
        ref={backdropRef}
        id="highlighted-backdrop"
        className="absolute inset-0 w-full h-full p-3 font-mono text-xs leading-relaxed overflow-hidden pointer-events-none select-none whitespace-pre-wrap break-all text-slate-400"
        aria-hidden="true"
      >
        {highlightCommand(value, isPolish)}
        {/* Render a simulated trailing line-break so scrolling stays in sync on new lines */}
        {value.endsWith("\n") ? " " : ""}
      </div>

      {/* Actual textarea overlaid on top, transparent text, visible cursor */}
      <textarea
        ref={textareaRef}
        id="highlighted-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onScroll={handleScroll}
        placeholder={placeholder}
        className="absolute inset-0 w-full h-full p-3 bg-transparent text-transparent caret-white resize-none border-none focus:ring-0 focus:outline-none z-10 font-mono text-xs leading-relaxed overflow-y-auto"
        spellCheck="false"
      />
    </div>
  );
}
