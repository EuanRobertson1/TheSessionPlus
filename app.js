
console.log("Script loaded");  // Debugging statement

// Function to fetch upcoming events
async function fetchUpcomingEvents() {
    try {
        const response = await fetch("https://thesession.org/events/new?format=json&perpage=50");
        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json(); // Parse JSON
        return data.events || []; // Ensure it returns an array
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
}


// Function to switch pages without affecting existing styles
function switchPage(pageId) {
    //Page Elements
    const searchBar = document.querySelector(".search-bar");
    const homeContent = document.querySelector("#home");
    const sessionsContent = document.querySelector("#sessionsPage");
    const savedTunesContent = document.querySelector("#savedTunesPage");
    const recordingContent = document.querySelector('#myRecordingsPage')
    const backButton = document.querySelector("#backToHome");
    const backButton2 = document.querySelector("#backToHomeFromSaved");
    const backButton3 = document.querySelector("#backToHomeFromRecording");

    if (pageId === "sessionsPage") {
        //Update what is displayed
        searchBar.style.display = "none"; 
        homeContent.style.display = "none"; 
        sessionsContent.style.display = "block"; 
        savedTunesContent.style.display = "none";
        backButton.style.display = "block";
        backButton2.style.display = "none";
        backButton3.style.display = "none";
        recordingContent.style.display = "none";
        fetchNearbySessions();//Fetch sessions when page opens

    }else if (pageId === "savedTunesPage") {
        //Update what is displayed
        homeContent.style.display = "none";
        searchBar.style.display = "none";
        sessionsContent.style.display = "none";
        savedTunesContent.style.display = "block";
        backButton2.style.display = "block";
        backButton.style.display = "none";
        backButton3.style.display = "none";
        recordingContent.style.display = "none";
        loadSavedTunes(); // Load saved tunes when page opens
    }
    else if (pageId === 'myRecordingsPage') {
        //Update what is displayed
        homeContent.style.display = "none";
        searchBar.style.display = "none";
        sessionsContent.style.display = "none";
        savedTunesContent.style.display = "none";
        backButton2.style.display = "none";
        backButton.style.display = "none";
        backButton3.style.display = "block";
        recordingContent.style.display = "block";
    }
    else {//Defaults to home page
        //Update what is displayed
        searchBar.style.display = "flex"; 
        homeContent.style.display = "block"; 
        sessionsContent.style.display = "none"; 
        savedTunesContent.style.display = "none";
        backButton.style.display = "none";
        backButton2.style.display = "none";
        backButton3.style.display = "none";
        recordingContent.style.display = "none";
    }
}

// Function to fetch and display tunes
async function searchTunes(query) {
    const url = `https://thesession.org/tunes/search?q=${encodeURIComponent(query)}&format=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("API request failed");

        const data = await response.json();
        console.log("API Response:", data); // Log to check if API returns results

        displaySearchResults(data.tunes); // Update the event list with search results
        document.getElementById("resetSearch").style.display = "block";

    } catch (error) {
        console.error("Error fetching tunes:", error);
    }
}

//Function to display search results
function displaySearchResults(tunes) {

    const eventList = document.getElementById("event-list");
    const header = document.querySelector(".upcoming-events h2"); // Target the heading

    eventList.innerHTML = ""; // Clear existing events
    header.textContent = "Search Results"; // Change header text


    if (!tunes.length) {
        eventList.innerHTML = "<p>No tunes found.</p>";
        return;
    }

    tunes.slice(0, 50).forEach(tune => {
        const tuneItem = document.createElement("div");
        tuneItem.classList.add("event-box");

        tuneItem.innerHTML = `
            <h3>${tune.name}</h3>
            <p><strong>Type:</strong> ${tune.type || "None"}</p>
            <button class="tune-button" onclick="window.open('${tune.url}', '_blank')">View Tune</button>
            <button class="tune-button save-tune" data-id="${tune.id}">Save Tune</button>
        `;

        eventList.appendChild(tuneItem);
    });


    // Attach event listeners to the "Save Tune" buttons
    document.querySelectorAll(".save-tune").forEach(button => {
        button.addEventListener("click", (event) => {
            const tuneId = event.target.getAttribute("data-id");
            saveTune(tuneId); // Call saveTune when button is clicked
        });
    });
}

// Function to display events
function displayEvents(events) {
    const eventList = document.getElementById("event-list");
    eventList.innerHTML = ""; // Clear previous events

    if (!events.length) {
        eventList.innerHTML = "<p>No upcoming events found.</p>";
        return;
    }

    events.slice(0, 50).forEach(event => {
        const eventItem = document.createElement("div");
        eventItem.classList.add("event-box");

        // Extract town and country correctly
        const town = event.town?.name || "Unknown Town";
        const country = event.country?.name || "Unknown Country";

        eventItem.innerHTML = `
            <h3>${event.name}</h3>
            <p><strong>Location:</strong> ${town}, ${country}</p>
            <p><strong>Date:</strong> ${new Date(event.dtstart).toLocaleString()}</p>
            <button class="tune-button" onclick="window.open('https://thesession.org/events/${event.id}', '_blank')">View Details</button>
        `;

        eventList.appendChild(eventItem);
    });
}

//Function to save a tune
function saveTune(tuneId) {
    let savedTunes = JSON.parse(localStorage.getItem("savedTunes")) || [];

    if (!savedTunes.includes(tuneId)) {
        savedTunes.push(tuneId);
        localStorage.setItem("savedTunes", JSON.stringify(savedTunes));
        alert("Tune saved!");
    } else {
        alert("Tune is already saved.");
    }
}

//Function to load saved tunes
async function loadSavedTunes() {
    const savedTunes = JSON.parse(localStorage.getItem("savedTunes")) || [];
    const savedTunesContainer = document.getElementById("saved-list");
    savedTunesContainer.innerHTML = "";

    if (savedTunes.length === 0) {
        savedTunesContainer.innerHTML = "<p>No saved tunes yet.</p>";
        return;
    }

    // Fetch tune details for each saved tune
    for (let tuneId of savedTunes) {
        try {
            const response = await fetch(`https://thesession.org/tunes/${tuneId}?format=json`);
            const tune = await response.json();

            const tuneElement = document.createElement("div");
            tuneElement.classList.add("event");

            tuneElement.innerHTML = `
                <h3>${tune.name}</h3>
                <p><strong>Type:</strong> ${tune.type}</p>
                <button class="tune-button" onclick="window.open('${tune.url}', '_blank')">View Tune</button>
                <button class="tune-button remove-tune" data-id="${tune.id}">Remove</button>
            `;

            savedTunesContainer.appendChild(tuneElement);
        } catch (error) {
            console.error("Error fetching tune:", error);
        }
    }

    // Add event listeners to remove buttons
    document.querySelectorAll(".remove-tune").forEach(button => {
        button.addEventListener("click", (event) => {
            const tuneId = event.target.getAttribute("data-id");
            removeTune(tuneId);
        });
    });
}

