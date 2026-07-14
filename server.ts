import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Brak klucza API (GEMINI_API_KEY). Skonfiguruj go w panelu Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST API routes

/**
 * Health check
 */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

/**
 * Real-time command translation & simulation
 */
app.post("/api/translate-command", async (req, res) => {
  try {
    const { input, sourceShell } = req.body;
    if (!input || typeof input !== "string" || input.trim() === "") {
      res.status(400).json({ error: "Brak podanego polecenia lub opisu." });
      return;
    }

    const ai = getGeminiClient();

    const systemInstruction = `Jesteś ekspertem systemów operacyjnych (Linux, macOS, Windows) oraz powłok systemowych: Bash (Linux), Zsh (domyślna w macOS), CMD (klasyczny wiersz poleceń Windows) oraz PowerShell (nowoczesny shell obiektowy).
Twoim zadaniem jest przetłumaczenie podanego polecenia lub opisu intencji użytkownika na odpowiedniki we wszystkich czterech systemach (Bash, Zsh, CMD, PowerShell), wyjaśnienie składni oraz wygenerowanie wysoce realistycznej symulacji wyniku tekstowego (stdout/stderr) dla każdego z tych terminali.

Dla każdego terminala wygeneruj:
1. 'command': dokładne, działające polecenie realizujące tę czynność.
2. 'output': realistyczną symulację wyniku tekstowego, jakby polecenie zostało rzeczywiście wykonane w danej powłoce. Dbaj o detale (np. 'dir' w CMD ma inny format niż 'ls -la' w Bashu/Zsh, a 'Get-ChildItem' w PowerShellu ma charakterystyczne kolumny).
3. 'explanation': zwięzłe wyjaśnienie po polsku (użyte flagi, parametry, specyfika powłoki).

Dodatkowo określ 'detectedSource' (np. 'Bash', 'Zsh', 'CMD', 'PowerShell', 'Opis słowny') oraz stwórz 'comparisonMarkdown' zawierający rzetelne porównanie różnic w składni, filozofii (np. obiekty vs strumienie tekstowe), obsłudze błędów lub potencjalnych pułapkach dla tej konkretnej operacji.

Mów wyłącznie w języku polskim.`;

    const prompt = `Przetłumacz i porównaj poniższe wejście:
Użytkownik podał: "${input}"
Sugerowane źródło przez użytkownika (opcjonalnie): ${sourceShell || "Wykryj automatycznie"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bash: {
              type: Type.OBJECT,
              properties: {
                command: { type: Type.STRING, description: "Dokładne, działające polecenie w Bashu" },
                output: { type: Type.STRING, description: "Symulowany, realistyczny wynik tekstowy wykonania tego polecenia w konsoli Bash" },
                explanation: { type: Type.STRING, description: "Krótkie wyjaśnienie działania i użytych flag po polsku" }
              },
              required: ["command", "output", "explanation"]
            },
            zsh: {
              type: Type.OBJECT,
              properties: {
                command: { type: Type.STRING, description: "Dokładne, działające polecenie w Zsh (domyślny macOS)" },
                output: { type: Type.STRING, description: "Symulowany, realistyczny wynik tekstowy wykonania tego polecenia w konsoli Zsh" },
                explanation: { type: Type.STRING, description: "Krótkie wyjaśnienie działania i użytych flag po polsku" }
              },
              required: ["command", "output", "explanation"]
            },
            cmd: {
              type: Type.OBJECT,
              properties: {
                command: { type: Type.STRING, description: "Dokładne, działające polecenie w wierszu poleceń CMD" },
                output: { type: Type.STRING, description: "Symulowany, realistyczny wynik tekstowy wykonania tego polecenia w konsoli CMD" },
                explanation: { type: Type.STRING, description: "Krótkie wyjaśnienie działania i użytych flag po polsku" }
              },
              required: ["command", "output", "explanation"]
            },
            powershell: {
              type: Type.OBJECT,
              properties: {
                command: { type: Type.STRING, description: "Dokładne, działające polecenie w PowerShellu" },
                output: { type: Type.STRING, description: "Symulowany, realistyczny wynik tekstowy wykonania tego polecenia w konsoli PowerShell" },
                explanation: { type: Type.STRING, description: "Krótkie wyjaśnienie działania i użytych flag po polsku" }
              },
              required: ["command", "output", "explanation"]
            },
            detectedSource: { type: Type.STRING, description: "Automatycznie wykryte źródło (np. Bash, Zsh, CMD, PowerShell, Opis słowny)" },
            comparisonMarkdown: { type: Type.STRING, description: "Rzetelne porównanie po polsku specyfiki tej operacji w różnych powłokach, różnice architektoniczne, potoki itp." }
          },
          required: ["bash", "zsh", "cmd", "powershell", "detectedSource", "comparisonMarkdown"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Model Gemini nie zwrócił odpowiedzi.");
    }

    const data = JSON.parse(responseText);
    res.json(data);
  } catch (error: any) {
    console.error("Error in /api/translate-command:", error);
    res.status(500).json({ error: error.message || "Błąd wewnętrzny serwera." });
  }
});

/**
 * Compare concept (e.g. Pipelines, Scripting, Error Handling, File permissions)
 */
app.post("/api/compare-concept", async (req, res) => {
  try {
    const { concept } = req.body;
    if (!concept || typeof concept !== "string") {
      res.status(400).json({ error: "Brak podanego pojęcia." });
      return;
    }

    const ai = getGeminiClient();

    const systemInstruction = `Jesteś wybitnym pedagogiem i administratorem systemów operacyjnych. Wyjaśnij pojęcie techniczne/koncepcyjne podane przez użytkownika w kontekście czterech środowisk terminalowych: Bash, Zsh, CMD i PowerShell.
Porównaj te środowiska pod kątem danej koncepcji (np. Potoki, Przekierowania strumieni, Zmienne środowiskowe, Skryptowanie, Pętle, Obsługa błędów, Uprawnienia plików, Zarządzanie procesami).
Zwróć odpowiedź w formacie JSON z następującymi polami:
- conceptName: polska nazwa pojęcia
- summary: ogólne zwięzłe podsumowanie pojęcia (po polsku)
- bashExplanation: szczegółowe wyjaśnienie jak ta koncepcja działa w Bashu wraz z przykładem kodu
- zshExplanation: szczegółowe wyjaśnienie jak ta koncepcja działa w Zsh wraz z przykładem kodu
- cmdExplanation: szczegółowe wyjaśnienie jak ta koncepcja działa w CMD wraz z przykładem kodu
- powershellExplanation: szczegółowe wyjaśnienie jak ta koncepcja działa w PowerShellu wraz z przykładem kodu
- comparisonMarkdown: tabela lub punkty porównawcze wszystkich czterech powłok w formacie markdown.
- proTips: 3 kluczowe wskazówki dla administratora/programisty przechodzącego między tymi powłokami.

Mów wyłącznie w języku polskim.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Wyjaśnij i porównaj koncepcję: "${concept}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            conceptName: { type: Type.STRING },
            summary: { type: Type.STRING },
            bashExplanation: { type: Type.STRING },
            zshExplanation: { type: Type.STRING },
            cmdExplanation: { type: Type.STRING },
            powershellExplanation: { type: Type.STRING },
            comparisonMarkdown: { type: Type.STRING, description: "Tabela lub punkty porównawcze w formacie markdown" },
            proTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Dokładnie 3 przydatne wskazówki powiązane z tym pojęciem"
            }
          },
          required: ["conceptName", "summary", "bashExplanation", "zshExplanation", "cmdExplanation", "powershellExplanation", "comparisonMarkdown", "proTips"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Model Gemini nie zwrócił odpowiedzi.");
    }

    const data = JSON.parse(responseText);
    res.json(data);
  } catch (error: any) {
    console.error("Error in /api/compare-concept:", error);
    res.status(500).json({ error: error.message || "Błąd wewnętrzny serwera." });
  }
});

