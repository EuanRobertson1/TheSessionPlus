//function for getting events
export async function fetchUpcomingEvents() {
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
