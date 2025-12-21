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

const LOGO_IMAGE = "./images/Logo.png";

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
    h.textContent = title;
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

    MEMBERS.forEach((_, c) => {
        const td = document.createElement("td");
        for (let r = 1; r < csv.length; r++) {
            const n = parseInt(csv[r][c + 2], 10);
            for (let i = 0; i < n; i++) {
                td.appendChild(img(csv[r][1], "pc-img"));
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
    if (!soloHasImages(bonus) && !soloHasImages(xxl)) return;

    const s = section(parent, "Bonus et grandes images");
    const table = document.createElement("table");

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

    const tbody = document.createElement("tbody");

    [
        { label: "Bonus", data: bonus },
        { label: "Grandes images", data: xxl }
    ].forEach(b => {
        if (!soloHasImages(b.data)) return;

        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.textContent = b.label;
        tr.appendChild(th);

        MEMBERS.forEach((_, c) => {
            const td = document.createElement("td");
            for (let r = 1; r < b.data.length; r++) {
                const n = parseInt(b.data[r][c + 2], 10);
                for (let i = 0; i < n; i++) {
                    td.appendChild(img(b.data[r][1], "pc-img"));
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
    if (!duoHasImages(csv)) return;

    const s = section(parent, title);
    const table = document.createElement("table");
    table.classList.add("duo-table");

    const header = csv[0];

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

    const tbody = document.createElement("tbody");

    MEMBERS.forEach((m, r) => {
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.textContent = m;
        th.appendChild(img(MEMBER_IMAGES[r], "member-icon"));
        tr.appendChild(th);

        MEMBERS.forEach((_, c) => {
            const td = document.createElement("td");

            if (c <= r) {
                td.classList.add("duo-disabled");
            } else {
                const idx = header.indexOf(`${r}${c}`);
                if (idx !== -1) {
                    for (let i = 1; i < csv.length; i++) {
                        const n = parseInt(csv[i][idx], 10);
                        for (let k = 0; k < n; k++) {
                            td.appendChild(
                                img(isOff ? csv[i][1] : LOGO_IMAGE, "pc-img")
                            );
                        }
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

/*************************************************
 * ====== TOTALS ================================
 *************************************************/

function emptyCounter() {
    return Array(9).fill(0);
}

function addSolo(counter, csv) {
    if (!csv || csv.length < 2) return;

    // Vérifier si le CSV a des colonnes "Nom Album" et "Chemin Album"
    const offset = csv[0].includes("Nom Album") && csv[0].includes("Chemin Album") ? 2 : 0;

    for (let r = 1; r < csv.length; r++) {
        for (let c = 0; c < MEMBERS.length; c++) {
            const val = parseInt(csv[r][c + offset], 10) || 0;
            counter[c] += val;
        }
    }
}


function addDuos(counter, csv) {
    const h = csv[0];
    for (let r = 1; r < csv.length; r++) {
        for (let c = 2; c < h.length; c++) {
            const v = parseInt(csv[r][c], 10);
            if (!v) continue;
            counter[parseInt(h[c][0], 10)] += v;
            counter[parseInt(h[c][1], 10)] += v;
        }
    }
}

function tableTotal(title, counters) {
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
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.textContent = row.label;
        tr.appendChild(th);

        row.values.forEach((v, i) => {
            const td = document.createElement("td");
            td.textContent = v;
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    // === LIGNE TOTAL DES COLONNES ===
    const totalRow = document.createElement("tr");
    totalRow.className = "total-row";

    const thTotal = document.createElement("th");
    thTotal.textContent = "Total";
    totalRow.appendChild(thTotal);

    for (let i = 0; i < MEMBERS.length; i++) {
        let sum = 0;
        counters.forEach(row => {
            sum += row.values[i];
        });
        const td = document.createElement("td");
        td.textContent = sum;
        totalRow.appendChild(td);
    }

    tbody.appendChild(totalRow);
    table.appendChild(tbody);
    s.appendChild(table);
}



/*************************************************
 * INIT
 *************************************************/

(async function init() {

    /* ========= OFFICIEL ========= */
    section(details, "Officiel", true);

    const soloOff = await loadCSV(`./PC-csv/${prenom}/Solo-off.csv`);
    const bonusOff = await loadCSV(`./PC-csv/${prenom}/Bonus-off.csv`);
    const xxlOff = await loadCSV(`./PC-csv/${prenom}/Solo_XXL-off.csv`);
    const duoOff = await loadCSV(`./PC-csv/${prenom}/Duos-off.csv`);

    await tablePhotocards(details, soloOff);
    await tableBonusXXL(details, bonusOff, xxlOff);
    await tableDuos(details, duoOff, "Duos", true);

    hr(details);

    /* ========= NON OFFICIEL ========= */
    section(details, "Non officiel", true);

    const soloNon = await loadCSV(`./PC-csv/${prenom}/Solo-non_off.csv`);
    const duoNon = await loadCSV(`./PC-csv/${prenom}/Duos-non_off.csv`);

    await tablePhotocards(details, soloNon);
    await tableDuos(details, duoNon, "Duos", false);

    hr(details);

    /* ========= TOTAL ========= */
    section(recap, "Total", true);

    const offP = emptyCounter(), offB = emptyCounter(), offX = emptyCounter(), offD = emptyCounter();
    const nonP = emptyCounter(), nonD = emptyCounter();

    addSolo(offP, soloOff);
    addSolo(offB, bonusOff);
    addSolo(offX, xxlOff);
    addDuos(offD, duoOff);

    addSolo(nonP, soloNon);
    addDuos(nonD, duoNon);

    tableTotal("Total officiel", [
        { label: "Photocards", values: offP },
        { label: "Bonus", values: offB },
        { label: "Grandes images", values: offX },
        { label: "Duos", values: offD }
    ]);

    tableTotal("Total non officiel", [
        { label: "Solos", values: nonP },
        { label: "Duos", values: nonD }
    ]);

    tableTotal("Total cumulé", [
        {
            label: "Total Officiel + Non officiel",
            values: offP.map((v, i) => v + offB[i] + offX[i] + offD[i] + nonP[i] + nonD[i])
        }
    ]);

})();
