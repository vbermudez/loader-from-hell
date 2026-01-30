// Blob state
let happiness = 0;
let lastInteractionTime = Date.now();
let interactionCount = 0;
let soundEnabled = true;

const blob = document.getElementById('blob');
const message = document.getElementById('message');
const happinessFill = document.getElementById('happiness-fill');
const soundToggle = document.getElementById('sound-toggle');
const customCursor = document.getElementById('custom-cursor');

// Add pupils
const pupilLeft = document.createElement('div');
pupilLeft.className = 'pupil pupil-left';
blob.appendChild(pupilLeft);

const pupilRight = document.createElement('div');
pupilRight.className = 'pupil pupil-right';
blob.appendChild(pupilRight);

// Audio context for sound effects
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

function playSound(frequency, duration, type = 'sine') {
    if (!soundEnabled) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

function playHappySound() {
    playSound(523.25, 0.1); // C5
    setTimeout(() => playSound(659.25, 0.1), 100); // E5
}

function playSadSound() {
    playSound(200, 0.3, 'triangle');
}

function updateBlobState() {
    const timeSinceInteraction = Date.now() - lastInteractionTime;
    
    // Update happiness meter
    happinessFill.style.width = happiness + '%';
    
    // Blob behavior based on happiness
    blob.className = '';
    
    if (happiness >= 80) {
        blob.classList.add('happy');
        message.textContent = "Yay! I'm so happy! 🥰";
    } else if (happiness >= 50) {
        message.textContent = "Keep petting me! 😊";
    } else if (happiness >= 20) {
        message.textContent = "Pet me more please... 🥺";
        blob.classList.add('needy');
    } else if (timeSinceInteraction > 3000) {
        message.textContent = "Why did you stop? 😢";
        blob.classList.add('sad');
    }
    
    // Decay happiness over time if not interacting
    if (timeSinceInteraction > 1000) {
        happiness = Math.max(0, happiness - 0.2);
    }
    
    // Check if blob is happy enough to complete
    if (happiness >= 100) {
        completeLoading();
    }
}

function petBlob(x, y) {
    lastInteractionTime = Date.now();
    interactionCount++;
    happiness = Math.min(100, happiness + 5);
    
    // Play happy sound
    playHappySound();
    
    // Create trail effect
    createTrail(x, y);
    
    // Move blob slightly towards cursor
    const blobRect = blob.getBoundingClientRect();
    const blobCenterX = blobRect.left + blobRect.width / 2;
    const blobCenterY = blobRect.top + blobRect.height / 2;
    
    const deltaX = (x - blobCenterX) * 0.1;
    const deltaY = (y - blobCenterY) * 0.1;
    
    blob.style.left = `calc(50% + ${deltaX}px)`;
    blob.style.top = `calc(50% + ${deltaY}px)`;
    
    // Reset position after a moment
    setTimeout(() => {
        blob.style.left = '50%';
        blob.style.top = '50%';
    }, 300);
}

function createTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'trail';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    document.body.appendChild(trail);
    
    setTimeout(() => trail.remove(), 500);
}

function updatePupils(x, y) {
    const blobRect = blob.getBoundingClientRect();
    const blobCenterX = blobRect.left + blobRect.width / 2;
    const blobCenterY = blobRect.top + blobRect.height / 2;
    
    const angle = Math.atan2(y - blobCenterY, x - blobCenterX);
    const distance = Math.min(5, Math.hypot(x - blobCenterX, y - blobCenterY) / 20);
    
    const pupilX = Math.cos(angle) * distance;
    const pupilY = Math.sin(angle) * distance;
    
    pupilLeft.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    pupilRight.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
}

function createConfetti() {
    const colors = ['#f5576c', '#f093fb', '#4facfe', '#43e97b', '#feca57'];
    const container = document.getElementById('confetti-container');
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '50%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confetti.style.animationDelay = Math.random() * 0.3 + 's';
            container.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 20);
    }
}

function completeLoading() {
    // Play success sound
    playSound(523.25, 0.15);
    setTimeout(() => playSound(659.25, 0.15), 150);
    setTimeout(() => playSound(783.99, 0.3), 300);
    
    // Hide loader
    document.getElementById('loader-container').style.display = 'none';
    document.getElementById('content').style.display = 'block';
    
    // Show confetti
    createConfetti();
}

// Event listeners
document.addEventListener('mousemove', (e) => {
    // Update custom cursor position
    customCursor.style.left = e.clientX + 'px';
    customCursor.style.top = e.clientY + 'px';
    
    // Update pupils to follow cursor
    updatePupils(e.clientX, e.clientY);
});

blob.addEventListener('mouseenter', () => {
    blob.style.transform = 'translate(-50%, -50%) scale(1.1)';
});

blob.addEventListener('mouseleave', () => {
    blob.style.transform = 'translate(-50%, -50%) scale(1)';
});

blob.addEventListener('click', (e) => {
    petBlob(e.clientX, e.clientY);
});

blob.addEventListener('mousemove', (e) => {
    // Pet blob on mouse move when over it
    if (Math.random() < 0.3) { // 30% chance on each move
        petBlob(e.clientX, e.clientY);
    }
});

soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.classList.toggle('muted');
});

document.getElementById('restart').addEventListener('click', () => {
    location.reload();
});

// Update blob state periodically
setInterval(updateBlobState, 100);

// Periodic sad sound if ignored
setInterval(() => {
    const timeSinceInteraction = Date.now() - lastInteractionTime;
    if (timeSinceInteraction > 5000 && happiness < 20) {
        playSadSound();
    }
}, 5000);

// Auto-complete after 30 seconds of sufficient interaction
setTimeout(() => {
    if (happiness < 100) {
        happiness = 100;
        completeLoading();
    }
}, 30000);