//Function to remove a saved tune
function removeTune(tuneId) {
    let savedTunes = JSON.parse(localStorage.getItem("savedTunes")) || [];
    savedTunes = savedTunes.filter(id => id !== tuneId);

    localStorage.setItem("savedTunes", JSON.stringify(savedTunes));
    loadSavedTunes(); // Refresh the saved tunes list
}

//Function to fetch nearby sessions
async function fetchNearbySessions() {
    if (!navigator.geolocation) {
        console.error("Geolocation is not supported by this browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const apiUrl = `https://thesession.org/sessions/nearby?latlon=${latitude},${longitude}&radius=75&format=json`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Failed to fetch sessions");

            const data = await response.json();
            const sessionsList = document.getElementById("sessions-list"); // Get list container
            sessionsList.innerHTML = ""; // Clear old results

            if (!data.sessions || data.sessions.length === 0) {
                sessionsList.innerHTML = "<p>No sessions found nearby.</p>";
                return;
            }

            data.sessions.forEach(session => {
                const sessionElement = document.createElement("div");
                sessionElement.classList.add("event-box"); 

                sessionElement.innerHTML = `
                    <h3>${session.venue.name}</h3>
                    <p><strong>Location:</strong> ${session.town.name}, ${session.country.name}</p>
                    <button class="tune-button remove-tune" data-id="${session.url}">View Session</button>
                `;

                sessionsList.appendChild(sessionElement);
            });

        } catch (error) {
            console.error("Error fetching nearby sessions:", error);
        }
    }, (error) => {
        console.error("Error getting location:", error);
    });
}

// Variables for recording
let mediaRecorder;
let audioChunks = [];
let recordingCount = 1; // Counter for recording labels


// Function to start recording with mic permission check
function startRecording() {
    // Request mic permissions explicitly
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        console.log("🎤 Microphone access granted.");

        const options = { mimeType: "audio/mp4" };
        mediaRecorder = new MediaRecorder(stream, options);
        audioChunks = [];

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            addRecordingToList(audioBlob);
        };

        mediaRecorder.start();
        console.log("🔴 Recording started...");

        // Show Stop button, hide Record button
        document.getElementById("recordButton").style.display = "none";
        document.getElementById("stopButton").style.display = "inline-block";

        // Store stream so we can stop it later
        window.currentStream = stream;
    })
    .catch(error => {
        console.error("🚨 Microphone access denied or unavailable:", error);
        alert("Microphone access is required to record audio. Please allow mic access in your browser settings.");
    });
}


