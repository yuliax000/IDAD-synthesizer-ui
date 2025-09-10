let audioCtx = new AudioContext();

// -----this part use oscillator to generate voice-----

// const oscillator = audioCtx.createOscillator();

let gainNode = audioCtx.createGain();
gainNode.gain.value = 0.5;
console.log(gainNode);

let activeOsillators = [];

const oscType = ["sine", "square", "triangle", "sawtooth"];
// oscillator.connect(gainNode).connect(audioCtx.destination);
// console.log(audioCtx);

xyPad.addEventListener("mousedown", (e) => {
  console.log("click on", e.target);
  //
  //   }
  if (dragging) return;
  dragging = true;

  // if (audioCtx.state === "suspended") audioCtx.resume();

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

  osc
    .connect(filter)
    .connect(oscGain)
    .connect(gainNode)
    .connect(audioCtx.destination);

  osc.start();

  activeOsillators.push({ osc, filter, oscGain });

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
});

xyPad.addEventListener("mouseup", () => {
  if (!dragging) return;
  dragging = false;

  activeOsillators.forEach(({ osc, oscGain }) => {
    oscGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 5);
    osc.stop(audioCtx.currentTime + 5);
  });

  activeOsillators = [];
});
xyPad.addEventListener("mouseleave", () => {
  if (dragging) {
    xyPad.dispatchEvent(new Event("mouseup"));
  }
});

console.log("new osc", osc);
console.log(audioCtx.state);
