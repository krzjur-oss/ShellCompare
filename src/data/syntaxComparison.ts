export interface SyntaxDetail {
  command: string;
  flags: string;
  args: string;
  returnValue: string;
}

export interface ItemSyntaxComparison {
  bash: SyntaxDetail;
  cmd: SyntaxDetail;
  powershell: SyntaxDetail;
}

export const SYNTAX_COMPARISON_DATA: Record<string, ItemSyntaxComparison> = {
  "create-dir": {
    bash: {
      command: "mkdir",
      flags: "brak (opcjonalnie -p dla tworzenia zagnieżdżonych struktur)",
      args: "projekty (nazwa nowego katalogu)",
      returnValue: "Kod wyjścia (0 = sukces), brak tekstu w terminalu"
    },
    cmd: {
      command: "mkdir / md",
      flags: "brak",
      args: "projekty (nazwa lub ścieżka do utworzenia)",
      returnValue: "Kod wyjścia (0 = sukces), brak tekstu"
    },
    powershell: {
      command: "New-Item",
      flags: "-ItemType Directory -Name",
      args: "\"projekty\" (nazwa nowego elementu w cudzysłowie)",
      returnValue: "Pełny obiekt typu DirectoryInfo zawierający metadane folderu"
    }
  },
  "list-dir": {
    bash: {
      command: "ls",
      flags: "-la (-l: długi format ze szczegółami, -a: wyświetla pliki ukryte)",
      args: "brak (opcjonalnie ścieżka do innego folderu)",
      returnValue: "Surowy strumień tekstowy sformatowany w kolumny systemowe"
    },
    cmd: {
      command: "dir",
      flags: "brak (opcjonalnie /ah dla plików ukrytych, /w dla formatu szerokiego)",
      args: "brak (opcjonalnie ścieżka)",
      returnValue: "Strumień tekstowy w formacie DOS z podsumowaniem liczby plików"
    },
    powershell: {
      command: "Get-ChildItem",
      flags: "brak (opcjonalnie -Force dla ukrytych, -Recurse dla podkatalogów)",
      args: "brak (opcjonalnie ścieżka lub parametr -Path)",
      returnValue: "Kolekcja silnie typowanych obiektów DirectoryInfo oraz FileInfo"
    }
  },
  "current-path": {
    bash: {
      command: "pwd",
      flags: "brak (opcjonalnie -P dla odczytu fizycznego bez dowiązań symbolicznych)",
      args: "brak",
      returnValue: "Jednowierszowy ciąg tekstowy reprezentujący ścieżkę bezwzględną"
    },
    cmd: {
      command: "cd",
      flags: "brak (wywołanie bez argumentu 'cd' zwraca obecny stan)",
      args: "brak",
      returnValue: "Tekstowa ścieżka bezwzględna do aktualnego katalogu"
    },
    powershell: {
      command: "Get-Location",
      flags: "brak",
      args: "brak",
      returnValue: "Obiekt PathInfo przechowujący ścieżkę roboczą i dostawcę"
    }
  },
  "copy-file": {
    bash: {
      command: "cp",
      flags: "brak (opcjonalnie -r dla folderów, -f wymuszenie)",
      args: "zrodlo.txt (źródło) kopia.txt (cel)",
      returnValue: "Kod wyjścia (brak informacji tekstowej o sukcesie)"
    },
    cmd: {
      command: "copy",
      flags: "brak (opcjonalnie /Y pomija pytanie przed nadpisaniem)",
      args: "zrodlo.txt (źródło) kopia.txt (cel)",
      returnValue: "Podsumowanie tekstowe (np. '1 file(s) copied.')"
    },
    powershell: {
      command: "Copy-Item",
      flags: "brak (opcjonalnie -Recurse, -Force, -Confirm)",
      args: "zrodlo.txt (źródło) kopia.txt (cel)",
      returnValue: "Brak wartości zwracanej (chyba że podamy flagę -PassThru)"
    }
  },
  "move-rename": {
    bash: {
      command: "mv",
      flags: "brak (opcjonalnie -f do nadpisania bez pytania)",
      args: "stary.txt (źródło) nowy.txt (cel)",
      returnValue: "Kod wyjścia (brak informacji o sukcesie)"
    },
    cmd: {
      command: "move",
      flags: "brak (opcjonalnie /Y)",
      args: "stary.txt (źródło) nowy.txt (cel)",
      returnValue: "Potwierdzenie tekstowe o przeniesieniu pliku"
    },
    powershell: {
      command: "Move-Item",
      flags: "brak (opcjonalnie -Force do nadpisywania)",
      args: "stary.txt (źródło) nowy.txt (cel)",
      returnValue: "Brak wartości (lub obiekt przy przekazaniu -PassThru)"
    }
  },
  "delete-file": {
    bash: {
      command: "rm",
      flags: "brak (opcjonalnie -f wymuszenie, -r usuwanie katalogów)",
      args: "dane.csv (nazwa pliku do usunięcia)",
      returnValue: "Kod wyjścia systemu operacyjnego"
    },
    cmd: {
      command: "del / erase",
      flags: "brak (opcjonalnie /F dla tylko-do-odczytu, /Q cichy tryb)",
      args: "dane.csv (plik docelowy)",
      returnValue: "Kod wyjścia"
    },
    powershell: {
      command: "Remove-Item",
      flags: "brak (opcjonalnie -Force, -Recurse)",
      args: "dane.csv",
      returnValue: "Brak zwracanego wyjścia (usuwa obiekt bezpośrednio)"
    }
  },
  "open-default": {
    bash: {
      command: "xdg-open",
      flags: "brak (w macOS używa się polecenia 'open')",
      args: "index.html (plik lub adres URL do otwarcia)",
      returnValue: "Asynchroniczne uruchomienie, kod wyjścia powłoki"
    },
    cmd: {
      command: "start",
      flags: "brak (opcjonalnie /B bez tworzenia nowego okna konsoli)",
      args: "index.html (plik lub URL)",
      returnValue: "Uruchamia powiązaną aplikację w osobnym procesie"
    },
    powershell: {
      command: "Start-Process",
      flags: "brak (opcjonalnie -FilePath, -NoNewWindow, -Wait)",
      args: "\"index.html\"",
      returnValue: "Kod wyjścia (lub obiekt typu Process przy -PassThru)"
    }
  },
  "cat-file": {
    bash: {
      command: "cat",
      flags: "brak (opcjonalnie -n dodaje numery linii)",
      args: "logi.txt (plik źródłowy)",
      returnValue: "Strumień tekstowy (wypisuje całą treść pliku na ekran)"
    },
    cmd: {
      command: "type",
      flags: "brak",
      args: "logi.txt",
      returnValue: "Strumień tekstowy wysyłany na standardowe wyjście"
    },
    powershell: {
      command: "Get-Content",
      flags: "brak (opcjonalnie -Raw dla całego tekstu, -Tail dla ostatnich linii)",
      args: "logi.txt",
      returnValue: "Tablica obiektów typu String (każdy wiersz to osobny element)"
    }
  },
  "search-text": {
    bash: {
      command: "grep",
      flags: "brak (opcjonalnie -i ignoruj wielkość liter, -v odwróć pasujące)",
      args: "\"ERROR\" (szukana fraza) serwer.log (plik)",
      returnValue: "Dopasowane linie jako sformatowany tekst"
    },
    cmd: {
      command: "findstr",
      flags: "brak (opcjonalnie /I ignoruj wielkość, /R użyj wyrażeń regularnych)",
      args: "\"ERROR\" serwer.log",
      returnValue: "Linie zawierające dopasowany wzorzec tekstowy"
    },
    powershell: {
      command: "Select-String",
      flags: "-Pattern (domyślnie używa dopasowań wyrażeń regularnych)",
      args: "\"ERROR\" serwer.log",
      returnValue: "Kolekcja bogatych obiektów MatchInfo (wiersz, tekst, plik)"
    }
  },
  "write-text": {
    bash: {
      command: "echo",
      flags: "brak (używa operatora przekierowania '>'; echo -n usuwa nową linię)",
      args: "\"Witaj Swiecie\" (tekst) info.txt (plik docelowy)",
      returnValue: "Tworzy/nadpisuje plik i zapisuje do niego tekst"
    },
    cmd: {
      command: "echo",
      flags: "brak (używa operatora przekierowania '>')",
      args: "Witaj Swiecie info.txt",
      returnValue: "Tworzy/nadpisuje plik i zapisuje tekst (z końcówką CRLF)"
    },
    powershell: {
      command: "Out-File",
      flags: "potok '|' (opcjonalnie -Encoding utf8 dla kodowania znaków, -Append)",
      args: "info.txt",
      returnValue: "Zapisuje przekazane potokiem obiekty w formie pliku"
    }
  },
  "count-lines": {
    bash: {
      command: "wc",
      flags: "-l (wymusza liczenie wyłącznie wierszy)",
      args: "plik.txt",
      returnValue: "Ciąg tekstowy zawierający liczbę linii oraz nazwę pliku"
    },
    cmd: {
      command: "find",
      flags: "/c (zlicza linie) /v (pokazuje tylko wiersze bez szukanej frazy)",
      args: "\"\" (pusty wzorzec do dopasowania wszystkich linii) plik.txt",
      returnValue: "Tekst zawierający nazwę pliku i policzoną liczbę wierszy"
    },
    powershell: {
      command: "Get-Content",
      flags: "używa nawiasów i właściwości tablicowej .Length",
      args: "plik.txt",
      returnValue: "Liczba całkowita (Integer) określająca rozmiar kolekcji"
    }
  },
  "clipboard-copy": {
    bash: {
      command: "xclip",
      flags: "-sel clip (lub pbcopy na systemach macOS)",
      args: "\"tekst\" (potokowany z polecenia echo)",
      returnValue: "Kopiuje tekst bezpośrednio do bufora schowka systemowego"
    },
    cmd: {
      command: "clip",
      flags: "brak",
      args: "tekst (potokowany z polecenia echo)",
      returnValue: "Kopiuje tekst jako ANSI do schowka systemowego Windows"
    },
    powershell: {
      command: "Set-Clipboard",
      flags: "brak (opcjonalnie -Append)",
      args: "\"tekst\" (potokowany z echo)",
      returnValue: "Zapisuje tekst bądź obiekty .NET bezpośrednio w schowku"
    }
  },
  "list-processes": {
    bash: {
      command: "ps",
      flags: "aux (a: wszyscy użytkownicy, u: szczegóły, x: procesy bez terminala)",
      args: "brak",
      returnValue: "Tabela tekstowa z kompletem statystyk procesów"
    },
    cmd: {
      command: "tasklist",
      flags: "brak (opcjonalnie /FI dla filtracji, /V dla szczegółów)",
      args: "brak",
      returnValue: "Sformatowana tabela tekstowa procesów środowiska Windows"
    },
    powershell: {
      command: "Get-Process",
      flags: "brak (opcjonalnie -Name do filtrowania, -Id dla PID)",
      args: "brak",
      returnValue: "Kolekcja obiektów System.Diagnostics.Process ze statystykami"
    }
  },
  "kill-process": {
    bash: {
      command: "kill",
      flags: "-9 (sygnał SIGKILL wymuszający bezwarunkowe zamknięcie)",
      args: "1234 (identyfikator procesu PID)",
      returnValue: "Kod wyjścia procesu zabijającego"
    },
    cmd: {
      command: "taskkill",
      flags: "/F (wymuszenie zamknięcia) /PID (wskazuje, że argument to ID)",
      args: "1234 (PID procesu)",
      returnValue: "Komunikat o wysłaniu sygnału zatrzymania do procesu"
    },
    powershell: {
      command: "Stop-Process",
      flags: "-Id -Force (wymusza zamknięcie bez żądania potwierdzenia)",
      args: "1234",
      returnValue: "Brak wartości (lub obiekt Process przy dodaniu -PassThru)"
    }
  },
  "system-info": {
    bash: {
      command: "uname",
      flags: "-a (wyświetla wszystkie dostępne parametry)",
      args: "brak",
      returnValue: "Tekst z nazwą jądra, hosta, wersją wydania i architekturą"
    },
    cmd: {
      command: "systeminfo",
      flags: "brak",
      args: "brak",
      returnValue: "Długi, ustrukturyzowany raport o sprzęcie i systemie Windows"
    },
    powershell: {
      command: "Get-ComputerInfo",
      flags: "brak (opcjonalnie -Property dla wyboru pól)",
      args: "brak",
      returnValue: "Obiekt o rozbudowanej strukturze właściwości systemowych"
    }
  },
  "macos-version": {
    bash: {
      command: "uname",
      flags: "-a (oraz czytanie plików konfiguracyjnych os-release)",
      args: "brak",
      returnValue: "Dane o architekturze i systemie operacyjnym"
    },
    cmd: {
      command: "ver",
      flags: "brak",
      args: "brak",
      returnValue: "Krótki komunikat z wersją systemu Windows"
    },
    powershell: {
      command: "[System.Environment]::OSVersion",
      flags: "statyczny dostęp do pól środowiska",
      args: "brak",
      returnValue: "Obiekt typu OperatingSystem reprezentujący wersję platformy"
    }
  },
  "ping-host": {
    bash: {
      command: "ping",
      flags: "-c 4 (liczba pakietów równa 4, bez tego działa w nieskończoność)",
      args: "google.com (adres docelowy hosta)",
      returnValue: "Logi transmisji pakietów ICMP i podsumowanie opóźnień"
    },
    cmd: {
      command: "ping",
      flags: "brak (domyślnie wysyła 4 pakiety na systemach Windows)",
      args: "google.com",
      returnValue: "Statystyki opóźnienia i pakiety wyświetlone w konsoli"
    },
    powershell: {
      command: "Test-Connection",
      flags: "brak (opcjonalnie -Count, -Quiet dla statusu prawda/fałsz)",
      args: "google.com (docelowa nazwa komputera)",
      returnValue: "Kolekcja obiektów diagnostycznych statusu połączenia sieciowego"
    }
  },
  "ip-config": {
    bash: {
      command: "ip",
      flags: "addr show (dawniej 'ifconfig' - wyświetlanie wszystkich interfejsów)",
      args: "brak",
      returnValue: "Skomplikowana tabela konfiguracji kart i adresów IP"
    },
    cmd: {
      command: "ipconfig",
      flags: "brak (opcjonalnie /all wyświetla szczegółowe parametry DNS/DHCP)",
      args: "brak",
      returnValue: "Lista tekstowa adapterów sieciowych, adresów IP i bramy"
    },
    powershell: {
      command: "Get-NetIPAddress",
      flags: "brak (opcjonalnie -AddressFamily IPv4)",
      args: "brak",
      returnValue: "Kolekcja silnie typowanych obiektów adresacji interfejsów IP"
    }
  },
  "download-file": {
    bash: {
      command: "curl",
      flags: "-O (zapisuje plik pod oryginalną nazwą z ścieżki URL)",
      args: "https://example.com/plik.zip",
      returnValue: "Pobiera plik i wypisuje tekstowy pasek postępu operacji"
    },
    cmd: {
      command: "curl",
      flags: "-O",
      args: "https://example.com/plik.zip",
      returnValue: "Pobiera plik do bieżącego katalogu roboczego systemu"
    },
    powershell: {
      command: "Invoke-WebRequest",
      flags: "-Uri (adres źródłowy) -OutFile (docelowa lokalizacja)",
      args: "\"https://example.com/plik.zip\" \"plik.zip\"",
      returnValue: "Plik zapisany na dysku oraz obiekt HtmlWebResponseObject"
    }
  },
  "set-variable": {
    bash: {
      command: "export",
      flags: "brak",
      args: "API_KEY=\"secret123\" (nazwa oraz przypisanie wartości)",
      returnValue: "Ustawia zmienną środowiskową dziedziczoną przez procesy potomne"
    },
    cmd: {
      command: "set",
      flags: "brak",
      args: "API_KEY=secret123",
      returnValue: "Ustawia zmienną środowiskową widoczną lokalnie w procesie CMD"
    },
    powershell: {
      command: "$env:...",
      flags: "użycie prefixu dostawcy środowiska '$env:'",
      args: "API_KEY = \"secret123\"",
      returnValue: "Ustawia zmienną środowiskową w aktualnym procesie sesji"
    }
  },
  "get-variable": {
    bash: {
      command: "echo",
      flags: "brak (referencja do zmiennej ze znakiem '$')",
      args: "$API_KEY",
      returnValue: "Wypisuje przypisaną wartość tekstową na ekran terminala"
    },
    cmd: {
      command: "echo",
      flags: "brak (referencja otoczona znakami '%')",
      args: "%API_KEY%",
      returnValue: "Wypisuje wartość zmiennej na standardowe wyjście"
    },
    powershell: {
      command: "$env:...",
      flags: "brak (bezpośrednia referencja do ścieżki środowiskowej)",
      args: "$env:API_KEY",
      returnValue: "Zwraca wartość jako obiekt string na wyjściu rury"
    }
  }
};

