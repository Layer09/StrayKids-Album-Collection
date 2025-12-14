fetch('./Albums.csv')
    .then(response => response.text())
    .then(data => {
        const lines = data.trim().split('\n');
        const headers = lines.shift(); // retire l'en-tête

        const albums = {};

        lines.forEach(line => {
            const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
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
                    path,
                    nom,
                    dimension
                });
            }
        });

        renderAlbums(albums);
    });

function renderAlbums(albums) {
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

            // Nom de l'image au-dessus
            const name = document.createElement('div');
            name.className = 'image-name';
            name.textContent = imgData.nom;

            // Conteneur pour l'aura dorée
            const auraContainer = document.createElement('div');
            auraContainer.style.position = 'relative'; // nécessaire pour les étincelles
            if (imgData.path.includes('Ver-limite.jpg')) {
                auraContainer.classList.add('gold-aura');
            }

            // Image
            const img = document.createElement('img');
            img.src = imgData.path;
            img.className = imgData.dimension === 'A' ? 'image-A' : 'image-B';
            img.style.display = 'block'; // important pour les pseudo-éléments

            auraContainer.appendChild(img);

            // Placeholder "?" en dessous de l'image
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.textContent = '?';

            // On assemble le block
            block.appendChild(name);
            block.appendChild(auraContainer);
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
