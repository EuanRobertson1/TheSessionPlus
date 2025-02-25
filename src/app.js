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

