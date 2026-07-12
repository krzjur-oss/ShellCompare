import { CommandComparison, ConceptComparison } from "../types";

export const INITIAL_SANDBOX_RESULT: CommandComparison = {
  detectedSource: "Bash",
  bash: {
    command: "ls -la",
    output: "total 24\ndrwxr-xr-x  4 user staff  128 Jul 12 11:30 .\ndrwxr-xr-x  6 user staff  192 Jul 12 11:15 ..\n-rw-r--r--  1 user staff  424 Jul 12 11:30 index.html\n-rw-r--r--  1 user staff 1024 Jul 12 11:30 package.json\ndrwxr-xr-x+ 5 user staff  160 Jul 12 11:20 src",
    explanation: "Wyświetla listę wszystkich plików i folderów w bieżącym katalogu (łącznie z ukrytymi zaczynającymi się od kropki '-a') w formacie długiej listy ('-l') pokazującym uprawnienia, właściciela, rozmiar i datę modyfikacji."
  },
  zsh: {
    command: "ls -la",
    output: "total 24\ndrwxr-xr-x  4 macuser staff  128 Jul 12 11:30 .\ndrwxr-xr-x  6 macuser staff  192 Jul 12 11:15 ..\n-rw-r--r--  1 macuser staff  424 Jul 12 11:30 index.html\n-rw-r--r--  1 macuser staff 1024 Jul 12 11:30 package.json\ndrwxr-xr-x+ 5 macuser staff  160 Jul 12 11:20 src",
    explanation: "W Zsh polecenie 'ls -la' działa identycznie jak w Bashu, podając szczegółową listę plików i katalogów. Zsh na macOS obsługuje także flagi specyficzne dla systemów BSD, jak np. 'ls -laG' do wyświetlania kolorowego wyniku."
  },
  cmd: {
    command: "dir /a",
    output: " Volume in drive C has no label.\n Volume Serial Number is 1234-5678\n\n Directory of C:\\Users\\Admin\n\n12/07/2026  11:30 AM    <DIR>          .\n12/07/2026  11:15 AM    <DIR>          ..\n12/07/2026  11:30 AM               424 index.html\n12/07/2026  11:30 AM             1,024 package.json\n12/07/2026  11:20 AM    <DIR>          src\n               2 File(s)          1,448 bytes\n               3 Dir(s)  45,123,456,789 bytes free",
    explanation: "Polecenie 'dir' w CMD wyświetla listę plików i katalogów. Przełącznik '/a' (attributes) powoduje wyświetlenie wszystkich plików, w tym ukrytych i systemowych, naśladując zachowanie '-a' z Linuksa."
  },
  powershell: {
    command: "Get-ChildItem -Force",
    output: "    Directory: C:\\Users\\Admin\n\nMode                 LastWriteTime         Length Name\n----                 -------------         ------ ----\nd-r---        12/07/2026  11:20 AM                src\n-a----        12/07/2026  11:30 AM            424 index.html\n-a----        12/07/2026  11:30 AM           1024 package.json",
    explanation: "Pobiera elementy i właściwości w jednej lub kilku określonych lokalizacjach. Parametr '-Force' pozwala na wyświetlenie ukrytych plików i folderów, które normalnie byłyby pominięte."
  },
  comparisonMarkdown: "### Różnice architektoniczne i składniowe dla listowania plików:\n\n1. **Strumień tekstu vs Obiekty:**\n   * **Bash, Zsh i CMD** przesyłają czysty tekst (string) do konsoli. Jeśli chcesz filtrować wynik, musisz przetrawiać tekst np. przy pomocy narzędzi takich jak `grep`, `awk` lub `findstr`.\n   * **PowerShell** zwraca pełnoprawne obiekty typu `System.IO.DirectoryInfo` oraz `System.IO.FileInfo`. Możesz odwoływać się bezpośrednio do ich właściwości, np. `(Get-ChildItem).Length` lub `Get-ChildItem | Where-Object {$_.Length -gt 1MB}`.\n\n2. **Koncepcja ukrytych plików:**\n   * W **Linux (Bash) oraz macOS (Zsh)** plik jest ukryty po prostu wtedy, gdy jego nazwa zaczyna się od kropki (np. `.env`).\n   * W **Windows (CMD/PowerShell)** ukrycie pliku to specjalny atrybut metadanych systemu plików (NTFS) o nazwie `Hidden`."
};

