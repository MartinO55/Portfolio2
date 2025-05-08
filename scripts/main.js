window.addEventListener("load", () => {
  const landingSection = document.getElementById("hero");
  landingSection.classList.add("loaded");
});

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".Project__List");
  const next = document.querySelector(".carousel__next");
  const prev = document.querySelector(".carousel__prev");

  const aboutSection = document.getElementById("aboutMe__Hider");
  const aboutTrigger = document.getElementById("aboutMe__circle");
  const portfolioSection = document.getElementById("Portfolio__Hider");
  const portfolioTrigger = document.getElementById("Projects__circle");

  const LineToAbout = document.getElementById("aboutMe__blurb__lineTo");
  const LineToSkills = document.getElementById(
    "aboutMe__SkillsGallery__LineTo"
  );
  const lineToProjects = document.getElementById("Projects__Heading__lineTo");

  //okay, so we should probably refactor this to make it reuseable
  function revealAboutSection() {
    aboutSection.classList.remove("section__hidden");
    aboutSection.classList.add("section__visible");

    LineToAbout.style.animation = "none";
    LineToSkills.style.animation = "none";

    void LineToAbout.offsetWidth;
    void LineToSkills.offsetWidth;

    LineToAbout.style.animation = "growLineToAboutMe 0.5s ease-out forwards";
    LineToSkills.style.animation =
      "growLineToSkillsGallery 0.5s ease-out forwards";
  }

  function revealPortfolioSection() {
    portfolioSection.classList.remove("section__hidden");
    portfolioSection.classList.add("section__visible");

    lineToProjects.style.animation = "none";
    void lineToProjects.offsetWidth;

    lineToProjects.style.animation =
      "growLineToProjectsHeading 0.5s ease-out forwards";
  }

  window.addEventListener("scroll", () => {
    const revealPoint = aboutSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (revealPoint < windowHeight - 100) {
      revealAboutSection();
    }
    if (revealPoint < windowHeight - 200) {
      revealPortfolioSection();
    }
  });

  aboutTrigger?.addEventListener("click", () => {
    aboutSection.scrollIntoView({ behavior: "smooth" });
    revealAboutSection();
  });

  portfolioTrigger?.addEventListener("click", () => {
    portfolioSection.scrollIntoView({ behavior: "smooth" });
    revealPortfolioSection();
  });

  const cardWidth = track.querySelector(".Project__Card").offsetWidth + 32; // card + gap

  next.addEventListener("click", () => {
    track.scrollBy({ left: cardWidth, behavior: "smooth" });
  });

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -cardWidth, behavior: "smooth" });
  });
});
