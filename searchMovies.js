import API_KEY from './apikey.js';

//const searchMovies = async (searchTerm) => {
// Ici, vous devrez remplacer 'YOUR_API_KEY' par votre clé API réelle
//const apiKey = process.env.OMDB_API_KEY; // Remplacez 'YOUR_API_KEY' si vous exécutez sur un serveur
//const url = `http://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=${apiKey}`;

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
