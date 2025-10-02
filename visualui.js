const svg = document.querySelector(".xySVGEl");

let isDrawing = false;
let rippleInterval;
const rippleDelay = 100;
let rippleThrottled = false;
let isPaused = false;

svg.addEventListener("mousedown", (e) => {
  if (isPaused) return;
  isDrawing = true;

  if (!rippleThrottled) {
    const x = e.clientX;
    const y = e.clientY;
    generateRipple(x, y);

    rippleThrottled = true;
    setTimeout(function () {
      rippleThrottled = false;
    }, rippleDelay);
  }
});

function generateRipple(x, y) {
  // create circle
  for (let i = 0; i < 3; i = i + 1) {
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 0);
    circle.classList.add("ripple-circle");

    circle.style.animationDelay = `${i * 0.3}s`;

    // using classlist to control if the circle is paused or not
    if (isPaused) {
      circle.classList.add("paused");
    }

    svg.appendChild(circle);

    // delete after animation finished
    circle.addEventListener("animationend", () => {
      if (!circle.classList.contains("paused")) {
        circle.remove();
      }
    });
  }
}

function resetAnimation() {}
