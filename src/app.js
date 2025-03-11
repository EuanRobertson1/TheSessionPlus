let deferredPrompt;

// Detect if the PWA can be installed
window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    document.getElementById("installButton").style.display = "block";
});

// Handle Install Button Click
document.getElementById("installButton").addEventListener("click", async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
            console.log("PWA Installed!");
        }
        document.getElementById("installButton").style.display = "none";
        deferredPrompt = null;
    }
});

// Hide install button if app is already installed
window.addEventListener("appinstalled", () => {
    console.log("PWA Installed");
    document.getElementById("installButton").style.display = "none";
});

document.querySelectorAll(".bottom-nav button").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".bottom-nav button").forEach(b => b.classList.remove("active"));
        button.classList.add("active");
    });
});

import { fetchUpcomingEvents } from "../src/sessionAPI.js";

document.addEventListener("DOMContentLoaded", async () => {
    // Fetch and display events
    const events = await fetchUpcomingEvents();
    displayEvents(events);

    // Function to switch pages without affecting existing styles
    function switchPage(pageId) {
        const searchBar = document.querySelector(".search-bar");
        const homeContent = document.querySelector(".upcoming-events");
        const sessionsContent = document.querySelector("#sessionsPage");
    
        if (pageId === "sessionsPage") {
            searchBar.style.display = "none"; // Hide search bar
            homeContent.style.display = "none"; // Hide home content
            sessionsContent.style.display = "block"; // Show sessions page
        } else {
            searchBar.style.display = "flex"; // Show search bar on home page
            homeContent.style.display = "block"; // Show home content
            sessionsContent.style.display = "none"; // Hide sessions page
        }
    }
    
    

    // Handle navbar clicks
    document.querySelectorAll(".bottom-nav button").forEach(button => {
        button.addEventListener("click", () => {
            const pageId = button.getAttribute("data-page");
            if (pageId) switchPage(pageId);
        });
    });

    // Handle back button
    document.getElementById("backToHome").addEventListener("click", () => {
        switchPage("homePage");
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

    tunes.slice(0, 10).forEach(tune => {
        const tuneItem = document.createElement("div");
        tuneItem.classList.add("event-box");

        tuneItem.innerHTML = `
            <h3>${tune.name}</h3>
            <p><strong>Type:</strong> ${tune.type || "None"}</p>
            <a href="${tune.url}" target="_blank">View Tune</a>
        `;

        eventList.appendChild(tuneItem);
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
            <a href="https://thesession.org/events/${event.id}" target="_blank">View Details</a>
        `;

        eventList.appendChild(eventItem);
    });
}



