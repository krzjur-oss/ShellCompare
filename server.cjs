var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var aiClient = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Brak klucza API (GEMINI_API_KEY). Skonfiguruj go w panelu Secrets.");
    }
    aiClient = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
});
app.post("/api/translate-command", async (req, res) => {
  try {
    const { input, sourceShell } = req.body;
    if (!input || typeof input !== "string" || input.trim() === "") {
      res.status(400).json({ error: "Brak podanego polecenia lub opisu." });
      return;
    }
    const ai = getGeminiClient();
    const systemInstruction = `Jeste\u015B ekspertem system\xF3w operacyjnych (Linux, macOS, Windows) oraz pow\u0142ok systemowych: Bash (Linux), Zsh (domy\u015Blna w macOS), CMD (klasyczny wiersz polece\u0144 Windows) oraz PowerShell (nowoczesny shell obiektowy).
Twoim zadaniem jest przet\u0142umaczenie podanego polecenia lub opisu intencji u\u017Cytkownika na odpowiedniki we wszystkich czterech systemach (Bash, Zsh, CMD, PowerShell), wyja\u015Bnienie sk\u0142adni oraz wygenerowanie wysoce realistycznej symulacji wyniku tekstowego (stdout/stderr) dla ka\u017Cdego z tych terminali.

Dla ka\u017Cdego terminala wygeneruj:
1. 'command': dok\u0142adne, dzia\u0142aj\u0105ce polecenie realizuj\u0105ce t\u0119 czynno\u015B\u0107.
2. 'output': realistyczn\u0105 symulacj\u0119 wyniku tekstowego, jakby polecenie zosta\u0142o rzeczywi\u015Bcie wykonane w danej pow\u0142oce. Dbaj o detale (np. 'dir' w CMD ma inny format ni\u017C 'ls -la' w Bashu/Zsh, a 'Get-ChildItem' w PowerShellu ma charakterystyczne kolumny).
3. 'explanation': zwi\u0119z\u0142e wyja\u015Bnienie po polsku (u\u017Cyte flagi, parametry, specyfika pow\u0142oki).

Dodatkowo okre\u015Bl 'detectedSource' (np. 'Bash', 'Zsh', 'CMD', 'PowerShell', 'Opis s\u0142owny') oraz stw\xF3rz 'comparisonMarkdown' zawieraj\u0105cy rzetelne por\xF3wnanie r\xF3\u017Cnic w sk\u0142adni, filozofii (np. obiekty vs strumienie tekstowe), obs\u0142udze b\u0142\u0119d\xF3w lub potencjalnych pu\u0142apkach dla tej konkretnej operacji.

M\xF3w wy\u0142\u0105cznie w j\u0119zyku polskim.`;
    const prompt = `Przet\u0142umacz i por\xF3wnaj poni\u017Csze wej\u015Bcie:
U\u017Cytkownik poda\u0142: "${input}"
Sugerowane \u017Ar\xF3d\u0142o przez u\u017Cytkownika (opcjonalnie): ${sourceShell || "Wykryj automatycznie"}`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            bash: {
              type: import_genai.Type.OBJECT,
              properties: {
                command: { type: import_genai.Type.STRING, description: "Dok\u0142adne, dzia\u0142aj\u0105ce polecenie w Bashu" },
                output: { type: import_genai.Type.STRING, description: "Symulowany, realistyczny wynik tekstowy wykonania tego polecenia w konsoli Bash" },
                explanation: { type: import_genai.Type.STRING, description: "Kr\xF3tkie wyja\u015Bnienie dzia\u0142ania i u\u017Cytych flag po polsku" }
              },
              required: ["command", "output", "explanation"]
            },
            zsh: {
              type: import_genai.Type.OBJECT,
              properties: {
                command: { type: import_genai.Type.STRING, description: "Dok\u0142adne, dzia\u0142aj\u0105ce polecenie w Zsh (domy\u015Blny macOS)" },
                output: { type: import_genai.Type.STRING, description: "Symulowany, realistyczny wynik tekstowy wykonania tego polecenia w konsoli Zsh" },
                explanation: { type: import_genai.Type.STRING, description: "Kr\xF3tkie wyja\u015Bnienie dzia\u0142ania i u\u017Cytych flag po polsku" }
              },
              required: ["command", "output", "explanation"]
            },
            cmd: {
              type: import_genai.Type.OBJECT,
              properties: {
                command: { type: import_genai.Type.STRING, description: "Dok\u0142adne, dzia\u0142aj\u0105ce polecenie w wierszu polece\u0144 CMD" },
                output: { type: import_genai.Type.STRING, description: "Symulowany, realistyczny wynik tekstowy wykonania tego polecenia w konsoli CMD" },
                explanation: { type: import_genai.Type.STRING, description: "Kr\xF3tkie wyja\u015Bnienie dzia\u0142ania i u\u017Cytych flag po polsku" }
              },
              required: ["command", "output", "explanation"]
            },
            powershell: {
              type: import_genai.Type.OBJECT,
              properties: {
                command: { type: import_genai.Type.STRING, description: "Dok\u0142adne, dzia\u0142aj\u0105ce polecenie w PowerShellu" },
                output: { type: import_genai.Type.STRING, description: "Symulowany, realistyczny wynik tekstowy wykonania tego polecenia w konsoli PowerShell" },
                explanation: { type: import_genai.Type.STRING, description: "Kr\xF3tkie wyja\u015Bnienie dzia\u0142ania i u\u017Cytych flag po polsku" }
              },
              required: ["command", "output", "explanation"]
            },
            detectedSource: { type: import_genai.Type.STRING, description: "Automatycznie wykryte \u017Ar\xF3d\u0142o (np. Bash, Zsh, CMD, PowerShell, Opis s\u0142owny)" },
            comparisonMarkdown: { type: import_genai.Type.STRING, description: "Rzetelne por\xF3wnanie po polsku specyfiki tej operacji w r\xF3\u017Cnych pow\u0142okach, r\xF3\u017Cnice architektoniczne, potoki itp." }
          },
          required: ["bash", "zsh", "cmd", "powershell", "detectedSource", "comparisonMarkdown"]
        }
      }
    });
    const responseText = response.text;
    if (!responseText) {
      throw new Error("Model Gemini nie zwr\xF3ci\u0142 odpowiedzi.");
    }
    const data = JSON.parse(responseText);
    res.json(data);
  } catch (error) {
    console.error("Error in /api/translate-command:", error);
    res.status(500).json({ error: error.message || "B\u0142\u0105d wewn\u0119trzny serwera." });
  }
});
app.post("/api/compare-concept", async (req, res) => {
  try {
    const { concept } = req.body;
    if (!concept || typeof concept !== "string") {
      res.status(400).json({ error: "Brak podanego poj\u0119cia." });
      return;
    }
    const ai = getGeminiClient();
    const systemInstruction = `Jeste\u015B wybitnym pedagogiem i administratorem system\xF3w operacyjnych. Wyja\u015Bnij poj\u0119cie techniczne/koncepcyjne podane przez u\u017Cytkownika w kontek\u015Bcie czterech \u015Brodowisk terminalowych: Bash, Zsh, CMD i PowerShell.
Por\xF3wnaj te \u015Brodowiska pod k\u0105tem danej koncepcji (np. Potoki, Przekierowania strumieni, Zmienne \u015Brodowiskowe, Skryptowanie, P\u0119tle, Obs\u0142uga b\u0142\u0119d\xF3w, Uprawnienia plik\xF3w, Zarz\u0105dzanie procesami).
Zwr\xF3\u0107 odpowied\u017A w formacie JSON z nast\u0119puj\u0105cymi polami:
- conceptName: polska nazwa poj\u0119cia
- summary: og\xF3lne zwi\u0119z\u0142e podsumowanie poj\u0119cia (po polsku)
- bashExplanation: szczeg\xF3\u0142owe wyja\u015Bnienie jak ta koncepcja dzia\u0142a w Bashu wraz z przyk\u0142adem kodu
- zshExplanation: szczeg\xF3\u0142owe wyja\u015Bnienie jak ta koncepcja dzia\u0142a w Zsh wraz z przyk\u0142adem kodu
- cmdExplanation: szczeg\xF3\u0142owe wyja\u015Bnienie jak ta koncepcja dzia\u0142a w CMD wraz z przyk\u0142adem kodu
- powershellExplanation: szczeg\xF3\u0142owe wyja\u015Bnienie jak ta koncepcja dzia\u0142a w PowerShellu wraz z przyk\u0142adem kodu
- comparisonMarkdown: tabela lub punkty por\xF3wnawcze wszystkich czterech pow\u0142ok w formacie markdown.
- proTips: 3 kluczowe wskaz\xF3wki dla administratora/programisty przechodz\u0105cego mi\u0119dzy tymi pow\u0142okami.

M\xF3w wy\u0142\u0105cznie w j\u0119zyku polskim.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Wyja\u015Bnij i por\xF3wnaj koncepcj\u0119: "${concept}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            conceptName: { type: import_genai.Type.STRING },
            summary: { type: import_genai.Type.STRING },
            bashExplanation: { type: import_genai.Type.STRING },
            zshExplanation: { type: import_genai.Type.STRING },
            cmdExplanation: { type: import_genai.Type.STRING },
            powershellExplanation: { type: import_genai.Type.STRING },
            comparisonMarkdown: { type: import_genai.Type.STRING, description: "Tabela lub punkty por\xF3wnawcze w formacie markdown" },
            proTips: {
              type: import_genai.Type.ARRAY,
              items: { type: import_genai.Type.STRING },
              description: "Dok\u0142adnie 3 przydatne wskaz\xF3wki powi\u0105zane z tym poj\u0119ciem"
            }
          },
          required: ["conceptName", "summary", "bashExplanation", "zshExplanation", "cmdExplanation", "powershellExplanation", "comparisonMarkdown", "proTips"]
        }
      }
    });
    const responseText = response.text;
    if (!responseText) {
      throw new Error("Model Gemini nie zwr\xF3ci\u0142 odpowiedzi.");
    }
    const data = JSON.parse(responseText);
    res.json(data);
  } catch (error) {
    console.error("Error in /api/compare-concept:", error);
    res.status(500).json({ error: error.message || "B\u0142\u0105d wewn\u0119trzny serwera." });
  }
});
app.get("/sw.js", (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    const filePath = import_path.default.join(process.cwd(), "dist", "sw.js");
    if (import_fs.default.existsSync(filePath)) {
      res.setHeader("Content-Type", "application/javascript");
      return res.sendFile(filePath);
    }
  }
  next();
});
app.get("/manifest.webmanifest", (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    const filePath = import_path.default.join(process.cwd(), "dist", "manifest.webmanifest");
    if (import_fs.default.existsSync(filePath)) {
      res.setHeader("Content-Type", "application/manifest+json");
      return res.sendFile(filePath);
    }
  }
  next();
});
app.get("/workbox-*.js", (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    const fileName = import_path.default.basename(req.path);
    const filePath = import_path.default.join(process.cwd(), "dist", fileName);
    if (import_fs.default.existsSync(filePath)) {
      res.setHeader("Content-Type", "application/javascript");
      return res.sendFile(filePath);
    }
  }
  next();
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
