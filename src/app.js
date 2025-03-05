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
});



function displayEvents(events) {
    const eventList = document.getElementById("event-list");
    eventList.innerHTML = ""; // Clear previous events

    if (!events.length) {
        eventList.innerHTML = "<p>No upcoming events found.</p>";
        return;
    }

    events.slice(0, 10).forEach(event => {
        const eventItem = document.createElement("div");
        eventItem.classList.add("event-box");

        // Extract town and country correctly
        const town = event.town?.name || "Unknown Town";
        const country = event.country?.name || "Unknown Country";

        eventItem.innerHTML = `
            <h3>${event.name}</h3>
            <p><strong>Location:</strong> ${town}, ${country}</p>
            <p><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</p>
            <a href="https://thesession.org/events/${event.id}" target="_blank">View Details</a>
        `;

        eventList.appendChild(eventItem);
    });
}



