// TMDB API configuration
const API_KEY = '19a14bc5d901149be0309256757968fa'; // Replace with your TMDB API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// DOM Elements
const moviesGrid = document.getElementById('moviesGrid');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');
const categoryBtns = document.querySelectorAll('.category-btn');
const modal = document.getElementById('movieModal');
const modalBody = modal.querySelector('.modal-body');
const closeBtn = modal.querySelector('.close-btn');

// Current state
let currentCategory = 'popular';

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchMovies(currentCategory);
});

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        currentCategory = category;
        
        // Update active button
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        fetchMovies(category);
    });
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Functions
async function fetchMovies(category) {
    try {
        let url;
        if (category === 'search') {
            const query = searchInput.value.trim();
            url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
        } else {
            url = `${BASE_URL}/movie/${category}?api_key=${API_KEY}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching movies:', error);
        moviesGrid.innerHTML = '<p class="error">Error loading movies. Please try again later.</p>';
    }
}

function displayMovies(movies) {
    moviesGrid.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.onclick = () => showMovieDetails(movie.id);

        const posterPath = movie.poster_path
            ? `${IMAGE_BASE_URL}/w500${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Poster+Available';

        movieCard.innerHTML = `
            <img class="movie-poster" src="${posterPath}" alt="${movie.title}">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-rating">
                    <div class="rating-circle">${Math.round(movie.vote_average * 10)}%</div>
                    <span>${new Date(movie.release_date).getFullYear()}</span>
                </div>
            </div>
        `;

        moviesGrid.appendChild(movieCard);
    });
}

async function showMovieDetails(movieId) {
    try {
        const [movieDetails, videos] = await Promise.all([
            fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`).then(res => res.json()),
            fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`).then(res => res.json())
        ]);

        const trailer = videos.results.find(video => video.type === 'Trailer') || videos.results[0];
        const posterPath = movieDetails.poster_path
            ? `${IMAGE_BASE_URL}/w500${movieDetails.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Poster+Available';

        modalBody.innerHTML = `
            <div class="movie-detail">
                <img class="detail-poster" src="${posterPath}" alt="${movieDetails.title}">
                <div class="detail-info">
                    <h2 class="detail-title">${movieDetails.title} (${new Date(movieDetails.release_date).getFullYear()})</h2>
                    <div class="movie-rating">
                        <div class="rating-circle">${Math.round(movieDetails.vote_average * 10)}%</div>
                        <span>User Score</span>
                    </div>
                    <h3>Overview</h3>
                    <p class="detail-overview">${movieDetails.overview}</p>
                    <p><strong>Genres:</strong> ${movieDetails.genres.map(genre => genre.name).join(', ')}</p>
                    <p><strong>Runtime:</strong> ${movieDetails.runtime} minutes</p>
                </div>
            </div>
            ${trailer ? `
                <div class="trailer-container">
                    <h3>Trailer</h3>
                    <iframe
                        src="https://www.youtube.com/embed/${trailer.key}"
                        frameborder="0"
                        allowfullscreen
                    ></iframe>
                </div>
            ` : ''}
        `;

        modal.style.display = 'block';
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

function handleSearch() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        currentCategory = 'search';
        categoryBtns.forEach(btn => btn.classList.remove('active'));
        fetchMovies('search');
    }
} 