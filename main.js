import Lenis from "lenis";
import "./style.css";

// Initialize Lenis
const lenis = new Lenis({
  lerp: 0.01,
  wheelMultiplier: 1,
});

// Listen for the scroll event and log the event data
lenis.on("scroll", (e) => {
  console.log(e);
});

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
