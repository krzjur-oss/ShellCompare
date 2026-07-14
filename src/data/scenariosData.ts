import { Challenge, ChallengeEvaluationResult, ShellType } from "../types";

export const CHALLENGES: Challenge[] = [
  {
    id: "backup-etc",
    title: "📁 Kopia zapasowa /etc",
    goal: "Skopiuj cały katalog /etc wraz z zawartością do /backup",
    description: "Musisz stworzyć pełną kopię zapasową konfiguracji systemowej znajdującej się w /etc i zapisać ją w katalogu /backup. Pamiętaj o rekurencyjnym kopiowaniu podkatalogów!",
    level: "ponadpodstawowa",
    solutions: {
      bash: ["cp -r /etc /backup", "cp -R /etc /backup", "cp -a /etc /backup", "cp -r /etc/ /backup"],
      zsh: ["cp -r /etc /backup", "cp -R /etc /backup", "cp -a /etc /backup", "cp -r /etc/ /backup"],
      cmd: ["xcopy /s /e /i /h /y /etc \\backup", "robocopy /etc \\backup /e", "xcopy /s /e /i /h /y /etc/ \\backup"],
      powershell: [
        "Copy-Item -Path /etc -Destination /backup -Recurse",
        "Copy-Item /etc /backup -Recurse",
        "Copy-Item -Path /etc -Destination /backup -Recurse -Force",
        "cp /etc /backup -Recurse"
      ]
    },
    tips: "W systemach Linux/macOS użyj polecenia cp z flagą -r. W Windows CMD skorzystaj z xcopy z parametrami /s /e lub nowoczesnego narzędzia robocopy. W PowerShellu cmdlet Copy-Item wymaga flagi -Recurse."
  },
  {
    id: "list-hidden",
    title: "🔍 Listowanie ukrytych plików",
    goal: "Wyświetl wszystkie pliki w katalogu domowym, w tym ukryte",
    description: "Katalog domowy użytkownika często zawiera ukryte pliki konfiguracyjne (np. .bashrc, .gitconfig). Wyświetl pełną listę plików w bieżącej ścieżce, nie omijając tych ukrytych.",
    level: "podstawowa",
    solutions: {
      bash: ["ls -la", "ls -a", "ls -F -a", "ls -laF"],
      zsh: ["ls -la", "ls -a", "ls -laF", "ls -aF"],
      cmd: ["dir /a", "dir /ah", "dir /a:h", "dir /a-d"],
      powershell: ["Get-ChildItem -Force", "gci -Force", "ls -Force", "dir -Force"]
    },
    tips: "W Bash i Zsh flaga -a odpowiada za 'all' (pokazanie plików z kropką na początku). W CMD służy do tego dir z parametrem /a. W PowerShellu Get-ChildItem domyślnie pomija ukryte elementy, chyba że dodasz flagę -Force."
  },
  {
    id: "search-fatal",
    title: "📝 Filtrowanie błędów 'FATAL'",
    goal: "Wyszukaj linie zawierające słowo 'FATAL' w pliku serwer.log",
    description: "Analizujesz awarię serwera. Przeszukaj duży plik tekstowy o nazwie serwer.log i wyświetl tylko te linie, które zawierają krytyczny błąd oznaczony słowem 'FATAL'.",
    level: "ponadpodstawowa",
    solutions: {
      bash: ["grep \"FATAL\" serwer.log", "grep 'FATAL' serwer.log", "grep FATAL serwer.log"],
      zsh: ["grep \"FATAL\" serwer.log", "grep 'FATAL' serwer.log", "grep FATAL serwer.log"],
      cmd: ["findstr \"FATAL\" serwer.log", "findstr FATAL serwer.log"],
      powershell: [
        "Select-String -Pattern \"FATAL\" serwer.log",
        "Select-String -Pattern 'FATAL' serwer.log",
        "Select-String FATAL serwer.log",
        "sls \"FATAL\" serwer.log"
      ]
    },
    tips: "W Bashu i Zsh wyszukiwanie tekstu to domena narzędzia grep. W CMD służy do tego findstr. W PowerShellu dedykowanym cmdletem jest Select-String (alias: sls)."
  },
  {
    id: "kill-process-2026",
    title: "⚙️ Awaryjne ubicie procesu",
    goal: "Wymuś zamknięcie procesu o identyfikatorze PID 2026",
    description: "Jeden z procesów systemowych o numerze PID 2026 zawiesił się i zużywa 100% procesora. Wyślij sygnał natychmiastowego zakończenia (zabicia) tego procesu.",
    level: "ponadpodstawowa",
    solutions: {
      bash: ["kill -9 2026", "kill -SIGKILL 2026", "kill -KILL 2026"],
      zsh: ["kill -9 2026", "kill -SIGKILL 2026", "kill -KILL 2026"],
      cmd: ["taskkill /F /PID 2026", "taskkill /f /pid 2026", "taskkill -f -pid 2026"],
      powershell: [
        "Stop-Process -Id 2026 -Force",
        "Stop-Process 2026 -Force",
        "kill -Id 2026 -Force",
        "Stop-Process -Id 2026"
      ]
    },
    tips: "W systemach POSIX polecenie kill z flagą -9 wysyła nieprzechwytywalny sygnał SIGKILL. W CMD służy do tego taskkill z wymuszeniem /F i wskazaniem identyfikatora /PID. W PowerShellu używasz Stop-Process z parametrem -Id i ewentualnie -Force."
  },
  {
    id: "create-folder",
    title: "📁 Nowy katalog 'szkola'",
    goal: "Utwórz folder o nazwie 'szkola' w aktualnej ścieżce",
    description: "Chcesz założyć nowy podkatalog roboczy o nazwie 'szkola'. Wybierz najprostsze polecenie tworzenia katalogów.",
    level: "podstawowa",
    solutions: {
      bash: ["mkdir szkola", "mkdir \"szkola\""],
      zsh: ["mkdir szkola", "mkdir \"szkola\""],
      cmd: ["mkdir szkola", "md szkola", "mkdir \"szkola\""],
      powershell: [
        "New-Item -ItemType Directory -Name \"szkola\"",
        "New-Item -ItemType Directory szkola",
        "mkdir szkola",
        "md szkola"
      ]
    },
    tips: "mkdir to standard we wszystkich powłokach (w PowerShellu jest wbudowaną funkcją opakowującą). W PowerShellu kanonicznym odpowiednikiem obiektowym jest New-Item z parametrem -ItemType Directory."
  },
  {
    id: "write-powitanie",
    title: "✍️ Zapisywanie tekstu do pliku",
    goal: "Zapisz tekst 'Zdamy E12' do nowego pliku info.txt",
    description: "Musisz stworzyć nowy plik o nazwie info.txt, a w jego zawartości umieścić hasło 'Zdamy E12'. Jeżeli plik już istnieje, jego stara treść powinna zostać nadpisana.",
    level: "podstawowa",
    solutions: {
      bash: ["echo \"Zdamy E12\" > info.txt", "echo 'Zdamy E12' > info.txt", "echo Zdamy E12 > info.txt"],
      zsh: ["echo \"Zdamy E12\" > info.txt", "echo 'Zdamy E12' > info.txt", "echo Zdamy E12 > info.txt"],
      cmd: ["echo Zdamy E12 > info.txt", "echo \"Zdamy E12\" > info.txt"],
      powershell: [
        "\"Zdamy E12\" | Out-File info.txt",
        "Set-Content -Path info.txt -Value \"Zdamy E12\"",
        "echo \"Zdamy E12\" > info.txt",
        "\"Zdamy E12\" > info.txt"
      ]
    },
    tips: "Użycie operatora przekierowania '>' to uniwersalny sposób nadpisywania plików we wszystkich powłokach. W PowerShellu bezpieczniejszym dla kodowania znaków jest jednak Out-File lub Set-Content."
  }
];

