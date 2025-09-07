const audioCtx = new AudioContext();

// -----this part use oscillator to generate voice-----

// const oscillator = audioCtx.createOscillator();

const gainNode = audioCtx.createGain();
gainNode.gain.value = 0.5;

console.log(gainNode);

// oscillator.connect(gainNode).connect(audioCtx.destination);
// console.log(audioCtx);

xyPad.addEventListener("click", async (e) => {
  console.log("click on", e.target);
  //   if (audioCtx.state === "suspended") {
  //     await audioCtx.resume();
  //   }
  const osc = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();

  const x = e.clientX;
  const y = e.clientY;

  osc.frequency.value = 200 + (x / window.innerWidth) * 800;
  console.log("frequecyNow", osc.frequency.value);

  const oscType = ["sine", "square", "triangle", "sawtooth"];
  function oscTypeSelect() {
    let randomNumber = Math.random();
    let randomSelector = Math.floor(oscType.length * randomNumber);
    osc.type = oscType[randomSelector];
    console.log("oscType", osc.type);
  }
  oscTypeSelect();

  filter.frequency.value = 200 + (y / window.innerHeight) * 2000;
  console.log("filterFrequencyNow", filter.frequency.value);
  filter.Q.value = (y / window.innerHeight) * 5;
  console.log("filterQ", filter.Q.value);
  filter.type = "lowpass";
  //   const filterTypes = ["lowpass", "highpass", "bandpass", "peaking"];
  //   function randomFilterTypeSelect() {
  //     let randomNumber = Math.random();
  //     let randomSelector = Math.floor(filterTypes.length * randomNumber);
  //     filter.type = filterTypes[randomSelector];

  //   console.log("filterType", filter.type);
  //   }
  //   randomFilterTypeSelect();

  osc.connect(filter).connect(gainNode).connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 1);
  console.log("new osc", osc);
  console.log(audioCtx.state);
});

//----trying to use existing mp3 file (if time enough)------
