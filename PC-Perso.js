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

// Récupération automatique du prénom depuis le nom du fichier HTML
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
    return text.trim().split("\n").map(line =>
        line.split(",").map(v => v.trim())
    );
}

/*************************************************
 * OUTILS HTML
 *************************************************/

function createSection(title) {
    const section = document.createElement("section");
    const h2 = document.createElement("h2");
    h2.textContent = title;
    section.appendChild(h2);
    container.appendChild(section);
    return section;
}

function createImg(src, className = "") {
    const img = document.createElement("img");
    img.src = src;
    if (className) img.className = className;
    return img;
}

/*************************************************
 * SOLOS OFF (classique / XXL / Bonus)
 *************************************************/

/*************************************************
 * SOLOS OFFICIELS (CLASSIQUES)
 *************************************************/

async function buildSoloOfficielSimple() {
    const section = createSection("Solos officiels");
    const rows = await loadCSV(`./PC-csv/${prenom}/Solo-off.csv`);

    const table = document.createElement("table");

    /* ===== ENTÊTE ===== */
    const thead = document.createElement("thead");
    const trh = document.createElement("tr");

    MEMBERS.forEach((name, i) => {
        const th = document.createElement("th");
        th.textContent = name;
        th.appendChild(createImg(MEMBER_IMAGES[i], "member-icon"));
        trh.appendChild(th);
    });

    thead.appendChild(trh);
    table.appendChild(thead);

    /* ===== LIGNE UNIQUE ===== */
    const tbody = document.createElement("tbody");
    const tr = document.createElement("tr");

    MEMBERS.forEach((_, memberIndex) => {
        const td = document.createElement("td");

        for (let i = 1; i < rows.length; i++) {
            const albumImg = rows[i][1];
            const value = parseInt(rows[i][memberIndex + 2], 10);

            for (let n = 0; n < value; n++) {
                td.appendChild(createImg(albumImg, "pc-img"));
            }
        }

        tr.appendChild(td);
    });

    tbody.appendChild(tr);
    table.appendChild(tbody);
    section.appendChild(table);
}

/*************************************************
 * BONUS & GRANDES IMAGES OFFICIELS
 *************************************************/

async function buildBonusXXLOfficiel() {
    const section = createSection("Bonus et Grandes images officiels");

    const bonus = await loadCSV(`./PC-csv/${prenom}/Bonus-off.csv`);
    const xxl = await loadCSV(`./PC-csv/${prenom}/Solo_XXL-off.csv`);

    const table = document.createElement("table");

    /* ===== ENTÊTE ===== */
    const thead = document.createElement("thead");
    const trh = document.createElement("tr");

    trh.appendChild(document.createElement("th")); // colonne vide

    MEMBERS.forEach((name, i) => {
        const th = document.createElement("th");
        th.textContent = name;
        th.appendChild(createImg(MEMBER_IMAGES[i], "member-icon"));
        trh.appendChild(th);
    });

    thead.appendChild(trh);
    table.appendChild(thead);

    /* ===== CORPS ===== */
    const tbody = document.createElement("tbody");

    [
        { label: "Bonus", data: bonus },
        { label: "Grandes images", data: xxl }
    ].forEach(block => {
        const tr = document.createElement("tr");

        const th = document.createElement("th");
        th.textContent = block.label;
        tr.appendChild(th);

        MEMBERS.forEach((_, memberIndex) => {
            const td = document.createElement("td");

            for (let i = 1; i < block.data.length; i++) {
                const img = block.data[i][1];
                const value = parseInt(block.data[i][memberIndex + 2], 10);

                for (let n = 0; n < value; n++) {
                    td.appendChild(createImg(img, "pc-img"));
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
 * DUOS OFF / NON OFF
 *************************************************/

async function buildDuosTable(isOff) {
    const title = isOff ? "Duos officiels" : "Duos non officiels";
    const section = createSection(title);

    const path = isOff
        ? `./PC-csv/${prenom}/Duos-off.csv`
        : `./PC-csv/${prenom}/Duos-non_off.csv`;

    const rows = await loadCSV(path);
    const header = rows[0];

    const table = document.createElement("table");
    table.classList.add("duo-table");


    // ENTÊTE
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headRow.appendChild(document.createElement("th"));

    MEMBERS.forEach((name, i) => {
        const th = document.createElement("th");
        th.textContent = name;
        th.appendChild(createImg(MEMBER_IMAGES[i], "member-icon"));
        headRow.appendChild(th);
    });

    thead.appendChild(headRow);
    table.appendChild(thead);

    // CORPS
    const tbody = document.createElement("tbody");

    MEMBERS.forEach((rowMember, rowIndex) => {
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.textContent = rowMember;
        tr.appendChild(th);

        MEMBERS.forEach((_, colIndex) => {
            const td = document.createElement("td");
            
            if (colIndex < rowIndex) {
                td.classList.add("duo-disabled");
            }

            if (colIndex > rowIndex) {
                const duoCode = `${rowIndex}${colIndex}`;
                const duoIndex = header.indexOf(duoCode);

                if (duoIndex !== -1) {
                    for (let i = 1; i < rows.length; i++) {
                        const value = parseInt(rows[i][duoIndex], 10);
                        const imgSrc = isOff ? rows[i][1] : LOGO_IMAGE;

                        for (let n = 0; n < value; n++) {
                            td.appendChild(createImg(imgSrc, "pc-img"));
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
 * SOLOS NON OFF
 *************************************************/

async function buildSoloNonOff() {
    const section = createSection("Solos non officiels");

    const rows = await loadCSV(`./PC-csv/${prenom}/Solo-non_off.csv`);
    const values = rows[1];

    const table = document.createElement("table");

    const thead = document.createElement("thead");
    const trh = document.createElement("tr");
    MEMBERS.forEach((name, i) => {
        const th = document.createElement("th");
        th.textContent = name;
        th.appendChild(createImg(MEMBER_IMAGES[i], "member-icon"));
        trh.appendChild(th);
    });
    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    const tr = document.createElement("tr");

    values.forEach(v => {
        const td = document.createElement("td");
        const count = parseInt(v, 10);
        for (let i = 0; i < count; i++) {
            td.appendChild(createImg(LOGO_IMAGE, "pc-img"));
        }
        tr.appendChild(td);
    });

    tbody.appendChild(tr);
    table.appendChild(tbody);
    section.appendChild(table);
}

/*************************************************
 * LANCEMENT
 *************************************************/

(async function init() {
    await buildSoloOfficielSimple();
    await buildBonusXXLOfficiel();
    await buildDuosTable(true);
    await buildDuosTable(false);
    await buildSoloNonOff();
})();
