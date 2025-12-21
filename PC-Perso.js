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

const container = document.getElementById("pc-container");

// prénom auto
const prenom = window.location.pathname
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
 * OUTILS DIVERS
 *************************************************/

function img(src, cls = "") {
    const i = document.createElement("img");
    i.src = src;
    if (cls) i.className = cls;
    return i;
}

function emptyCounter() {
    return Array(9).fill(0);
}

function isAllZero(arr) {
    return arr.every(v => v === 0);
}

/*************************************************
 * CALCULS
 *************************************************/

function addSolo(counter, csv) {
    for (let r = 1; r < csv.length; r++) {
        for (let c = 0; c < 9; c++) {
            counter[c] += parseInt(csv[r][c + 2], 10);
        }
    }
}

function addDuos(counter, csv) {
    const headers = csv[0];
    for (let r = 1; r < csv.length; r++) {
        for (let c = 2; c < headers.length; c++) {
            const value = parseInt(csv[r][c], 10);
            if (!value) continue;

            const a = parseInt(headers[c][0], 10);
            const b = parseInt(headers[c][1], 10);

            counter[a] += value;
            counter[b] += value;
        }
    }
}

/*************************************************
 * TABLEAU RÉCAP
 *************************************************/

function buildRecapTable(title, rowsData) {
    // vérifier si tout est vide
    if (rowsData.every(r => isAllZero(r.values))) return null;

    const wrapper = document.createElement("section");
    const h3 = document.createElement("h3");
    h3.textContent = title;
    wrapper.appendChild(h3);

    const table = document.createElement("table");

    /* ENTÊTE */
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

    /* CORPS */
    const tbody = document.createElement("tbody");
    const totals = emptyCounter();

    rowsData.forEach(row => {
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

    /* TOTAL */
    const trTotal = document.createElement("tr");
    trTotal.classList.add("total-row");

    const thTotal = document.createElement("th");
    thTotal.textContent = "Total";
    trTotal.appendChild(thTotal);

    totals.forEach((v, i) => {
        const td = document.createElement("td");
        td.textContent = v;
        td.appendChild(img(MEMBER_IMAGES[i], "member-icon"));
        trTotal.appendChild(td);
    });

    tbody.appendChild(trTotal);
    table.appendChild(tbody);
    wrapper.appendChild(table);

    return { wrapper, totals };
}

/*************************************************
 * INITIALISATION
 *************************************************/

(async function init() {

    container.innerHTML = "";

    /* STRUCTURE COLONNES */
    const colOff = document.createElement("div");
    colOff.className = "pc-column";

    const colNon = document.createElement("div");
    colNon.className = "pc-column";

    const sepV = document.createElement("div");
    sepV.className = "pc-separator-vertical";

    container.appendChild(colOff);
    container.appendChild(sepV);
    container.appendChild(colNon);

    colOff.innerHTML = "<h2>Officiel</h2>";
    colNon.innerHTML = "<h2>Non officiel</h2>";

    /* ===== OFFICIEL ===== */

    const offPhoto = emptyCounter();
    const offBonus = emptyCounter();
    const offXXL = emptyCounter();
    const offDuos = emptyCounter();

    addSolo(offPhoto, await loadCSV(`./PC-csv/${prenom}/Solo-off.csv`));
    addSolo(offBonus, await loadCSV(`./PC-csv/${prenom}/Bonus-off.csv`));
    addSolo(offXXL, await loadCSV(`./PC-csv/${prenom}/Solo_XXL-off.csv`));
    addDuos(offDuos, await loadCSV(`./PC-csv/${prenom}/Duos-off.csv`));

    const offTable = buildRecapTable("Officiel", [
        { label: "Photocards", values: offPhoto },
        { label: "Bonus", values: offBonus },
        { label: "Grandes images", values: offXXL },
        { label: "Duos", values: offDuos }
    ]);

    if (offTable) colOff.appendChild(offTable.wrapper);

    /* ===== NON OFFICIEL ===== */

    colNon.appendChild(Object.assign(document.createElement("div"), {
        className: "pc-separator-horizontal"
    }));

    const nonPhoto = emptyCounter();
    const nonDuos = emptyCounter();

    addSolo(nonPhoto, await loadCSV(`./PC-csv/${prenom}/Solo-non_off.csv`));
    addDuos(nonDuos, await loadCSV(`./PC-csv/${prenom}/Duos-non_off.csv`));

    const nonTable = buildRecapTable("Non officiel", [
        { label: "Photocards", values: nonPhoto },
        { label: "Duos", values: nonDuos }
    ]);

    if (nonTable) colNon.appendChild(nonTable.wrapper);

    /* ===== TOTAL CUMULÉ ===== */

    if (offTable && nonTable) {
        const totalWrapper = document.createElement("section");
        totalWrapper.style.gridColumn = "1 / span 3";

        const h2 = document.createElement("h2");
        h2.textContent = "Total cumulé";
        totalWrapper.appendChild(h2);

        const total = offTable.totals.map(
            (v, i) => v + nonTable.totals[i]
        );

        const totalTable = buildRecapTable("Total cumulé", [
            { label: "Total", values: total }
        ]);

        totalWrapper.appendChild(totalTable.wrapper);
        container.appendChild(totalWrapper);
    }

})();
