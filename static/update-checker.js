async function fetchLatestVersion() {
    const current = await fetch('/version.json').then(res => res.json());
    const latest = await fetch('https://share.flux.moe/wnp/info.json').then(res => res.json());
    
    // dev build
    if (current.version === "0.0.0") {
        console.log("Dev build detected, skipping update check.");
        return;
    }

    console.log(`Current version: ${current.version}`);
    console.log(`Latest version: ${latest.version}`);
    
    if (current.version !== latest.version) {
        console.log("Update available!");
        
        // show update notification
        const notification = document.getElementById("update-notification");
        notification.style.display = "flex";
    } else {
        console.log("Running latest version.");
    }
}

fetchLatestVersion();