function scrambleText(element) {
    const originalText = element.textContent.trim();
    let scrambledText = '';
    let iteration = 0;
    const scrambleInterval = 12; // Geschwindigkeit der Scramble-Animation in Millisekunden

    function scramble() {
        scrambledText = '';
        for (let i = 0; i < originalText.length; i++) {
            if (i < iteration) {
                scrambledText += originalText[i];
            } else {
                scrambledText += String.fromCharCode(33 + Math.random() * 94);
            }
        }
        element.textContent = scrambledText;

        iteration++;
        if (iteration <= originalText.length) {
            setTimeout(scramble, scrambleInterval);
        }
    }

    scramble();
}

function applyScrambleEffect() {
    const elements = document.querySelectorAll('body *');  // Alle Elemente auf der Seite durchgehen

    elements.forEach(element => {
        if (element.children.length === 0 && element.textContent.trim().length > 0) {
            scrambleText(element);
        }
    });
}

applyScrambleEffect();