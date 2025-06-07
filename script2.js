const artistDropdown = document.getElementById('artistDropdown');
const songDropdown = document.getElementById('songDropdown');
const pageBody = document.getElementById('pageBody');
const noSongsMessageP = document.getElementById('noSongsMessage');

// Song details elements
const songDetailsContainer = document.getElementById('songDetailsContainer');
const songTitleArtistEl = document.getElementById('songTitleArtist');
const songChordsUl = document.getElementById('songChords');
const songLyricsPre = document.getElementById('songLyrics');
const errorMessageDiv = document.getElementById('errorMessage');

// Scroll Control Elements
const startScrollButton = document.getElementById('startScrollButton');
const stopScrollButton = document.getElementById('stopScrollButton');
const resetScrollButton = document.getElementById('resetScrollButton');
// --- START: Speed Control Elements ---
const scrollSpeedInput = document.getElementById('scrollSpeed');
const scrollSpeedValueSpan = document.getElementById('scrollSpeedValue');
// --- END: Speed Control Elements ---

let scrollInterval = null;
let currentScrollSpeed = 1; // Default, will be updated by input
const SCROLL_INTERVAL_MS = 300; // Base interval time

// --- START: Initialize and Update Speed ---
function updateScrollSpeed() {
    currentScrollSpeed = parseInt(scrollSpeedInput.value) || 1;
    scrollSpeedValueSpan.textContent = currentScrollSpeed;

    // If already scrolling, restart with the new speed
    if (scrollInterval) {
        stopLyricsScroll(); // Clear existing interval
        startLyricsScroll(); // Start new one with updated speed
    }
}
// --- END: Initialize and Update Speed ---

// Scroll Functions
function startLyricsScroll() {
    // console.log("startLyricsScroll called"); // Keep if you need debugging
    if (!songLyricsPre) {
        // console.error("songLyricsPre element not found!");
        return;
    }
    if (scrollInterval) {
        // console.log("Already scrolling, returning.");
        return;
    }

    // console.log(`Lyrics scrollHeight: ${songLyricsPre.scrollHeight}, clientHeight: ${songLyricsPre.clientHeight}`);
    if (songLyricsPre.scrollHeight <= songLyricsPre.clientHeight) {
        // console.warn("Lyrics not tall enough to scroll or already at bottom.");
        return;
    }

    // --- Ensure currentScrollSpeed is up-to-date before starting ---
    // currentScrollSpeed = parseInt(scrollSpeedInput.value) || 1; // Already handled by updateScrollSpeed or initial value

    scrollInterval = setInterval(() => {
        songLyricsPre.scrollTop += currentScrollSpeed;
        if (songLyricsPre.scrollTop + songLyricsPre.clientHeight >= songLyricsPre.scrollHeight -1 ) {
            // console.log("Scroll reached bottom.");
            stopLyricsScroll();
        }
    }, SCROLL_INTERVAL_MS);

    // console.log("Scroll interval started:", scrollInterval);
    startScrollButton.disabled = true;
    stopScrollButton.disabled = false;
}

function stopLyricsScroll() {
    // console.log("stopLyricsScroll called");
    if (scrollInterval) {
        clearInterval(scrollInterval);
        // console.log("Scroll interval cleared:", scrollInterval);
        scrollInterval = null;
    }
    startScrollButton.disabled = false;
    stopScrollButton.disabled = true;
}

function resetLyricsScroll() {
    // console.log("resetLyricsScroll called");
    stopLyricsScroll();
    if (songLyricsPre) {
        songLyricsPre.scrollTop = 0;
        // console.log("Lyrics scroll reset to 0");
    } else {
        // console.error("songLyricsPre element not found in resetLyricsScroll!");
    }
}

