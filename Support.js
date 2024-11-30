document.addEventListener("DOMContentLoaded", function() {
    // Load header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading header:', error));

    // Load footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));

    // Search functionality
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');

    searchButton.addEventListener('click', function() {
        const query = searchInput.value.toLowerCase();
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query) ? '' : 'none';
        });
    });
});
