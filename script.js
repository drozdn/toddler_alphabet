const alphabetList = [
    { letter: "A", subject: "Arbuz", phrase: "A jak Arbuz", img: "images/arbuz.png" },
    { letter: "B", subject: "Balon", phrase: "B jak Balon", img: "images/balon.png" },
    { letter: "C", subject: "Cześć", phrase: "C jak Cześć", img: "images/czesc.png" },
    { letter: "D", subject: "Dom", phrase: "D jak Dom", img: "images/dom.png" },
    { letter: "E", subject: "Ekran", phrase: "E jak Ekran", img: "images/ekran.png" },
    { letter: "F", subject: "Foka", phrase: "F jak Foka", img: "images/foka.png" },
    { letter: "G", subject: "Gruszka", phrase: "G jak Gruszka", img: "images/gruszka.png" },
    { letter: "H", subject: "Herbata", phrase: "H jak Herbata", img: "images/herbata.png" },
    { letter: "I", subject: "Igła", phrase: "I jak Igła", img: "images/igla.png" },
    { letter: "J", subject: "Jabłko", phrase: "J jak Jabłko", img: "images/jablko.png" },
    { letter: "K", subject: "Koń", phrase: "K jak Koń", img: "images/kon.png" },
    { letter: "L", subject: "Lampka", phrase: "L jak Lampka", img: "images/lampka.png" },
    { letter: "M", subject: "Mysz", phrase: "M jak Mysz", img: "images/mysz.png" },
    { letter: "N", subject: "Narty", phrase: "N jak Narty", img: "images/narty.png" },
    { letter: "O", subject: "Owca", phrase: "O jak Owca", img: "images/owca.png" },
    { letter: "P", subject: "Pies", phrase: "P jak Pies", img: "images/pies.png" },
    { letter: "R", subject: "Rower", phrase: "R jak Rower", img: "images/rower.png" },
    { letter: "S", subject: "Ser", phrase: "S jak Ser", img: "images/ser.png" },
    { letter: "T", subject: "Talerz", phrase: "T jak Talerz", img: "images/talerz.png" },
    { letter: "U", subject: "Ul", phrase: "U jak Ul", img: "images/ul.png" },
    { letter: "W", subject: "Woda", phrase: "W jak Woda", img: "images/woda.png" },
    { letter: "Y", subject: "Yeti", phrase: "Y jak Yeti", img: "images/yeti.png" },
    { letter: "Z", subject: "Zamek", phrase: "Z jak Zamek", img: "images/zamek.png" }
];

const mainText = document.getElementById("main-text");
const image = document.getElementById("image");
const loadingScreen = document.getElementById("loading-screen");
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

let currentIndex = 0;
let currentStep = 0; // 0=letter,1=subject,2=phrase
let isLocked = false;
let firstTapDone = false;
let appReady = false;

// Helper to safely convert to string
const safeString = (val) => (val !== undefined && val !== null) ? String(val) : "";

// Preload images with progress
let imagesLoaded = 0;
const totalImages = alphabetList.length;

alphabetList.forEach(item => {
    const img = new Image();
    img.src = safeString(item.img);
    img.onload = img.onerror = () => {
        imagesLoaded++;
        const percent = Math.round((imagesLoaded / totalImages) * 100);
        progressBar.style.width = percent + '%';
        progressText.textContent = percent + '%';
        if (imagesLoaded === totalImages) {
            // All images loaded
            setTimeout(hideLoadingScreen, 300);
        }
    };
});

// Speak helper (mobile-safe)
function speak(text) {
    return new Promise(resolve => {
        try {
            const utterance = new SpeechSynthesisUtterance(safeString(text));
            utterance.lang = "pl-PL";
            utterance.rate = 0.9;
            utterance.onend = () => setTimeout(resolve, 50);
            speechSynthesis.speak(utterance);
        } catch (e) {
            resolve();
        }
    });
}

// Hide loader
function hideLoadingScreen() {
    try {
        loadingScreen.style.opacity = 0;
        setTimeout(() => {
            loadingScreen.style.display = "none";
            appReady = true; // set ready before first tap
        }, 500);
    } catch (e) {
        console.warn("Loader hide error ignored:", e);
    }
}

// Main interaction
async function handleInteraction() {
    if (!appReady || isLocked) return;
    isLocked = true;

    // Handle first tap (must show first image and speak)
    if (!firstTapDone) {
        firstTapDone = true;

        const firstItem = alphabetList[currentIndex];

        if (firstItem.img) {
            image.src = safeString(firstItem.img);
            image.style.display = "block";
            mainText.style.opacity = 0;
        } else {
            mainText.textContent = safeString(firstItem.letter);
            mainText.style.opacity = 1;
            image.style.display = "none";
        }

        await speak(firstItem.letter);
        currentStep = 1;
        isLocked = false;
        return;
    }

    const currentItem = alphabetList[currentIndex];

    try {
        if (currentStep === 0) {
            if (currentItem.img) {
                image.src = safeString(currentItem.img);
                image.style.display = "block";
                mainText.style.opacity = 0;
            } else {
                mainText.textContent = safeString(currentItem.letter);
                mainText.style.opacity = 1;
                image.style.display = "none";
            }
            await speak(currentItem.letter);
            currentStep = 1;

        } else if (currentStep === 1) {
            await speak(currentItem.subject);
            currentStep = 2;

        } else if (currentStep === 2) {
            await speak(currentItem.phrase);
            currentStep = 0;
            currentIndex++;
            if (currentIndex >= alphabetList.length) currentIndex = 0;
        }
    } catch (e) {
        console.warn("Interaction error ignored:", e);
    }

    isLocked = false;
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    mainText.style.display = 'none';
    image.style.display = 'none';
});

// Use pointerdown for consistent cross-device first-tap behavior
document.addEventListener('pointerdown', handleInteraction);

// Loader skip
loadingScreen.addEventListener('pointerdown', hideLoadingScreen);
