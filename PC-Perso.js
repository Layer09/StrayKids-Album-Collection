/*************************************************
 * CONFIGURATION GLOBALE
 *************************************************/

const MEMBERS = [
    "Woojin",
    "Bang Chan",
    "Lee Know",
    "Changbin",
    "Hyunjin",
    "Han",
    "Felix",
    "Seungmin",
    "I.N"
];

const MEMBER_IMAGES = [
    "./images/skzoo/Unknown.png",
    "./images/skzoo/WolfChan.png",
    "./images/skzoo/LeeBit.png",
    "./images/skzoo/Dwaekki.png",
    "./images/skzoo/Jiniret.png",
    "./images/skzoo/HanQuokka.png",
    "./images/skzoo/Bbokari.png",
    "./images/skzoo/PuppyM.png",
    "./images/skzoo/FoxINy.png"
];

const LOGO_IMAGE = "./images/Logo-StrayKids.png";

const details = document.getElementById("pc-details");
const recap = document.getElementById("pc-recap");

const prenom = location.pathname
    .split("/")
    .pop()
    .replace("PC-", "")
    .replace(".html", "");

/*************************************************
 * CSV
 *************************************************/

async function loadCSV(path) {
    const res = await fetch(path);
    const text = await res.text();
    return text.trim().split("\n").map(l => l.split(",").map(v => v.trim()));
}

/*************************************************
 * OUTILS
 *************************************************/

function img(src, cls = "") {
    const i = document.createElement("img");
    i.src = src;
    if (cls) i.className = cls;
    return i;
}

function section(container, title, isCategory = false) {
    const s = document.createElement("section");
    const h = document.createElement(isCategory ? "h1" : "h2");
    h.innerText = title;
    h.className = isCategory ? "pc-category" : "pc-table-title";
    s.appendChild(h);
    container.appendChild(s);
    return s;
}

function hr(container) {
    const d = document.createElement("div");
    d.className = "pc-separator-horizontal";
    container.appendChild(d);
}

/*************************************************
 * VÉRIFICATIONS (images présentes ?)
 *************************************************/

function soloHasImages(csv) {
    for (let r = 1; r < csv.length; r++) {
        for (let c = 2; c < csv[r].length; c++) {
            if (parseInt(csv[r][c], 10) > 0) return true;
        }
    }
    return false;
}

function duoHasImages(csv) {
    for (let r = 1; r < csv.length; r++) {
        for (let c = 2; c < csv[r].length; c++) {
            if (parseInt(csv[r][c], 10) > 0) return true;
        }
    }
    return false;
}

async function hasCategoryContent(tables) {
    for (const t of tables) {
        const csvs = await t(); // appelle la fonction qui construit le tableau mais retourne si images
        if (csvs) return true;
    }
    return false;
}


/*************************************************
 * ====== TABLEAUX DÉTAILLÉS =====================
 *************************************************/

/* Photocards */
async function tablePhotocards(parent, csv) {
    if (!soloHasImages(csv)) return;

    const s = section(parent, "Photocards");
    const table = document.createElement("table");

    const thead = document.createElement("thead");
    const trh = document.createElement("tr");

    MEMBERS.forEach((m, i) => {
        const th = document.createElement("th");
        th.textContent = m;
        th.appendChild(img(MEMBER_IMAGES[i], "member-icon"));
        trh.appendChild(th);
    });

    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    const tr = document.createElement("tr");

    // --- Déterminer si le CSV est officiel ---
    const offset = csv[0].includes("Nom Album") && csv[0].includes("Chemin Album") ? 2 : 0;
    const useAlbumImage = offset === 2; // vrai pour les officiels

    MEMBERS.forEach((_, c) => {
        const td = document.createElement("td");

        for (let r = 1; r < csv.length; r++) {
            const n = parseInt(csv[r][c + offset], 10) || 0;
            for (let i = 0; i < n; i++) {
                td.appendChild(img(useAlbumImage ? csv[r][1] : LOGO_IMAGE, "pc-img"));
            }
        }

        tr.appendChild(td);
    });

    tbody.appendChild(tr);
    table.appendChild(tbody);
    s.appendChild(table);
}

