const svg = document.querySelector(".xySVGEl");

let isDrawing = false;
let rippleInterval;

svg.addEventListener("mousedown", (e) => {
  isDrawing = true;

  const x = e.clientX;
  const y = e.clientY;
  generateRipple(x, y);
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

    svg.appendChild(circle);

    circle.addEventListener("animationend", () => {
      circle.remove();
    });
  }

  // delete after animation finished
}

function resetAnimation() {}
