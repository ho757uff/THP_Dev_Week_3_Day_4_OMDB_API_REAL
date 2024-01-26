// Importer la clé API depuis un fichier externe
import API_KEY from './apikey.js';

// Fonction asynchrone pour rechercher des films en utilisant l'API OMDB
const searchMovies = async (searchTerm) => {
  // Construire l'URL de la requête avec le terme de recherche et la clé API
  const url = `http://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=${API_KEY}`;

  try {
    // Effectuer la requête GET à l'API OMDB
    const response = await fetch(url);
    // Convertir la réponse en format JSON
    const data = await response.json();
    // Retourner les résultats de recherche
    return data.Search;
  } catch (error) {
    console.error(`Erreur lors de la recherche de films : ${error}`);
    return []; // Retourner un tableau vide en cas d'erreur
  }
};

// Écouter l'événement de soumission du formulaire de recherche
document.getElementById('search-form').addEventListener('submit', async (event) => {
  event.preventDefault(); // Empêcher le rechargement de la page
  const searchTerm = document.getElementById('movie-title').value;
  const movies = await searchMovies(searchTerm);

  const resultsContainer = document.getElementById('movie-results');
  resultsContainer.innerHTML = ''; // Effacer les résultats précédents

  if (movies) {
    // Afficher les films trouvés dans la page
    movies.forEach(movie => {
      const movieElement = document.createElement('div');
      movieElement.innerHTML = `
        <h3>${movie.Title}</h3>
        <img src="${movie.Poster}" alt="${movie.Title}">
        <p>Année : ${movie.Year}</p>
      `;
      resultsContainer.appendChild(movieElement);
    });
  }
});

// Fonction pour ouvrir la modal avec les détails d'un film
const openModal = (movie) => {
  // Remplir la modal avec les détails du film
  document.getElementById('modalTitle').textContent = movie.Title;
  document.getElementById('modalDetails').textContent = `Année de sortie : ${movie.Year}`;
  document.getElementById('movieModal').style.display = 'block';
};

// Écouter à nouveau l'événement de soumission du formulaire de recherche
document.getElementById('search-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const searchTerm = document.getElementById('movie-title').value;
  const movies = await searchMovies(searchTerm);

  const resultsContainer = document.getElementById('movie-results');
  resultsContainer.innerHTML = '';

  if (movies) {
    // Afficher les films trouvés dans la page avec un bouton "Read more"
    movies.forEach(movie => {
      const movieElement = document.createElement('div');
      movieElement.classList.add('movie');
      movieElement.innerHTML = `
        <h3>${movie.Title}</h3>
        <img src="${movie.Poster}" alt="${movie.Title}">
        <p>Année : ${movie.Year}</p>
        <button class="btn btn-primary read-more" data-movie='${JSON.stringify(movie)}'>Read more</button>
      `;
      resultsContainer.appendChild(movieElement);

      // Écouter le clic sur le bouton "Read more" pour ouvrir la modal
      movieElement.querySelector('.read-more').addEventListener('click', () => {
        openModal(movie);
      });
    });

    // Observer l'apparition des éléments ".movie" pour l'animation
    document.querySelectorAll('.movie').forEach(movie => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateX(0)';
          }
        });
      }, { threshold: 0.5 });

      observer.observe(movie);
    });
  }
});

// Écouter le clic sur le bouton "Fermer" dans la modal pour la fermer
document.querySelector('.modal-close').addEventListener('click', () => {
  document.getElementById('movieModal').style.display = 'none';
});
