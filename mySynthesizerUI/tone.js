const audioCtx = new AudioContext();
const oscillator = audioCtx.createOscillator();

const gainNode = audioCtx.createGain();
gainNode.gain.value = 50;

console.log(gainNode);

oscillator.connect(gainNode).connect(audioCtx.destination);
// console.log(audioCtx);
// console.log(oscillator);

xyPad.addEventListener("click", (e) => {
  const osc = audioCtx.createOscillator();
  osc.type = "square";
  osc.connect(gainNode).connect(audioCtx.destination);
  osc.start();
});
