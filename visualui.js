const svg = document.querySelector(".xySVGEl");

svg.addEventListener("click", (e) => {
  const x = e.clientX;
  const y = e.clientY;

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
  }

  // delete after animation finished

  circle.addEventListener("animationend", () => {
    circle.remove();
  });
});
