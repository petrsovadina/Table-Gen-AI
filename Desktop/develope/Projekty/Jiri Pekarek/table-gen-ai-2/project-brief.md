## About this project

<aside>
💡

**Vyvíjíme webovou aplikaci, která umožní uživatelům nahrávat tabulky, upravovat jejich strukturu, generovat hodnoty do vybraných sloupců pomocí AI modelu Anthropic Claude, spravovat prompty a exportovat výsledné tabulky. Aplikace musí být uživatelsky přívětivá, rychlá a schopná pracovat s velkými objemy dat.**

</aside>

---

- User Storie's
    
    ```markdown
    
    ### **User Stories pro TableGenAI**  
    Níže jsou klíčové scénáře použití z pohledu různých rolí. Každý příběh obsahuje **akceptační kritéria** pro jasnou definici úspěchu.
    
    ---
    
    #### **1. Nahrávání a správa tabulek**  
    **Jako** *uživatel*  
    **Chci** nahrát CSV/Excel tabulku a upravit její strukturu  
    **Abych** mohl připravit data pro generování hodnot AI.  
    
    **Akceptační kritéria:**  
    - Nahrání souboru do 500 MB.  
    - Náhled prvních 10 řádků před potvrzením.  
    - Možnost přidat/přejmenovat/smazat sloupce.  
    
    ---
    
    #### **2. Generování hodnot pomocí AI**  
    **Jako** *marketingový specialista*  
    **Chci** vybrat cílový sloupec a zadat prompt  
    **Abych** automaticky vygeneroval popisy produktů z existujících dat.  
    
    **Akceptační kritéria:**  
    - Výběr sloupce z tabulky.  
    - Zadání promptu s proměnnými (např. `{název}`).  
    - Spuštění generování pro vybrané řádky.  
    
    ---
    
    #### **3. Batch zpracování velkých dat**  
    **Jako** *datový analytik*  
    **Chci** zpracovat 50 000 řádků bez zatížení prohlížeče  
    **Abych** nemusel čekat na dokončení v reálném čase.  
    
    **Akceptační kritéria:**  
    - Průběžné zobrazení stavu (např. *„35 % dokončeno“*).  
    - Možnost pozastavit/obnovit úlohu.  
    - Upozornění na e-mail po dokončení.  
    
    ---
    
    #### **4. Ukládání a správa promptů**  
    **Jako** *HR manažer*  
    **Chci** uložit šablonu pro generování životopisů  
    **Abych** ji mohl znovu použít pro další kandidáty.  
    
    **Akceptační kritéria:**  
    - Pojmenování a uložení promptu.  
    - Editace existující šablony.  
    - Přidání proměnných z externích tabulek (např. `{B1[pozice]}`).  
    
    ---
    
    #### **5. Validace AI výstupů**  
    **Jako** *kontrolor dat*  
    **Chci** vidět neplatné hodnoty v generovaných sloupcích  
    **Abych** je mohl ručně opravit před exportem.  
    
    **Akceptační kritéria:**  
    - Zvýraznění buněk s chybami (např. červený rámeček).  
    - Filtr pro zobrazení pouze chybných řádků.  
    - Možnost přepsat hodnotu přímo v tabulce.  
    
    ---
    
    #### **6. Export výsledků**  
    **Jako** *e-commerce manažer*  
    **Chci** stáhnout tabulku ve formátu XLSX  
    **Abych** ji mohl importovat do interního systému.  
    
    **Akceptační kritéria:**  
    - Výběr formátu (CSV, XLSX, JSON).  
    - Možnost vybrat konkrétní sloupce pro export.  
    - Automatické formátování datumových sloupců.  
    ```
    

### Project Brief:

