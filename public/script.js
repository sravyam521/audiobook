document.addEventListener('DOMContentLoaded', function () {
    function announce(message) {
        const utterance = new SpeechSynthesisUtterance(message);
        speechSynthesis.speak(utterance);
    }

    // Check if elements exist before adding event listeners
    const languageFilter = document.getElementById('languageFilter');
    const subjectFilter = document.getElementById('subjectFilter');
    const authorFilter = document.getElementById('authorFilter');
    const searchInput = document.getElementById('searchInput');
    const books = document.querySelectorAll('.book.clickable-box');

    if (languageFilter) {
        languageFilter.addEventListener('click', (e) => announce(`To Select Language`));
    }

    if (subjectFilter) {
        subjectFilter.addEventListener('click', (e) => announce(`To Select Subject`));
    }

    if (authorFilter) {
        authorFilter.addEventListener('click', (e) => announce(`To Select Author`));
    }

    if (searchInput) {
        searchInput.addEventListener('click', () => announce(`To search the book`));
    }

    if (suggestionBox) {
        suggestionBox.addEventListener("click", () => announce(`The required audiobook`));
    }

    if (books.length > 0) {
        books.forEach(book => {
            book.addEventListener('click', () => announce('Opening book...'));
        });
    }
});
