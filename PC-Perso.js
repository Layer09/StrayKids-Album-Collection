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

const MEMBER_IMAGES = MEMBERS.map((_, i) => `./images/${i + 1}.jpg`);
const LOGO_IMAGE = "./images/Logo.png";

const detailsContainer = document.getElementById("pc-details");
const recapContainer = document.getElementById("pc-recap");

// prénom auto
const prenom = location.pathname
    .split("/")
    .pop()
    .replace("PC-", "")
    .replace(".html", "");

/*************************************************
 * OUTILS CSV
 *************************************************/

async function loadCSV(path) {
    const res = await fetch(path);
    const text = await res.text();
    return text.trim().split("\n").map(l => l.split(",").map(v => v.trim()));
}

/*************************************************
 * OUTILS HTML
 *************************************************/

function createImg(src, cls = "") {
    const img = document.createElement("img");
    img.src = src;
    if (cls) img.className = cls;
    return img;
}

function createSection(container, title) {
    const section = document.createElement("section");
    const h2 = document.createElement("h2");
    h2.textContent = title;
    section.appendChild(h2);
    container.appendChild(section);
    return section;
}

/*************************************************
 * ====== PARTIE 1 : TABLEAUX VISUELS (DETAILS) ===
 *************************************************/

/* Photocards officiels */
async function buildPhotocardsOff() {
    const section = createSection(detailsContainer, "Photocards");
    const rows = await loadCSV(`./PC-csv/${prenom}/Solo-off.csv`);
    const table = document.createElement("table");

    const thead = document.createElement("thead");
    const trh = document.createElement("tr");

    MEMBERS.forEach((m, i) => {
        const th = document.createElement("th");
        th.textContent = m;
        th.appendChild(createImg(MEMBER_IMAGES[i], "member-icon"));
        trh.appendChild(th);
    });

    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    const tr = document.createElement("tr");

    MEMBERS.forEach((_, c) => {
        const td = document.createElement("td");
        for (let r = 1; r < rows.length; r++) {
            const n = parseInt(rows[r][c + 2], 10);
            for (let i = 0; i < n; i++) {
                td.appendChild(createImg(rows[r][1], "pc-img"));
            }
        }
        tr.appendChild(td);
    });

    tbody.appendChild(tr);
    table.appendChild(tbody);
    section.appendChild(table);
}