export interface SyntaxRowDetail {
  desc: string;
  link: string;
}

export interface PlatformRowDetails {
  bash: SyntaxRowDetail;
  cmd: SyntaxRowDetail;
  powershell: SyntaxRowDetail;
}

// Hand-crafted detailed overrides for major commands to provide high-fidelity educational insight
const EXPLICIT_DETAILS: Record<string, Partial<Record<'command' | 'flags' | 'args' | 'returnValue', PlatformRowDetails>>> = {
  "create-dir": {
    command: {
      bash: { desc: "Polecenie 'mkdir' (make directory) tworzy nowy katalog w systemie plików UNIX/POSIX.", link: "https://man7.org/linux/man-pages/man1/mkdir.1.html" },
      cmd: { desc: "Polecenie 'mkdir' (lub skrót 'md') tworzy podkatalog w systemie Windows Command Prompt.", link: "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/mkdir" },
      powershell: { desc: "Polecenie cmdlet 'New-Item' to uniwersalne narzędzie PowerShell do tworzenia plików, folderów, wpisów rejestru itp.", link: "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/new-item" }
    },
    flags: {
      bash: { desc: "Najważniejszą flagą jest '-p' (parents), która tworzy całą strukturę katalogów nadrzędnych, jeśli nie istnieją, nie zgłaszając błędu gdy katalog już istnieje.", link: "https://man7.org/linux/man-pages/man1/mkdir.1.html" },
      cmd: { desc: "Polecenie 'mkdir' w CMD nie wymaga flag do tworzenia katalogów pośrednich; zachowuje się domyślnie tak jak 'mkdir -p' w systemach UNIX.", link: "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/mkdir" },
      powershell: { desc: "Użycie parametru '-ItemType Directory' informuje system, że tworzony ma być folder. Flaga '-Force' pozwala na ignorowanie błędów nadpisywania.", link: "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/new-item" }
    }
  },
  "list-dir": {
    command: {
      bash: { desc: "Polecenie 'ls' służy do listowania zawartości wybranego katalogu w systemach POSIX.", link: "https://man7.org/linux/man-pages/man1/ls.1.html" },
      cmd: { desc: "Polecenie 'dir' to jedno z najstarszych poleceń powłoki DOS/Windows służących do listowania plików na ekranie.", link: "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/dir" },
      powershell: { desc: "Komenda cmdlet 'Get-ChildItem' służy do pobierania obiektów podrzędnych w określonej lokalizacji, np. w systemie plików.", link: "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-childitem" }
    },
    flags: {
      bash: { desc: "Używamy flagi '-l' dla formatu długiego (prawa dostępu, właściciel, rozmiar) oraz '-a' aby zobaczyć ukryte pliki (rozpoczynające się od kropki '.').", link: "https://man7.org/linux/man-pages/man1/ls.1.html" },
      cmd: { desc: "Można użyć parametrów takich jak '/A' (filtrowanie po atrybutach np. /AH wyświetli pliki ukryte) oraz '/W' do widoku szerokiego.", link: "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/dir" },
      powershell: { desc: "Parametr '-Force' wyciąga pliki ukryte, a '-Recurse' przechodzi rekursywnie w głąb podkatalogów, zwracając bogate dane.", link: "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-childitem" }
    }
  },
  "search-text": {
    command: {
      bash: { desc: "Polecenie 'grep' (Global Regular Expression Print) to legendarne narzędzie POSIX do wyszukiwania wzorców tekstowych w plikach.", link: "https://man7.org/linux/man-pages/man1/grep.1.html" },
      cmd: { desc: "Narzędzie 'findstr' to wbudowany w Windows program konsolowy do wyszukiwania ciągów znaków w plikach tekstowych.", link: "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/findstr" },
      powershell: { desc: "Cmdlet 'Select-String' wyszukuje wzorce tekstowe w plikach i ciągach znaków, bazując na silnym silniku wyrażeń regularnych .NET.", link: "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/select-string" }
    },
    flags: {
      bash: { desc: "Flaga '-i' ignoruj wielkość liter, '-v' odwraca logikę dopasowania (pokazuje linie niespełniające warunku), a '-r' przeszukuje katalogi rekurencyjnie.", link: "https://man7.org/linux/man-pages/man1/grep.1.html" },
      cmd: { desc: "Przełącznik '/I' ignoruje wielkość liter podczas wyszukiwania, a '/R' instruuje CMD do interpretowania ciągu jako wyrażenia regularnego.", link: "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/findstr" },
      powershell: { desc: "Parametr '-Pattern' definiuje szukany wzorzec (wyrażenie regularne). Flaga '-SimpleMatch' wyłącza regex i dopasowuje dokładny tekst.", link: "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/select-string" }
    }
  },
  "kill-process": {
    command: {
      bash: { desc: "Polecenie 'kill' wysyła określone sygnały systemowe do działających procesów UNIX/Linux na podstawie ich PID.", link: "https://man7.org/linux/man-pages/man1/kill.1.html" },
      cmd: { desc: "Polecenie 'taskkill' służy do natychmiastowego kończenia jednego lub większej liczby zadań lub procesów w Windows.", link: "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/taskkill" },
      powershell: { desc: "Cmdlet 'Stop-Process' zatrzymuje jeden lub więcej aktywnych procesów w systemie operacyjnym Windows, macOS lub Linux.", link: "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/stop-process" }
    },
    flags: {
      bash: { desc: "Flaga '-9' (sygnał SIGKILL) powoduje natychmiastowe ubicie procesu przez jądro systemu, bez możliwości posprzątania zasobów.", link: "https://man7.org/linux/man-pages/man1/kill.1.html" },
      cmd: { desc: "Użycie parametru '/F' (force) wymusza bezwarunkowe zamknięcie procesu. Flaga '/PID' określa, że podany argument to identyfikator procesu.", link: "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/taskkill" },
      powershell: { desc: "Parametr '-Force' wymusza zatrzymanie procesu bez pytania użytkownika o potwierdzenie. Parametr '-Id' wskazuje na PID procesu.", link: "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/stop-process" }
    }
  },
  "download-file": {
    command: {
      bash: { desc: "Polecenie 'curl' (client URL) to niezwykle popularne narzędzie wiersza poleceń do przesyłania danych za pomocą różnych protokołów.", link: "https://curl.se/docs/manpage.html" },
      cmd: { desc: "Nowsze wersje Windows 10/11 zawierają wbudowany port narzędzia 'curl' działający bezpośrednio w Command Prompt.", link: "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/curl" },
      powershell: { desc: "Komenda cmdlet 'Invoke-WebRequest' (lub skrót iwr) wysyła żądania HTTP, HTTPS, FTP do usług sieciowych i zwraca pobrane pliki i obiekty.", link: "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-webrequest" }
    },
    flags: {
      bash: { desc: "Flaga '-O' (wielkie O) zapisuje pobierany plik pod jego oryginalną nazwą zdalną. Można też użyć '-o <nazwa>' do podania własnej nazwy.", link: "https://curl.se/docs/manpage.html" },
      cmd: { desc: "Używa tych samych parametrów co wersja POSIX, najczęściej '-O' do automatycznego nazwania pliku lub '-o <plik>' dla własnej nazwy.", link: "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/curl" },
      powershell: { desc: "Parametr '-OutFile' określa ścieżkę zapisu pobieranego pliku na dysku. '-Uri' wskazuje adres URL zasobu.", link: "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-webrequest" }
    }
  }
};

