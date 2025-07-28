const songList = document.getElementById('songList');

// --- START: Retrieve Songs List via REST API ---
function initSongList() {
            
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://uws-songbook-svr.onrender.com/listAllSongs'); // Replace with your API endpoint
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            console.log(data);

            data.forEach((song, index) => {

                console.log("Adding: <" + song.title + " - " + song.artist + ">");

                var primaryLi = document.createElement('li');
                primaryLi.textContent = song.title + " - " + song.artist;
                songList.appendChild(primaryLi);
            });
    
        } else {
            console.error("Request failed. Status:", xhr.status);
        }
    };  
    xhr.onerror = function() {
        console.error("Request failed");
    };  
        
    xhr.send();
}       
// --- END: Retrieve Songs List via REST API ---
