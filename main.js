import "./assets/scss/style.scss";

let btnShowMore = document.getElementById("btn-show-more");
let footerHeight = document.getElementById("footer").offsetHeight;
let bgPositionX =
  getWidthSize() <= 1919 && getWidthSize() > 1469
    ? "50%"
    : getWidthSize() <= 1469
    ? "70%"
    : "100%";
let showMoreBtnHeight = document.getElementById("btn-show-more").offsetHeight;
let isMobileScreen = getWidthSize() <= 767;
const windowSize = setWindowSize();

// GSAP Initialization. We add animations to the timeline below
let tl = gsap.timeline();

// Watch WIDTH property on value change
windowSize.setWatcherWidth(() => {
  clearAnimation();
  updateValues();
});

// Event Listeners
btnShowMore.addEventListener("click", showMore);
window.addEventListener("resize", setWindowResize);

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
    if (!isMobileScreen) {
      tl.to(
        "#moto",
        {
          duration: 0.5,
          ease: "power4.out",
          opacity: 0,
        },
        "-=0.5"
      );
    }
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
    if (!isMobileScreen) {
      tl.to(
        "#bg_img",
        {
          delay: 0.1,
          duration: 0.3,
          backgroundPosition: `${bgPositionX} -${footerHeight}px`,
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
    }
  });
}

function setWindowResize() {
  windowSize.width = getWidthSize();
  windowSize.height = getHeightSize();
}

function getWidthSize() {
  return document.documentElement.clientWidth;
}

function getHeightSize() {
  return document.documentElement.clientHeight;
}

function updateValues() {
  btnShowMore = document.getElementById("btn-show-more");
  footerHeight = document.getElementById("footer").offsetHeight;
  bgPositionX =
    getWidthSize() <= 1919 && getWidthSize() > 1469
      ? "50%"
      : getWidthSize() <= 1469
      ? "70%"
      : "100%";
  showMoreBtnHeight = document.getElementById("btn-show-more").offsetHeight;
  isMobileScreen = getWidthSize() <= 767;
}

function clearAnimation() {
  tl.clear();
  gsap.set("#show-more-arrow", { clearProps: "all" });
  gsap.set("#moto", { clearProps: "all" });
  gsap.set("#btn-show-more", { clearProps: "all" });
  gsap.set("#footer", { clearProps: "all" });
  gsap.set("#bg_img", { clearProps: "all" });
  gsap.set("#subscribe-group", { clearProps: "all" });
}

function setWindowSize() {
  return {
    widthInternal: getWidthSize(),
    heightInternal: getHeightSize(),
    widthWatcher: function (val) {},
    heightWatcher: function (val) {},
    set width(val) {
      this.widthInternal = val;
      this.widthWatcher(val);
    },
    set height(val) {
      this.heightInternal = val;
      this.heightWatcher(val);
    },
    get width() {
      return this.widthInternal;
    },
    get height() {
      return this.heightInternal;
    },
    setWatcherWidth: function (watcher) {
      this.widthWatcher = watcher;
    },
    setWatcherHeight: function (watcher) {
      this.heightWatcher = watcher;
    },
  };
}