// Function to stop recording
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        console.log("⏹️ Recording stopped.");

        // Stop the microphone stream to release it
        if (window.currentStream) {
            window.currentStream.getTracks().forEach(track => track.stop());
            console.log("🎤 Microphone released.");
        }

        // Hide Stop button, show Record button
        document.getElementById("recordButton").style.display = "inline-block";
        document.getElementById("stopButton").style.display = "none";
    }
}

// Function to add recording to the list
function addRecordingToList(audioBlob) {
    const recordingsList = document.getElementById("recordingsList");

    // Create audio URL
    const audioUrl = URL.createObjectURL(audioBlob);

    // Create recording item
    const recordingItem = document.createElement("div");
    recordingItem.classList.add("event-box");
    recordingItem.dataset.recordingId = recordingCount; // Store ID

    recordingItem.innerHTML = `
        <p><strong>Recording ${recordingCount}</strong></p>
        <audio controls src="${audioUrl}"></audio>
        <button class="delete-button" onclick="removeRecording(${recordingCount})">❌ Delete</button>
    `;

    recordingsList.appendChild(recordingItem);
    recordingCount++; // Increment counter for next recording
}

// Function to remove recording
function removeRecording(id) {
    const recordingsList = document.getElementById("recordingsList");
    const recordingItem = recordingsList.querySelector(`[data-recording-id='${id}']`);

    if (recordingItem) {
        recordingsList.removeChild(recordingItem);
        console.log(`🗑️ Removed Recording ${id}`);

        // Reduce the recording count if there are no more recordings
        const remainingRecordings = recordingsList.querySelectorAll(".event-box").length;
        if (remainingRecordings === 0) {
            recordingCount = 1; // Reset count if list is empty
        }
    }
}

// Attach event listeners to buttons
document.getElementById("recordButton").addEventListener("click", startRecording);
document.getElementById("stopButton").addEventListener("click", stopRecording);


document.addEventListener("DOMContentLoaded", async () => {
    console.log("📢 Disclaimer screen shown");

    document.getElementById("continueButton").addEventListener("click", () => {
        const disclaimerScreen = document.getElementById("disclaimerScreen");

        // Apply fade-out effect
        disclaimerScreen.classList.add("fade-out");

        console.log("⏳ Fading out disclaimer...");

        // Wait for the transition to finish, then hide the element
        setTimeout(() => {
            disclaimerScreen.style.display = "none";
            console.log("✅ Disclaimer accepted, app ready.");
        }, 600); // Matches the CSS transition time (0.6s)
    });
    
    // Fetch and display events
    const events = await fetchUpcomingEvents();
    displayEvents(events);

    // Handle navbar clicks
    document.querySelectorAll(".bottom-nav button").forEach(button => {
        button.addEventListener("click", () => {
            const pageId = button.getAttribute("data-page");
            if (pageId) switchPage(pageId);
        });
    });

    // Handle back buttons
    document.getElementById("backToHome").addEventListener("click", () => {
        switchPage("homePage");
        //make sure bottom nav buttons aren't highlighted
        document.querySelectorAll(".bottom-nav button").forEach(button => {
            button.classList.remove("active");
        });
    });
    document.getElementById("backToHomeFromSaved").addEventListener("click", () => {
        switchPage("homePage");
        //make sure bottom nav buttons aren't highlighted
        document.querySelectorAll(".bottom-nav button").forEach(button => {
            button.classList.remove("active");
        });
    });
    document.getElementById("backToHomeFromRecording").addEventListener("click", () => {
        switchPage("homePage");
        //make sure bottom nav buttons aren't highlighted
        document.querySelectorAll(".bottom-nav button").forEach(button => {
            button.classList.remove("active");
        });
    });

    // Ensure the home page is visible initially
    switchPage("homePage");

    // Select the search input and button
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");

    
    //Retursnt to home page from search results page
    document.getElementById("resetSearch").addEventListener("click", async () => {
        const events = await fetchUpcomingEvents();
        displayEvents(events);
    
        document.querySelector(".upcoming-events h2").textContent = "Upcoming Events"; // Reset heading
        document.getElementById("resetSearch").style.display = "none"; // Hide back button
        document.getElementById("searchInput").value = ""; //clear search
    });
    

    // Handle search button click
    searchButton.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query) {
            searchTunes(query); // Call API with search term
        }
    });

    // Handle "Enter" key in search bar
    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const query = searchInput.value.trim();
            if (query) {
                searchTunes(query);
            }
        }
    });



});


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(() => console.log("Service Worker Registered"));
    });
}

//PWA Stuff
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;

    setTimeout(() => {
        document.getElementById("installButton").style.display = "block";
    }, 3000); // Delays install button for 3 sec (prevents issues)
});

// Handle install button click
document.getElementById("installButton").addEventListener("click", () => {
    if (deferredPrompt) {
        deferredPrompt.prompt(); // Show install prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
                console.log("User installed the app");
            } else {
                console.log("User dismissed the install prompt");
            }
            deferredPrompt = null; // Reset
        });
    }
});



