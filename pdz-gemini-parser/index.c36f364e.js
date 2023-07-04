/*
kód pro stránku index.html

co zde najdete:

- funkce pro upload souboru (uploadFile)
- funkce pro načtení vybraného souboru (loadFile)
- parser pro formát Gemini (parseGemini) - popis formátu viz dále
- funkce pro zobrazení rozparsovaného obsahu v tabulce (showParsed)
- funkce pro zkopírování obsahu tabulky do schránky (copyTable)
*/ function showError(message) {
    let el = document.getElementById("error");
    el.innerText = message;
    el.style.display = "block";
}
function hideError() {
    let el = document.getElementById("error");
    el.style.display = "none";
}
function showSuccess(message) {
    let el = document.getElementById("success");
    el.innerText = message;
    el.style.display = "block";
}
function hideSuccess() {
    let el = document.getElementById("success");
    el.style.display = "none";
}
function showAccountNo() {
    let el = document.getElementById("acc");
    el.style.display = "block";
}
function hideAccountNo() {
    let el = document.getElementById("acc");
    el.style.display = "none";
}
function showStatementNo() {
    let el = document.getElementById("stno");
    el.style.display = "block";
}
function hideStatementNo() {
    let el = document.getElementById("stno");
    el.style.display = "none";
}
document.getElementById("loadFile").addEventListener("click", function() {
    hideError();
    hideSuccess();
    let el = document.createElement("input");
    el.type = "file";
    el.accept = ".ace";
    el.addEventListener("change", uploadFile);
    el.click();
});
// funkce pro upload souboru
function uploadFile(event) {
    hideAccountNo();
    hideStatementNo();
    // vyprázdníme tabulku
    document.getElementById("result").getElementsByTagName("tbody")[0].innerHTML = "";
    // získání souboru z eventu
    const file = event.target.files[0];
    // pokud je soubor vybrán, načteme ho
    if (file) loadFile(file);
}
// funkce pro načtení vybraného souboru
function loadFile(file) {
    // vytvoření objektu FileReader
    const reader = new FileReader();
    // nastavení callbacku pro načtení souboru
    reader.onload = function(e) {
        // získání obsahu souboru
        const contents = e.target.result;
        // zavolání funkce pro parsování
        parseGemini(contents);
    };
    // načtení souboru
    reader.readAsText(file);
}
// parser pro formát Gemini
function parseGemini(contents) {
    // vyprázdníme tabulku
    document.getElementById("result").getElementsByTagName("tbody")[0].innerHTML = "";
    // rozdělíme obsah souboru na řádky
    let lines = contents.split("\n");
    // vytvoříme pole pro uložení rozparsovaného obsahu
    let data = [];
    let row = [];
    let stmtNo = "";
    let currency = "";
    // pro každý řádek
    for(let i = 0; i < lines.length; i++){
        if (lines[i].startsWith(":25:")) {
            // odřízneme sekvenci ":25:"
            let line = lines[i].substring(4);
            // odstraníme případné mezery na začátku a na konci řetězce
            line = line.trim();
            // zbytek řádku je číslo účtu, přidáme na konec "/2700"
            // a zobrazíme ve span id="accountNo"
            document.getElementById("accountNo").innerText = line + "/2700";
            showAccountNo();
        } else if (lines[i].startsWith(":28:")) {
            // odřízneme sekvenci ":28:"
            let line1 = lines[i].substring(4);
            // odstraníme / na konci řetězce
            line1 = line1.replace("/", "");
            // zbytek řádku je číslo výpisu, zobrazíme ve span id="statementNo"
            stmtNo = Number.parseInt(line1).toString();
            // pad left with zeros to three digits
            stmtNo = stmtNo.padStart(3, "0");
            document.getElementById("stmtNo").innerText = stmtNo;
            showStatementNo();
        } else if (lines[i].startsWith(":60F:")) {
            // měna výpisu je na pozici 12-15
            currency = lines[i].substring(12, 15);
            // vypíšeme do elementu id="currency"
            document.getElementById("currency").innerText = currency;
        } else if (lines[i].startsWith(":61:")) {
            // odřízneme sekvenci ":61:"
            let line2 = lines[i].substring(4);
            // struktura řádku :61: je následující:
            // 1-6 datum YYMMDD, přeložíme na formát DD.MM.YYYY
            // následuje jeden nebo dva znaky: "C", "D", "RC", "RD"
            // následuje částka, která může obsahovat desetinnou čárku a má max. délku 15 znaků
            // následuje 4 znaky dlouhý typ SWIFT transakce, ten ignorujeme
            // následuje 16 znaků dlouhá reference transakce, nebo řetězen "NONREF"
            // následuje řetězec "//", ten ignorujeme
            // následuje CRLF a po něm může následovat 34 znaků dlouhý popis transakce na dalším řádku
            // postupně čteme proměnné a ukládáme je do pole row
            // datum
            let date = line2.substring(0, 6);
            let year = "20" + date.substring(0, 2);
            // číslo výpisu UC-měnarokčíslo
            let stno = "UC-" + currency + year + stmtNo;
            row.push(stno);
            row.push(currency);
            row.push(date.substring(4, 6) + "." + date.substring(2, 4) + "." + year);
            line2 = line2.substring(6);
            // typ transakce - jedno nebo dvouznakový řetězec
            let type = line2.substring(0, 2);
            if (type[0] != "R") {
                // jen jeden znak
                row.push(type[0]);
                line2 = line2.substring(1);
            } else {
                // dva znaky
                row.push(type);
                line2 = line2.substring(2);
            }
            // částka - délka je proměnlivá, může obsahovat jen čísla a desetinnou čárku
            let amount = /([0-9]+,?[0-9]*)/.exec(line2)[0];
            let amountLength = amount.length;
            // uložíme do pole
            row.push(amount);
            line2 = line2.substring(amountLength);
            // ignorujeme typ SWIFT transakce
            line2 = line2.substring(4);
            // reference transakce, končící řetězcem "//", který ignorujeme
            let reference = line2.substring(0, line2.indexOf("//"));
            //row.push('="' + reference + '"');
            line2 = line2.substring(reference.length + 2);
            // původ transakce je text do konce řádku, ignorujeme
            // popis transakce je na dalším řádku, pokud ten nezačíná :86:
            if (lines[i + 1].startsWith(":86:")) row.push(""); // není popis
            else {
                let otherside = lines[i + 1];
                // odstraníme CR a LF
                otherside = otherside.replace("\r", "");
                otherside = otherside.replace("\n", "");
                // odstraníme "Z " nebo "NA " ze začátku řetězce
                otherside = otherside.replace("Z ", "");
                otherside = otherside.replace("NA ", "");
                row.push('="' + otherside + '"');
                i++;
            }
        } else if (lines[i].startsWith(":86:")) {
            // odřízneme sekvenci ":86:"
            let line3 = lines[i].substring(4);
            // odstraníme CR a LF
            line3 = line3.replace("\r", "");
            line3 = line3.replace("\n", "");
            // split pole podle znaku 0x04
            let parts = line3.split(String.fromCharCode(0x04));
            // jestliže první prvek je "O" nebo "I", ignorujeme řádek
            if (parts[0] == "O" || parts[0] == "I") row.push(""); // není popis
            else {
                // spojíme první dva prvky pole tak, že druhý uzavřeme do závorek
                let desc = parts[0];
                if (parts[1].length) desc += " (" + parts[1] + ")";
                row.push('="' + desc + '"');
            }
            // uložíme řádek do pole
            data.unshift(row);
            row = [];
        }
    }
    showParsed(data);
}
// funkce pro zobrazení rozparsovaného obsahu v tabulce
function showParsed(contents) {
    //contents je pole polí
    // každé pole obsahuje řádek tabulky
    // každý řádek obsahuje pole s obsahem buněk
    // např. [[1,2,3],[4,5,6]] zobrazí tabulku
    // 1 2 3
    // 4 5 6
    // získáme element tabulky
    let table = document.getElementById("result");
    // získáme element tbody
    let tbody = table.getElementsByTagName("tbody")[0];
    // pro každý řádek tabulky
    for(let i = 0; i < contents.length; i++){
        // vytvoříme řádek tabulky
        let row = document.createElement("tr");
        // pro každou buňku řádku
        for(let j = 0; j < contents[i].length; j++){
            // vytvoříme buňku
            let cell = document.createElement("td");
            // nastavíme obsah buňky
            cell.innerText = contents[i][j];
            // přidáme buňku do řádku
            row.appendChild(cell);
        }
        // přidáme řádek do tbody
        tbody.appendChild(row);
    }
}
document.getElementById("copyTable").addEventListener("click", copyTable);
// funkce pro zkopírování obsahu tabulky do schránky
function copyTable() {
    // zkopírujeme tbody tabulky do schránky jako pole polí
    // viz https://stackoverflow.com/questions/70581191/copy-html-table-into-clipboard-with-format
    // získáme element tabulky
    let table = document.getElementById("result");
    // získáme element tbody
    let tbody = table.getElementsByTagName("tbody")[0];
    // získáme všechny řádky tbody
    let rows = tbody.getElementsByTagName("tr");
    // vytvoříme pole polí pro uložení obsahu tabulky
    let data = [];
    // pro každý řádek tabulky
    for(let i = 0; i < rows.length; i++){
        // získáme všechny buňky řádku
        let cells = rows[i].getElementsByTagName("td");
        // vytvoříme pole pro uložení obsahu řádku
        let row = [];
        // pro každou buňku řádku
        for(let j = 0; j < cells.length; j++)// uložíme obsah buňky do pole
        row.push(cells[j].innerText);
        // uložíme pole obsahující obsah řádku do pole obsahující obsah tabulky
        data.push(row);
    }
    // vytvoříme element textarea
    let el = document.createElement("textarea");
    // nastavíme obsah textarea na obsah tabulky
    el.value = data.map((row)=>row.join("	")).join("\n");
    // přidáme textarea do stránky
    document.body.appendChild(el);
    // vybereme obsah textarea
    el.select();
    // zkopírujeme obsah textarea do schránky
    document.execCommand("copy");
    // odstraníme textarea ze stránky
    document.body.removeChild(el);
    // zobrazíme zprávu o úspěchu na 2 sekundy
    showSuccess("Obsah tabulky byl zkop\xedrov\xe1n do schr\xe1nky.");
    setTimeout(hideSuccess, 2000);
}

//# sourceMappingURL=index.c36f364e.js.map