export function getDetailedRowData(itemId: string, rowType: 'command' | 'flags' | 'args' | 'returnValue'): PlatformRowDetails {
  const item = SYNTAX_COMPARISON_DATA[itemId];
  if (!item) {
    return {
      bash: { desc: "Brak danych szczegółowych dla powłoki Bash.", link: "https://man7.org/linux/man-pages/" },
      cmd: { desc: "Brak danych szczegółowych dla powłoki CMD.", link: "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/" },
      powershell: { desc: "Brak danych szczegółowych dla powłoki PowerShell.", link: "https://learn.microsoft.com/en-us/powershell/" }
    };
  }

  const override = EXPLICIT_DETAILS[itemId]?.[rowType];
  if (override) {
    // Fill other fields dynamically if override only has partial rows
    const fullOverride = { ...override } as any;
    ['bash', 'cmd', 'powershell'].forEach((platform) => {
      if (!fullOverride[platform]) {
        fullOverride[platform] = { desc: "Szczegółowy opis platformy.", link: "https://learn.microsoft.com" };
      }
    });
    return fullOverride;
  }

  const bashVal = item.bash[rowType] || "brak";
  const cmdVal = item.cmd[rowType] || "brak";
  const psVal = item.powershell[rowType] || "brak";

  const bashCmd = item.bash.command;
  const cmdCmd = item.cmd.command.split(" / ")[0];
  const psCmd = item.powershell.command;

  let bashDesc = "";
  let cmdDesc = "";
  let psDesc = "";

  let bashLink = `https://man7.org/linux/man-pages/man1/${bashCmd}.1.html`;
  let cmdLink = `https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/${cmdCmd}`;
  let psLink = `https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/${psCmd.toLowerCase()}`;

  // Fix known link structures or platforms
  if (bashCmd === "ip") {
    bashLink = "https://man7.org/linux/man-pages/man8/ip.8.html";
  } else if (bashCmd === "xclip") {
    bashLink = "https://linux.die.net/man/1/xclip";
  } else if (bashCmd === "ping") {
    bashLink = "https://man7.org/linux/man-pages/man8/ping.8.html";
  } else if (bashCmd === "export") {
    bashLink = "https://man7.org/linux/man-pages/man1/bash.1.html";
  } else if (bashCmd === "echo") {
    bashLink = "https://man7.org/linux/man-pages/man1/echo.1.html";
  }

  if (psCmd === "[System.Environment]::OSVersion") {
    psLink = "https://learn.microsoft.com/en-us/dotnet/api/system.environment.osversion";
  } else if (psCmd.startsWith("$env:")) {
    psLink = "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_environment_variables";
  } else if (psCmd === "Set-Clipboard") {
    psLink = "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/set-clipboard";
  } else if (psCmd === "Select-String") {
    psLink = "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/select-string";
  } else if (psCmd === "Test-Connection") {
    psLink = "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/test-connection";
  }

  if (rowType === "command") {
    bashDesc = `Polecenie '${bashCmd}' to natywne polecenie powłoki UNIX/POSIX do wykonania tej operacji.`;
    cmdDesc = `Polecenie '${cmdCmd}' to standardowy program wbudowany w Command Prompt systemu Windows.`;
    psDesc = `Polecenie '${psCmd}' to dedykowany cmdlet środowiska PowerShell do interakcji obiektowych.`;
  } else if (rowType === "flags") {
    bashDesc = `Flagi powłoki Bash pozwalają dostosować działanie '${bashCmd}'. Obecne ustawienie: ${bashVal}.`;
    cmdDesc = `Przełączniki powłoki CMD konfigurują opcje dla '${cmdCmd}'. Obecne ustawienie: ${cmdVal}.`;
    psDesc = `Parametry i flagi w PowerShell modyfikują działanie '${psCmd}'. Obecne ustawienie: ${psVal}.`;
  } else if (rowType === "args") {
    bashDesc = `Argumenty pozycyjne przekazywane do '${bashCmd}' reprezentują cele operacji: ${bashVal}.`;
    cmdDesc = `Argumenty w CMD definiują parametry ścieżkowe lub tekstowe dla '${cmdCmd}': ${cmdVal}.`;
    psDesc = `Parametry argumentowe cmdletu '${psCmd}' reprezentują silnie typowane wartości: ${psVal}.`;
  } else {
    bashDesc = `Wynik wykonania '${bashCmd}' zwraca: ${bashVal}. UNIX sygnalizuje powodzenie poprzez kod wyjścia 0.`;
    cmdDesc = `Polecenie '${cmdCmd}' po wykonaniu skutkuje: ${cmdVal}. Informacje wypisywane są tekstowo do konsoli.`;
    psDesc = `Cmdlet '${psCmd}' zwraca silnie typowany obiekt systemowy: ${psVal}, co pozwala na dalszą obróbkę w potoku.`;
  }

  return {
    bash: { desc: bashDesc, link: bashLink },
    cmd: { desc: cmdDesc, link: cmdLink },
    powershell: { desc: psDesc, link: psLink }
  };
}