// Display Song Data
function displaySongData(songData, songFileName) {
    resetLyricsScroll(); // Stop/reset scroll when a new song is displayed
    errorMessageDiv.textContent = '';
    songChordsUl.innerHTML = '';
    // --- MODIFIED: Combine Title and Artist ---
    const title = songData.title || "N/A";
    const artist = songData.artist || "N/A";

    if (title === "N/A" && artist === "N/A") {
        songTitleArtistEl.textContent = "Song Details N/A"; // Or just ""
    } else if (artist === "N/A") {
        songTitleArtistEl.textContent = title; // Only title if artist is N/A
    } else if (title === "N/A") {
        songTitleArtistEl.textContent = artist; // Only artist if title is N/A (or maybe "Unknown Title - Artist")
                                                // Let's stick to the "Title - Artist" format more strictly
        songTitleArtistEl.textContent = `N/A - ${artist}`;
    }
    else {
        songTitleArtistEl.textContent = `${title} - ${artist}`;
    }
    // --- END OF MODIFICATION ---

    if (songData.chords && Array.isArray(songData.chords)) {
        if (songData.chords.length > 0) {
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
             li.textContent = "No chords listed.";
             songChordsUl.appendChild(li);
        }
    } else {
        const li = document.createElement('li');
        li.textContent = "Chords N/A";
        songChordsUl.appendChild(li);
    }

    let lyricsText = songData.lyrics || "No lyrics provided.";
    if (lyricsText !== "No lyrics provided.") {
        const highlightRegex = /(\[.*?\]|\(.*?\))/g;
        const formattedLyrics = lyricsText.replace(highlightRegex, '<b>$&</b>');
        songLyricsPre.innerHTML = formattedLyrics;
    } else {
        songLyricsPre.textContent = lyricsText;
    }
    songDetailsContainer.style.display = 'block';
}

// Load and Display Song
function loadAndDisplaySong(fileIndex) {
    if (fileIndex === "" || fileIndex === undefined || fileIndex < 0) {
        songDetailsContainer.style.display = 'none';
        errorMessageDiv.textContent = '';
        resetLyricsScroll();
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
                errorMessageDiv.textContent = `Error parsing ${fileToLoad.name}: ${err.message}.`;
                songDetailsContainer.style.display = 'block';
                songTitleEl.textContent = '';
                songArtistEl.textContent = '';
                songChordsUl.innerHTML = '';
                songLyricsPre.textContent = '';
                resetLyricsScroll();
            }
        };
        reader.onerror = function() {
            errorMessageDiv.textContent = `Error reading ${fileToLoad.name}.`;
            songDetailsContainer.style.display = 'block';
            songTitleEl.textContent = '';
            songArtistEl.textContent = '';
            songChordsUl.innerHTML = '';
            songLyricsPre.textContent = '';
            resetLyricsScroll();
        };
        reader.readAsText(fileToLoad);
    }
}

// Song Dropdown Change Listener
songDropdown.addEventListener('change', function(event) {
    const songTitle = event.target.value;

    const xhr = new XMLHttpRequest();
    const httpQuery = "https://uws-songbook-svr.onrender.com/listArtists?title=" + songTitle;
    xhr.open('GET', httpQuery); // Replace with your API endpoint

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            console.log(data);
    
            data.forEach((song, index) => {
        
                console.log("Adding: <" + song.artist + "> to Title Dropdown Box");
        
                const option = document.createElement('option');
                option.textContent = song.artist;
                option.value = song.artist;
                artistDropdown.appendChild(option);
            });
    
        } else {
            console.error("Request failed. Status:", xhr.status);
        }
    };
    xhr.onerror = function() {
        console.error("Request failed");
    };

    xhr.send();

});


// --- START: Event Listeners for Scroll Controls ---
if (startScrollButton && stopScrollButton && resetScrollButton) {
    startScrollButton.addEventListener('click', startLyricsScroll);
    stopScrollButton.addEventListener('click', stopLyricsScroll);
    resetScrollButton.addEventListener('click', resetLyricsScroll);
} else {
    console.error("One or more main scroll buttons not found.");
}

// Event Listener for Speed Control
if (scrollSpeedInput && scrollSpeedValueSpan) {
    // Set initial speed display and currentScrollSpeed from default slider value
    currentScrollSpeed = parseInt(scrollSpeedInput.value) || 1;
    scrollSpeedValueSpan.textContent = currentScrollSpeed;

    scrollSpeedInput.addEventListener('input', updateScrollSpeed);
    console.log("Scroll speed control listener attached.");
} else {
    console.error("Scroll speed input or value span not found.");
}
// --- END: Event Listeners for Scroll Controls ---

// --- START: Retrieve Artist and Songs List via REST API ---
function initSongSelection(){
    songDropdown.options.length = 1;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://uws-songbook-svr.onrender.com/listTitles'); // Replace with your API endpoint

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            console.log(data);

            data.forEach((song, index) => {

                console.log("Adding: <" + song.title + "> to Title Dropdown Box");

                const option = document.createElement('option');
                option.textContent = song.title;
                option.value = song.title;
                songDropdown.appendChild(option);
            });

            if(songDropdown.options.length == 2){
                songDropdown.selectedIndex = 1;
            }

        } else {
            console.error("Request failed. Status:", xhr.status);
        }
    };
    xhr.onerror = function() {
        console.error("Request failed");
    };

    xhr.send();
}
// --- END: Retrieve Artist and Songs List via REST API ---
