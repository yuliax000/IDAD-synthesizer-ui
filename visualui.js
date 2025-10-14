const svg = document.querySelector(".xySVGEl");

let isDrawing = false;
let rippleInterval;
const rippleDelay = 100;
let rippleThrottled = false;
let isPaused = false;

xyPad.addEventListener("pointerdown", (e) => {
  if (isPaused) return;
  isDrawing = true;

  // if (!rippleThrottled) {
  const rect = xyPad.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  generateRipple(x, y);

  //   rippleThrottled = true;
  //   setTimeout(function () {
  //     rippleThrottled = false;
  //   }, rippleDelay);
  // }
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

    // adding random color setting
    // but I don't like the effets it create, which makes the ripple look not that clean

    // const colors = [
    //   "#FFDFD6",
    //   "#FFFFFF",
    //   "#FFFABA",
    //   "#D6FFBA",
    //   "#FFFFFF",
    //   "#FFFFFF",
    //   "#FFFFFF",
    // ];
    // circle.setAttribute(
    //   "stroke",
    //   colors[Math.floor(Math.random() * colors.length)]
    // );

    // delete after animation finished
    circle.addEventListener("animationend", () => {
      if (!circle.classList.contains("paused")) {
        circle.remove();
      }
    });
  }
}

xyPad.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  if (!rippleThrottled) {
    const rect = xyPad.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    generateRipple(x, y);

    rippleThrottled = true;
    setTimeout(function () {
      rippleThrottled = false;
    }, rippleDelay);
  }
});

function clearRipples() {
  svg.querySelectorAll(".ripple-circle").forEach(function (circle) {
    circle.remove();
  });
}
