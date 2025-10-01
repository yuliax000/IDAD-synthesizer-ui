const xyPad = document.getElementById("xyPad");

let dragging = false;

const volumeSlider = document.getElementById("volumeSlider");
volumeSlider.addEventListener("input", (e) => {
  gainNode.gain.setValueAtTime(e.target.value, audioCtx.currentTime);
  console.log("volumeNow", gainNode.gain.value);
});

// introModal
let introModal = document.getElementById("infoDialog");
document.getElementById("infoDialog").showModal();
document.getElementById("infoDialogClose").addEventListener("click", () => {
  introModal.close();
});

// apply pause button and reset button
const pauseBtn = document.getElementById("pauseBtn");
pauseBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (audioCtx.state === "running") {
    audioCtx.suspend();
    pauseIcon.src = "./assets/icons8-play-60.png";
    Animation.pause();
    console.log("paused");
  } else if (audioCtx.state === "suspended") {
    audioCtx.resume();
    pauseIcon.src = "./assets/icons8-pause-60.png";
    console.log("Resumed");
  }
});

let resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  // close old one
  if (audioCtx && audioCtx.state !== "closed") {
    audioCtx.close();
  }
  // new one
  audioCtx = new window.AudioContext();
  gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.5;
  gainNode.connect(audioCtx.destination);
  volumeSlider.value = 0.5;

  console.log("audio reset", audioCtx.state);
});
