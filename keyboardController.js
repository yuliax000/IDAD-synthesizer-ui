/* this is where you'd change out what the keyboard is controlling */
/* as its imported AFTER script.js where polySynth is defined I can assign it here */

let keyboardSynth = polySynth;

/* get all the keys */

let allKeys = Array.from(document.getElementsByClassName("whiteKey")).concat(Array.from(document.getElementsByClassName("blackKey")));

let octave = 3;

allKeys.forEach(key => {
    key.addEventListener("mousedown", e => {
        let note = e.target.dataset.note;
        keyboardSynth.triggerAttackRelease(note+octave);
    });
});