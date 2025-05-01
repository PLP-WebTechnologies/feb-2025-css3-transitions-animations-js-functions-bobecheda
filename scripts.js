document.addEventListener('DOMContentLoaded', () => {
    // Initialize localStorage if needed
    if (!localStorage.getItem('favorites')) {
        localStorage.setItem('favorites', JSON.stringify([]));
    }
    if (!localStorage.getItem('ratings')) {
        localStorage.setItem('ratings', JSON.stringify({}));
    }

    // Load saved states
    loadFavorites();
    loadRatings();

    // Setup event listeners
    setupFavoriteButtons();
    setupRatingStars();
});

function setupFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(btn => {
        const movieId = btn.closest('.movie-card').dataset.movieId;
        const favorites = JSON.parse(localStorage.getItem('favorites'));

        // Set initial state
        if (favorites.includes(movieId)) {
            btn.classList.add('active');
        }

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleFavorite(movieId, btn);
        });
    });
}

function setupRatingStars() {
    const movieCards = document.querySelectorAll('.movie-card');
    movieCards.forEach(card => {
        const movieId = card.dataset.movieId;
        const stars = card.querySelectorAll('.star');
        const ratings = JSON.parse(localStorage.getItem('ratings'));

        // Set initial state
        if (ratings[movieId]) {
            highlightStars(stars, ratings[movieId]);
        }

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.dataset.rating);
                rateMovie(movieId, rating, stars);
            });

            star.addEventListener('mouseover', () => {
                const rating = parseInt(star.dataset.rating);
                highlightStars(stars, rating, true);
            });

            star.addEventListener('mouseout', () => {
                const ratings = JSON.parse(localStorage.getItem('ratings'));
                const currentRating = ratings[movieId] || 0;
                highlightStars(stars, currentRating);
            });
        });
    });
}

function toggleFavorite(movieId, btn) {
    const favorites = JSON.parse(localStorage.getItem('favorites'));
    const index = favorites.indexOf(movieId);

    if (index === -1) {
        favorites.push(movieId);
        btn.classList.add('active');
        animateFavoriteButton(btn, true);
    } else {
        favorites.splice(index, 1);
        btn.classList.remove('active');
        animateFavoriteButton(btn, false);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesSection();
}

function rateMovie(movieId, rating, stars) {
    const ratings = JSON.parse(localStorage.getItem('ratings'));
    ratings[movieId] = rating;
    localStorage.setItem('ratings', JSON.stringify(ratings));

    highlightStars(stars, rating);
    animateRating(stars[rating - 1]);
}

function highlightStars(stars, rating, isHover = false) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.style.color = isHover ? '#ffa502' : '#ffd700';
            star.style.transform = 'scale(1.2)';
        } else {
            star.style.color = '#ddd';
            star.style.transform = 'scale(1)';
        }
    });
}

function animateFavoriteButton(btn, isActive) {
    btn.style.transform = 'scale(1.3)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 200);
}

function animateRating(star) {
    star.style.transform = 'scale(1.3) rotate(20deg)';
    setTimeout(() => {
        star.style.transform = 'scale(1) rotate(0deg)';
    }, 200);
}

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites'));
    favorites.forEach(movieId => {
        const btn = document.querySelector(`.movie-card[data-movie-id="${movieId}"] .favorite-btn`);
        if (btn) btn.classList.add('active');
    });
    updateFavoritesSection();
}

function loadRatings() {
    const ratings = JSON.parse(localStorage.getItem('ratings'));
    Object.entries(ratings).forEach(([movieId, rating]) => {
        const stars = document.querySelectorAll(`.movie-card[data-movie-id="${movieId}"] .star`);
        if (stars.length) highlightStars(stars, rating);
    });
}

function updateFavoritesSection() {
    const favoritesContainer = document.querySelector('.favorites-container');
    const favorites = JSON.parse(localStorage.getItem('favorites'));

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p>No favorites yet. Click the heart icon to add movies to your favorites!</p>';
        return;
    }

    const favoriteMovies = favorites.map(movieId => {
        const movieCard = document.querySelector(`.movie-card[data-movie-id="${movieId}"]`);
        if (movieCard) {
            return movieCard.cloneNode(true);
        }
    }).filter(Boolean);

    favoritesContainer.innerHTML = '';
    favoriteMovies.forEach(movie => {
        favoritesContainer.appendChild(movie);
    });

    // Reinitialize event listeners for cloned elements
    setupFavoriteButtons();
    setupRatingStars();
}