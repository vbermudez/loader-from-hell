// Terminal command sequences
const commandSequences = [
    { text: "INITIALIZING MAINFRAME CONNECTION...", class: "info", delay: 500 },
    { text: "> Establishing secure tunnel...", class: "success", delay: 800 },
    { text: "> Bypassing firewall protocols...", class: "warning", delay: 1200 },
    { text: "> Scanning network ports...", class: "info", delay: 600 },
    { text: "> Port 8080: OPEN", class: "success", delay: 400 },
    { text: "> Port 443: SECURED", class: "success", delay: 400 },
    { text: "> Injecting authentication bypass...", class: "warning", delay: 1000 },
    { text: "ERROR: Access Denied", class: "error", delay: 800 },
    { text: "> Attempting alternative route...", class: "warning", delay: 700 },
    { text: "> Just kidding, we're in! 😎", class: "success", delay: 1200 },
    { text: "> Downloading RAM: 0%", class: "info", delay: 500 },
    { text: "> Decrypting database...", class: "info", delay: 900 },
    { text: "> Accessing mainframe core...", class: "warning", delay: 800 },
    { text: "> Negotiating with backend servers...", class: "info", delay: 1000 },
    { text: "> Compiling assets from the void...", class: "info", delay: 700 },
    { text: "> Final synchronization...", class: "success", delay: 1200 }
];

const progressBars = [
    { label: "SYSTEM BREACH", duration: 3000 },
    { label: "DATA EXTRACTION", duration: 4000 },
    { label: "SECURITY OVERRIDE", duration: 3500 }
];

let currentCommandIndex = 0;
let keyPressCount = 0;
let hackingSpeed = 1;
const output = document.getElementById('terminal-output');
const progressContainer = document.getElementById('progress-bars');
const terminalContainer = document.getElementById('terminal-container');

// Matrix rain effect
function createMatrixRain() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
    const char = document.createElement('div');
    char.className = 'matrix-char';
    char.textContent = chars[Math.floor(Math.random() * chars.length)];
    char.style.left = Math.random() * 100 + '%';
    document.body.appendChild(char);
    
    setTimeout(() => char.remove(), 3000);
}

// Start matrix rain
setInterval(createMatrixRain, 200);

// Type out a command
function typeCommand(text, className, callback) {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
    
    // Random glitch effect
    if (Math.random() < 0.3) {
        line.classList.add('glitch');
        terminalContainer.classList.add('screen-shake');
        setTimeout(() => {
            terminalContainer.classList.remove('screen-shake');
        }, 500);
    }
    
    if (callback) {
        setTimeout(callback, 300);
    }
}

// Create progress bar
function createProgressBar(label, duration) {
    const container = document.createElement('div');
    container.className = 'progress-container';
    
    container.innerHTML = `
        <div class="progress-label">${label}</div>
        <div class="progress-bar">
            <div class="progress-fill"></div>
            <span class="progress-percentage">0%</span>
        </div>
    `;
    
    progressContainer.appendChild(container);
    
    const fill = container.querySelector('.progress-fill');
    const percentage = container.querySelector('.progress-percentage');
    
    let progress = 0;
    const increment = 100 / (duration / 50);
    
    const interval = setInterval(() => {
        progress += increment * hackingSpeed;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
        }
        fill.style.width = progress + '%';
        percentage.textContent = Math.floor(progress) + '%';
    }, 50);
    
    return new Promise(resolve => {
        setTimeout(resolve, duration / hackingSpeed);
    });
}

// Execute command sequence
async function executeCommands() {
    for (const cmd of commandSequences) {
        await new Promise(resolve => {
            setTimeout(() => {
                typeCommand(cmd.text, cmd.class, resolve);
            }, cmd.delay / hackingSpeed);
        });
    }
    
    // Start progress bars
    const progressPromises = progressBars.map((bar, index) => 
        new Promise(resolve => {
            setTimeout(() => {
                createProgressBar(bar.label, bar.duration).then(resolve);
            }, index * 500);
        })
    );
    
    await Promise.all(progressPromises);
    
    // Final message
    await new Promise(resolve => setTimeout(resolve, 500));
    typeCommand("✓ ACCESS GRANTED", "success");
    typeCommand("✓ CONTENT LOADED SUCCESSFULLY", "success");
    
    // Complete loading
    setTimeout(completeLoading, 2000);
}

function completeLoading() {
    terminalContainer.style.display = 'none';
    document.getElementById('content').style.display = 'flex';
    document.getElementById('content').style.justifyContent = 'center';
    document.getElementById('content').style.alignItems = 'center';
    document.getElementById('content').style.minHeight = '100vh';
}

// Keyboard interaction - typing makes it "hack faster"
let lastKeyTime = Date.now();
document.addEventListener('keydown', (e) => {
    keyPressCount++;
    const now = Date.now();
    
    if (now - lastKeyTime < 100) { // Rapid typing
        hackingSpeed = Math.min(3, hackingSpeed + 0.1);
        
        // Show feedback
        if (keyPressCount % 10 === 0) {
            const feedback = document.createElement('div');
            feedback.className = 'terminal-line success';
            feedback.textContent = `> HACKING INTENSIFIES! Speed: ${hackingSpeed.toFixed(1)}x`;
            output.appendChild(feedback);
            output.scrollTop = output.scrollHeight;
            
            setTimeout(() => feedback.remove(), 2000);
        }
    }
    
    lastKeyTime = now;
    
    // Easter egg: pressing Enter multiple times
    if (e.key === 'Enter' && keyPressCount > 20) {
        const msg = document.createElement('div');
        msg.className = 'terminal-line warning';
        msg.textContent = "> You're really good at this! 💻";
        output.appendChild(msg);
        output.scrollTop = output.scrollHeight;
    }
});

// Mouse movement causes screen glitches
let lastGlitchTime = 0;
document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastGlitchTime > 2000 && Math.random() < 0.1) {
        terminalContainer.classList.add('screen-shake');
        setTimeout(() => {
            terminalContainer.classList.remove('screen-shake');
        }, 200);
        lastGlitchTime = now;
    }
});

// Restart button
document.getElementById('restart').addEventListener('click', () => {
    location.reload();
});

// Start the hacking sequence
setTimeout(() => {
    executeCommands();
}, 1000);
