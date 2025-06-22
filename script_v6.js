// DOM Element References
const songDropdown = document.getElementById('songDropdown');
const folderInput = document.getElementById('folderInput');
const noSongsMessageP = document.getElementById('noSongsMessage');

// Song details elements
const songDetailsContainer = document.getElementById('songDetailsContainer');
const songTitleArtistEl = document.getElementById('songTitleArtist');
const songChordsUl = document.getElementById('songChords');
const songLyricsPre = document.getElementById('songLyrics');
const errorMessageDiv = document.getElementById('errorMessage');

// Scroll Control Elements (MODIFIED: Removed resetScrollButton)
const toggleScrollButton = document.getElementById('startScrollButton'); // This button will now toggle start/stop
// const resetScrollButton = document.getElementById('resetScrollButton'); // REMOVED
const scrollSpeedInput = document.getElementById('scrollSpeed');
const scrollSpeedValueSpan = document.getElementById('scrollSpeedValue');

// Font Size Control Element
const fontSizeSelect = document.getElementById('fontSizeSelect');

// Global state variables
let scrollInterval = null;
let currentScrollSpeed = 1; // Default, will be updated by input
const SCROLL_INTERVAL_MS = 300; // Base interval for scroll updates
let selectedFiles = [];

// Define font size mapping
const FONT_SIZES = {
    small: '1em',
    medium: '1.5em',
    big: '1.9em'
};

// --- Font Size Control Function ---
/**
 * Applies the selected font size to the song lyrics.
 */
function applyFontSize() {
    if (!songLyricsPre || !fontSizeSelect) {
        console.error("Error: songLyricsPre or fontSizeSelect element not found when applying font size!");
        return;
    }
    const selectedSizeKey = fontSizeSelect.value;
    songLyricsPre.style.fontSize = FONT_SIZES[selectedSizeKey] || FONT_SIZES.medium;
}

// --- Scroll Control Functions (ADAPTED for single toggle button) ---

/**
 * Starts the automatic scrolling of the lyrics (internal logic).
 * Does NOT handle button state directly, that's for toggleScroll().
 */
function startLyricsScrollInternal() {
    if (!songLyricsPre || scrollInterval) {
        return; // Don't start if element is missing or already scrolling
    }

    // If lyrics are not tall enough to scroll, don't start
    if (songLyricsPre.scrollHeight <= songLyricsPre.clientHeight) {
        // Since we can't scroll, ensure button state reflects "Start"
        toggleScrollButton.textContent = 'Start Scroll';
        // resetScrollButton.disabled = false; // REMOVED
        return;
    }

    scrollInterval = setInterval(() => {
        songLyricsPre.scrollTop += currentScrollSpeed;
        if (songLyricsPre.scrollTop + songLyricsPre.clientHeight >= songLyricsPre.scrollHeight - 1) {
            // Reached bottom, stop scrolling and reset button state
            stopLyricsScrollInternal(); // Stop the interval
            toggleScrollButton.textContent = 'Start Scroll'; // Update button text
            // resetScrollButton.disabled = false; // REMOVED
            // Optional: Reset scroll position to top after reaching end,
            // or leave it at the end to allow manual scrolling back up.
            // If you want it to jump to top: songLyricsPre.scrollTop = 0;
        }
    }, SCROLL_INTERVAL_MS);
}

/**
 * Stops the automatic scrolling of the lyrics (internal logic).
 * Does NOT handle button state directly, that's for toggleScroll().
 */
function stopLyricsScrollInternal() {
    if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
}

/**
 * Toggles the scroll state (start/stop) and updates the button text accordingly.
 * This is the function attached to the single "Start Scroll" button.
 */