/* Bonus + XXL */
async function buildBonusXXL() {
    const section = createSection(detailsContainer, "Bonus et Grandes images officiels");

    const bonus = await loadCSV(`./PC-csv/${prenom}/Bonus-off.csv`);
    const xxl = await loadCSV(`./PC-csv/${prenom}/Solo_XXL-off.csv`);

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const trh = document.createElement("tr");
    trh.appendChild(document.createElement("th"));

    MEMBERS.forEach((m, i) => {
        const th = document.createElement("th");
        th.textContent = m;
        th.appendChild(createImg(MEMBER_IMAGES[i], "member-icon"));
        trh.appendChild(th);
    });

    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    [
        { label: "Bonus", data: bonus },
        { label: "Grandes images", data: xxl }
    ].forEach(block => {
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.textContent = block.label;
        tr.appendChild(th);

        MEMBERS.forEach((_, c) => {
            const td = document.createElement("td");
            for (let r = 1; r < block.data.length; r++) {
                const n = parseInt(block.data[r][c + 2], 10);
                for (let i = 0; i < n; i++) {
                    td.appendChild(createImg(block.data[r][1], "pc-img"));
                }
            }
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    section.appendChild(table);
}

/* Duos visuels */
async function buildDuos(isOff) {
    const section = createSection(
        detailsContainer,
        isOff ? "Duos officiels" : "Duos non officiels"
    );

    const rows = await loadCSV(
        `./PC-csv/${prenom}/${isOff ? "Duos-off.csv" : "Duos-non_off.csv"}`
    );

    const header = rows[0];
    const table = document.createElement("table");
    table.classList.add("duo-table");

    const thead = document.createElement("thead");
    const trh = document.createElement("tr");
    trh.appendChild(document.createElement("th"));

    MEMBERS.forEach((m, i) => {
        const th = document.createElement("th");
        th.textContent = m;
        th.appendChild(createImg(MEMBER_IMAGES[i], "member-icon"));
        trh.appendChild(th);
    });

    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    MEMBERS.forEach((m, r) => {
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.textContent = m;
        th.appendChild(createImg(MEMBER_IMAGES[r], "member-icon"));
        tr.appendChild(th);

        MEMBERS.forEach((_, c) => {
            const td = document.createElement("td");

            if (c <= r) {
                td.classList.add("duo-disabled");
            } else {
                const idx = header.indexOf(`${r}${c}`);
                if (idx !== -1) {
                    for (let i = 1; i < rows.length; i++) {
                        const n = parseInt(rows[i][idx], 10);
                        for (let k = 0; k < n; k++) {
                            td.appendChild(createImg(isOff ? rows[i][1] : LOGO_IMAGE, "pc-img"));
                        }
                    }
                }
            }
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    section.appendChild(table);
}

/*************************************************
 * ====== PARTIE 2 : TABLEAUX RECAP ============
 *************************************************/

function emptyCounter() {
    return Array(9).fill(0);
}

function addSolo(counter, csv) {
    for (let r = 1; r < csv.length; r++) {
        for (let c = 0; c < 9; c++) {
            counter[c] += parseInt(csv[r][c + 2], 10);
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

function buildRecap(title, rows) {
    if (rows.every(r => r.values.every(v => v === 0))) return null;

    const section = createSection(recapContainer, title);
    const table = document.createElement("table");

    const thead = document.createElement("thead");
    const trh = document.createElement("tr");
    trh.appendChild(document.createElement("th"));

    MEMBERS.forEach((m, i) => {
        const th = document.createElement("th");
        th.textContent = m;
        th.appendChild(createImg(MEMBER_IMAGES[i], "member-icon"));
        trh.appendChild(th);
    });

    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    const totals = emptyCounter();

    rows.forEach(row => {
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.textContent = row.label;
        tr.appendChild(th);

        row.values.forEach((v, i) => {
            totals[i] += v;
            const td = document.createElement("td");
            td.textContent = v;
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    const trT = document.createElement("tr");
    trT.classList.add("total-row");
    const thT = document.createElement("th");
    thT.textContent = "Total";
    trT.appendChild(thT);

    totals.forEach((v, i) => {
        const td = document.createElement("td");
        td.textContent = v;
        td.appendChild(createImg(MEMBER_IMAGES[i], "member-icon"));
        trT.appendChild(td);
    });

    tbody.appendChild(trT);
    table.appendChild(tbody);
    section.appendChild(table);

    return totals;
}

/*************************************************
 * LANCEMENT
 *************************************************/

(async function init() {

    /* ===== DETAILS ===== */
    await buildPhotocardsOff();
    await buildBonusXXL();
    await buildDuos(true);
    await buildDuos(false);

    /* ===== RECAP ===== */
    const offP = emptyCounter();
    const offB = emptyCounter();
    const offX = emptyCounter();
    const offD = emptyCounter();

    addSolo(offP, await loadCSV(`./PC-csv/${prenom}/Solo-off.csv`));
    addSolo(offB, await loadCSV(`./PC-csv/${prenom}/Bonus-off.csv`));
    addSolo(offX, await loadCSV(`./PC-csv/${prenom}/Solo_XXL-off.csv`));
    addDuos(offD, await loadCSV(`./PC-csv/${prenom}/Duos-off.csv`));

    const totalOff = buildRecap("Officiel", [
        { label: "Photocards", values: offP },
        { label: "Bonus", values: offB },
        { label: "Grandes images", values: offX },
        { label: "Duos", values: offD }
    ]);

    const nonP = emptyCounter();
    const nonD = emptyCounter();

    addSolo(nonP, await loadCSV(`./PC-csv/${prenom}/Solo-non_off.csv`));
    addDuos(nonD, await loadCSV(`./PC-csv/${prenom}/Duos-non_off.csv`));

    const totalNon = buildRecap("Non officiel", [
        { label: "Photocards", values: nonP },
        { label: "Duos", values: nonD }
    ]);

    if (totalOff && totalNon) {
        const section = createSection(recapContainer, "Total cumulé");
        const table = document.createElement("table");

        const thead = document.createElement("thead");
        const trh = document.createElement("tr");
        trh.appendChild(document.createElement("th"));

        MEMBERS.forEach((m, i) => {
            const th = document.createElement("th");
            th.textContent = m;
            th.appendChild(createImg(MEMBER_IMAGES[i], "member-icon"));
            trh.appendChild(th);
        });

        thead.appendChild(trh);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.textContent = "Total";
        tr.appendChild(th);

        totalOff.forEach((v, i) => {
            const td = document.createElement("td");
            td.textContent = v + totalNon[i];
            td.appendChild(createImg(MEMBER_IMAGES[i], "member-icon"));
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
        table.appendChild(tbody);
        section.appendChild(table);
    }

})();
