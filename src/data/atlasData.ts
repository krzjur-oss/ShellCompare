import { AtlasItem } from "../types";

export const ATLAS_CATEGORIES = [
  { id: "all", name: "Wszystkie kategorie" },
  { id: "files", name: "📁 Pliki i Katalogi" },
  { id: "text", name: "📝 Praca z Tekstem" },
  { id: "system", name: "⚙️ System i Procesy" },
  { id: "network", name: "🌐 Sieć i Połączenia" },
  { id: "variables", name: "🔑 Zmienne i Środowisko" }
];

export const ATLAS_ITEMS: AtlasItem[] = [
  // FILES & DIRECTORIES
  {
    id: "create-dir",
    title: "Tworzenie nowego katalogu (folderu)",
    category: "files",
    description: "Tworzy nowy, pusty folder w bieżącej lokalizacji.",
    bash: "mkdir projekty",
    cmd: "mkdir projekty",
    powershell: "New-Item -ItemType Directory -Name \"projekty\"",
    zsh: "mkdir projekty",
    explanation: "Bash, Zsh i CMD współdzielą proste polecenie 'mkdir'. W PowerShellu kanonicznym poleceniem jest 'New-Item' z typem 'Directory', chociaż PowerShell udostępnia również skrót (alias) 'mkdir', który pod maską wywołuje funkcję opakowującą.",
    level: "podstawowa"
  },
  {
    id: "change-dir",
    title: "Nawigacja: Zmiana katalogu roboczego (cd)",
    category: "files",
    description: "Przechodzi do innego folderu (katalogu) w strukturze drzewa plików.",
    bash: "cd projekty",
    cmd: "cd projekty",
    powershell: "Set-Location projekty",
    zsh: "cd projekty",
    explanation: "Polecenie 'cd' (change directory) służy do przemieszczania się po folderach. Pozwala wejść do wybranego podfolderu w bieżącej lokalizacji. W PowerShellu oficjalnym poleceniem cmdlet jest 'Set-Location' (alias: cd).",
    level: "podstawowa"
  },
  {
    id: "cd-parent",
    title: "Powrót do katalogu nadrzędnego (cd ..)",
    category: "files",
    description: "Cofa nas o jeden poziom wyżej w hierarchii folderów.",
    bash: "cd ..",
    cmd: "cd ..",
    powershell: "Set-Location ..",
    zsh: "cd ..",
    explanation: "Symbol dwóch kropek '..' w systemach operacyjnych reprezentuje folder nadrzędny (rodzica). Użycie 'cd ..' pozwala szybko cofnąć się o jeden poziom wyżej w strukturze plików.",
    level: "podstawowa"
  },
  {
    id: "list-dir",
    title: "Wyświetlanie zawartości katalogu",
    category: "files",
    description: "Listuje pliki i podkatalogi w bieżącym katalogu wraz ze szczegółami.",
    bash: "ls -la",
    cmd: "dir",
    powershell: "Get-ChildItem",
    zsh: "ls -la",
    explanation: "W Bashu i Zsh 'ls -la' wyświetla szczegółową listę (l) ze wszystkimi plikami ukrytymi (a). W CMD 'dir' to klasyczne polecenie DOS pokazujące pliki, rozmiary i wolną przestręń. W PowerShellu 'Get-ChildItem' zwraca tablicę obiektów reprezentujących elementy systemu plików. PowerShell ma wbudowane aliasy 'ls' i 'dir' kierujące do Get-ChildItem.",
    level: "podstawowa"
  },
  {
    id: "current-path",
    title: "Wyświetlanie bieżącej ścieżki roboczej",
    category: "files",
    description: "Pokazuje pełną bezwzględną ścieżkę do bieżącego katalogu roboczego.",
    bash: "pwd",
    cmd: "cd",
    powershell: "Get-Location",
    zsh: "pwd",
    explanation: "Zarówno w Bashu, jak i w Zsh 'pwd' oznacza 'print working directory'. W CMD wywołanie 'cd' bez parametrów zwraca aktualną ścieżkę. W PowerShellu oficjalnym poleceniem cmdlet jest 'Get-Location' (aliasy: pwd, gl).",
    level: "podstawowa"
  },
  {
    id: "create-empty-file",
    title: "Tworzenie pustego pliku tekstowego",
    category: "files",
    description: "Szybko tworzy nowy, pusty plik o dowolnym rozszerzeniu bez uruchamiania edytora graficznego.",
    bash: "touch notatka.txt",
    cmd: "type nul > notatka.txt",
    powershell: "New-Item -ItemType File -Name \"notatka.txt\"",
    zsh: "touch notatka.txt",
    explanation: "W systemach Linux/macOS standardem do tworzenia plików i aktualizacji czasu ich modyfikacji jest 'touch'. W Windows CMD nie ma bezpośredniego odpowiednika, więc powszechnie przekierowuje się pustą wartość 'nul' do pliku za pomocą 'type nul > plik'. W PowerShellu kanoniczną komendą jest 'New-Item' z typem 'File'.",
    level: "podstawowa"
  },
  {
    id: "copy-file",
    title: "Kopiowanie plików",
    category: "files",
    description: "Kopiuje plik z lokalizacji źródłowej do docelowej.",
    bash: "cp zrodlo.txt kopia.txt",
    cmd: "copy zrodlo.txt kopia.txt",
    powershell: "Copy-Item zrodlo.txt kopia.txt",
    zsh: "cp zrodlo.txt kopia.txt",
    explanation: "W systemach Unix (Bash i Zsh) skrót 'cp' służy do kopiowania. CMD posiada polecenie 'copy' (lub 'xcopy' dla folderów). PowerShell oferuje 'Copy-Item' (aliasy: cp, copy), który potrafi kopiować pliki, foldery i inne obiekty (np. klucze rejestru).",
    level: "podstawowa"
  },
  {
    id: "move-rename",
    title: "Przenoszenie lub zmiana nazwy pliku",
    category: "files",
    description: "Zmienia ścieżkę lub nazwę pliku bądź katalogu.",
    bash: "mv stary.txt nowy.txt",
    cmd: "move stary.txt nowy.txt",
    powershell: "Move-Item stary.txt nowy.txt",
    zsh: "mv stary.txt nowy.txt",
    explanation: "Zarówno przenoszenie do innego katalogu, jak i zwykła zmiana nazwy (rename) są w systemach operacyjnych tą samą operacją. Bash i Zsh używają 'mv', CMD 'move' (oraz 'ren' tylko do zmiany nazwy w tym samym folderze), a PowerShell 'Move-Item' (aliasy: mv, move).",
    level: "podstawowa"
  },
  {
    id: "delete-file",
    title: "Usuwanie plików",
    category: "files",
    description: "Usuwa wskazany plik z dysku (bezpowrotnie, omijając Kosz).",
    bash: "rm dane.csv",
    cmd: "del dane.csv",
    powershell: "Remove-Item dane.csv",
    zsh: "rm dane.csv",
    explanation: "Bash i Zsh używają standardowego 'rm' (remove). CMD używa 'del' (delete) lub 'erase'. PowerShell używa 'Remove-Item' (aliasy: rm, del, erase, rmdir).",
    level: "podstawowa"
  },
  {
    id: "open-default",
    title: "Otwieranie plików/URL w domyślnym programie",
    category: "files",
    description: "Otwiera plik, folder w Finderze/Eksploratorze lub stronę WWW w domyślnej aplikacji.",
    bash: "xdg-open index.html",
    cmd: "start index.html",
    powershell: "Start-Process \"index.html\"",
    zsh: "open index.html",
    explanation: "Na macOS (powłoka Zsh) polecenie 'open' to absolutny fundament ułatwiający pracę (np. 'open .' otwiera bieżący katalog w Finderze). Linux w Bashu używa zazwyczaj 'xdg-open'. W systemie Windows CMD opiera się na słowie kluczowym 'start', a PowerShell na cmdlet 'Start-Process' (który pod maską również ma alias 'start').",
    level: "ponadpodstawowa"
  },

  // TEXT PROCESSING
  {
    id: "cat-file",
    title: "Wyświetlanie zawartości pliku tekstowego",
    category: "text",
    description: "Wypisuje pełną treść pliku tekstowego bezpośrednio na ekran terminala.",
    bash: "cat logi.txt",
    cmd: "type logi.txt",
    powershell: "Get-Content logi.txt",
    zsh: "cat logi.txt",
    explanation: "W Bashu i Zsh 'cat' (concatenate) to uniwersalne narzędzie. W CMD polecenie 'type' wypisuje zawartość pliku na ekran. W PowerShellu używa się 'Get-Content' (aliasy: cat, gc, type), które wczytuje plik jako tablicę ciągów tekstowych (linii).",
    level: "podstawowa"
  },
  {
    id: "tail",
    title: "Wyświetlanie końcówki pliku (tail)",
    category: "text",
    description: "Pokazuje ostatnie kilka wierszy pliku tekstowego (przydatne do analizy logów).",
    bash: "tail -n 10 serwer.log",
    cmd: "powershell Get-Content serwer.log -Tail 10",
    powershell: "Get-Content serwer.log -Tail 10",
    zsh: "tail -n 10 serwer.log",
    explanation: "W Linuxie i macOS 'tail' to kluczowe narzędzie dla administratorów do śledzenia logów systemowych na bieżąco. Windows CMD nie posiada natywnego odpowiednika, więc wywołuje się w nim cmdlet PowerShell. W PowerShellu odpowiada za to parametr '-Tail' w połączeniu z 'Get-Content'.",
    level: "ponadpodstawowa"
  },
  {
    id: "search-text",
    title: "Wyszukiwanie tekstu (frazy) w pliku",
    category: "text",
    description: "Filtruje linie w pliku tekstowym i wyświetla tylko te zawierające szukaną frazę.",
    bash: "grep \"ERROR\" serwer.log",
    cmd: "findstr \"ERROR\" serwer.log",
    powershell: "Select-String -Pattern \"ERROR\" serwer.log",
    zsh: "grep \"ERROR\" serwer.log",
    explanation: "Zarówno Bash, jak i Zsh używają potężnego narzędzia 'grep'. CMD ma archaiczne, ale sprawne 'findstr'. PowerShell bazuje na 'Select-String', który wspiera zaawansowane dopasowania wyrażeń regularnych (RegEx) i zwraca obiekty dopasowania zawierające m.in. numer linii.",
    level: "ponadpodstawowa"
  },
  {
    id: "write-text",
    title: "Zapisywanie tekstu do pliku (Nadpisywanie)",
    category: "text",
    description: "Zapisuje podany tekst do pliku. Jeśli plik istniał, jego zawartość zostanie zastąpiona nową.",
    bash: "echo \"Witaj Swiecie\" > info.txt",
    cmd: "echo Witaj Swiecie > info.txt",
    powershell: "\"Witaj Swiecie\" | Out-File info.txt",
    zsh: "echo \"Witaj Swiecie\" > info.txt",
    explanation: "We wszystkich powłokach operator '>' służy do przekierowania standardowego wyjścia i nadpisania pliku. W PowerShellu zalecanym, w pełni bezpiecznym dla kodowania znaków (UTF-8) sposobem jest potok do 'Out-File' lub 'Set-Content'.",
    level: "podstawowa"
  },
  {
    id: "count-lines",
    title: "Liczenie linii w pliku tekstowym",
    category: "text",
    description: "Zwraca całkowitą liczbę linii (wierszy) znajdujących się w pliku.",
    bash: "wc -l plik.txt",
    cmd: "find /c /v \"\" plik.txt",
    powershell: "(Get-Content plik.txt).Length",
    zsh: "wc -l plik.txt",
    explanation: "W systemach Unix (Bash i Zsh) 'wc -l' (word count - lines) to standardowy program. W CMD nie ma bezpośredniego odpowiednika, więc stosuje się trik z 'find /c' (count) z wyszukiwaniem linii, które NIE są puste (/v \"\"). W PowerShellu odczytujemy plik do tablicy za pomocą Get-Content w nawiasach i sprawdzamy właściwość '.Length' lub '.Count'.",
    level: "ponadpodstawowa"
  },
  {
    id: "clipboard-copy",
    title: "Kopiowanie do schowka (Clipboard)",
    category: "text",
    description: "Kopiuje strumień tekstu bezpośrednio do schowka systemowego, by móc go wkleić w innym programie.",
    bash: "echo \"tekst\" | xclip -sel clip",
    cmd: "echo tekst | clip",
    powershell: "echo \"tekst\" | Set-Clipboard",
    zsh: "echo \"tekst\" | pbcopy",
    explanation: "System macOS (domyślny dla Zsh) oferuje rewelacyjne narzędzia konsolowe 'pbcopy' (pasteboard copy) oraz 'pbpaste'. Pod Linuksem najczęstszym wyborem w Bashu jest 'xclip' lub 'xsel'. Na Windowsie CMD ma proste polecenie 'clip', a PowerShell obiektowe 'Set-Clipboard'.",
    level: "ponadpodstawowa"
  },

  // SYSTEM & PROCESSES
  {
    id: "whoami",
    title: "Sprawdzanie nazwy użytkownika (whoami)",
    category: "system",
    description: "Wyświetla nazwę obecnie zalogowanego użytkownika w systemie.",
    bash: "whoami",
    cmd: "whoami",
    powershell: "whoami",
    zsh: "whoami",
    explanation: "Uniwersalne, bardzo proste polecenie 'whoami' (czyli 'kim jestem') działa identycznie w systemach Windows, macOS i Linux, ułatwiając sprawdzenie tożsamości w danej konsoli.",
    level: "podstawowa"
  },
  {
    id: "clear-screen",
    title: "Czyszczenie konsoli (clear / cls)",
    category: "system",
    description: "Usuwa cały widoczny tekst z okna terminala, pozostawiając pusty ekran.",
    bash: "clear",
    cmd: "cls",
    powershell: "Clear-Host",
    zsh: "clear",
    explanation: "W systemach Unix-owych (Linux/macOS) ekran czyści się słowem 'clear'. W systemie Windows CMD używa 'cls' (skrót od 'clear screen'). W PowerShellu natywnym poleceniem jest 'Clear-Host', ale obsługuje on również aliasy 'cls' i 'clear' dla wygody użytkowników.",
    level: "podstawowa"
  },
  {
    id: "run-python",
    title: "Uruchamianie skryptu Python",
    category: "system",
    description: "Uruchamia kod programu napisany w języku Python bezpośrednio z poziomu konsoli.",
    bash: "python3 program.py",
    cmd: "python program.py",
    powershell: "python program.py",
    zsh: "python3 program.py",
    explanation: "Programowanie w Pythonie jest kluczowym elementem podstawy programowej w szkole średniej. Z poziomu konsoli uruchamiamy interpreter python podając nazwę pliku jako parametr. Na Linux/macOS domyślnie używa się nazwy binarki 'python3'.",
    level: "ponadpodstawowa"
  },
  {
    id: "chmod",
    title: "Nadawanie uprawnień do pliku (chmod)",
    category: "system",
    description: "Ustawia uprawnienia odczytu, zapisu i wykonywania plików (standard w Linux / macOS).",
    bash: "chmod +x skrypt.sh",
    cmd: "attrib +r plik.txt",
    powershell: "Set-Acl plik.txt",
    zsh: "chmod +x skrypt.sh",
    explanation: "Uczniowie szkół ponadpodstawowych uczą się o uprawnieniach plików w Linuksie (użytkownik, grupa, inni). Komenda 'chmod +x' pozwala nadać plikowi prawo do uruchomienia (wykonywania). W Windows uprawnienia opierają się na ACL, a w CMD komendą 'attrib' kontroluje się prostsze atrybuty (np. '+r' to tylko do odczytu).",
    level: "ponadpodstawowa"
  },
  {
    id: "list-processes",
    title: "Lista uruchomionych procesów",
    category: "system",
    description: "Wyświetla aktywne procesy działające w systemie operacyjnym.",
    bash: "ps aux",
    cmd: "tasklist",
    powershell: "Get-Process",
    zsh: "ps aux",
    explanation: "W systemach Unix (Linux z Bashem oraz macOS z Zsh) 'ps aux' daje szczegółowy podgląd procesów wszystkich użytkowników. CMD w Windowsie oferuje 'tasklist'. PowerShell ma cmdlet 'Get-Process' (alias: ps), zwracający bogate obiekty procesów ze statystykami pamięci i CPU.",
    level: "ponadpodstawowa"
  },
  {
    id: "kill-process",
    title: "Zamykanie (ubijanie) procesu",
    category: "system",
    description: "Wymusza zamknięcie procesu o określonym identyfikatorze (PID) lub nazwie.",
    bash: "kill -9 1234",
    cmd: "taskkill /F /PID 1234",
    powershell: "Stop-Process -Id 1234 -Force",
    zsh: "kill -9 1234",
    explanation: "W środowiskach POSIX (Bash i Zsh) 'kill -9' wysyła sygnał SIGKILL natychmiastowo zamykający proces o ID 1234. W CMD Windowsa służy do tego 'taskkill' z flagą wymuszenia '/F'. W PowerShellu służy do tego 'Stop-Process' (aliasy: kill, spps).",
    level: "ponadpodstawowa"
  },
  {
    id: "system-info",
    title: "Pobieranie informacji o systemie operacyjnym",
    category: "system",
    description: "Wyświetla szczegółowe parametry systemu, wersję jądra, sprzętu i systemu operacyjnego.",
    bash: "uname -a",
    cmd: "systeminfo",
    powershell: "Get-ComputerInfo",
    zsh: "uname -a",
    explanation: "W systemach Unix-like (Bash/Linux i Zsh/macOS) 'uname -a' podaje ogólny typ systemu, wersję jądra i architektury. W CMD 'systeminfo' generuje raport o wersji Windows, pamięci RAM, poprawkach KB i BIOSie. PowerShell ma nowoczesny 'Get-ComputerInfo', zbierający gigantyczną listę właściwości systemowych.",
    level: "ponadpodstawowa"
  },
  {
    id: "macos-version",
    title: "Wersja systemu macOS",
    category: "system",
    description: "Wyświetla dokładne informacje o zainstalowanej wersji systemu macOS przy użyciu narzędzia sw_vers.",
    bash: "uname -a",
    cmd: "ver",
    powershell: "[System.Environment]::OSVersion",
    zsh: "sw_vers",
    explanation: "System macOS (domyślny dla Zsh) wykorzystuje wbudowane narzędzie systemowe 'sw_vers' do pobierania nazwy i wersji macOS. Na Linuxie standardem jest 'uname -a' lub czytanie '/etc/os-release', w CMD systemu Windows używa się 'ver', a w PowerShellu klasy [System.Environment] lub Get-ComputerInfo.",
    level: "ponadpodstawowa"
  },

  // NETWORK
  {
    id: "ping-host",
    title: "Testowanie łączności sieciowej (Ping)",
    category: "network",
    description: "Wysyła pakiety ICMP Echo Request do hosta w celu sprawdzenia opóźnienia i dostępności sieciowej.",
    bash: "ping -c 4 google.com",
    cmd: "ping google.com",
    powershell: "Test-Connection google.com",
    zsh: "ping -c 4 google.com",
    explanation: "W Linuxie i macOS 'ping' działa domyślnie w nieskończoność, stąd flaga '-c 4' ograniczająca liczbę pakietów. W CMD Windows domyślnie wysyłane są 4 pakiety. W PowerShellu oficjalnym, obiektowym ekwiwalentem jest 'Test-Connection', zwracający obiekty statusu połączenia.",
    level: "podstawowa"
  },
  {
    id: "ip-config",
    title: "Sprawdzanie adresów IP i kart sieciowych",
    category: "network",
    description: "Wyświetla konfigurację sieciową komputera, przypisane adresy IP, maski podsieci i bramy domyślne.",
    bash: "ip addr show",
    cmd: "ipconfig",
    powershell: "Get-NetIPAddress",
    zsh: "ifconfig",
    explanation: "W nowoczesnym Linuxie standardem jest 'ip addr show' (dawniej 'ifconfig'). W systemie macOS (Zsh) podstawowym narzędziem niskopoziomowym do odczytu stanu kart sieciowych wciąż pozostaje 'ifconfig'. W CMD Windowsa króluje 'ipconfig', a w PowerShellu 'Get-NetIPAddress' lub 'Get-NetIPConfiguration'.",
    level: "podstawowa"
  },
  {
    id: "nslookup",
    title: "Odpytywanie serwera DNS (nslookup)",
    category: "network",
    description: "Rozwiązuje nazwę domeny (np. google.com) na adres IP za pomocą systemu DNS.",
    bash: "nslookup google.com",
    cmd: "nslookup google.com",
    powershell: "Resolve-DnsName google.com",
    zsh: "nslookup google.com",
    explanation: "Niezbędne narzędzie do nauki działania sieci komputerowych w szkołach ponadpodstawowych. Pozwala prześledzić, jak nazwy mnemoniczne (domeny) tłumaczone są na adresy IP. PowerShell posiada nowoczesny i bardziej szczegółowy odpowiednik 'Resolve-DnsName'.",
    level: "ponadpodstawowa"
  },
  {
    id: "traceroute",
    title: "Śledzenie trasy pakietów (traceroute / tracert)",
    category: "network",
    description: "Wypisuje trasę (kolejne routery), jaką pakiety sieciowe pokonują w drodze do celu.",
    bash: "traceroute google.com",
    cmd: "tracert google.com",
    powershell: "Test-NetConnection google.com -TraceRoute",
    zsh: "traceroute google.com",
    explanation: "Kluczowe narzędzie diagnostyczne służące do badania routingu w sieciach rozległych (WAN), często omawiane w szkole ponadpodstawowej. Pokazuje opóźnienia na każdym węźle pośrednim (hop). PowerShell udostępnia to w ramach wielofunkcyjnego cmdlet 'Test-NetConnection'.",
    level: "ponadpodstawowa"
  },
  {
    id: "download-file",
    title: "Pobieranie plików z internetu",
    category: "network",
    description: "Pobiera plik z podanego adresu URL bezpośrednio na dysk.",
    bash: "curl -O https://example.com/plik.zip",
    cmd: "curl -O https://example.com/plik.zip",
    powershell: "Invoke-WebRequest -Uri \"https://example.com/plik.zip\" -OutFile \"plik.zip\"",
    zsh: "curl -O https://example.com/plik.zip",
    explanation: "Zarówno w Bashu jak i Zsh najczęściej używa się 'curl' lub 'wget'. Nowe wersje CMD w Windows 10/11 mają wbudowany port 'curl'. W PowerShellu podstawą jest 'Invoke-WebRequest' (aliasy: iwr, wget, curl) lub szybszy 'Start-BitsTransfer' dla dużych plików.",
    level: "ponadpodstawowa"
  },

  // VARIABLES & ENVIRONMENT
  {
    id: "set-variable",
    title: "Ustawianie zmiennej środowiskowej (tymczasowej)",
    category: "variables",
    description: "Definiuje zmienną środowiskową widoczną w bieżącej sesji terminala.",
    bash: "export API_KEY=\"secret123\"",
    cmd: "set API_KEY=secret123",
    powershell: "$env:API_KEY = \"secret123\"",
    zsh: "export API_KEY=\"secret123\"",
    explanation: "Zarówno w Bashu, jak i w Zsh 'export' sprawia, że zmienna staje się dostępna dla procesów potomnych. W CMD 'set' przypisuje wartość natychmiastowo. W PowerShellu środowisko traktowane jest jako dedykowany napęd 'env:', stąd zapis '$env:ZMIENNA = wartość'.",
    level: "ponadpodstawowa"
  },
  {
    id: "get-variable",
    title: "Odczytywanie wartości zmiennej środowiskowej",
    category: "variables",
    description: "Pobiera i wyświetla wartość zapisanej zmiennej w terminalu.",
    bash: "echo $API_KEY",
    cmd: "echo %API_KEY%",
    powershell: "$env:API_KEY",
    zsh: "echo $API_KEY",
    explanation: "Sposób odwoływania się do zmiennych silnie definiuje składnię powłoki: Bash i Zsh używają prefixu '$', CMD otacza nazwę znakami procenta '%', a PowerShell korzysta z przestrzeni nazw '$env:'.",
    level: "ponadpodstawowa"
  }
];
