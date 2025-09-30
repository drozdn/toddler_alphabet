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

// Preload images with progress
let imagesLoaded = 0;
const totalImages = alphabetList.length;

alphabetList.forEach(item => {
    const img = new Image();
    img.src = item.img;
    img.onload = img.onerror = () => {
        imagesLoaded++;
        const percent = Math.round((imagesLoaded / totalImages) * 100);
        progressBar.style.width = percent + '%';
        progressText.textContent = percent + '%';
        if (imagesLoaded === totalImages) {
            setTimeout(hideLoadingScreen, 300);
        }
    };
});

// Hide loader
function hideLoadingScreen() {
    loadingScreen.style.opacity = 0;
    setTimeout(() => {
        loadingScreen.style.display = "none";
        appReady = true; // app ready before first tap
    }, 500);
}

// Normal speak function
function speak(text, callback) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pl-PL";
    utterance.rate = 0.9;
    utterance.onend = () => setTimeout(callback, 50);
    speechSynthesis.speak(utterance);
}

// Safari-safe speak for FIRST utterance
function speakNow(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pl-PL";
    utterance.rate = 0.9;
    utterance.onend = () => {
        currentStep = 1;
        isLocked = false;
    };
    speechSynthesis.speak(utterance);
}

// Handle first tap on Safari + mobile safely
function handleFirstTap() {
    if (!firstTapDone) {
        firstTapDone = true;
        const item = alphabetList[currentIndex];

        if (item.img) {
            image.src = item.img;
            image.style.display = "block";
            mainText.style.opacity = 0;
        } else {
            mainText.textContent = item.letter;
            mainText.style.opacity = 1;
            image.style.display = "none";
        }

        // Safari-safe voice init
        let voices = speechSynthesis.getVoices();
        if (!voices || voices.length === 0) {
            speechSynthesis.onvoiceschanged = () => {
                speakNow(item.letter);
            };
        } else {
            speakNow(item.letter);
        }

        return true;
    }
    return false;
}

// Main interaction for subsequent taps
function handleInteraction() {
    if (!appReady || isLocked) return;
    if (handleFirstTap()) return; // first tap handled

    const item = alphabetList[currentIndex];
    isLocked = true;

    try {
        if (currentStep === 0) {
            if (item.img) {
                image.src = item.img;
                image.style.display = "block";
                mainText.style.opacity = 0;
            } else {
                mainText.textContent = item.letter;
                mainText.style.opacity = 1;
                image.style.display = "none";
            }
            speak(item.letter, () => { currentStep = 1; isLocked = false; });

        } else if (currentStep === 1) {
            speak(item.subject, () => { currentStep = 2; isLocked = false; });

        } else if (currentStep === 2) {
            speak(item.phrase, () => {
                currentStep = 0;
                currentIndex++;
                if (currentIndex >= alphabetList.length) currentIndex = 0;
                isLocked = false;
            });
        }
    } catch (e) {
        console.warn("Interaction error:", e);
        isLocked = false;
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    mainText.style.display = 'none';
    image.style.display = 'none';
});

// Pointerdown for desktop + mobile
document.addEventListener('pointerdown', handleInteraction);

// Loader skip
loadingScreen.addEventListener('pointerdown', hideLoadingScreen);
