let audioCtx = new AudioContext();
let xyPosMarker = document.getElementsByClassName("xyPosMarker")[0];
let lastTrigger = 0;

// -----this part use oscillator to generate voice-----

// const oscillator = audioCtx.createOscillator();

let gainNode = audioCtx.createGain();
gainNode.gain.value = 0.5;
console.log(gainNode);

let activeOsillators = [];

const oscType = ["sine", "square", "triangle", "sawtooth"];

// I combine two mousedown logic (xycontroller and tone controller) together to avoid conflict
let framelock = false;

let markerXPos = 500,
  markerYPos = 500;
let dragging = false;

xyPad.addEventListener("mousedown", (e) => {
  // console.log("click on", e.target);
  if (isPaused) return;
  console.log(isPaused);

  if (dragging) return;
  dragging = true;
  lastTrigger = 0;
  // console.log(dragging);
  document.body.classList.add("drag-active");
  // xyDragging(e);

  xyPosMarker.setAttribute("fill", "#577277");
  voice(e);
  // interval(e);
  xyDragging(e);
  // let throttled = false;

  // if (!throttled) {
  //   voice(e);
  //   throttled = true;
  //   setTimeout(function () {
  //     throttled = false;
  //   }, delay);
  // }
  if (audioCtx.state === "suspended") audioCtx.resume();
});

function voice(e) {
  let osc = audioCtx.createOscillator();
  let filter = audioCtx.createBiquadFilter();

  const x = e.clientX;
  const y = e.clientY;
  const maxOsc = 12;
  if (activeOsillators.length >= maxOsc) return;

  function oscTypeSelect() {
    let randomNumber = Math.random();
    let randomSelector = Math.floor(oscType.length * randomNumber);
    osc.type = oscType[randomSelector];
    console.log("oscType", osc.type);
  }
  oscTypeSelect();
  osc.frequency.setValueAtTime(
    200 + (x / window.innerWidth) * 800,
    audioCtx.currentTime
  );
  // console.log("frequecyNow", osc.frequency.setValueAtTime);

  filter.frequency.setValueAtTime(
    200 + (y / window.innerHeight) * 2000,
    audioCtx.currentTime
  );
  // console.log("filterFrequencyNow", filter.frequency.value);
  filter.Q.setValueAtTime((y / window.innerHeight) * 5, audioCtx.currentTime);
  // console.log("filterQ", filter.Q.value);
  filter.type = "lowpass";
  //   const filterTypes = ["lowpass", "highpass", "bandpass", "peaking"];
  //   function randomFilterTypeSelect() {
  //     let randomNumber = Math.random();
  //     let randomSelector = Math.floor(filterTypes.length * randomNumber);
  //     filter.type = filterTypes[randomSelector];

  //   console.log("filterType", filter.type);
  //   }
  //   randomFilterTypeSelect();
  let oscGain = audioCtx.createGain();
  oscGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
  oscGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 5);

  osc
    .connect(filter)
    .connect(oscGain)
    .connect(gainNode)
    .connect(audioCtx.destination);

  osc.start();

  activeOsillators.push({ osc, filter, oscGain });

  setTimeout(() => {
    activeOsillators = activeOsillators.filter((o) => o.osc !== osc);
  }, 1000);

  activeOsillators.forEach(({ osc, filter }) => {
    osc.frequency.setValueAtTime(
      200 + (x / window.innerWidth) * 800,
      audioCtx.currentTime
    );

    filter.frequency.setValueAtTime(
      200 + (y / window.innerHeight) * 2000,
      audioCtx.currentTime
    );

    filter.Q.setValueAtTime((y / window.innerHeight) * 5, audioCtx.currentTime);
  });

  setTimeout(() => {
    activeOsillators = activeOsillators.filter((o) => o.osc !== osc);
  }, 1000);

  // osc.stop(audioCtx.currentTime + 1);
  console.log("new osc", osc);
}

// ---dragging change frequency and filter---
function updateOsc(e) {
  const x = e.clientX;
  const y = e.clientY;

  activeOsillators.forEach(({ osc, filter }) => {
    osc.frequency.setValueAtTime(
      200 + (x / window.innerWidth) * 800,
      audioCtx.currentTime
    );

    filter.frequency.setValueAtTime(
      200 + (y / window.innerHeight) * 2000,
      audioCtx.currentTime
    );

    filter.Q.setValueAtTime((y / window.innerHeight) * 5, audioCtx.currentTime);
  });
}

// adding interval to dragging voice
// let lastTrigger = 0;
// function interval(e) {
// let now = performance.now();
// if (now - lastTrigger > 200) {
//   lastTrigger = now;
//   voice(e);
//   // draggingTone();
// }
// }
// adjusting dragging tone

function draggingTone() {
  activeOsillators.forEach(({ oscGain }) => {
    oscGain.gain.cancelScheduledValues(audioCtx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 5);
  });
  // osc.stop(audioCtx.currentTime + 5);
}
const delay = 300;
// let throttled = false;

document.addEventListener("mousemove", (e) => {
  if (audioCtx.state === "suspended") audioCtx.resume();
  console.log("mousemove", dragging);
  // if (dragging) {
  //   // updateOsc(e);
  if (!dragging) return;

  xyDragging(e);

  let now = performance.now();
  if (now - lastTrigger > 200) {
    lastTrigger = now;
    console.log("voice triggered");
    voice(e);

    // draggingTone();
  }
  // console.log("mousemove", dragging);

  // }

  // if (!throttled) {
  //   voice(e);
  //   throttled = true;
  //   setTimeout(function () {
  //     throttled = false;
  //   }, delay);
  // }
  console.log(audioCtx.state, isPaused);
});

document.addEventListener("mouseup", () => {
  if (!dragging) return;
  dragging = false;

  document.body.classList.remove("drag-active");

  xyPosMarker.setAttribute("fill", "#577277");

  // activeOsillators.forEach(({ osc, oscGain }) => {
  //   oscGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 5);
  //   osc.stop(audioCtx.currentTime + 5);
  // });
  draggingTone();
  // activeOsillators = [];
});

xyPad.addEventListener("mouseleave", () => {
  if (dragging) {
    xyPad.dispatchEvent(new Event("mouseup"));
  }
});

console.log(audioCtx.state);

function xyDragging(e) {
  // adding framelock to prevent too much mousemove;
  // if (dragging) return;
  if (framelock) return;
  framelock = true;

  const x = e.clientX;
  const y = e.clientY;

  window.requestAnimationFrame(() => {
    markerXPos = clamp(x, 0, window.innerWidth);
    markerYPos = clamp(y, 0, window.innerHeight);
    xyPosMarker.setAttribute("cx", markerXPos);
    xyPosMarker.setAttribute("cy", markerYPos);

    newXValue(markerXPos);
    newYValue(markerYPos);
    framelock = false;
  });
}
