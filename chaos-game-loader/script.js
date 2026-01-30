// Game State
let gameState = {
    coffee: 100,
    serverTemp: 30,
    memory: 100,
    loadingProgress: 0,
    score: 0,
    combo: 0,
    isGameOver: false,
    achievements: []
};

// Counters
let bugCount = 0;
let bugsSquashed = 0;
let coffeesDrunk = 0;
let tabsClosed = 0;
let leaksFixed = 0;
let managersSurvived = 0;

// Game settings
const LOADING_SPEED = 0.3; // % per second
const COFFEE_DRAIN = 2; // per second
const TEMP_INCREASE = 1; // per second
const MEMORY_DRAIN = 1.5; // per second

// Intervals
let gameLoop;
let bugSpawner;
let leakSpawner;
let tabSpawner;
let chaosEventTimer;
let managerTimer;

// Elements
const coffeeBar = document.getElementById('coffee-bar');
const tempBar = document.getElementById('temp-bar');
const memoryBar = document.getElementById('memory-bar');
const progressFill = document.getElementById('progress-fill');
const progressPercent = document.getElementById('progress-percent');
const scoreValue = document.getElementById('score-value');
const comboValue = document.getElementById('combo-value');
const bugsContainer = document.getElementById('bugs-container');
const leaksContainer = document.getElementById('leaks-container');
const tabsContainer = document.getElementById('tabs-container');
const mainMessage = document.getElementById('main-message');
const gameContainer = document.getElementById('game-container');

// Fun messages
const messages = [
    "Keep everything balanced! 🎯",
    "You got this! 💪",
    "Loading... Please wait! ⏳",
    "Don't let the bugs win! 🐛",
    "Coffee is life! ☕",
    "The server is your friend! 🌡️",
    "Memory management is key! 💾",
    "Stack Overflow to the rescue! 📚",
    "Just a bit more... 🔄",
    "Chaos is temporary, glory is forever! ✨"
];

let messageInterval;

// Initialize game
function initGame() {
    gameState = {
        coffee: 100,
        serverTemp: 30,
        memory: 100,
        loadingProgress: 0,
        score: 0,
        combo: 0,
        isGameOver: false,
        achievements: []
    };
    
    bugCount = 0;
    bugsSquashed = 0;
    coffeesDrunk = 0;
    tabsClosed = 0;
    leaksFixed = 0;
    managersSurvived = 0;
    
    updateUI();
    startGame();
}

function startGame() {
    // Main game loop
    gameLoop = setInterval(updateGame, 100);
    
    // Spawn bugs
    bugSpawner = setInterval(spawnBug, 2000);
    
    // Spawn leaks
    leakSpawner = setInterval(spawnLeak, 4000);
    
    // Spawn tabs
    tabSpawner = setInterval(spawnTab, 5000);
    
    // Random chaos events
    chaosEventTimer = setInterval(maybeSpawnChaosEvent, 15000);
    
    // Manager appearances
    managerTimer = setInterval(maybeSpawnManager, 20000);
    
    // Rotate messages
    messageInterval = setInterval(rotateMessage, 3000);
}

function updateGame() {
    if (gameState.isGameOver) return;
    
    // Drain resources
    gameState.coffee = Math.max(0, gameState.coffee - COFFEE_DRAIN / 10);
    gameState.serverTemp = Math.min(100, gameState.serverTemp + TEMP_INCREASE / 10);
    gameState.memory = Math.max(0, gameState.memory - MEMORY_DRAIN / 10);
    
    // Check for game over conditions
    if (gameState.coffee <= 0) {
        endGame("You fell asleep! ☕💤");
        return;
    }
    
    if (gameState.serverTemp >= 100) {
        endGame("Server overheated! 🔥🌡️");
        return;
    }
    
    if (gameState.memory <= 0) {
        endGame("Out of memory! 💾❌");
        return;
    }
    
    // Update loading progress (slower if stats are low)
    const efficiency = (gameState.coffee / 100 + (100 - gameState.serverTemp) / 100 + gameState.memory / 100) / 3;
    gameState.loadingProgress += LOADING_SPEED * efficiency / 10;
    
    // Check for victory
    if (gameState.loadingProgress >= 100) {
        victory();
        return;
    }
    
    // Decay combo
    if (gameState.combo > 0 && Math.random() < 0.02) {
        gameState.combo = Math.max(0, gameState.combo - 1);
    }
    
    updateUI();
}

