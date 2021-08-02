import "./assets/scss/style.scss";

const btnShowMore = document.getElementById("btn-show-more");
const footerHeight = document.getElementById("footer").offsetHeight;
const showMoreBtnHeight = document.getElementById("btn-show-more").offsetHeight;
const windowSize = {
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
};

// Event Listeners
btnShowMore.addEventListener("click", showMore);
window.addEventListener("resize", resizeWindow);

// GSAP Initialization. We add animations to the timeline below
let tl = gsap.timeline();

async function showMore() {
  // Check if the timeline is Active. If there is an existing animation, return. Otherwise continue.
  if (tl.isActive()) return;
  await showMoreAnimation();
  setTimeout(() => {
    tl.reverse();
  }, 5000);
}

function showMoreAnimation() {
  return new Promise((resolve) => {
    tl = gsap.timeline({ onComplete: () => resolve() });
    tl.to("#show-more-arrow", { duration: 0.5, bottom: 0, rotation: 180 });
    tl.to(
      "#moto",
      {
        duration: 0.5,
        ease: "power4.out",
        opacity: 0,
      },
      "-=0.5"
    );
    tl.to("#btn-show-more", {
      duration: 0.3,
      ease: "power4.out",
      bottom: -(showMoreBtnHeight + 10),
    });
    tl.to("#footer", {
      delay: 0.1,
      duration: 0.3,
      bottom: 0,
      ease: "power4.out",
    });
    tl.to(
      "#bg_img",
      {
        delay: 0.1,
        duration: 0.3,
        backgroundPosition: `100% -${footerHeight}px`,
        ease: "power4.out",
      },
      "-=0.4"
    );
    tl.to(
      "#subscribe-group",
      {
        delay: 0.1,
        duration: 0.3,
        ease: "power4.out",
        y: -250,
      },
      "-=0.4"
    );
  });
}

function resizeWindow() {
  windowSize.width = document.documentElement.clientWidth;
  windowSize.height = document.documentElement.clientHeight;
  console.log(windowSize);
}
