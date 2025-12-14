// Récupérer le prénom depuis le nom de fichier
const pageName = window.location.pathname.split("/").pop(); // ex: "Albums-Laurana.html"
const prenom = pageName.match(/^Albums-(.+)\.html$/)[1];   // "Laurana"
const csvFile = `./Albums-${prenom}.csv`;                        // "./Laurana.csv"

// Charger Albums.csv et le CSV spécifique du prénom
Promise.all([
    fetch('./Albums.csv').then(r => r.text()),
    fetch(csvFile).then(r => r.text())
]).then(([albumsData, persoData]) => {

    // --- Albums.csv ---
    const albumLines = albumsData.trim().split('\n');
    albumLines.shift();
    const albums = {};

    albumLines.forEach(line => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const id = values[0];
        const albumName = values[1];
        const path = values[2];
        const nom = values[3];
        const dimension = values[4];

        if (!albums[albumName]) albums[albumName] = { cover: null, images: [] };
        if (nom === 'Couverture') albums[albumName].cover = path;
        if (dimension === 'A' || dimension === 'B') {
            albums[albumName].images.push({ id, path, nom, dimension });
        }
    });

    // --- CSV spécifique du prénom ---
    const persoLines = persoData.trim().split('\n');
    persoLines.shift();
    const persoMap = {}; // id => obtenu
    persoLines.forEach(line => {
        const values = line.split(',').map(v => v.trim());
        persoMap[values[0]] = values[1]; // 0 ou 1
    });

    renderAlbums(albums, persoMap);
});

// --- Fonction pour afficher les albums ---
function renderAlbums(albums, persoMap) {
    const container = document.getElementById('albums-container');

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

            const imageContainer = document.createElement('div');
            imageContainer.style.position = 'relative';

            const img = document.createElement('img');
            img.src = imgData.path;
            img.className = imgData.dimension === 'A' ? 'image-A' : 'image-B';
            img.style.display = 'block';
            img.title = imgData.id; // tooltip avec ID

            imageContainer.appendChild(img);

            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';

            const obtenu = persoMap[imgData.id];
            if (obtenu === '1') {
                placeholder.textContent = 'Acquis ✓';
                placeholder.style.color = 'green';
            } else {
                placeholder.textContent = 'Manquant ☹';
                placeholder.style.color = 'red';
            }

            block.appendChild(name);
            block.appendChild(imageContainer);
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
