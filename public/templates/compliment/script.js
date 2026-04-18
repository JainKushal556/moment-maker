// Stage management
let currentStage = 0;
const stages = ['stage-intro', 'stage-scanner', 'stage-gallery', 'stage-letter', 'stage-outro'];

function showStage(stageIndex) {
    stages.forEach((stage, index) => {
        const el = document.getElementById(stage);
        if (index === stageIndex) {
            el.classList.add('active');
            el.classList.add('animate-fade-in');
        } else {
            el.classList.remove('active');
        }
    });
    currentStage = stageIndex;
}

// Stage 0: Intro -> Scanner
document.getElementById('start-btn').addEventListener('click', function () {
    showStage(1);
    runScanner();
});

// Scanner animation
function runScanner() {
    const scanTexts = ['Checking smile...', 'Measuring cuteness...', 'Detecting sweetness...', 'Almost done...'];
    let index = 0;
    const scanTextEl = document.getElementById('scan-text');

    const interval = setInterval(() => {
        if (index < scanTexts.length) {
            scanTextEl.textContent = scanTexts[index];
            scanTextEl.classList.remove('animate-slide-in');
            void scanTextEl.offsetWidth; // Trigger reflow
            scanTextEl.classList.add('animate-slide-in');
            index++;
        }
    }, 1100);

    setTimeout(() => {
        clearInterval(interval);
        document.getElementById('scanning-view').style.display = 'none';
        document.getElementById('receipt-view').style.display = 'flex';
        document.getElementById('report-date').textContent = new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }, 4800);
}

// Stage 1: Scanner -> Gallery
document.getElementById('continue-to-gallery').addEventListener('click', function () {
    showStage(2);
});

// Stage 2: Gallery -> Letter
document.getElementById('continue-to-letter').addEventListener('click', function () {
    showStage(3);
});

// Stage 3: Open letter
document.getElementById('open-letter-btn').addEventListener('click', function () {
    document.getElementById('envelope-view').style.display = 'none';
    document.getElementById('letter-content').style.display = 'block';
});

// Stage 3: Letter -> Outro
document.getElementById('continue-to-outro').addEventListener('click', function () {
    showStage(4);
});

// Create falling petals
function createPetals() {
    const container = document.getElementById('petals-container');
    const petalColors = ['#ffc6c4', '#ffd6e0', '#fde2ea', '#e9d5ff', '#ffe4c7'];
    const petalCount = 20;

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';

        const size = Math.random() * 12 + 8; // 8-20px
        const left = Math.random() * 100; // 0-100%
        const delay = Math.random() * 10; // 0-10s delay
        const duration = Math.random() * 10 + 10; // 10-20s duration
        const color = petalColors[Math.floor(Math.random() * petalColors.length)];

        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        petal.style.left = left + '%';
        petal.style.backgroundColor = color;
        petal.style.animationDuration = duration + 's';
        petal.style.animationDelay = delay + 's';
        petal.style.boxShadow = '0 2px 10px rgba(255, 182, 193, 0.3)';

        container.appendChild(petal);
    }
}

// Initialize petals on page load
createPetals();
