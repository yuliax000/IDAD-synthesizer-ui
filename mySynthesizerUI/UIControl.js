const xyPad = document.getElementById("xyPad");

xyPad.addEventListener("click", (e) => {
  const x = e.clientX;
  const y = e.clientY;
});

const volumeSlider = document.getElementById("volumeSlider");
volumeSlider.addEventListener("input", (e) => {
  gainNode.gain.value = e.target.value / 100;
  console.log("volumeNow", gainNode.gain.value);
});
