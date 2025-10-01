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
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

let currentIndex = 0;
let currentStep = 0;
let isLocked = false;
let clickMeVisible = false;

// Preload images
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
            showClickMeScreen();
        }
    };
});

// Show click me screen
function showClickMeScreen() {
    loadingScreen.innerHTML = '<div class="click-me-screen">Uczę się Alfabetu<br><small>Tap to start</small></div>';
    clickMeVisible = true;
}

// Hide click me screen
function hideClickMeScreen() {
    loadingScreen.style.display = "none";
    mainText.style.display = "block";
    image.style.display = "block";
    clickMeVisible = false;
}

// Show an item
function showItem(item) {
    if (item.img) {
        image.src = item.img;
        image.style.display = "block";
        mainText.style.opacity = 0;
    } else {
        mainText.textContent = item.letter;
        mainText.style.opacity = 1;
        image.style.display = "none";
    }
}

// Speak helper
function speak(text, callback) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pl-PL";
    utterance.rate = 0.9;
    utterance.onend = () => setTimeout(callback, 50);
    speechSynthesis.speak(utterance);
}

// Handle first tap
function handleFirstTap() {
    if (clickMeVisible) {
        hideClickMeScreen();
        const item = alphabetList[currentIndex];
        showItem(item);
        speak(item.letter, () => { currentStep = 1; isLocked = false; });
        return true;
    }
    return false;
}

// Handle normal interaction
function handleInteraction() {
    if (isLocked || clickMeVisible) return;
    const item = alphabetList[currentIndex];
    isLocked = true;

    if (currentStep === 0) {
        showItem(item);
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
}

// Event listeners
document.addEventListener('pointerdown', () => {
    if (handleFirstTap()) return;
    handleInteraction();
});

document.addEventListener('DOMContentLoaded', () => {
    mainText.style.display = 'none';
    image.style.display = 'none';
});
