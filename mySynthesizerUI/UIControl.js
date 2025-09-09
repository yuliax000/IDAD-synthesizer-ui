const xyPad = document.getElementById("xyPad");

const volumeSlider = document.getElementById("volumeSlider");
volumeSlider.addEventListener("input", (e) => {
  gainNode.gain.value = e.target.value;
  console.log("volumeNow", gainNode.gain.value);
});

// apply pause button and reset button
const pauseBtn = document.getElementById("pauseBtn");
pauseBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (audioCtx.state === "running") {
    audioCtx.suspend();
    console.log("paused");
  } else if (audioCtx.state === "suspended") {
    audioCtx.resume();
    console.log("Resumed");
  }
});
