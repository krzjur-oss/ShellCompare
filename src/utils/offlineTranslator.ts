import { CommandComparison, ConceptComparison } from "../types";
import { ATLAS_ITEMS } from "../data/atlasData";
import { INITIAL_SANDBOX_RESULT, INITIAL_CONCEPT_RESULT } from "../data/mockResponses";

// Normalize text for easier fuzzy matches
function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Perform intelligent client-side fallback command translation when the backend is unavailable (e.g. on GitHub Pages)
 */
export function offlineTranslateCommand(input: string, sourceShell: string): CommandComparison {
  const normalized = normalizeText(input);

  // 1. Try to find an exact or close match from our comprehensive Atlas Database!
  const matchedItem = ATLAS_ITEMS.find((item) => {
    return (
      normalizeText(item.bash) === normalized ||
      normalizeText(item.cmd) === normalized ||
      normalizeText(item.powershell) === normalized ||
      normalizeText(item.title) === normalized ||
      normalized.includes(normalizeText(item.bash)) ||
      normalized.includes(normalizeText(item.cmd)) ||
      normalized.includes(normalizeText(item.powershell))
    );
  });

  if (matchedItem) {
    return {
      detectedSource: sourceShell === "Opis słowny" ? "Opis słowny" : sourceShell,
      bash: {
        command: matchedItem.bash,
        output: `$ ${matchedItem.bash}\n# Wykonano pomyślnie w trybie offline.\n# Wynik symulowany:\n(Zadanie: ${matchedItem.title})`,
        explanation: `${matchedItem.explanation} (Uruchomiono z bazy lokalnej Atlasu)`
      },
      cmd: {
        command: matchedItem.cmd,
        output: `C:\\> ${matchedItem.cmd}\n\n[CMD Executed successfully in offline mode]\n(Zadanie: ${matchedItem.title})`,
        explanation: `Klasyczny odpowiednik CMD: ${matchedItem.explanation}`
      },
      powershell: {
        command: matchedItem.powershell,
        output: `PS C:\\> ${matchedItem.powershell}\n\nSuccess: True\nType: SimulatedOfflineResult\nName: ${matchedItem.id}`,
        explanation: `Obiektowy odpowiednik PowerShell: ${matchedItem.explanation}`
      },
      comparisonMarkdown: `### 🌐 Analiza Offline: ${matchedItem.title}\n\nAplikacja działa obecnie w **trybie statycznym (np. GitHub Pages)**. Wykryto polecenie z wbudowanej bazy danych Atlasu!\n\n**Różnice między środowiskami:**\n* **Bash**: Tradycyjne środowisko UNIX-owe, oparte o strumienie znakowe.\n* **CMD**: Wiersz poleceń systemów Windows, o ograniczonej składni i kompatybilności wstecznej.\n* **PowerShell**: Zaawansowane narzędzie obiektowe oparte o .NET Core.\n\n*Wskazówka: Cała baza ponad dwudziestu poleceń i tryb Quizu są w pełni interaktywne w wersji statycznej!*`
    };
  }

  // 2. Fallback to smart rule-based translations for common patterns
  if (normalized.startsWith("ls") || normalized.includes("wyświetl pliki") || normalized.includes("pokaz pliki")) {
    return {
      detectedSource: "Bash / Opis",
      bash: {
        command: "ls -la",
        output: "total 8\ndrwxr-xr-x 2 user staff 64 Jul 12 11:30 .\n-rw-r--r-- 1 user staff 424 Jul 12 11:30 index.html",
        explanation: "Listuje wszystkie pliki (również ukryte) w formacie długim."
      },
      cmd: {
        command: "dir /a",
        output: " Directory of C:\\\n12/07/2026  11:30 AM               424 index.html",
        explanation: "Wyświetla pliki o dowolnych atrybutach (w tym ukryte)."
      },
      powershell: {
        command: "Get-ChildItem -Force",
        output: "    Directory: C:\\\nMode                 LastWriteTime         Length Name\n----                 -------------         ------ ----\n-a----        12/07/2026  11:30 AM            424 index.html",
        explanation: "Pobiera pliki z uwzględnieniem ukrytych za pomocą parametru -Force."
      },
      comparisonMarkdown: "### Różnice w listowaniu plików\n\n* **Bash** używa prostej konwencji kropek dla ukrytych plików.\n* **Windows (CMD/PowerShell)** odczytuje fizyczne atrybuty systemu plików NTFS."
    };
  }

  if (normalized.startsWith("mkdir") || normalized.includes("utwórz folder") || normalized.includes("stworz katalog")) {
    const folderName = input.split(" ").slice(1).join(" ") || "nowy_folder";
    return {
      detectedSource: sourceShell,
      bash: {
        command: `mkdir ${folderName}`,
        output: `$ mkdir ${folderName}\n# Utworzono katalog pomyślnie.`,
        explanation: "Tworzy nowy katalog w ścieżce roboczej."
      },
      cmd: {
        command: `mkdir ${folderName}`,
        output: `C:\\> mkdir ${folderName}\n[Katalog utworzony]`,
        explanation: "Tworzy katalog przy użyciu systemowego polecenia wbudowanego."
      },
      powershell: {
        command: `New-Item -ItemType Directory -Name "${folderName}"`,
        output: `    Directory: C:\\\nMode                 LastWriteTime         Length Name\n----                 -------------         ------ ----\nd-----        12/07/2026  11:30 AM                ${folderName}`,
        explanation: "Używa elastycznego polecenia New-Item o typie Directory."
      },
      comparisonMarkdown: "### Różnice w tworzeniu katalogów\n\nBash i CMD korzystają z prostego `mkdir`. PowerShell faworyzuje silnie typowane polecenie `New-Item`, ale posiada alias `mkdir`."
    };
  }

  if (normalized.startsWith("rm") || normalized.includes("usuń plik") || normalized.includes("skasuj")) {
    const fileName = input.split(" ").slice(1).join(" ") || "plik.txt";
    return {
      detectedSource: sourceShell,
      bash: {
        command: `rm ${fileName}`,
        output: `$ rm ${fileName}\n# Usunięto.`,
        explanation: "Usuwa plik."
      },
      cmd: {
        command: `del ${fileName}`,
        output: `C:\\> del ${fileName}`,
        explanation: "Usuwa plik za pomocą polecenia del."
      },
      powershell: {
        command: `Remove-Item ${fileName}`,
        output: `PS C:\\> Remove-Item ${fileName}`,
        explanation: "Usuwa plik (lub inny zasób) za pomocą Remove-Item."
      },
      comparisonMarkdown: "### Różnice w usuwaniu plików\n\n`rm` (Bash), `del` (CMD) oraz `Remove-Item` (PowerShell)."
    };
  }

  if (normalized.startsWith("ping") || normalized.includes("pinguj")) {
    const host = input.split(" ").find(w => w.includes(".") || w === "localhost") || "google.com";
    return {
      detectedSource: "Zasoby sieciowe",
      bash: {
        command: `ping -c 4 ${host}`,
        output: `PING ${host} (142.250.186.46) 56(84) bytes of data.\n64 bytes from ${host}: icmp_seq=1 ttl=116 time=14.2 ms\n64 bytes from ${host}: icmp_seq=2 ttl=116 time=14.5 ms\n\n--- ${host} ping statistics ---\n4 packets transmitted, 4 received, 0% packet loss, time 3004ms`,
        explanation: "Wysyła 4 pakiety testowe ICMP (flaga -c określa liczbę powtórzeń)."
      },
      cmd: {
        command: `ping -n 4 ${host}`,
        output: `Pinging ${host} with 32 bytes of data:\nReply from 142.250.186.46: bytes=32 time=14ms TTL=116\nReply from 142.250.186.46: bytes=32 time=15ms TTL=116\n\nPing statistics for 142.250.186.46:\n    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`,
        explanation: "Wysyła pakiety ping do hosta. Flaga -n kontroluje liczbę zapytań (domyślnie 4)."
      },
      powershell: {
        command: `Test-Connection -ComputerName ${host} -Count 4`,
        output: `Source        Destination     IPV4Address      Answering        RTT(ms)\n------        -----------     -----------      ---------        -------\nDESKTOP-ABC   ${host}      142.250.186.46   True                  14`,
        explanation: "Nowoczesne cmdlet testujące połączenie sieciowe. Zwraca obiekty pomiarów połączenia."
      },
      comparisonMarkdown: "### Narzędzia sieciowe i diagnostyka\n\n* **Bash i CMD** korzystają z tradycyjnych binarek `ping` o nieco innych flagach (`-c` vs `-n`).\n* **PowerShell** posiada cmdlet `Test-Connection`, który w przeciwieństwie do zwykłego pingowania zwraca sformatowaną tabelę obiektów diagnostycznych."
    };
  }

  // 3. Elegant generic generator when no specific rule is matched
  return {
    detectedSource: "Opis słowny (Offline)",
    bash: {
      command: `# Kliknij w zakładkę "Atlas Komend" po lewej stronie, aby wybrać z gotowej bazy.\n# Przykładowe polecenie:\necho "${input}"`,
      output: `Hello from static client mode!\nInput: ${input}`,
      explanation: "Wersja demonstracyjna offline. Cały Atlas i Quiz są w 100% dostępne i responsywne offline!"
    },
    cmd: {
      command: `echo ${input}`,
      output: `${input}`,
      explanation: "Prosta symulacja polecenia echo w wierszu poleceń CMD."
    },
    powershell: {
      command: `Write-Output "${input}"`,
      output: `${input}`,
      explanation: "PowerShell cmdlet 'Write-Output' (alias 'echo') przesyłający tekst do potoku."
    },
    comparisonMarkdown: `### 🚀 Witaj w trybie demonstracyjnym (GitHub Pages)!\n\nTo polecenie zostało przetworzone przez **lokalny silnik offline** aplikacji ShellCompare.\n\nAby ułatwić naukę bez potrzeby stałego serwera backendowego z kluczem API Gemini, przygotowaliśmy dla Ciebie:\n\n1. **Pełny Atlas Komend** – interaktywna baza ponad dwudziestu fundamentalnych operacji systemowych (znajdziesz go w menu po lewej).\n2. **🎓 Tryb Quizu** – w zakładce Atlas możesz sprawdzić swoją wiedzę i zgadywać odpowiedniki komend w Bashu, CMD i PowerShellu!\n3. **Przykłady Live** – wypróbuj wpisywanie standardowych komend takich jak \`ls -la\`, \`mkdir\`, \`rm\`, \`ping google.com\`, by zobaczyć dedykowaną symulację.`
  };
}

