let xOutputText = document.getElementById("xPosOutput");
let yOutputText = document.getElementById("yPosOutput");
let xyControllers = Array.from(document.getElementsByClassName("xyControlBox"));
xyControllers.forEach((xyBox) => {
  let xyPosMarker = xyBox.querySelector(".xyPosMarker");
  let svgCTM = xyBox.querySelector(".xySVGEl").getScreenCTM();
  window.addEventListener("resize", () => {
    svgCTM = xyBox.querySelector(".xySVGEl").getScreenCTM();
  });

  let markerXPos = 3,
    markerYPos = 3;
  let dragging = false;

  function startxyDrag() {
    document.body.classList.add("drag-active");
    document.addEventListener("mousemove", xyDragging);
    document.addEventListener("mouseup", endXYDrag);
  }
  function xyDragging(e) {
    if (!dragging) {
      window.requestAnimationFrame(() => {
        markerXPos = clamp((e.clientX - svgCTM.e) / svgCTM.a, 0, 1000);
        markerYPos = clamp((e.clientY - svgCTM.f) / svgCTM.d, 0, 1000);
        xyPosMarker.setAttribute("cx", markerXPos);
        xyPosMarker.setAttribute("cy", markerYPos);

        newXValue(markerXPos);
        newYValue(markerYPos);
        dragging = false;
      });
      dragging = true;
    }
  }

  function endXYDrag() {
    document.body.classList.remove("drag-active");
    document.removeEventListener("mousemove", xyDragging);
    document.removeEventListener("mouseup", endXYDrag);
  }

  xyBox.addEventListener("mousedown", startxyDrag);
  xyBox.addEventListener("mousedown", xyDragging);
});
// function newXValue(value) {
//   xOutputText.textContent = value;
// }
// function newYValue(value) {
//   yOutputText.textContent = value;
// }

function clamp(value, min, max) {
  return Math.min(Math.max(value.min), max);
}