function toggleScroll() {
    if (scrollInterval) { // If currently scrolling
        stopLyricsScrollInternal();
        toggleScrollButton.textContent = 'Start Scroll';
        // resetScrollButton.disabled = false; // REMOVED
    } else { // If not scrolling
        startLyricsScrollInternal(); // Attempt to start scrolling
        // Only change button text to 'Stop Scroll' if scrolling actually started
        if (scrollInterval) {
            toggleScrollButton.textContent = 'Stop Scroll';
            // resetScrollButton.disabled = true; // REMOVED
        }
    }
}

// --- REMOVED: resetLyricsScroll function ---
/*
function resetLyricsScroll() {
    stopLyricsScrollInternal();
    if (songLyricsPre) {
        songLyricsPre.scrollTop = 0;
    }
    toggleScrollButton.textContent = 'Start Scroll';
    resetScrollButton.disabled = false;
}
*/

/**
 * Updates the scroll speed. If already scrolling, restarts with new speed.
 */
function updateScrollSpeed() {
    currentScrollSpeed = parseInt(scrollSpeedInput.value) || 1;
    scrollSpeedValueSpan.textContent = currentScrollSpeed;

    // If already scrolling, restart with the new speed
    if (scrollInterval) {
        stopLyricsScrollInternal(); // Clear existing interval
        startLyricsScrollInternal(); // Start new one with updated speed
        // Button state should remain 'Stop Scroll'
        toggleScrollButton.textContent = 'Stop Scroll';
        // resetScrollButton.disabled = true; // REMOVED
    }
}

