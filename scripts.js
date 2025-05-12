document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const searchInput = document.getElementById('movie-search');
    const searchBtn = document.querySelector('.search-btn');
    const movieCards = document.querySelectorAll('.movie-card');

    // Dark mode functionality
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    // Search functionality
    const handleSearch = () => {
        const searchTerm = searchInput.value.toLowerCase();
        movieCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const isVisible = title.includes(searchTerm) || description.includes(searchTerm);
            card.style.display = isVisible ? 'block' : 'none';
        });
    };

    searchInput.addEventListener('input', handleSearch);
    searchBtn.addEventListener('click', handleSearch);
});