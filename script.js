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

let currentIndex = 0;
let currentStep = 0; // 0=letter,1=subject,2=phrase
let isLocked = false;
let appReady = false;
let firstInteraction = true;

// Preload images
function preloadImages(list) {
    return Promise.all(
        list.map(item => new Promise(resolve => {
            const img = new Image();
            img.src = item.img;
            img.onload = () => resolve();
            img.onerror = () => resolve();
        }))
    );
}

// Speak text with small delay
function speak(text) {
    return new Promise(resolve => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "pl-PL";
        utterance.rate = 0.9;
        utterance.onend = () => setTimeout(resolve, 50);
        speechSynthesis.speak(utterance);
    });
}

// Hide loader
function hideLoadingScreen() {
    loadingScreen.style.opacity = 0;
    setTimeout(() => {
        loadingScreen.style.display = "none";
        mainText.style.display = "block";
        appReady = true;
    }, 500);
}

// Main interaction
async function handleInteraction() {
    if (!appReady || isLocked) return;
    isLocked = true;

    const currentItem = alphabetList[currentIndex];

    if (firstInteraction) {
        firstInteraction = false;

        // Show first image
        if (currentItem.img && currentItem.img.includes(".png")) {  // string check only
            image.src = currentItem.img;
            image.style.display = "block";
            mainText.style.opacity = 0;
        } else {
            image.style.display = "none";
            mainText.textContent = currentItem.letter;
            mainText.style.opacity = 1;
        }

        // Mobile speech unlock
        const unlock = new SpeechSynthesisUtterance("");
        speechSynthesis.speak(unlock);
        await new Promise(resolve => setTimeout(resolve, 50));

        // Speak first letter
        await speak(currentItem.letter);
        currentStep = 1; // next tap = subject

    } else {
        if (currentStep === 0) {
            if (currentItem.img && currentItem.img.includes(".png")) {
                image.src = currentItem.img;
                image.style.display = "block";
                mainText.style.opacity = 0;
            } else {
                image.style.display = "none";
                mainText.textContent = currentItem.letter;
                mainText.style.opacity = 1;
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
    }

    isLocked = false;
}

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    mainText.style.display = 'none';
    image.style.display = 'none';

    await preloadImages(alphabetList);
    hideLoadingScreen();
});

// Event listeners
document.addEventListener('click', handleInteraction);
document.addEventListener('touchstart', handleInteraction);
document.addEventListener('keydown', handleInteraction);

// Skip loader
loadingScreen.addEventListener('click', hideLoadingScreen);