function updateUI() {
    coffeeBar.style.width = gameState.coffee + '%';
    updateBarColor(coffeeBar, gameState.coffee);
    
    tempBar.style.width = gameState.serverTemp + '%';
    updateBarColor(tempBar, 100 - gameState.serverTemp);
    
    memoryBar.style.width = gameState.memory + '%';
    updateBarColor(memoryBar, gameState.memory);
    
    progressFill.style.width = gameState.loadingProgress + '%';
    progressPercent.textContent = Math.floor(gameState.loadingProgress);
    
    scoreValue.textContent = gameState.score;
    comboValue.textContent = gameState.combo;
}

function updateBarColor(bar, value) {
    bar.classList.remove('warning', 'danger');
    if (value < 30) {
        bar.classList.add('danger');
    } else if (value < 50) {
        bar.classList.add('warning');
    }
}

function rotateMessage() {
    mainMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
}

// Bug spawning
function spawnBug() {
    if (bugCount >= 8) return; // Max bugs
    
    const bug = document.createElement('div');
    bug.className = 'bug';
    bug.textContent = ['🐛', '🐞', '🦗', '🕷️'][Math.floor(Math.random() * 4)];
    bug.style.left = Math.random() * (window.innerWidth - 100) + 'px';
    bug.style.top = (Math.random() * (window.innerHeight - 300) + 150) + 'px';
    
    bug.addEventListener('click', () => squashBug(bug));
    
    bugsContainer.appendChild(bug);
    bugCount++;
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (bug.parentElement) {
            bug.remove();
            bugCount--;
            // Penalty for not squashing
            gameState.serverTemp = Math.min(100, gameState.serverTemp + 5);
        }
    }, 10000);
}

function squashBug(bug) {
    bug.classList.add('squashed');
    bugCount--;
    bugsSquashed++;
    
    // Rewards
    addScore(50);
    gameState.combo++;
    
    createParticle(bug.offsetLeft, bug.offsetTop, '💥');
    
    setTimeout(() => bug.remove(), 300);
}

// Memory leaks
function spawnLeak() {
    if (gameState.memory <= 10) return; // Already critical
    
    const leak = document.createElement('div');
    leak.className = 'leak';
    leak.textContent = '💧';
    leak.style.left = Math.random() * (window.innerWidth - 50) + 'px';
    leak.style.top = '100px';
    
    leaksContainer.appendChild(leak);
    
    // Drain memory over time
    const drainInterval = setInterval(() => {
        gameState.memory = Math.max(0, gameState.memory - 2);
    }, 500);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (leak.parentElement) {
            clearInterval(drainInterval);
            leak.remove();
        }
    }, 5000);
}

// Stack Overflow tabs
function spawnTab() {
    const tab = document.createElement('div');
    tab.className = 'so-tab';
    tab.textContent = 'How to fix ' + ['memory leak', 'null pointer', 'infinite loop', 'deadlock'][Math.floor(Math.random() * 4)];
    tab.style.left = Math.random() * (window.innerWidth - 200) + 'px';
    tab.style.top = Math.random() * 200 + 100 + 'px';
    
    tab.addEventListener('click', () => closeTab(tab));
    
    tabsContainer.appendChild(tab);
}

function closeTab(tab) {
    tab.style.animation = 'squash 0.3s forwards';
    tabsClosed++;
    
    addScore(30);
    gameState.combo++;
    
    createParticle(tab.offsetLeft, tab.offsetTop, '✨');
    
    setTimeout(() => tab.remove(), 300);
}

// Chaos Events
function maybeSpawnChaosEvent() {
    if (Math.random() < 0.5) {
        spawnChaosEvent();
    }
}

