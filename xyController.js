let xOutputText = document.getElementById("xPosOutput");
let yOutputText = document.getElementById("yPosOutput");
let xyControllers = Array.from(document.getElementsByClassName("xyControlBox"));
xyControllers.forEach((xyBox) => {
  let xyPosMarker = xyBox.querySelector(".xyPosMarker");
  // let svgCTM = xyBox.querySelector(".xySVGEl").getScreenCTM();
  // window.addEventListener("resize", () => {
  //   svgCTM = xyBox.querySelector(".xySVGEl").getScreenCTM();
  // });

  function updateViewBox(svgAdjust) {
    svgAdjust.setAttribute(
      "viewBox",
      `0 0 ${window.innerWidth} ${window.innerHeight}`
    );
  }
  let xySVG = document.querySelector(".xySVGEl");
  updateViewBox(xySVG);

  window.addEventListener("resize", () => {
    updateViewBox(xySVG);
  });
});
function newXValue(value) {
  // xOutputText.textContent = value;
}
function newYValue(value) {
  // yOutputText.textContent = value;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
