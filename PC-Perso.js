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

async function buildSoloOffTable() {
    const section = createSection("Solos officiels");

    const files = {
        Photocard: `./PC-csv/${prenom}/Solo-off.csv`,
        "Grandes images": `./PC-csv/${prenom}/Solo_XXL-off.csv`,
        Bonus: `./PC-csv/${prenom}/Bonus-off.csv`
    };

    const data = {};
    for (const key in files) {
        data[key] = await loadCSV(files[key]);
    }

    const table = document.createElement("table");

    // ENTÊTE
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
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

    for (const type in data) {
        const rows = data[type];
        const header = rows[0];

        const tr = document.createElement("tr");
        const label = document.createElement("td");
        label.textContent = type;
        tr.appendChild(label);

        MEMBERS.forEach((_, memberIndex) => {
            const td = document.createElement("td");

            for (let i = 1; i < rows.length; i++) {
                const albumPath = rows[i][1];
                const value = parseInt(rows[i][memberIndex + 2], 10);

                for (let n = 0; n < value; n++) {
                    td.appendChild(createImg(albumPath, "pc-img"));
                }
            }
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    }

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
    await buildSoloOffTable();
    await buildDuosTable(true);
    await buildDuosTable(false);
    await buildSoloNonOff();
})();
