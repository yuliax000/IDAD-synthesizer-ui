/* this is where you'd change out what the keyboard is controlling */
/* as its imported AFTER script.js where sampler is defined I can assign it here */
let keyboardSynth = sampler;
//let keyboardSynth = sampler;

/* find keys by their class and add to array */
let allKeys = Array.from(document.getElementsByClassName("whiteKey")).concat(
  Array.from(document.getElementsByClassName("blackKey"))
);

/* set default octace : we will update based on keys later on */
let octave = 3;

let mouseHeld = false;

window.addEventListener("mousedown", () => {
  mouseHeld = true;
});
window.addEventListener("mouseup", () => {
  mouseHeld = false;
});

/* add an event listener to each key */
allKeys.forEach((key) => {
  key.addEventListener("mousedown", (e) => {
    let note = e.target.dataset.note;
    sampler.triggerAttack(note + octave);
    key.style.backgroundColor = "red";
  });
  key.addEventListener("mouseup", (e) => {
    let note = e.target.dataset.note;
    sampler.triggerRelease(note + octave);
  });
  key.addEventListener("mouseenter", (e) => {
    if (mouseHeld === false) {
      return;
    }
    let note = e.target.dataset.note;
    sampler.triggerAttackRelease(note + octave);
  });
  key.addEventListener("mouseleave", (e) => {
    let note = e.target.dataset.note;
    sampler.triggerRelease(note + octave);
  });
});

let keyHeld = false;

// event listener for keyboard(qwertyu)//
// window.addEventListener("keydown", (e) => {
//   if (e.code === "keyA") {
//     if (keyHeld === false) {
//       sampler.triggerAttack("c3");
//       keyHeld = true;
//     }
//   }
// });
// window.addEventListener("keyup", (e) => {
//   if (e.code === "keyA") {
//     sampler.triggerRelease("c3");
//     keyHeld = false;
//   }
// });
window.addEventListener("keydown", (e) => {
  if (keyCodeToNote[e.code]) {
    if (keyHeld === false) {
      sampler.triggerAttack(keyCodeToNote[e.code]);
      keyHeld = true;
    }
  }
});
window.addEventListener("keyup", (e) => {
  if (keyCodeToNote[e.code]) {
    sampler.triggerRelease(keyCodeToNote[e.code]);
    keyHeld = false;
  }
});