function spawnChaosEvent() {
    const events = [
        { text: "🌩️ NETWORK STORM! 🌩️", effect: () => { gameState.serverTemp += 20; } },
        { text: "📉 STOCK MARKET CRASH! 📉", effect: () => { gameState.coffee -= 20; } },
        { text: "🎲 RANDOM BUG MULTIPLICATION! 🎲", effect: () => { for(let i = 0; i < 3; i++) spawnBug(); } },
        { text: "⚡ POWER SURGE! ⚡", effect: () => { gameState.serverTemp += 15; gameState.memory -= 15; } },
        { text: "🎉 BONUS TIME! 🎉", effect: () => { gameState.loadingProgress += 10; addScore(100); } }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    const chaosDiv = document.getElementById('chaos-event');
    
    chaosDiv.innerHTML = `<div class="chaos-content">${event.text}</div>`;
    chaosDiv.style.display = 'flex';
    
    event.effect();
    
    gameContainer.classList.add('screen-shake');
    
    setTimeout(() => {
        chaosDiv.style.display = 'none';
        gameContainer.classList.remove('screen-shake');
    }, 2000);
}

// Manager Warning
function maybeSpawnManager() {
    if (Math.random() < 0.4) {
        spawnManager();
    }
}

function spawnManager() {
    const managerDiv = document.getElementById('manager-warning');
    const busyFill = document.getElementById('busy-fill');
    
    managerDiv.style.display = 'flex';
    
    let busyLevel = 0;
    const targetBusy = 100;
    
    const checkBusy = setInterval(() => {
        if (busyLevel >= targetBusy) {
            clearInterval(checkBusy);
            managerDiv.style.display = 'none';
            addScore(200);
            managersSurvived++;
            gameState.combo += 5;
            createParticle(window.innerWidth / 2, window.innerHeight / 2, '🎉');
        }
        busyFill.style.width = busyLevel + '%';
    }, 50);
    
    const decayInterval = setInterval(() => {
        busyLevel = Math.max(0, busyLevel - 2);
    }, 100);
    
    // Space key listener
    const spaceHandler = (e) => {
        if (e.key === ' ' && managerDiv.style.display === 'flex') {
            e.preventDefault();
            busyLevel = Math.min(100, busyLevel + 5);
        }
    };
    
    document.addEventListener('keydown', spaceHandler);
    
    setTimeout(() => {
        clearInterval(checkBusy);
        clearInterval(decayInterval);
        document.removeEventListener('keydown', spaceHandler);
        if (managerDiv.style.display === 'flex') {
            managerDiv.style.display = 'none';
            gameState.coffee -= 30;
            mainMessage.textContent = "Manager noticed you slacking! ☕-30";
            setTimeout(() => rotateMessage(), 2000);
        }
    }, 8000);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (gameState.isGameOver) return;
    
    switch(e.key.toLowerCase()) {
        case 'c':
            drinkCoffee();
            break;
        case 'f':
            coolServer();
            break;
        case 'm':
            freeMemory();
            break;
        case 'x':
            closeAllTabs();
            break;
    }
});

function drinkCoffee() {
    gameState.coffee = Math.min(100, gameState.coffee + 30);
    coffeesDrunk++;
    addScore(20);
    createParticle(100, 100, '☕');
    mainMessage.textContent = "Ahhh, coffee! +30 ☕";
    setTimeout(() => rotateMessage(), 1500);
}

function coolServer() {
    if (gameState.serverTemp < 50) {
        mainMessage.textContent = "Server is already cool! 🧊";
        setTimeout(() => rotateMessage(), 1500);
        return;
    }
    gameState.serverTemp = Math.max(0, gameState.serverTemp - 40);
    addScore(30);
    createParticle(300, 100, '❄️');
    mainMessage.textContent = "Server cooled! -40°C 🌡️";
    setTimeout(() => rotateMessage(), 1500);
}

function freeMemory() {
    // Remove all leaks
    const leaks = document.querySelectorAll('.leak');
    leaks.forEach(leak => leak.remove());
    
    gameState.memory = Math.min(100, gameState.memory + 30);
    leaksFixed += leaks.length;
    addScore(40 * leaks.length);
    gameState.combo += leaks.length;
    createParticle(500, 100, '💾');
    mainMessage.textContent = `Memory freed! +${30 + leaks.length * 10} 💾`;
    setTimeout(() => rotateMessage(), 1500);
}

