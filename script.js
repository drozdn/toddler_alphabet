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

let currentIndex = 0;
let step = 0;
let isSpeaking = false;

const mainText = document.getElementById('main-text');
const image = document.getElementById('image');

// Initial screen
mainText.textContent = "Uczę się Alfabetu";
mainText.style.opacity = 1;
image.style.display = "none";

// Preload images
alphabetList.forEach(item => {
    const img = new Image();
    img.src = item.img;
});

// Speak text with short pause
function speak(text) {
    return new Promise(resolve => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pl-PL';
        utterance.rate = 0.9;
        utterance.onend = () => setTimeout(resolve, 50);
        speechSynthesis.speak(utterance);
    });
}

// Show element with fade-in
function showElement(element, text = null) {
    element.style.opacity = 0;
    if (text !== null) element.textContent = text;
    requestAnimationFrame(() => element.style.opacity = 1);
}

// Advance steps
async function nextStep() {
    if (isSpeaking) return;
    isSpeaking = true;

    if(currentIndex >= alphabetList.length) {
        showElement(mainText, "Koniec!");
        image.style.display = "none";
        isSpeaking = false;
        return;
    }

    const currentItem = alphabetList[currentIndex];

    switch(step) {
        case 0:
            if(currentItem.img) {
                image.src = currentItem.img;

                let imageLoaded = false;
                image.onload = () => {
                    image.style.display = "block";
                    mainText.style.opacity = 0;
                    imageLoaded = true;
                };
                image.onerror = () => {
                    image.style.display = "none";
                    showElement(mainText, currentItem.letter);
                    imageLoaded = false;
                };

                // tiny delay to check if image loaded
                await new Promise(resolve => setTimeout(resolve, 50));
                if (!imageLoaded) showElement(mainText, currentItem.letter);
            } else {
                image.style.display = "none";
                showElement(mainText, currentItem.letter);
            }

            await speak(currentItem.letter);
            step++;
            break;
        case 1:
            await speak(currentItem.subject);
            step++;
            break;
        case 2:
            await speak(currentItem.phrase);
            step++;
            break;
        case 3:
            currentIndex++;
            step = 0;
            break;
    }

    isSpeaking = false;
}

// Event listeners
document.addEventListener('keydown', nextStep);
document.addEventListener('click', nextStep);
document.addEventListener('touchstart', nextStep);
