window.addEventListener("load", () => {
  const landingSection = document.getElementById("hero");
  landingSection.classList.add("loaded");
});

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".Project__List");
  const next = document.querySelector(".carousel__next");
  const prev = document.querySelector(".carousel__prev");

  const cardWidth = track.querySelector(".Project__Card").offsetWidth + 32; // card + gap

  next.addEventListener("click", () => {
    track.scrollBy({ left: cardWidth, behavior: "smooth" });
  });

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -cardWidth, behavior: "smooth" });
  });
});