function closeAllTabs() {
    const tabs = document.querySelectorAll('.so-tab');
    if (tabs.length === 0) {
        mainMessage.textContent = "No tabs to close! 📚";
        setTimeout(() => rotateMessage(), 1500);
        return;
    }
    
    tabs.forEach(tab => {
        tab.remove();
        tabsClosed++;
    });
    
    addScore(50 * tabs.length);
    gameState.combo += tabs.length;
    createParticle(700, 100, '📚');
    mainMessage.textContent = `Closed ${tabs.length} tabs! 📚`;
    setTimeout(() => rotateMessage(), 1500);
}

function addScore(points) {
    const multiplier = 1 + (gameState.combo * 0.1);
    gameState.score += Math.floor(points * multiplier);
}

function createParticle(x, y, emoji) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = emoji;
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 1000);
}

// Game Over
function endGame(reason) {
    gameState.isGameOver = true;
    clearAllIntervals();
    
    const gameoverScreen = document.getElementById('gameover-screen');
    const crashReason = document.getElementById('crash-reason');
    const gameoverScore = document.getElementById('gameover-score');
    
    crashReason.textContent = reason;
    gameoverScore.textContent = `Final Score: ${gameState.score}`;
    
    gameContainer.style.display = 'none';
    gameoverScreen.style.display = 'flex';
}

// Victory
function victory() {
    gameState.isGameOver = true;
    clearAllIntervals();
    
    // Calculate achievements
    calculateAchievements();
    
    const victoryScreen = document.getElementById('victory-screen');
    const finalScore = document.getElementById('final-score');
    const achievementsDiv = document.getElementById('achievements');
    
    finalScore.textContent = `Final Score: ${gameState.score}`;
    
    achievementsDiv.innerHTML = '<h3>🏆 Achievements</h3>';
    gameState.achievements.forEach(achievement => {
        const div = document.createElement('div');
        div.className = 'achievement';
        div.textContent = achievement;
        achievementsDiv.appendChild(div);
    });
    
    gameContainer.style.display = 'none';
    victoryScreen.style.display = 'flex';
    
    // Confetti!
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            createParticle(
                Math.random() * window.innerWidth,
                -50,
                ['🎉', '🎊', '✨', '⭐', '💫'][Math.floor(Math.random() * 5)]
            );
        }, i * 30);
    }
}

function calculateAchievements() {
    if (bugsSquashed >= 10) gameState.achievements.push('🐛 Bug Terminator');
    if (coffeesDrunk >= 5) gameState.achievements.push('☕ Coffee Addict');
    if (tabsClosed >= 10) gameState.achievements.push('📚 Tab Hoarder');
    if (managersSurvived >= 2) gameState.achievements.push('🎭 Master of Disguise');
    if (gameState.combo >= 10) gameState.achievements.push('🔥 Combo King');
    if (gameState.score >= 1000) gameState.achievements.push('💯 Score Legend');
    if (leaksFixed >= 5) gameState.achievements.push('💧 Plumber');
    if (gameState.coffee > 50 && gameState.memory > 50) gameState.achievements.push('⚡ Efficiency Expert');
}

function clearAllIntervals() {
    clearInterval(gameLoop);
    clearInterval(bugSpawner);
    clearInterval(leakSpawner);
    clearInterval(tabSpawner);
    clearInterval(chaosEventTimer);
    clearInterval(managerTimer);
    clearInterval(messageInterval);
}

// Restart
document.getElementById('restart-btn').addEventListener('click', () => {
    document.getElementById('victory-screen').style.display = 'none';
    gameContainer.style.display = 'flex';
    
    // Clear all entities
    bugsContainer.innerHTML = '';
    leaksContainer.innerHTML = '';
    tabsContainer.innerHTML = '';
    
    initGame();
});

document.getElementById('retry-btn').addEventListener('click', () => {
    document.getElementById('gameover-screen').style.display = 'none';
    gameContainer.style.display = 'flex';
    
    // Clear all entities
    bugsContainer.innerHTML = '';
    leaksContainer.innerHTML = '';
    tabsContainer.innerHTML = '';
    
    initGame();
});

// Start the game
initGame();