/**
 * Perform offline concept lookup for the Theoretical tab
 */
export function offlineGetConcept(conceptName: string): ConceptComparison {
  if (conceptName === "Potoki (Pipelines)") {
    return INITIAL_CONCEPT_RESULT;
  }

  // Provide high-quality offline fallbacks for other pre-defined concepts
  if (conceptName === "Zmienne środowiskowe") {
    return {
      conceptName: "Zmienne środowiskowe",
      summary: "Zmienne środowiskowe to dynamiczne wartości przechowywane w systemie operacyjnym, które mogą wpływać na zachowanie uruchomionych procesów i programów (np. ścieżka wyszukiwania PATH).",
      bashExplanation: "W Bashu zmienne definiuje się bez spacji, a odczytuje ze znakiem '$'. Zmienne lokalne stają się środowiskowe po użyciu 'export'.\n\n```bash\nMOJA_ZMIENNA=\"wartość\"\nexport MOJA_ZMIENNA\necho $MOJA_ZMIENNA\n```",
      cmdExplanation: "W CMD zmienne są globalne dla sesji terminala. Definiuje się je za pomocą 'set', a odczytuje otaczając znakami '%'.\n\n```cmd\nset MOJA_ZMIENNA=wartość\necho %MOJA_ZMIENNA%\n```",
      powershellExplanation: "W PowerShellu zmienne środowiskowe są dostępne poprzez specjalny dostawca (provider) 'env:'.\n\n```powershell\n$env:MOJA_ZMIENNA = \"wartość\"\nWrite-Output $env:MOJA_ZMIENNA\n```",
      comparisonMarkdown: "### Porównanie Zmiennych Środowiskowych:\n\n| Cecha | Bash (Linux) | CMD (Windows) | PowerShell |\n| :--- | :--- | :--- | :--- |\n| **Deklaracja** | `VAR=val` (potem `export VAR`) | `set VAR=val` | `$env:VAR = 'val'` |\n| **Odczyt** | `$VAR` | `%VAR%` | `$env:VAR` |\n| **Zakres** | Lokalny (wymaga export dla podprocesów) | Globalny w sesji CMD | Globalny w sesji poprzez provider Env |\n| **Usuwanie** | `unset VAR` | `set VAR=` | `Remove-Item env:VAR` |",
      proTips: [
        "W Bashu pamiętaj, aby nie stawiać spacji wokół znaku '=' podczas przypisywania wartości.",
        "W CMD przypisanie 'set VAR= ' ze spacją na końcu przypisze tę spację jako część wartości zmiennej!",
        "W PowerShellu zmienne środowiskowe i standardowe zmienne skryptowe ($mojaZmienna) to dwa różne obszary pamięci."
      ]
    };
  }

  if (conceptName === "Skryptowanie i Pętle") {
    return {
      conceptName: "Skryptowanie i Pętle",
      summary: "Pozwalają na automatyzację powtarzalnych czynności poprzez sekwencyjne wykonywanie poleceń oraz iterowanie po plikach, liczbach lub elementach list.",
      bashExplanation: "Pętla 'for' w Bashu często współpracuje z podstawieniem poleceń lub sekwencjami nawiasowymi.\n\n```bash\nfor i in {1..5}; do\n  echo \"Iteracja $i\"\ndone\n```",
      cmdExplanation: "Pętle 'for' w CMD mają skomplikowaną składnię z różnymi przełącznikami (np. /L dla liczb, /F dla plików).\n\n```cmd\nfor /L %i in (1,1,5) do (\n  echo Iteracja %i\n)\n```",
      powershellExplanation: "PowerShell korzysta z obiektowych struktur znanych z języków C# oraz elastycznego potoku ForEach-Object.\n\n```powershell\n1..5 | ForEach-Object {\n  Write-Output \"Iteracja $_\"\n}\n```",
      comparisonMarkdown: "### Składnia pętli iteracyjnych:\n\n* **Bash**: Bardzo intuicyjna, wzorowana na powłokach POSIX. Bezproblemowe przetwarzanie kolekcji plików tekstowych.\n* **CMD**: Trudna w opanowaniu, przestarzała składnia z wieloma ograniczeniami w blokach wielolinijkowych.\n* **PowerShell**: W pełni programistyczna składnia. Możliwość stosowania zarówno tradycyjnych pętli `foreach ($i in $kolekcja)`, jak i potoku dynamicznego `$_`.",
      proTips: [
        "Pisząc skrypty w CMD, pamiętaj, że zmienne pętli w plikach wsadowych .bat wymagają podwójnego znaku procenta (np. %%i zamiast %i).",
        "W PowerShellu zmienna `$_` reprezentuje aktualnie przetwarzany obiekt w potoku.",
        "W Bashu zawsze umieszczaj zmienne w cudzysłowach `\"$i\"`, aby zapobiec rozbiciu wyrazów (word splitting) przy spacjach."
      ]
    };
  }

  if (conceptName === "Przekierowania strumieni (stdout/stderr)") {
    return {
      conceptName: "Przekierowania strumieni (stdout/stderr)",
      summary: "Umożliwiają przekierowanie standardowego wyjścia (stdout - 1) lub standardowego strumienia błędów (stderr - 2) do pliku zamiast wyświetlania ich w konsoli.",
      bashExplanation: "Bash pozwala na precyzyjne przekierowania i łączenie strumieni.\n\n```bash\n# Zapis wyjścia i błędów do osobnych plików\ncommand > wynik.log 2> bledy.log\n# Połączenie obu strumieni\ncommand > wynik.log 2>&1\n```",
      cmdExplanation: "CMD obsługuje podstawowe operatory przekierowania, podobnie do systemów Unix.\n\n```cmd\n# Nadpisanie pliku wynikami\ncommand > wynik.log 2> bledy.log\n# Dopisywanie do pliku (operator >>)\ncommand >> wynik.log 2>&1\n```",
      powershellExplanation: "PowerShell rozszerza tradycyjne strumienie o strumienie specyficzne (np. Information, Warning, Verbose). Do zapisu pliku poleca się Out-File.\n\n```powershell\n# Przekierowanie strumienia błędów do pliku\nGet-ChildItem 2> bledy.log\n# Przekierowanie wszystkich strumieni (*)\nGet-ChildItem *> wszystko.log\n```",
      comparisonMarkdown: "### Podsumowanie przekierowań strumieni:\n\n* **Operator `>`**: Nadpisuje plik docelowy we wszystkich trzech powłokach.\n* **Operator `>>`**: Dopisuja treść na końcu pliku we wszystkich trzech powłokach.\n* **PowerShell** obsługuje unikalne przekierowanie `*>` oznaczające połączenie absolutnie wszystkich typów strumieni danych wyjściowych (wyjściowe, ostrzeżenia, błędy, debug, verbose).",
      proTips: [
        "Aby uciszyć błędy w Bashu, przekieruj je do czarnej dziury: `command 2> /dev/null`.",
        "W Windows (CMD i PowerShell) odpowiednikiem czarnej dziury /dev/null jest urządzenie `NUL` (np. `command > NUL`).",
        "W PowerShellu standardowe kodowanie przy użyciu operatora `>` to często UTF-16. Jeśli wolisz UTF-8, użyj `command | Out-File -Encoding utf8 plik.txt`."
      ]
    };
  }

  // General fallback for other concepts
  return {
    conceptName: conceptName,
    summary: `Porównanie koncepcyjne pojęcia "${conceptName}" w systemach Linux i Windows.`,
    bashExplanation: `W Bashu pojęcie "${conceptName}" opiera się na klasycznym podejściu POSIX/Unix. Narzędzia i procesy współdziałają ze sobą bez zbędnego narzutu warstw pośrednich.`,
    cmdExplanation: `W CMD obsługa "${conceptName}" jest determinowana dziedzictwem historycznym MS-DOS. Rozwiązania są proste, ale mają mniejszą elastyczność strukturalną.`,
    powershellExplanation: `W PowerShellu "${conceptName}" jest w pełni zaimplementowane w architekturze obiektowej .NET, co ułatwia zarządzanie i automatyzację w systemach Windows i Linux (PowerShell Core).`,
    comparisonMarkdown: `### ℹ️ Informacje o pojęciu: ${conceptName}\n\nPrezentowana karta została załadowana w trybie offline/statycznym.\n\nWięcej powiązanych pojęć i pełne porównania live są dostępne bezpośrednio z bazy danych aplikacji!`,
    proTips: [
      "Przeanalizuj filozofię projektową: tekst vs obiekty.",
      "Zwracaj uwagę na różnice w obsłudze wielkości liter (case-sensitivity) między powłokami.",
      "Większość nowoczesnych systemów wspiera standardy wieloplatformowe."
    ]
  };
}