// --- Song Data Display Functions ---
function displaySongData(songData, songFileName) {
    // When a new song is loaded, automatically reset scroll position and button state
    stopLyricsScrollInternal(); // Ensure any ongoing scroll is stopped
    if (songLyricsPre) {
        songLyricsPre.scrollTop = 0; // Reset lyrics to the top
    }
    toggleScrollButton.textContent = 'Start Scroll'; // Set button to 'Start Scroll'

    errorMessageDiv.textContent = '';
    songChordsUl.innerHTML = '';
    
    const title = songData.title || "";
    const artist = songData.artist || "";

    if (title && artist) {
        songTitleArtistEl.textContent = `${title} - ${artist}`;
    } else if (title) {
        songTitleArtistEl.textContent = title;
    } else if (artist) {
        songTitleArtistEl.textContent = `Unknown Title - ${artist}`;
    } else {
        songTitleArtistEl.textContent = "Song Details Not Available";
    }

    if (songData.chords && Array.isArray(songData.chords) && songData.chords.length > 0) {
        songData.chords.forEach(chord => {
            const li = document.createElement('li');
            const img = document.createElement('img');
            img.src = `chords/${encodeURIComponent(chord)}.png`;
            img.alt = `${chord} chord diagram`;
            img.classList.add('chord-image');
            img.onerror = function() {
                li.innerHTML = '';
                const fallbackText = document.createElement('span');
                fallbackText.textContent = chord;
                fallbackText.classList.add('chord-image-missing');
                li.appendChild(fallbackText);
            };
            li.appendChild(img);
            songChordsUl.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = "No chords listed or chords data invalid.";
        songChordsUl.appendChild(li);
    }

    let lyricsText = songData.lyrics || "No lyrics provided.";
    if (lyricsText !== "No lyrics provided.") {
        const highlightRegex = /(\[.*?\]|\(.*?\))/g;
        songLyricsPre.innerHTML = lyricsText.replace(highlightRegex, '<b>$&</b>');
    } else {
        songLyricsPre.textContent = lyricsText;
    }
    songDetailsContainer.style.display = 'block';

    applyFontSize(); // Apply font size after loading new song data
}

function loadAndDisplaySong(fileIndex) {
    if (fileIndex === "" || fileIndex === undefined || parseInt(fileIndex) < 0) {
        songDetailsContainer.style.display = 'none';
        errorMessageDiv.textContent = '';
        // Call displaySongData with empty data to reset view
        displaySongData({title: '', artist: '', chords: [], lyrics: ''}, ''); 
        return;
    }

    const fileToLoad = selectedFiles[parseInt(fileIndex)];
    if (fileToLoad) {
        const reader = new FileReader();
        reader.onload = function(e_reader) {
            try {
                const songData = JSON.parse(e_reader.target.result);
                displaySongData(songData, fileToLoad.name);
            } catch (err) {
                errorMessageDiv.textContent = `Error parsing ${fileToLoad.name}: ${err.message}. Please ensure it's a valid JSON file.`;
                songDetailsContainer.style.display = 'block';
                // Call displaySongData with empty data to reset view
                displaySongData({title: '', artist: '', chords: [], lyrics: ''}, ''); 
            }
        };
        reader.onerror = function() {
            errorMessageDiv.textContent = `Error reading ${fileToLoad.name}.`;
            songDetailsContainer.style.display = 'block';
            // Call displaySongData with empty data to reset view
            displaySongData({title: '', artist: '', chords: [], lyrics: ''}, ''); 
        };
        reader.readAsText(fileToLoad);
    }
}

// --- Event Listeners ---

// Handle folder input change
folderInput.addEventListener('change', function(event) {
    songDropdown.innerHTML = '<option value="">-- Select a Song --</option>';
    songDetailsContainer.style.display = 'none';
    errorMessageDiv.textContent = '';
    noSongsMessageP.style.display = 'none';
    
    // Reset view when new folder is selected
    displaySongData({title: '', artist: '', chords: [], lyrics: ''}, ''); 

    selectedFiles = Array.from(event.target.files);
    let jsonFileFound = false;

    selectedFiles.forEach((file, index) => {
        const pathSegments = file.webkitRelativePath ? file.webkitRelativePath.split('/') : [file.name];
        const isTopLevelFile = file.webkitRelativePath === file.name;
        const isChildOfSelectedFolder = file.webkitRelativePath.startsWith(event.target.files[0]?.webkitRelativePath?.split('/')[0] + '/') && file.webkitRelativePath.split('/').length === 2;

        if (file.name.toLowerCase().endsWith('.json') && (isTopLevelFile || isChildOfSelectedFolder)) {
            jsonFileFound = true;
            const option = document.createElement('option');
            const displayName = file.name.endsWith('.json') ? file.name.slice(0, -5) : file.name;
            option.textContent = displayName;
            option.value = index;
            songDropdown.appendChild(option);
        }
    });

    if (!jsonFileFound) {
        noSongsMessageP.style.display = 'block';
    }
});

// Handle song dropdown selection change
songDropdown.addEventListener('change', function(event) {
    const selectedFileIndex = event.target.value;
    loadAndDisplaySong(selectedFileIndex);
});

// Attach scroll control event listeners (MODIFIED)
if (toggleScrollButton && scrollSpeedInput && scrollSpeedValueSpan) { // REMOVED: resetScrollButton from check
    toggleScrollButton.addEventListener('click', toggleScroll);
    // REMOVED: resetScrollButton.addEventListener('click', resetLyricsScroll);

    // Initialize speed display and value
    currentScrollSpeed = parseInt(scrollSpeedInput.value) || 1;
    scrollSpeedValueSpan.textContent = currentScrollSpeed;
    
    // Listen for input events on the slider to update speed
    scrollSpeedInput.addEventListener('input', updateScrollSpeed);
} else {
    console.error("One or more essential scroll control elements not found. Check your HTML IDs.");
}

// Font Size Event Listener
if (fontSizeSelect) {
    applyFontSize(); 
    fontSizeSelect.addEventListener('change', applyFontSize);
} else {
    console.error("Font size select element (fontSizeSelect) not found. Check your HTML ID.");
}

// Initial state setup: Ensure the toggle button says "Start Scroll"
// This is now handled by displaySongData being called with empty data on initial load and folder/song changes.
// We explicitly set it here for the very first load or if no song is ever loaded.
if (toggleScrollButton) {
    toggleScrollButton.textContent = 'Start Scroll';
}