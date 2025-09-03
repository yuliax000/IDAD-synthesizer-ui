let xOutputText = document.getElementById("xPosOutput");
let yOutputText = document.getElementById("yPosOutput");
let xyControllers = Array.from(document.getElementByClassName("xyControlBox"));
xyControllers.forEach((xyBox) => {
  let xyPosMarker = xyBox.querySelector(".xyPosMarker");
  let svgCTM = xyBox.querySelector(".xySVGEl").getScreenCTM();
  window.addEventListener("resize", () => {
    svgCTM = xyBox.querySelector(".xySVGEl").getScreenCTM();
  });
});

let markerXPos,
  markerYPos = 3;
let dragging = false;

function startxyDrag() {
  document.body.classList.add("drag-active");
  document.addEventListener("mousemove", xyDragging);
  document;
}
