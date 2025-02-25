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

async function loadBooks() {
    try {
        const response = await fetch('/api/books');
        const books = await response.json();
        displayBooks(books); // Function to display books based on filters
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

function displayBooks(books) {
    const container = document.querySelector('.container');
    container.innerHTML = ''; // Clear previous content

    // Get the filter and search input values
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const selectedLanguage = document.getElementById('languageFilter').value;
    const selectedSubject = document.getElementById('subjectFilter').value;
    const selectedAuthor = document.getElementById('authorFilter').value;

    // Filter books based on search and selected filters
    const filteredBooks = books.filter(book => {
        const matchesSearch = book.name.toLowerCase().includes(searchQuery);
        const matchesLanguage = selectedLanguage ? book.language === selectedLanguage : true;
        const matchesSubject = selectedSubject ? book.subject === selectedSubject : true;
        const matchesAuthor = selectedAuthor ? book.author === selectedAuthor : true;

        return matchesSearch && matchesLanguage && matchesSubject && matchesAuthor;
    });

    // Display filtered books
    filteredBooks.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book';
        bookDiv.innerHTML = `
            <img src="${book.image_link}" alt="${book.name}">
            <h2>${book.name}</h2>
        `;
        bookDiv.onclick = () => loadChapters(book.book_id, bookDiv);
        container.appendChild(bookDiv);
    });
}

// Event listeners for filter changes and search input
document.getElementById('searchInput').addEventListener('input', () => loadBooks());
document.getElementById('languageFilter').addEventListener('change', () => loadBooks());
document.getElementById('subjectFilter').addEventListener('change', () => loadBooks());
document.getElementById('authorFilter').addEventListener('change', () => loadBooks());

// Initialize the filters and load books
loadFilters();
loadBooks();


async function loadChapters(bookId, bookDiv) {
    try {
        const response = await fetch(`/api/books/${bookId}/chapters`);
        const chapters = await response.json();
        
        let chaptersDiv = bookDiv.querySelector('.chapters');
        
        // If chaptersDiv doesn't exist, create it
        if (!chaptersDiv) {
            chaptersDiv = document.createElement('div');
            chaptersDiv.className = 'chapters';
            
            chapters.forEach(chapter => {
                const chapterDiv = document.createElement('div');
                const hline = document.createElement('hr');
                chapterDiv.className = 'chapter';
                chapterDiv.textContent = `Chapter ${chapter.chapter_number}: ${chapter.chapter_name}`;
                chapterDiv.onclick = (e) => {
                    e.stopPropagation();
                    playChapter(chapter.audio_link);
                };
                chaptersDiv.appendChild(chapterDiv);
                chaptersDiv.appendChild(hline);
            });
            
            bookDiv.appendChild(chaptersDiv);  // Append chaptersDiv if it was newly created
        }

        // Toggle chapters visibility
        if (chaptersDiv.style.display === 'block') {
            chaptersDiv.style.display = 'none';
        } else {
            chaptersDiv.style.display = 'block';
        }

    } catch (error) {
        console.error('Error loading chapters:', error);
    }
}


function playChapter(audioSrc) {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = audioSrc;
    audioPlayer.play();
}

loadBooks();

//audio
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const muteBtn = document.getElementById('muteBtn');

// Play / Pause functionality
playPauseBtn.addEventListener('click', () => {
  if (audioPlayer.paused) {
    audioPlayer.play(); // Start playing audio
  } else {
    audioPlayer.pause(); // Pause the audio
  }
});

// Update the play/pause button when the audio starts or pauses
audioPlayer.addEventListener('play', () => {
  playPauseBtn.innerHTML = '<i class="fa fa-pause"></i>';
});

audioPlayer.addEventListener('pause', () => {
  playPauseBtn.innerHTML = '<i class="fa fa-play"></i>';
});

// Update progress bar and time display as the audio plays
audioPlayer.addEventListener('timeupdate', () => {
  const currentTime = audioPlayer.currentTime;
  const duration = audioPlayer.duration;

  // Update progress bar
  const progress = (currentTime / duration) * 100;
  progressBar.value = progress;

  // Update current time display
  currentTimeDisplay.textContent = formatTime(currentTime);
  
  // Update duration display
  durationDisplay.textContent = formatTime(duration);
});

// Seek functionality on progress bar click
progressBar.addEventListener('input', () => {
  const seekTime = (progressBar.value / 100) * audioPlayer.duration;
  audioPlayer.currentTime = seekTime;
});

// Mute / Unmute functionality
muteBtn.addEventListener('click', () => {
  if (audioPlayer.muted) {
    audioPlayer.muted = false;
    muteBtn.innerHTML = '<i class="fa fa-volume-up"></i>';
  } else {
    audioPlayer.muted = true;
    muteBtn.innerHTML = '<i class="fa fa-volume-mute"></i>';
  }
});

// Format time in minutes:seconds
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
}

document.getElementById('suggestionHeader').addEventListener('click', () => {
    const suggestionContent = document.getElementById('suggestionContent');
    const bo = document.getElementById('suggestionBox');

    suggestionContent.style.display = suggestionContent.style.display === 'block' ? 'none' : 'block';
    bo.style.bottom = bo.style.bottom === '50vh' ? '70px' : '50vh';
});

async function fetchSuggestions() {
    try {
        const response = await fetch('/api/suggestions');
        const suggestions = await response.json();
        const suggestionsContainer = document.getElementById('submittedSuggestions');
        suggestionsContainer.innerHTML = suggestions.map(s => `<p>${s.comment_text} - <small>${new Date(s.created_at).toLocaleString()}</small></p>`).join('');
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

document.addEventListener("DOMContentLoaded", function () {
    const suggestionBox = document.getElementById("suggestionBox");

    if (suggestionBox) {
        suggestionBox.addEventListener("click", function () {
            speakText("You clicked on the suggestion box.");
        });
    }

    function speakText(text) {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US"; // Set language
        speech.rate = 1; // Speed of speech
        window.speechSynthesis.speak(speech);
    }
});
document.getElementById("suggestionHeader").addEventListener("click", function() {
    var box = document.getElementById("suggestionBox");
    box.classList.toggle("expanded");
});
// Load suggestions when the page loads
fetchSuggestions();

