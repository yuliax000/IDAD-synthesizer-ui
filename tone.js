let audioCtx = new AudioContext();
let xyPosMarker = document.getElementsByClassName("xyPosMarker")[0];

// -----this part use oscillator to generate voice-----

// const oscillator = audioCtx.createOscillator();

let gainNode = audioCtx.createGain();
gainNode.gain.value = 0.5;
console.log(gainNode);

let activeOsillators = [];

const oscType = ["sine", "square", "triangle", "sawtooth"];

xyPad.addEventListener("mousedown", (e) => {
  // console.log("click on", e.target);
  if (isPaused) return;

  // if (dragging) return;
  dragging = true;
  // console.log(dragging);

  xyPosMarker.setAttribute("fill", "#577277");
  voice(e);
  let throttled = false;

  if (!throttled) {
    voice(e);
    throttled = true;
    setTimeout(function () {
      throttled = false;
    }, delay);
  }
  // if (audioCtx.state === "suspended") audioCtx.resume();
});

function voice(e) {
  let osc = audioCtx.createOscillator();
  let filter = audioCtx.createBiquadFilter();

  const x = e.clientX;
  const y = e.clientY;

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
let lastTrigger = 0;
function interval(e) {
  let now = performance.now();
  if (now - lastTrigger > 200) {
    lastTrigger = now;
    voice(e);
    // draggingTone();
  }
}
// adjusting dragging tone

function draggingTone() {
  activeOsillators.forEach(({ oscGain }) => {
    oscGain.gain.cancelScheduledValues(audioCtx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 5);
  });
}
const delay = 300;
let throttled = false;

xyPad.addEventListener("mousemove", (e) => {
  console.log(dragging);
  // if (dragging) {
  //   // updateOsc(e);
  //   interval(e);
  // }
  if (!dragging) return;
  if (!throttled) {
    voice(e);
    throttled = true;
    setTimeout(function () {
      throttled = false;
    }, delay);
  }
});

xyPad.addEventListener("mouseup", () => {
  if (!dragging) return;
  dragging = false;

  xyPosMarker.setAttribute("fill", "#577277");

  activeOsillators.forEach(({ osc, oscGain }) => {
    oscGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 5);
    osc.stop(audioCtx.currentTime + 5);
  });

  // activeOsillators = [];
});

xyPad.addEventListener("mouseleave", () => {
  if (dragging) {
    xyPad.dispatchEvent(new Event("mouseup"));
  }
});

console.log(audioCtx.state);