- Product description
    
    ```markdown
    Produktový popis: TableGenAI**  
    **Podtitul:** *„Generujte data do tabulek pomocí AI – rychle, chytře, bez manuální práce.“*  
    
    ---
    
    #### **Co je TableGenAI?**  
    TableGenAI je **webová aplikace pro automatické doplňování tabulkových dat** pomocí umělé inteligence (Anthropic Claude). Umožňuje uživatelům nahrát tabulku (CSV/Excel), vybrat sloupce k doplnění, definovat pravidla pro generování (tzv. **prompty**) a získat kompletní dataset s AI-vygenerovanými hodnotami.  
    
    **Příklad použití:**  
    - Marketingový tým nahraje tabulku s 10 000 produkty bez popisů.  
    - Definuje prompt: *„Vytvoř prodejní popis pro {název} v kategorii {kategorie}. Použij data z přiložené tabulky služeb.“*  
    - Aplikace automaticky doplní chybějící popisy do 2 hodin.  
    
    ---
    
    ### **Klíčové vlastnosti**  
    
    #### 1. **Inteligentní generování dat**  
    - **AI Model:** Integrace s Anthropic Claude pro vysokou kvalitu výstupů.  
    - **Kontextové prompty:**  
      - Propojení s externími tabulkami (např. `{B1[služby]}` načte data z jiného souboru).  
      - Podpora dynamických proměnných (např. `{název}`, `{datum}`).  
    - **Batch zpracování:** Zpracování až **100 000 řádků** s možností pozastavit/obnovit úlohu.  
    
    #### 2. **Správa workflow**  
    - **Uložené šablony:** Prompty lze pojmenovat, upravovat a znovu použít (např. „SEO popisy“ nebo „HR životopisy“).  
    - **Historie změn:** Vrácení k předchozím verzím tabulky po chybném generování.  
    
    #### 3. **Optimalizovaný tabulkový editor**  
    - **Virtuální scrollování:** Rychlé načítání i pro velké tabulky (50 000+ řádků).  
    - **Validace dat:** Varování před neplatnými formáty (např. text v číselném sloupci).  
    - **Export výsledků:** CSV, Excel, nebo JSON – včetně možnosti vybrat pouze určité sloupce.  
    
    #### 4. **Bezpečnost a kontrola**  
    - **Šifrování:** Uživatelské API klíče k Claude jsou uloženy pomocí AES-256.  
    - **Izolace dat:** Každý uživatel má vlastní úložiště bez rizika přístupu cizích osob.  
    
    ---
    
    ### **Pro koho je TableGenAI určen?**  
    - **Marketingové týmy:** Generování popisů produktů, tagů, SEO textů.  
    - **Výzkumníci:** Doplňování neúplných datových sad (např. chybějící geolokace).  
    - **E-commerce firmy:** Tvorba katalogů z nezpracovaných dat.  
    - **Administrativní pracovníci:** Automatizace opakujících se úkolů (např. generování emailů z kontaktů).  
    
    ---
    
    ### **Jak to funguje?**  
    1. **Nahrání tabulky**  
       - Uživatel nahraje CSV/Excel soubor a vybere cílový sloupec pro generování.  
       - *Příklad:* Sloupec „Popis hotelu“ je prázdný – AI ho doplní.  
    
    2. **Definice promptu**  
       - Uživatel zadá instrukce pro AI (např. *„Vytvoř popis pro {název} v {destinace}. Použij služby z tabulky B1.“*).  
       - Prompt lze uložit jako šablonu pro pozdější použití.  
    
    3. **Spuštění generování**  
       - Aplikace zpracuje data po dávkách (např. 50 řádků/požadavek) a zobrazí průběh.  
       - Uživatel může proces kdykoli pozastavit nebo upravit prompt.  
    
    4. **Stažení výsledků**  
       - Hotová tabulka se stáhne v požadovaném formátu.  
       - Data se automaticky archivují pro budoucí úpravy.  
    
    ---
    
    ### **Technické výhody**  
    - **Výkon:** Optimalizováno pro velké datasety (lazy loading, dávkové zpracování).  
    - **Integrace:** Hotová řešení pro populární formáty (CSV, Excel, JSON).  
    - **Škálovatelnost:** Backend postavený na Supabase zvládne až 1 000 000 řádků/tabulku.  
    
    ---
    
    ### **Proč TableGenAI?**  
    - **Ušetříte 80 % času:** Místo ručního doplňování necháte pracovat AI.  
    - **Konzistentní výsledky:** Výstupy dodržují definovaná pravidla (např. formát dat).  
    - **Flexibilita:** Přizpůsobíte si prompty pro jakýkoli use case.  
    ```
    
