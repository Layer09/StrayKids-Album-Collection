// Récupérer le prénom depuis le nom de fichier
const pageName = window.location.pathname.split("/").pop(); // ex: "Albums-Laurana.html"
const prenom = pageName.match(/^Albums-(.+)\.html$/)[1];   // "Laurana"
const csvFile = `./Albums-${prenom}.csv`;                        // "./Laurana.csv"

// Charger Albums.csv et le CSV spécifique du prénom
    Promise.all([
        fetch('./Albums.csv').then(r => r.text()),
        fetch(csvFile).then(r => r.text())
    ])
    .then(([albumsData, persoData]) => {
        const albums = parseAlbumsCSV(albumsData);
        const persoMap = parsePersoCSV(persoData);

        renderAlbums(albums, persoMap);
        updateObtainedAlbumCounter(albums, persoMap);
    })
    .catch(err => {
        console.error("Erreur de chargement des CSV :", err);
    });
}

// Parsing Albums.csv
function parseAlbumsCSV(data) {
    const lines = data.trim().split('\n');
    lines.shift();

    const albums = {};

    lines.forEach(line => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const id = values[0];
        const albumName = values[1];
        const path = values[2];
        const nom = values[3];
        const dimension = values[4];

        if (!albums[albumName]) {
            albums[albumName] = {
                cover: null,
                images: []
            };
        }

        if (nom === 'Couverture') {
            albums[albumName].cover = path;
        }

        if (dimension === 'A' || dimension === 'B') {
            albums[albumName].images.push({
                id,
                path,
                nom,
                dimension
            });
        }
    });

    return albums;
}

// Parsing Albums-Prenom.csv
function parsePersoCSV(data) {
    const lines = data.trim().split('\n');
    lines.shift();

    const map = {};

    lines.forEach(line => {
        const values = line.split(',').map(v => v.trim());
        map[values[0]] = values[1]; // "0" ou "1"
    });

    return map;
}

// Rendu des albums
function renderAlbums(albums, persoMap) {
    const container = document.getElementById('albums-container');
    container.innerHTML = '';

    Object.keys(albums).forEach(albumName => {
        const album = albums[albumName];

        const section = document.createElement('section');
        section.className = 'album-section';

        const title = document.createElement('h2');
        title.className = 'album-title';
        title.textContent = albumName;

        const content = document.createElement('div');
        content.className = 'album-content';

        const cover = document.createElement('img');
        cover.className = 'album-cover';
        cover.src = album.cover;

        const rectangle = document.createElement('div');
        rectangle.className = 'album-rectangle';

        const imagesContainer = document.createElement('div');
        imagesContainer.className = 'album-images';

        album.images.forEach(imgData => {
            const block = document.createElement('div');
            block.className = 'album-image-block';

            const name = document.createElement('div');
            name.className = 'image-name';
            name.textContent = imgData.nom;

            const img = document.createElement('img');
            img.src = imgData.path;
            img.className = imgData.dimension === 'A' ? 'image-A' : 'image-B';
            img.title = imgData.id;

            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';

            const obtenu = persoMap[imgData.id];
            if (obtenu === '1') {
                placeholder.textContent = 'Acquis ✓';
                placeholder.style.color = '#6aff6a';
            } else {
                placeholder.textContent = 'Manquant ✕';
                placeholder.style.color = '#ff6a6a';
            }

            block.appendChild(name);
            block.appendChild(img);
            block.appendChild(placeholder);

            imagesContainer.appendChild(block);
        });

        rectangle.appendChild(imagesContainer);
        content.appendChild(cover);
        content.appendChild(rectangle);

        section.appendChild(title);
        section.appendChild(content);

        container.appendChild(section);
    });
}

// Compteur X / Y
function updateObtainedAlbumCounter(albums, persoMap) {
    let obtainedCount = 0;
    const totalCount = Object.keys(albums).length;

    Object.values(albums).forEach(album => {
        const allObtained = album.images.length > 0 &&
            album.images.every(img => persoMap[img.id] === '1');

        if (allObtained) {
            obtainedCount++;
        }
    });

    const counter = document.getElementById('album-counter');
    if (counter) {
        counter.textContent = `Nombre d'albums obtenus : ${obtainedCount} / ${totalCount}`;
    }
}