function normalize(cmd: string): string {
  return cmd
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/["']/g, ""); // strip quotes for fuzzy match
}

export function localEvaluateChallenge(
  challenge: Challenge,
  shell: ShellType,
  userCommand: string
): ChallengeEvaluationResult {
  const normUser = normalize(userCommand);
  const correctSolutions = challenge.solutions[shell];

  // Check for exact matching
  const hasExactMatch = correctSolutions.some((sol) => normalize(sol) === normUser);

  if (hasExactMatch) {
    return {
      isCorrect: true,
      feedback: `✨ Doskonale! Twoja komenda "${userCommand}" jest w 100% poprawna dla powłoki ${shell.toUpperCase()}. Realizuje dokładnie ten cel, który został postawiony w wyzwaniu. Brawo za świetną znajomość składni!`,
      alternative: correctSolutions[0],
      isOffline: true
    };
  }

  // Smart fuzzy rules
  if (challenge.id === "backup-etc") {
    if (shell === "bash" || shell === "zsh") {
      if (normUser.includes("cp") && (normUser.includes("-r") || normUser.includes("-a") || normUser.includes("-u"))) {
        return {
          isCorrect: true,
          feedback: `✔️ Poprawnie! Użycie polecenia cp z flagą rekurencji (-r) pomyślnie skopiuje katalog wraz z jego zawartością.`,
          alternative: "cp -r /etc /backup",
          isOffline: true
        };
      }
      if (normUser.includes("cp") && !normUser.includes("-r") && !normUser.includes("-a") && !normUser.includes("-R")) {
        return {
          isCorrect: false,
          feedback: `❌ Blisko, ale niezupełnie. Użyłeś polecenia "cp", ale kopiujesz katalog (folder) /etc. Bez flagi rekurencyjnej (np. "-r" lub "-R") system odmówi skopiowania katalogu i zgłosi błąd: "cp: -r not specified; omitting directory '/etc'".`,
          alternative: "cp -r /etc /backup",
          isOffline: true
        };
      }
    } else if (shell === "powershell") {
      if (normUser.includes("copy-item") || normUser.includes("cp") || normUser.includes("copy")) {
        if (normUser.includes("recurse")) {
          return {
            isCorrect: true,
            feedback: `✔️ Świetnie! W PowerShellu cmdlet Copy-Item wymaga parametru -Recurse do skopiowania struktury folderu. Twój zapis jest poprawny.`,
            alternative: "Copy-Item -Path /etc -Destination /backup -Recurse",
            isOffline: true
          };
        } else {
          return {
            isCorrect: false,
            feedback: `❌ Niestety nie. W PowerShellu polecenie Copy-Item bez flagi "-Recurse" utworzy tylko pusty folder docelowy lub skopiuje sam katalog bez jego zawartości. Zawsze pamiętaj o parametrze "-Recurse" przy kopiowaniu drzewa folderów!`,
            alternative: "Copy-Item -Path /etc -Destination /backup -Recurse",
            isOffline: true
          };
        }
      }
    } else if (shell === "cmd") {
      if (normUser.includes("copy") && !normUser.includes("xcopy")) {
        return {
          isCorrect: false,
          feedback: `❌ Klasyczne polecenie "copy" w Windows CMD kopiuje wyłącznie pliki, nie potrafi kopiować całych folderów ani podfolderów. Aby skopiować strukturę katalogu, musisz użyć "xcopy" (z przełącznikami /s /e) lub nowoczesnego polecenia "robocopy".`,
          alternative: "xcopy /s /e /i /h /y /etc \\backup",
          isOffline: true
        };
      }
      if (normUser.includes("xcopy") || normUser.includes("robocopy")) {
        return {
          isCorrect: true,
          feedback: `✔️ Poprawnie! Komenda "xcopy" lub "robocopy" to idealny wybór w CMD do kopiowania całych katalogów wraz z podkatalogami.`,
          alternative: "xcopy /s /e /i /h /y /etc \\backup",
          isOffline: true
        };
      }
    }
  }

  if (challenge.id === "list-hidden") {
    if (shell === "bash" || shell === "zsh") {
      if (normUser.includes("ls") && (normUser.includes("-a") || normUser.includes("-la") || normUser.includes("-a"))) {
        return {
          isCorrect: true,
          feedback: `✔️ Poprawnie! Program "ls" z parametrem "-a" (all) listuje wszystkie pliki, także te ukryte (których nazwy zaczynają się od kropki).`,
          alternative: "ls -la",
          isOffline: true
        };
      }
      if (normUser.includes("ls") && !normUser.includes("-a")) {
        return {
          isCorrect: false,
          feedback: `❌ Błąd. Samo polecenie "ls" listuje jedynie pliki widoczne. Pliki ukryte (np. te zaczynające się od kropki) zostaną pominięte. Aby je wyświetlić, koniecznie dodaj flagę "-a" lub "-la".`,
          alternative: "ls -la",
          isOffline: true
        };
      }
    } else if (shell === "powershell") {
      if (normUser.includes("get-childitem") || normUser.includes("gci") || normUser.includes("ls") || normUser.includes("dir")) {
        if (normUser.includes("force")) {
          return {
            isCorrect: true,
            feedback: `✔️ Poprawnie! W PowerShellu musisz podać przełącznik "-Force" do pobrania ukrytych elementów systemu plików.`,
            alternative: "Get-ChildItem -Force",
            isOffline: true
          };
        } else {
          return {
            isCorrect: false,
            feedback: `❌ Niestety nie. W PowerShellu domyślnie Get-ChildItem (oraz jego aliasy ls/dir) ignoruje pliki z atrybutem "Hidden". Musisz jawnie dopisać przełącznik "-Force", aby je zobaczyć.`,
            alternative: "Get-ChildItem -Force",
            isOffline: true
          };
        }
      }
    } else if (shell === "cmd") {
      if (normUser.includes("dir")) {
        if (normUser.includes("/a")) {
          return {
            isCorrect: true,
            feedback: `✔️ Poprawnie! Przełącznik "/a" (attributes) w poleceniu "dir" pozwala kontrolować jakie pliki są wyświetlane. Bez niego pliki ukryte nie byłyby widoczne.`,
            alternative: "dir /a",
            isOffline: true
          };
        } else {
          return {
            isCorrect: false,
            feedback: `❌ Niestety nie. Standardowe polecenie "dir" w CMD nie wyświetla plików z atrybutem "Ukryty" (Hidden). Musisz dodać przełącznik "/a" (lub "/ah"), aby je uwzględnić w wyjściu.`,
            alternative: "dir /a",
            isOffline: true
          };
        }
      }
    }
  }

  if (challenge.id === "search-fatal") {
    if (shell === "bash" || shell === "zsh") {
      if (normUser.includes("grep") && normUser.includes("fatal") && normUser.includes("serwer.log")) {
        return {
          isCorrect: true,
          feedback: `✔️ Poprawnie! grep to najlepsze narzędzie UNIX do wyszukiwania wzorców w plikach tekstowych.`,
          alternative: "grep \"FATAL\" serwer.log",
          isOffline: true
        };
      }
    } else if (shell === "cmd") {
      if (normUser.includes("findstr") && normUser.includes("fatal") && normUser.includes("serwer.log")) {
        return {
          isCorrect: true,
          feedback: `✔️ Poprawnie! findstr w CMD świetnie nadaje się do szybkiego filtrowania linii tekstu.`,
          alternative: "findstr \"FATAL\" serwer.log",
          isOffline: true
        };
      }
    } else if (shell === "powershell") {
      if ((normUser.includes("select-string") || normUser.includes("sls")) && normUser.includes("fatal") && normUser.includes("serwer.log")) {
        return {
          isCorrect: true,
          feedback: `✔️ Poprawnie! Select-String w PowerShellu zwraca kompletne obiekty dopasowania i jest idealnym odpowiednikiem polecenia grep.`,
          alternative: "Select-String -Pattern \"FATAL\" serwer.log",
          isOffline: true
        };
      }
    }
  }

  // Fallback for any other custom input
  return {
    isCorrect: false,
    feedback: `❌ Twoje polecenie nie wydaje się w pełni poprawne dla powłoki ${shell.toUpperCase()} w kontekście tego zadania. Sprawdź pisownię, wymagane parametry, ścieżki i nazwy plików, a następnie spróbuj ponownie lub skorzystaj ze wskazówki!`,
    alternative: correctSolutions[0],
    isOffline: true
  };
}
