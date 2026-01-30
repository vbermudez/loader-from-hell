// Stage management
let startTime = Date.now();
let currentStage = 1;
let tipInterval;
let consoleInterval;

const stages = {
    1: { duration: 3000, message: "Loading resources...", spinnerClass: "", containerClass: "" },
    2: { duration: 5000, message: "Still loading... this is fine 🔥", spinnerClass: "", containerClass: "" },
    3: { duration: 7000, message: "Negotiating with backend servers...", spinnerClass: "multi-spin", containerClass: "shake" },
    4: { duration: Infinity, message: "⚠️ PANIC MODE ACTIVATED ⚠️", spinnerClass: "chaos", containerClass: "intense-shake" }
};

const loadingTips = [
    "💡 Tip: This is taking longer than expected",
    "💡 Tip: Have you tried turning it off and on again?",
    "💡 Tip: The backend is probably having coffee",
    "💡 Tip: Maybe the data is stuck in traffic",
    "💡 Tip: Try restarting your career",
    "💡 Tip: It's not you, it's the API",
    "💡 Tip: The cloud is just someone else's problem",
    "💡 Tip: Have you considered a different profession?",
    "💡 Tip: Packet loss is just the internet's way of saying 'no'",
    "💡 Tip: Stack Overflow won't save you now"
];

const consoleMessages = [
    "WARNING: CPU temperature rising",
    "ERROR: Sanity check failed",
    "INFO: Attempting to recover...",
    "DEBUG: Why is this taking so long?",
    "CRITICAL: Memory leak detected in hopes and dreams",
    "WARNING: Developer patience at 12%",
    "ERROR: Cannot find motivation.dll",
    "INFO: Blaming cache for all problems",
    "ALERT: Coffee levels critically low",
    "PANIC: Everything is on fire 🔥"
];

function updateStage() {
    const elapsed = Date.now() - startTime;
    const loader = document.getElementById('loader-container');
    const spinner = document.getElementById('spinner');
    const message = document.getElementById('message');
    const emergencyBtn = document.getElementById('emergency-exit');
    
    // Determine current stage
    let newStage = 1;
    let cumulativeDuration = 0;
    
    for (let stage in stages) {
        cumulativeDuration += stages[stage].duration;
        if (elapsed < cumulativeDuration) {
            newStage = parseInt(stage);
            break;
        }
        newStage = parseInt(stage);
    }
    
    if (newStage !== currentStage) {
        currentStage = newStage;
        const stageData = stages[currentStage];
        
        // Update message
        message.textContent = stageData.message;
        message.className = currentStage >= 3 ? (currentStage >= 4 ? 'panic' : 'warning') : '';
        
        // Update spinner
        spinner.className = stageData.spinnerClass;
        
        // Update container
        loader.className = 'active ' + stageData.containerClass;
        
        // Show console messages in stage 3+
        if (currentStage >= 3) {
            showConsoleMessages();
        }
        
        // Show emergency button at stage 4
        if (currentStage >= 4) {
            emergencyBtn.style.display = 'block';
        }
    }
}

function showLoadingTip() {
    const tips = document.getElementById('tips');
    const randomTip = loadingTips[Math.floor(Math.random() * loadingTips.length)];
    tips.textContent = randomTip;
}

function showConsoleMessages() {
    const consoleDiv = document.getElementById('console-messages');
    consoleDiv.classList.add('active');
    
    if (consoleInterval) return; // Already showing messages
    
    consoleInterval = setInterval(() => {
        const message = consoleMessages[Math.floor(Math.random() * consoleMessages.length)];
        const line = document.createElement('div');
        line.className = 'console-line';
        line.textContent = `> ${message}`;
        consoleDiv.appendChild(line);
        
        // Keep only last 10 messages
        while (consoleDiv.children.length > 10) {
            consoleDiv.removeChild(consoleDiv.firstChild);
        }
        
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
    }, 800);
}

function showBSOD() {
    const bsod = document.createElement('div');
    bsod.className = 'bsod active';
    bsod.innerHTML = `
        <h1>😱 A PROBLEM HAS BEEN DETECTED</h1>
        <p>LOADER_IMPATIENCE_EXCEPTION</p>
        <br>
        <p>You pressed the emergency exit button. This is what you wanted, right?</p>
        <br>
        <p>Technical information:</p>
        <p>*** STOP: 0x000000FE (0xDEADBEEF, 0xCAFEBABE, 0x00000000, 0x00000001)</p>
        <br>
        <p>Just kidding! Your content will load in 3 seconds... 😄</p>
    `;
    document.body.appendChild(bsod);
    
    setTimeout(() => {
        bsod.remove();
        loadContent();
    }, 3000);
}

function loadContent() {
    clearInterval(tipInterval);
    clearInterval(consoleInterval);
    document.getElementById('loader-container').style.display = 'none';
    document.getElementById('content').style.display = 'block';
}

// Initialize
tipInterval = setInterval(showLoadingTip, 2000);
setInterval(updateStage, 100);

// Emergency exit button
document.getElementById('emergency-exit').addEventListener('click', showBSOD);

// Restart button
document.getElementById('restart').addEventListener('click', () => {
    location.reload();
});

// Auto-complete after 20 seconds (for demo purposes)
setTimeout(loadContent, 20000);
