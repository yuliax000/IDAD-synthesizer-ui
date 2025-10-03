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

  let markerXPos = 500,
    markerYPos = 500;
  let dragging = false;
  let framelock = false;

  function startxyDrag(e) {
    dragging = true;
    document.body.classList.add("drag-active");
    document.addEventListener("mousemove", xyDragging);
    document.addEventListener("mouseup", endXYDrag);
    xyDragging(e);
  }
  function xyDragging(e) {
    // adding framelock to prevent too much mousemove;
    if (!dragging) return;
    if (framelock) return;
    framelock = true;

    const x = e.clientX;
    const y = e.clientY;

    window.requestAnimationFrame(() => {
      markerXPos = clamp(x, 0, window.innerWidth);
      markerYPos = clamp(y, 0, window.innerHeight);
      xyPosMarker.setAttribute("cx", markerXPos);
      xyPosMarker.setAttribute("cy", markerYPos);

      newXValue(markerXPos);
      newYValue(markerYPos);
      framelock = false;
      // dragging = false;
      // });
      // dragging = true;
    });
  }

  function endXYDrag() {
    dragging = false;
    document.body.classList.remove("drag-active");
    document.removeEventListener("mousemove", xyDragging);
    document.removeEventListener("mouseup", endXYDrag);
  }

  xyBox.addEventListener("mousedown", startxyDrag);
  // xyBox.addEventListener("mousedown", xyDragging);
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
