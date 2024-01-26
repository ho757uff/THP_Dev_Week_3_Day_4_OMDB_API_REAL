import API_KEY from './apikey.js';

const searchMovies = async (searchTerm) => {
  const url = `http://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.Search;
  } catch (error) {
    console.error(`Erreur lors de la recherche de films : ${error}`);
    return []; // Retourne un tableau vide en cas d'erreur
  }
};

document.getElementById('search-form').addEventListener('submit', async (event) => {
  event.preventDefault(); // Empêche le rechargement de la page
  const searchTerm = document.getElementById('movie-title').value;
  const movies = await searchMovies(searchTerm);

  const resultsContainer = document.getElementById('movie-results');
  resultsContainer.innerHTML = ''; // Efface les résultats précédents

  if (movies) {
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

const openModal = (movie) => {
  document.getElementById('modalTitle').textContent = movie.Title;
  document.getElementById('modalDetails').textContent = `Année de sortie : ${movie.Year}`;
  document.getElementById('movieModal').style.display = 'block';
};

document.getElementById('search-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const searchTerm = document.getElementById('movie-title').value;
  const movies = await searchMovies(searchTerm);

  const resultsContainer = document.getElementById('movie-results');
  resultsContainer.innerHTML = '';

  if (movies) {
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

      movieElement.querySelector('.read-more').addEventListener('click', () => {
        openModal(movie);
      });
    });

    // Intersection Observer pour l'animation
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

// Fermer la modal
document.querySelector('.modal-close').addEventListener('click', () => {
  document.getElementById('movieModal').style.display = 'none';
});