- Project brief
    
    ```markdown
    Vyvinout webovou aplikaci, která uživatelům umožní:
    1. **Pracovat s tabulkovými daty:** Nahrávat tabulky, upravovat jejich strukturu (přidávání, mazání, přejmenovávání sloupců) a generovat hodnoty pro prázdné sloupce pomocí AI modelu Anthropic Claude.
    2. **Efektivně zpracovávat velké objemy dat:** Umožnit zpracování tisíců řádků pomocí dávkového zpracování.
    3. **Ukládat a spravovat prompty:** Prompt lze uložit pro opakované použití, editovat nebo odstranit.
    4. **Poskytnout jednoduché uživatelské rozhraní:** Intuitivní design umožňující snadnou interakci s tabulkami a generování dat.
    
    ---
    
    ### **Uživatelský tok (flow aplikace)**
    
    1. **Přihlášení uživatele:**
       - Uživatel se přihlásí pomocí svého účtu (e-mail a heslo).
       - Po přihlášení má možnost zadat svůj API klíč pro Anthropic Claude (klíč je uložen šifrovaně).
    
    2. **Nahrání tabulky:**
       - Uživatel nahraje tabulku ve formátu CSV nebo Excel.
       - Aplikace zobrazí náhled tabulky s existujícími sloupci a daty.
       - Provádí validaci struktury tabulky (správný formát, prázdné hodnoty).
    
    3. **Správa sloupců:**
       - Uživatel může:
         - Přidat nový sloupec.
         - Přejmenovat nebo odstranit existující sloupce.
         - Upravit hodnoty přímo v jednotlivých buňkách.
    
    4. **Výběr sloupce k vyplnění:**
       - Uživatel označí konkrétní sloupec, který má být doplněn pomocí AI.
       - Data z ostatních sloupců řádku se použijí jako kontext pro generování.
    
    5. **Zadání promptu:**
       - Uživatel zadá prompt, který určuje, jak má být sloupec vyplněn.
         - **Příklad promptu:** „Vytvoř popis hotelu na základě názvu hotelu, destinace a dostupných služeb.“
       - Prompt lze uložit pro pozdější použití, editovat nebo odstranit.
    
    6. **Generování hodnot:**
       - Aplikace pošle požadavky do Anthropic Claude API:
         - Zpracování probíhá dávkově, aby respektovalo limity API.
         - Generované hodnoty se ukládají do vybraného sloupce.
       - Uživatel vidí průběh zpracování (např. „zpracováno 120/1000 řádků“).
    
    7. **Stažení výsledné tabulky:**
       - Po dokončení generování si uživatel může stáhnout upravenou tabulku ve formátu CSV nebo Excel.
    
    ---
    
    ### **Klíčové funkce aplikace**
    
    #### **1. Nahrávání tabulek:**
    - Podpora CSV a Excel formátů.
    - Automatická detekce struktury tabulky.
    - Náhled dat pro kontrolu a úpravy.
    
    #### **2. Správa tabulek:**
    - Přidávání, přejmenovávání a mazání sloupců.
    - Možnost úpravy hodnot v jednotlivých buňkách.
    
    #### **3. Správa promptů:**
    - Ukládání zadaných promptů do databáze.
    - Možnost opakovaného použití promptů.
    - Editace a mazání promptů.
    
    #### **4. Generování hodnot pomocí AI:**
    - Integrace s Anthropic Claude API.
    - Kontext generování tvoří hodnoty z ostatních sloupců daného řádku.
    - Optimalizace pro velké objemy dat (tisíce řádků) pomocí dávkového zpracování.
    
    #### **5. Export výsledků:**
    - Stáhnutí upravené tabulky s doplněnými hodnotami.
    - Podpora CSV a Excel formátů.
    
    #### **6. Stav zpracování:**
    - Zobrazení postupu generování (procentuální dokončení, počet zpracovaných řádků).
    - Možnost pozastavit nebo restartovat proces.
    
    ---
    
    ### **Technologie**
    
    #### **Frontend: Next.js a Shadcn/UI**
    - **Next.js:**
      - Rychlý framework pro moderní webové aplikace.
      - Server-side rendering (SSR) pro lepší výkon.
    - **Shadcn/UI:**
      - Moderní komponenty pro intuitivní a estetické uživatelské rozhraní.
    
    #### **Backend: Pocketbase**
    - **Pocketbase:**
      - Slouží jako databáze a backendové API.
      - Ukládání:
        - Nahraných tabulek a jejich metadat.
        - Uživatelských promptů.
        - Informací o uživatelských účtech a nastavení.
    
    #### **AI model: Anthropic Claude**
    - Použití pro generování textů na základě promptů a kontextu dat.
    - Optimalizace pro dávkové zpracování (požadavky na velké objemy dat).
    
    #### **Integrace:**
    - Next.js napojený na Pocketbase pro správu uživatelských dat.
    - API endpointy pro komunikaci s Anthropic Claude API.
    ```
    