/**
 * Evaluate user's challenge command
 */
app.post("/api/evaluate-challenge", async (req, res) => {
  try {
    const { challengeGoal, shell, userCommand } = req.body;
    if (!challengeGoal || !shell || !userCommand) {
      res.status(400).json({ error: "Brak wymaganych parametrów (challengeGoal, shell, userCommand)." });
      return;
    }

    const ai = getGeminiClient();

    const systemInstruction = `Jesteś surowym, ale sprawiedliwym i bardzo pomocnym nauczycielem systemów operacyjnych oraz administratorem systemów. 
Oceniasz odpowiedź ucznia na praktyczne zadanie (wyzwanie) w określonej powłoce systemowej.

Zasady oceny:
1. Sprawdź, czy komenda wpisana przez użytkownika poprawnie realizuje postawiony cel w wybranej powłoce.
2. Weź pod uwagę, że istnieje wiele poprawnych sposobów (np. aliasy, alternatywne komendy).
3. Wyjaśnij szczegółowo w języku polskim, dlaczego komenda jest poprawna lub błędna. Wskaż ewentualne brakujące flagi lub parametry, albo napisz, jak komenda zachowa się w rzeczywistości.
4. Zwróć odpowiedź w formacie JSON zawierającym:
   - isCorrect: boolean (czy komenda poprawnie i bezpiecznie wykonuje zadanie)
   - feedback: szczegółowa informacja zwrotna i edukacyjne uzasadnienie po polsku
   - alternative: najbardziej eleganckie, zalecane, kanoniczne polecenie realizujące ten cel w tej powłoce.

Mów wyłącznie w języku polskim.`;

    const prompt = `Oceń rozwiązanie wyzwania:
Cel zadania: "${challengeGoal}"
Wybrana powłoka: "${shell}"
Wpisane polecenie użytkownika: "${userCommand}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN, description: "Czy polecenie użytkownika jest w pełni poprawne i realizuje cel" },
            feedback: { type: Type.STRING, description: "Szczegółowa ocena, pochwała lub wytłumaczenie błędów i różnic po polsku" },
            alternative: { type: Type.STRING, description: "Kanoniczna, wzorcowa komenda dla tego shella" }
          },
          required: ["isCorrect", "feedback", "alternative"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Model Gemini nie zwrócił odpowiedzi.");
    }

    const data = JSON.parse(responseText);
    res.json(data);
  } catch (error: any) {
    console.error("Error in /api/evaluate-challenge:", error);
    res.status(500).json({ error: error.message || "Błąd podczas oceny wyzwania." });
  }
});


// Serve PWA assets from dist directory directly with correct MIME types
app.get("/sw.js", (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    const filePath = path.join(process.cwd(), "dist", "sw.js");
    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Type", "application/javascript");
      return res.sendFile(filePath);
    }
  }
  next();
});

app.get("/manifest.webmanifest", (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    const filePath = path.join(process.cwd(), "dist", "manifest.webmanifest");
    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Type", "application/manifest+json");
      return res.sendFile(filePath);
    }
  }
  next();
});

app.get("/workbox-*.js", (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    const fileName = path.basename(req.path);
    const filePath = path.join(process.cwd(), "dist", fileName);
    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Type", "application/javascript");
      return res.sendFile(filePath);
    }
  }
  next();
});


// Serve static/dev assets with Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
