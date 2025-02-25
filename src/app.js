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
    const events = await fetchUpcomingEvents();
    displayEvents(events);
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

        eventItem.innerHTML = `
            <h3>${event.name}</h3>
            <p><strong>Location:</strong> ${event.town}, ${event.country}</p>
            <p><strong>Date:</strong> ${event.date}</p>
            <a href="https://thesession.org/events/${event.id}" target="_blank">View Details</a>
        `;

        eventList.appendChild(eventItem);
    });
}