- UIX
    
    ```markdown
    ### **Detailní návrh uživatelského rozhraní pro práci s tabulkou**
    
    Zaměříme se na návrh **hlavní tabulkové komponenty** a na její klíčové funkce:
    1. Přidání nového sloupce.
    2. Zadání promptu pro generování dat.
    3. Výběr sloupce, kde má být prompt použit, a generování textu na základě kontextu ostatních sloupců.
    
    ---
    
    ### **Hlavní rozložení obrazovky s tabulkou**
    
    #### **1. Struktura rozložení:**
    - **Horní část:**
    - Název aktuální tabulky.
    - Akční tlačítka:
    - „Zpět na Dashboard“.
    - „Exportovat“.
    - „Uložit změny“.
    
    - **Hlavní obsah (Tabulka a pravý panel):**
    - **Levá část (Tabulka):**
    - Interaktivní tabulka dat.
    - Hlavička sloupců umožňuje přístup k akcím (přidání promptu, přejmenování, mazání).
    
    - **Pravá část (Kontextový panel):**
    - Sekce Prompt (pro nastavení promptů).
    - Sekce Generování (pro spuštění generování a vizualizaci progresu).
    
    ---
    
    ### **Tabulka – Funkce a ovládací prvky**
    
    #### **2. Hlavní funkce tabulky:**
    
    1. **Přidání nového sloupce:**
    - Tlačítko „+“ na konci hlavičky tabulky.
    - Po kliknutí se otevře modální okno s formulářem:
    - **Název nového sloupce.**
    - **Typ dat (volitelně)**: Text, číslo, datum.
    - Po potvrzení se sloupec přidá na konec tabulky.
    
    2. **Editace hlavičky sloupce:**
    - **Kliknutím na název sloupce** se otevře kontextové menu:
    - Přejmenovat sloupec (otevře malý editační formulář inline).
    - Smazat sloupec (zobrazí potvrzovací dialog).
    - Nastavit prompt.
    
    3. **Nastavení promptu pro sloupec:**
    - Kliknutím na tlačítko „Nastavit prompt“ v kontextovém menu sloupce se otevře pravý panel:
    - **Dropdown s uloženými prompty.**
    - Tlačítko „Vytvořit nový prompt“ (otevře modální okno).
    - Po výběru promptu se sloupec označí jako **cílový sloupec pro generování** (např. zvýrazněním).
    
    4. **Inline editace buněk:**
    - Dvojklikem na buňku lze editovat její obsah.
    
    5. **Výběr řádků/sloupců:**
    - Kliknutím na řádek nebo sloupec se provede jeho zvýraznění.
    - Aktivní sloupec (pro generování) je označen barevně.
    
    ---
    
    ### **Pravý panel – Prompt a generování**
    
    #### **3. Struktura pravého panelu:**
    
    1. **Sekce Prompt:**
    - **Výběr promptu:**
    Dropdown s uloženými prompty.
    - **Vytvořit nový prompt:**
    Tlačítko, které otevře modální okno s formulářem:
    - Název promptu.
    - Text promptu (textarea s možností přidat placeholdery pro hodnoty ostatních sloupců).
    - Tlačítka: „Uložit“ a „Zrušit“.
    
    2. **Sekce Generování:**
    - **Tlačítko „Spustit generování“**:
    Aktivuje AI generování dat pro cílový sloupec.
    - **Vizualizace stavu generování:**
    - Progres bar zobrazující postup (po řádcích nebo sloupcích).
    - Text: „Generování dat… (50% dokončeno)“.
    - **Přerušení generování:**
    Tlačítko „Zastavit“.
    
    ---
    
    ### **Interakční toky (User Flows)**
    
    #### **4. Přidání nového sloupce:**
    1. Kliknutí na tlačítko „+“ na konci hlavičky tabulky.
    2. Otevře se modální okno s formulářem.
    3. Uživatel zadá název nového sloupce a potvrdí.
    4. Sloupec se přidá na konec tabulky a je možné s ním dále pracovat.
    
    ---
    
    #### **5. Nastavení promptu a generování dat:**
    1. Uživatel klikne na hlavičku cílového sloupce a zvolí „Nastavit prompt“.
    2. Pravý panel zobrazí možnosti:
    - Výběr uloženého promptu.
    - Možnost vytvořit nový prompt.
    3. Po přiřazení promptu je sloupec označen jako aktivní.
    4. Uživatel klikne na „Spustit generování“ v pravém panelu.
    5. AI generuje data na základě kontextu ostatních sloupců.
    
    ---
    
    #### **6. Inline editace dat v buňkách:**
    1. Dvojklikem na buňku uživatel zahájí editaci.
    2. Po potvrzení změny je hodnota uložena v tabulce.
    
    ---
    
    ### **Wireframe návrhy**
    Pro vizualizaci bych mohl navrhnout:
    1. **Rozložení tabulky a pravého panelu.**
    2. **Detail modálního okna pro přidání sloupce a tvorbu promptu.**
    3. **Vizualizaci stavu generování a interakci s buňkami.**
    ```