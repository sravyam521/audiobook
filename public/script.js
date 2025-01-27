// Load filters for language, subject, and author
async function loadFilters() {
    try {
        const response = await fetch('/api/filters');
        const filters = await response.json();

        // Populate language filter
        const languageFilter = document.getElementById('languageFilter');
        filters.languages.forEach(language => {
            const option = document.createElement('option');
            option.value = language;
            option.textContent = language;
            languageFilter.appendChild(option);
        });

        // Populate subject filter
        const subjectFilter = document.getElementById('subjectFilter');
        filters.subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            subjectFilter.appendChild(option);
        });

        // Populate author filter
        const authorFilter = document.getElementById('authorFilter');
        filters.authors.forEach(author => {
            const option = document.createElement('option');
            option.value = author;
            option.textContent = author;
            authorFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading filter options:', error);
    }
}

function togglefilters(){
    filt = document.getElementById('filters');
    filt.classList.toggle('hide');
}

// Load books and display them
async function loadBooks() {
    try {
        const response = await fetch('/api/books');
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

// Display books with filters and search
function displayBooks(books) {
    const container = document.querySelector('.container');
    container.innerHTML = ''; // Clear previous content

    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book';
        bookDiv.innerHTML = `
            <img src="${book.image_link}" alt="${book.name}">
            <h2>${book.name}</h2>
        `;
        bookDiv.onclick = () => loadChapters(book.book_id, book.image_link); // Pass book image as well
        container.appendChild(bookDiv);
    });
}

// Load chapters for a specific book
async function loadChapters(bookId, bookImage) {
    try {
        const response = await fetch(`/api/books/${bookId}/chapters`);
        const chapters = await response.json();

        // Update book image in the player
        const playerDiv = document.querySelector('.player');
        let bookImageContainer = playerDiv.querySelector('.book-image');

        if (!bookImageContainer) {
            bookImageContainer = document.createElement('div');
            bookImageContainer.className = 'book-image';
            playerDiv.insertBefore(bookImageContainer, playerDiv.firstChild);
        }

        bookImageContainer.innerHTML = `<img src="${bookImage}" alt="Book Cover" />`;

        // Find or create the chapters container
        let chaptersContainer = playerDiv.querySelector('.chapters-container');

        if (!chaptersContainer) {
            chaptersContainer = document.createElement('div');
            chaptersContainer.className = 'chapters-container';
            playerDiv.appendChild(chaptersContainer);
        }

        // Clear previous chapters
        chaptersContainer.innerHTML = `<h3>Chapters</h3>`;

        // Add chapters to the container
        chapters.forEach(chapter => {
            const chapterDiv = document.createElement('div');
            chapterDiv.className = 'chapter';
            chapterDiv.textContent = `Chapter ${chapter.chapter_number}: ${chapter.chapter_name}`;
            chapterDiv.onclick = () => playChapter(chapter.audio_link);
            chaptersContainer.appendChild(chapterDiv);
        });
        const player = document.getElementById('player');
        player.classList.toggle('hidemobonly')
    } catch (error) {
        console.error('Error loading chapters:', error);
    }
}

function closeplayer(){
    const player = document.getElementById('player');
    player.classList.toggle('hidemobonly')
}

// Play audio for a selected chapter
function playChapter(audioSrc) {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = audioSrc;
    audioPlayer.play();
}

// Audio player controls
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const muteBtn = document.getElementById('muteBtn');

// Play / Pause functionality
playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
});

audioPlayer.addEventListener('play', () => {
    playPauseBtn.innerHTML = '<i class="fa fa-pause"></i>';
});

audioPlayer.addEventListener('pause', () => {
    playPauseBtn.innerHTML = '<i class="fa fa-play"></i>';
});

audioPlayer.addEventListener('timeupdate', () => {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;

    progressBar.value = (currentTime / duration) * 100;
    currentTimeDisplay.textContent = formatTime(currentTime);
    durationDisplay.textContent = formatTime(duration);
});

progressBar.addEventListener('input', () => {
    const seekTime = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
});

muteBtn.addEventListener('click', () => {
    audioPlayer.muted = !audioPlayer.muted;
    muteBtn.innerHTML = audioPlayer.muted ? '<i class="fa fa-volume-mute"></i>' : '<i class="fa fa-volume-up"></i>';
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
}

// Suggestion handling
async function fetchSuggestions() {
    try {
        const response = await fetch('/api/suggestions');
        const suggestions = await response.json();
        const suggestionsContainer = document.getElementById('submittedSuggestions');
        suggestionsContainer.innerHTML = suggestions.map(s => `
            <p>${s.comment_text} - <small>${new Date(s.created_at).toLocaleString()}</small></p>
        `).join('');
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

document.getElementById('submitSuggestion').addEventListener('click', async () => {
    const suggestionInput = document.getElementById('suggestionInput');
    const commentText = suggestionInput.value.trim();
    if (!commentText) {
        alert('Please write a suggestion before submitting.');
        return;
    }

    try {
        const response = await fetch('/api/suggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment_text: commentText }),
        });

        if (response.ok) {
            suggestionInput.value = '';
            fetchSuggestions();
        } else {
            alert('Error submitting suggestion.');
        }
    } catch (error) {
        console.error('Error submitting suggestion:', error);
    }
});

// Initialize the filters, books, and suggestions
loadFilters();
loadBooks();
fetchSuggestions();
