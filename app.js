
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
    console.log("Switching to:", pageId);
    const searchBar = document.querySelector(".search-bar");
    const homeContent = document.querySelector(".upcoming-events");
    const sessionsContent = document.querySelector("#sessionsPage");
    const savedTunesContent = document.querySelector("#savedTunesPage");
    const identifyTuneContent = document.querySelector("#identifyTunePage");

    if (pageId === "sessionsPage") {
        searchBar.style.display = "none";
        homeContent.style.display = "none";
        savedTunesContent.style.display = "none";
        identifyTuneContent.style.display = "none";
        sessionsContent.style.display = "block";
    } else if (pageId === "savedTunesPage") {
        searchBar.style.display = "none";
        homeContent.style.display = "none";
        sessionsContent.style.display = "none";
        identifyTuneContent.style.display = "none";
        savedTunesContent.style.display = "block";
    } else if (pageId === "identifyTunePage") {
        searchBar.style.display = "none";
        homeContent.style.display = "none";
        sessionsContent.style.display = "none";
        savedTunesContent.style.display = "none";
        identifyTuneContent.style.display = "block";
    } else {
        searchBar.style.display = "flex";
        homeContent.style.display = "block";
        sessionsContent.style.display = "none";
        savedTunesContent.style.display = "none";
        identifyTuneContent.style.display = "none";
    }
}



document.addEventListener("DOMContentLoaded", async () => {
    // Fetch and display events
    const events = await fetchUpcomingEvents();
    displayEvents(events);

    // Handle navbar clicks
    document.querySelectorAll(".bottom-nav button").forEach(button => {
        button.addEventListener("click", () => {
            const pageId = button.getAttribute("data-page");
            console.log(`Switching to: ${pageId}`);
            if (pageId) switchPage(pageId);
        });
    });

    //debug
   document.querySelectorAll(".bottom-nav button").forEach(button => {
        button.addEventListener("click", (event) => {
            console.log("Button Clicked:", event.target);
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
    document.getElementById("backToHomeFromIdentify").addEventListener("click", () => {
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

function removeTune(tuneId) {
    let savedTunes = JSON.parse(localStorage.getItem("savedTunes")) || [];
    savedTunes = savedTunes.filter(id => id !== tuneId);

    localStorage.setItem("savedTunes", JSON.stringify(savedTunes));
    loadSavedTunes(); // Refresh the saved tunes list
}

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



