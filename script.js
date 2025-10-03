const appContent = document.getElementById("app");
const loader = document.getElementById("loader");

let currentIndex = 0;
let currentStep = 0;
let isLocked = false;
let started = false;

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

// Show Start Screen
function showStartScreen() {
    appContent.innerHTML = `
        <div class="start-screen">
            <h1>Uczę się alfabetu</h1>
            <button id="startBtn">Start</button>
        </div>
    `;

    document.getElementById("startBtn").addEventListener("click", () => {
        // Unlock speech synthesis on iOS
        const unlock = new SpeechSynthesisUtterance(" ");
        unlock.lang = "pl-PL";
        speechSynthesis.speak(unlock);

        started = true;
        currentIndex = 0;
        currentStep = 0;
        isLocked = false;

        showItem(alphabetList[currentIndex]);
        speak(alphabetList[currentIndex].letter, () => {
            currentStep = 1;
        });
    });
}

// Show image/item
function showItem(item) {
    appContent.innerHTML = `
        <div class="item-container">
            <img src="${item.img}" alt="${item.subject}" />
        </div>
    `;
}

// Speech synthesis
function speak(text, callback) {
    if (!text) {
        if (callback) callback();
        return;
    }
    isLocked = true;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pl-PL";
    utterance.rate = 0.9;
    utterance.onend = () => {
        setTimeout(() => {
            isLocked = false;
            if (callback) callback();
        }, 50);
    };
    speechSynthesis.speak(utterance);
}

// Handle interactions
function handleInteraction() {
    if (!started || isLocked) return;

    const item = alphabetList[currentIndex];

    if (currentStep === 1) {
        speak(item.subject, () => { currentStep = 2; });
    } else if (currentStep === 2) {
        speak(item.phrase, () => { currentStep = 3; });
    } else if (currentStep === 3) {
        currentIndex = (currentIndex + 1) % alphabetList.length;
        currentStep = 0;
        showItem(alphabetList[currentIndex]);
        speak(alphabetList[currentIndex].letter, () => { currentStep = 1; });
    }
}

document.addEventListener("pointerdown", handleInteraction);
document.addEventListener("keydown", handleInteraction);

// Preload images
function preloadImages(list, callback) {
    let loaded = 0;
    list.forEach(item => {
        const img = new Image();
        img.src = item.img;
        img.onload = img.onerror = () => {
            loaded++;
            if (loaded === list.length) callback();
        };
    });
}

window.addEventListener("load", () => {
    preloadImages(alphabetList, () => {
        loader.classList.add("hidden");
        appContent.classList.remove("hidden");
        showStartScreen();
    });
});