export const INITIAL_CONCEPT_RESULT: ConceptComparison = {
  conceptName: "Potoki (Pipelines)",
  summary: "Potok (Pipe) reprezentowany przez znak pionowej kreski '|' służy do przesyłania wyjścia jednego polecenia jako wejście do innego polecenia. Pozwala to na łączenie małych, wyspecjalizowanych narzędzi w potężne skrypty przetwarzające dane.",
  bashExplanation: "W Bashu potoki działają na zasadzie przesyłu strumienia bajtów tekstowych (stdout -> stdin).\n\nPrzykład:\n```bash\ncat serwer.log | grep \"ERROR\" | wc -l\n```\nKażdy proces działa równolegle w osobnym procesie potomnym systemu operacyjnego. Dane płyną asynchronicznie linia po linii przez anonimowe łącza systemowe (kernel pipes).",
  zshExplanation: "W Zsh potoki działają niemal identycznie jak w Bashu (przesył tekstu linia po linii). Jednak Zsh oferuje ułatwienia, takie jak automatyczne potoki wielokrotne (tzw. MULTIOS), np. `cat plik | tee >(filtr1) >(filtr2)` bez konieczności jawnego konfigurowania skomplikowanych potoków systemowych, oraz natywne wsparcie dla rozbudowanego globowania w locie przed wysłaniem do potoku.",
  cmdExplanation: "W CMD potoki również działają na tekście, ale są zaimplementowane mniej efektywnie niż w systemach Unix.\n\nPrzykład:\n```cmd\ntype serwer.log | findstr \"ERROR\"\n```\nCMD często tworzy tymczasowe pliki na dysku pod maską, aby przekierować dane, co może spowalniać przetwarzanie dużych plików tekstowych. Nie ma też wbudowanego narzędzia do bezpośredniego liczenia wierszy bez trików z programem `find`.",
  powershellExplanation: "W PowerShellu potoki przesyłają **pełne obiekty .NET** zamiast zwykłego tekstu.\n\nPrzykład:\n```powershell\nGet-Service | Where-Object Status -eq 'Running' | Select-Object Name, DisplayName\n```\nKolejne polecenia w potoku nie muszą parsować tekstu regularnymi wyrażeniami. Mogą bezpośrednio odczytywać silnie typowane właściwości obiektów (properties), co eliminuje błędy związane ze zmianą formatu wyjściowego.",
  comparisonMarkdown: "### Porównanie potoków w pigułce:\n\n| Cecha | Bash (Linux) | Zsh (macOS) | CMD (Windows) | PowerShell |\n| :--- | :--- | :--- | :--- | :--- |\n| **Typ danych** | Strumień bajtów (tekst) | Strumień bajtów (tekst) | Strumień bajtów (tekst) | Obiekty środowiska .NET |\n| **Wydajność** | Bardzo wysoka (natywne potoki) | Bardzo wysoka (natywne potoki) | Średnia (pliki tymczasowe) | Średnia/Wysoka (narzut maszyn) |\n| **Łatwość filtrowania** | Wymaga awk/sed/grep | Wymaga awk/sed/grep | Bardzo ograniczona (findstr) | Bardzo wysoka (właściwości obiektu) |\n| **Przetwarzanie** | Linia po linii (stream) | Linia po linii (stream) | Blokowe/Pliki tymczasowe | Przekazywanie całych obiektów |",
  proTips: [
    "Zsh posiada opcję 'MULTIOS' włączoną domyślnie, co oznacza, że możesz napisać `cat plik > kopia1 > kopia2` i zawartość zostanie skopiowana do obu plików jednocześnie!",
    "Przechodząc z Basha do PowerShella zapomnij o grep/awk. Używaj Where-Object i Select-Object, by filtrować właściwości bez parsowania tekstu.",
    "W CMD unikaj długich potoków na setkach megabajtów danych, ponieważ procesor i dysk mogą zostać nadmiernie obciążone przez tworzenie plików tymczasowych.",
    "W Bashu potok tworzy nowe podpowłoki (subshells) dla każdego polecenia. Zmienne ustawione po prawej stronie znaku '|' nie będą dostępne w głównej powłoce!"
  ]
};
