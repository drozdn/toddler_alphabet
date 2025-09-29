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

let currentIndex = -1;
let currentStep = 0;
let isLocked = false;
let appReady = false;
let firstInteraction = true; // special handling for first gesture

// Preload images
function preloadImages(list) {
    return Promise.all(
        list.map(item => {
            return new Promise(resolve => {
                const img = new Image();
                img.src = item.img;
                img.onload = () => resolve();
                img.onerror = () => resolve();
            });
        })
    );
}

function speak(text) {
    return new Promise(resolve => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "pl-PL";
        utterance.rate = 0.9;
        utterance.onend = () => setTimeout(resolve, 50);
        speechSynthesis.speak(utterance);
    });
}

function hideLoadingScreen() {
    loadingScreen.style.opacity = 0;
    setTimeout(() => {
        loadingScreen.style.display = "none";
        mainText.style.display = "block";
        appReady = true;
    }, 500);
}

async function nextStep() {
    if (isLocked) return;
    isLocked = true;

    if (currentStep === 0) {
        currentIndex++;
        if (currentIndex >= alphabetList.length) {
            currentIndex = 0;
        }
    }

    const currentItem = alphabetList[currentIndex];

    if (currentStep === 0) {
        if (currentItem.img) {
            image.src = currentItem.img;
            image.style.display = "block";
            mainText.style.opacity = 0;
        } else {
            image.style.display = "none";
            mainText.textContent = currentItem.letter;
            mainText.style.opacity = 1;
        }
        await speak(currentItem.letter);
    } else if (currentStep === 1) {
        await speak(currentItem.subject);
    } else if (currentStep === 2) {
        await speak(currentItem.phrase);
    }

    currentStep = (currentStep + 1) % 3;
    isLocked = false;
}

// Handle first tap separately
async function handleInteraction() {
    if (!appReady) return;

    if (firstInteraction) {
        firstInteraction = false;
        // Force start with index 0 and step 0 immediately here
        currentIndex = 0;
        currentStep = 0;

        const currentItem = alphabetList[currentIndex];
        if (currentItem.img) {
            image.src = currentItem.img;
            image.style.display = "block";
            mainText.style.opacity = 0;
        } else {
            image.style.display = "none";
            mainText.textContent = currentItem.letter;
            mainText.style.opacity = 1;
        }

        // 🔑 Speak the first letter directly in this handler (works on mobile)
        speak(currentItem.letter).then(() => {
            currentStep = 1; // move to next step for following interactions
        });
    } else {
        nextStep();
    }
}

// Wait for DOM and preload
document.addEventListener('DOMContentLoaded', async () => {
    mainText.style.display = 'none';
    image.style.display = 'none';

    await preloadImages(alphabetList);
    hideLoadingScreen();
});

// Input listeners
document.addEventListener('keydown', handleInteraction);
document.addEventListener('click', handleInteraction);
document.addEventListener('touchstart', handleInteraction);
