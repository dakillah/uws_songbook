const testSongList = document.getElementById('testSongList');

// --- START: Retrieve Songs List via REST API ---
function initSongList() {
            
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://uws-songbook-svr.onrender.com/listAllSongsTest'); // Replace with your API endpoint
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            console.log(data);

            data.forEach((song, index) => {

                //console.log("Adding: <" + song + "> to Title List");

                var primaryLi = document.createElement('li');
                var a = document.createElement('a');
                a.href = "#";
                a.textContent = song.title + " - " + song.artist;
                primaryLi.appendChild(a);
                primaryLi.style.display = "none";
                testSongList.appendChild(primaryLi);
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