/* Bonus + XXL */
async function tableBonusXXL(parent, bonus, xxl) {
    // Si vraiment aucun contenu du tout
    if (!soloHasImages(bonus) && !soloHasImages(xxl)) return;

    const s = section(parent, "Bonus et grandes images");
    const table = document.createElement("table");

    /* ===== THEAD ===== */
    const thead = document.createElement("thead");
    const trh = document.createElement("tr");
    trh.appendChild(document.createElement("th"));

    MEMBERS.forEach((m, i) => {
        const th = document.createElement("th");
        th.textContent = m;
        th.appendChild(img(MEMBER_IMAGES[i], "member-icon"));
        trh.appendChild(th);
    });

    thead.appendChild(trh);
    table.appendChild(thead);

    /* ===== TBODY ===== */
    const tbody = document.createElement("tbody");

    [
        { label: "Bonus", data: bonus },
        { label: "Grandes images", data: xxl }
    ].forEach(b => {

        // ⚠️ Ne jamais bloquer Bonus
        if (b.label !== "Bonus" && !soloHasImages(b.data)) return;

        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.textContent = b.label;
        tr.appendChild(th);

        MEMBERS.forEach((_, c) => {
            const td = document.createElement("td");

            for (let r = 1; r < b.data.length; r++) {

                /* ===== BONUS ===== */
                if (b.label === "Bonus") {
                    const value = b.data[r][c + 2];
                    if (!value || value === "0") continue;

                    const clean = value.replace(/^\(|\)$/g, "");
                    const rewards = clean.includes("|")
                        ? clean.split("|").map(v => v.trim())
                        : [clean];

                    rewards.forEach(reward => {
                        const wrapper = document.createElement("div");
                        wrapper.className = "bonus-item";

                        // Image d’album (inchangée)
                        wrapper.appendChild(img(b.data[r][1], "pc-img"));

                        // Texte du bonus
                        const label = document.createElement("div");
                        label.className = "bonus-label";
                        label.textContent = reward;

                        wrapper.appendChild(label);
                        td.appendChild(wrapper);
                    });
                }

                /* ===== GRANDES IMAGES (INCHANGÉ) ===== */
                else {
                    const n = parseInt(b.data[r][c + 2], 10);
                    if (!n || isNaN(n)) continue;

                    for (let i = 0; i < n; i++) {
                        td.appendChild(img(b.data[r][1], "pc-img"));
                    }
                }
            }

            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    s.appendChild(table);
}

/* Duos */
async function tableDuos(parent, csv, title, isOff) {
    // Vérification si tableau vide
    let hasImage = false;
    for (let r = 1; r < csv.length; r++) {
        for (let c = 2; c < csv[r].length; c++) {
            if (parseInt(csv[r][c], 10) > 0) {
                hasImage = true;
                break;
            }
        }
        if (hasImage) break;
    }
    if (!hasImage) return;

    const s = section(parent, title);
    const table = document.createElement("table");
    table.classList.add("duo-table");

    const header = csv[0];

    // Membres affichés dans les colonnes (supprimer Woojin)
    const colMembers = MEMBERS.slice(1); // indice 1 → 8 (Bang Chan → I.N)
    // Membres affichés dans les lignes (supprimer I.N)
    const rowMembers = MEMBERS.slice(0, MEMBERS.length - 1); // indice 0 → 7 (Woojin → Seungmin)

    // === ENTÊTE ===
    const thead = document.createElement("thead");
    const trh = document.createElement("tr");
    trh.appendChild(document.createElement("th")); // coin supérieur gauche vide

    colMembers.forEach((m, i) => {
        const th = document.createElement("th");
        th.textContent = m;
        th.appendChild(img(MEMBER_IMAGES[i + 1], "member-icon")); // +1 car on a supprimé Woojin
        trh.appendChild(th);
    });

    // Dernière colonne vide pour aligner avec rappel des lignes
    const thLast = document.createElement("th");
    trh.appendChild(thLast);

    thead.appendChild(trh);
    table.appendChild(thead);

    // === CORPS ===
    const tbody = document.createElement("tbody");

    rowMembers.forEach((m, r) => {
        const tr = document.createElement("tr");

        // Première colonne = nom + icône de la ligne
        const th = document.createElement("th");
        th.textContent = m;
        th.appendChild(img(MEMBER_IMAGES[r], "member-icon"));
        tr.appendChild(th);

        colMembers.forEach((_, c) => {
            const td = document.createElement("td");

            // Calcul de la vraie colonne dans le CSV (décalage Woojin)
            const csvCol = c + 2; // +2 car colonnes Nom Album + Chemin Album
            const csvRow = r + 1; // +1 car en-tête

            // Partie triangle + diagonale barrée
            if (c < r) td.classList.add("duo-disabled");

            // Ajout des images
            if (!td.classList.contains("duo-disabled")) {
                const duoCode = `${r}${c + 1}`; // décalage colonne +1 pour correspondre à l'indice réel dans CSV
                const duoIndex = header.indexOf(duoCode);
                if (duoIndex !== -1) {
                    for (let i = 1; i < csv.length; i++) {
                        const value = parseInt(csv[i][duoIndex], 10) || 0;
                        for (let n = 0; n < value; n++) {
                            td.appendChild(img(isOff ? csv[i][1] : LOGO_IMAGE, "pc-img"));
                        }
                    }
                }
            }

            tr.appendChild(td);
        });

        // Dernière colonne = rappel de la ligne
        const tdLast = document.createElement("td");
        tdLast.textContent = m;
        tdLast.appendChild(img(MEMBER_IMAGES[r], "member-icon"));
        tr.appendChild(tdLast);

        tbody.appendChild(tr);
    });

    // === Ligne finale = rappel entêtes ===
    const trFooter = document.createElement("tr");
    trFooter.appendChild(document.createElement("th")); // coin vide
    colMembers.forEach((m, i) => {
        const td = document.createElement("td");
        td.textContent = m;
        td.appendChild(img(MEMBER_IMAGES[i + 1], "member-icon"));
        trFooter.appendChild(td);
    });
    trFooter.appendChild(document.createElement("td")); // coin bas droit vide
    tbody.appendChild(trFooter);

    table.appendChild(tbody);
    s.appendChild(table);
}

function bonusValue(v) {
    if (v == null) return 0;

    const value = String(v).trim();

    if (value === "" || value === "0") {
        return 0;
    }

    // valeurs multiples
    if (value.startsWith("(") && value.endsWith(")")) {
        return value
            .slice(1, -1)
            .split("|")
            .map(s => s.trim())
            .filter(Boolean).length;
    }

    // valeur simple
    return 1;
}

/*************************************************
 * ====== TOTALS ================================
 *************************************************/

function emptyCounter() {
    return Array(9).fill(0);
}

// Solos officiels (Nom Album + Chemin Album aux colonnes 0/1)
function addSoloOfficial(counter, csv) {
    for (let r = 1; r < csv.length; r++) {
        for (let c = 0; c < 9; c++) {
            counter[c] += parseInt(csv[r][c + 2], 10) || 0;
        }
    }
}

// Solos non-officiels (pas de colonnes Nom Album / Chemin Album)
function addSoloNonOfficial(counter, csv) {
    for (let r = 1; r < csv.length; r++) {
        for (let c = 0; c < 9; c++) {
            counter[c] += parseInt(csv[r][c], 10) || 0;
        }
    }
}

// Duos (officiel ou non)
function addDuos(counter, csv) {
    const header = csv[0];
    for (let r = 1; r < csv.length; r++) {
        for (let c = 2; c < header.length; c++) {
            const v = parseInt(csv[r][c], 10) || 0;
            if (!v) continue;
            const a = parseInt(header[c][0], 10);
            const b = parseInt(header[c][1], 10);
            counter[a] += v;
            counter[b] += v;
        }
    }
}

function tableTotal(title, counters, addColumnTotal = true) {
    const s = section(recap, title);
    const table = document.createElement("table");

    // === ENTÊTE ===
    const thead = document.createElement("thead");
    const trh = document.createElement("tr");
    trh.appendChild(document.createElement("th"));

    MEMBERS.forEach((m, i) => {
        const th = document.createElement("th");
        th.textContent = m;
        th.appendChild(img(MEMBER_IMAGES[i], "member-icon"));
        trh.appendChild(th);
    });

    thead.appendChild(trh);
    table.appendChild(thead);

    // === CORPS ===
    const tbody = document.createElement("tbody");

    counters.forEach(row => {
        const label = row.label.trim().toLowerCase();

        /* ===== LIGNE GROUPE (NON OFFICIEL) ===== */
        if (label === "groupe") {
            const tr = document.createElement("tr");

            const th = document.createElement("th");
            th.textContent = row.label;
            tr.appendChild(th);

            const td = document.createElement("td");
            td.colSpan = MEMBERS.length; // occupe 9 colonnes
            td.textContent = row.values[0] ?? 0;

            tr.appendChild(td);
            tbody.appendChild(tr);
            return;
        }

        /* ===== LIGNES NORMALES ===== */
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.textContent = row.label;
        tr.appendChild(th);

        row.values.forEach(v => {
            const td = document.createElement("td");
            td.textContent = v;
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    // === TOTAL DES COLONNES ===
    if (addColumnTotal) {
        const totalRow = document.createElement("tr");
        totalRow.className = "total-row";

        const thTotal = document.createElement("th");
        thTotal.textContent = "Total";
        totalRow.appendChild(thTotal);

        for (let i = 0; i < MEMBERS.length; i++) {
            let sum = 0;

            counters.forEach(row => {
                const label = row.label.trim().toLowerCase();

                if (label === "bonus") {
                    sum += bonusValue(row.values[i]);
                }
                else if (label === "groupe") {
                    // Groupe compte pour CHAQUE colonne
                    sum += Number(row.values[0]) || 0;
                }
                else {
                    sum += Number(row.values[i]) || 0;
                }
            });

            const td = document.createElement("td");
            td.textContent = sum;
            totalRow.appendChild(td);
        }

        tbody.appendChild(totalRow);
    }

    table.appendChild(tbody);
    s.appendChild(table);
}

/*************************************************
 * INIT
 *************************************************/

(async function init() {

    // Chargement des CSV
    const soloOff = await loadCSV(`./PC-csv/${prenom}/Solo-off.csv`);
    const bonusOff = await loadCSV(`./PC-csv/${prenom}/Bonus-off.csv`);
    const xxlOff = await loadCSV(`./PC-csv/${prenom}/Solo_XXL-off.csv`);
    const duoOff = await loadCSV(`./PC-csv/${prenom}/Duos-off.csv`);

    const soloNon = await loadCSV(`./PC-csv/${prenom}/Solo-non_off.csv`);
    const duoNon = await loadCSV(`./PC-csv/${prenom}/Duos-non_off.csv`);
    const groupeNon = await loadCSV(`./PC-csv/${prenom}/Groupe-non_off.csv`);

    // Vérifier si au moins un tableau a du contenu
    const hasOfficiel =
        soloHasImages(soloOff) ||
        soloHasImages(bonusOff) ||
        soloHasImages(xxlOff) ||
        duoHasImages(duoOff);

    const hasNonOfficiel =
        soloHasImages(soloNon) ||
        duoHasImages(duoNon) ||
        groupeHasImages(groupeNon);

    // ========= OFFICIEL =========
    if (hasOfficiel) {
        section(details, "Officiel", true);
        await tablePhotocards(details, soloOff);
        await tableBonusXXL(details, bonusOff, xxlOff);
        await tableDuos(details, duoOff, "Duos", true);
        hr(details);
    }

    // ========= NON OFFICIEL =========
    if (hasNonOfficiel) {
        section(details, "Non officiel", true);
        await tablePhotocards(details, soloNon);
        await tableDuos(details, duoNon, "Duos", false);
        hr(details);
    }

    // ========= TOTAL =========
    section(recap, "Total", true);

    const offP = emptyCounter(), offB = emptyCounter(), offX = emptyCounter(), offD = emptyCounter();
    const nonP = emptyCounter(), nonD = emptyCounter(), nonG = emptyCounter();

    addSoloOfficial(offP, soloOff);
    addSoloOfficial(offB, bonusOff);
    addSoloOfficial(offX, xxlOff);
    addDuos(offD, duoOff);

    addSoloNonOfficial(nonP, soloNon);
    addDuos(nonD, duoNon);

    if (hasOfficiel) {
        tableTotal("Total officiel", [
            { label: "Photocards", values: offP },
            { label: "Bonus", values: offB },
            { label: "Grandes images", values: offX },
            { label: "Duos", values: offD }
        ]);
    }

    if (hasNonOfficiel) {
        tableTotal("Total non officiel", [
            { label: "Solos", values: nonP },
            { label: "Duos", values: nonD },
            { label: "Groupe", values: [nonG] }
        ]);
    }

    // Total cumulé
    if (hasOfficiel && hasNonOfficiel) {
        tableTotal("Total cumulé", [
            {
                label: "Total Officiel + \nNon officiel",
                values: offP.map((v, i) => v + offB[i] + offX[i] + offD[i] + nonP[i] + nonD[i])
            }
        ],
        false);
    }
})();

