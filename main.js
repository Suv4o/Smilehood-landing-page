import "./assets/scss/style.scss";
import { firestore, functions } from "./firebase-init.js";

// Assign elements
const btnSend = document.getElementById("btn-send");
const btnContact = document.getElementById("btn-contact");
const btnSubscribe = document.getElementById("btn-subscribe");
const formSubscribe = document.getElementById("form-subscribe");
const formContact = document.getElementById("form-contact");
const subscribeMsg = document.getElementById("subscribe-msg");
const contactMsg = document.getElementById("contact-msg");
const contactModal = document.getElementById("contact-modal");
const contactModalContent = document.getElementById("contact-modal-content");

// Get the values of each element on initial load. We update these values on window resize
let btnShowMore = document.getElementById("btn-show-more");
let footerHeight = document.getElementById("footer").offsetHeight;
let bgPositionX =
  getWidthSize() <= 1919 && getWidthSize() > 1199
    ? "50%"
    : getWidthSize() <= 1199
    ? "70%"
    : "100%";
let showMoreBtnHeight = document.getElementById("btn-show-more").offsetHeight;
let isMobileScreen = getWidthSize() <= 767;

// GSAP Timelines Initialization. We add animations to the timelines below
let tlShowMore = gsap.timeline();
let tlShowContactModal = gsap.timeline();

// Define window WIDTH and HEIGHT
const windowSize = setWindowSize();

// Watch WIDTH property on value change
windowSize.setWatcherWidth(() => {
  clearAnimation();
  clearAllTimeouts(window);
  updateValues();
});

// Event Listeners
formContact.addEventListener("submit", sandContact);
formSubscribe.addEventListener("submit", subscribe);
btnShowMore.addEventListener("click", showMore);
btnContact.addEventListener("click", showContactModal);
contactModal.addEventListener("click", hideContactModal);
contactModalContent.addEventListener("click", (e) => e.stopPropagation());
window.addEventListener("resize", setWindowResize);

async function showMore() {
  // Check if the timeline is Active. If there is an existing animation, return. Otherwise continue.
  if (tlShowMore.isActive()) return;
  await showMoreAnimation();
  setTimeout(() => {
    tlShowMore.reverse();
  }, 5000);
}

function showMoreAnimation() {
  return new Promise((resolve) => {
    tlShowMore = gsap.timeline({ onComplete: () => resolve() });
    tlShowMore.to("#show-more-arrow", {
      duration: 0.5,
      bottom: 0,
      rotation: 180,
    });
    if (!isMobileScreen) {
      tlShowMore.to(
        "#moto",
        {
          duration: 0.5,
          ease: "power4.out",
          opacity: 0,
        },
        "-=0.5"
      );
    }
    tlShowMore.to("#btn-show-more", {
      duration: 0.3,
      ease: "power4.out",
      bottom: -(showMoreBtnHeight + 10),
    });
    tlShowMore.to("#footer", {
      delay: 0.1,
      duration: 0.3,
      bottom: 0,
      ease: "power4.out",
    });
    if (!isMobileScreen) {
      tlShowMore.to(
        "#bg_img",
        {
          delay: 0.1,
          duration: 0.3,
          backgroundPosition: `${bgPositionX} -${footerHeight}px`,
          ease: "power4.out",
        },
        "-=0.4"
      );
      tlShowMore.to(
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
    getWidthSize() <= 1919 && getWidthSize() > 1199
      ? "50%"
      : getWidthSize() <= 1199
      ? "70%"
      : "100%";
  showMoreBtnHeight = document.getElementById("btn-show-more").offsetHeight;
  isMobileScreen = getWidthSize() <= 767;
}

function clearAnimation() {
  tlShowMore.clear();
  tlShowContactModal.clear();
  gsap.set("#show-more-arrow", { clearProps: "all" });
  gsap.set("#moto", { clearProps: "all" });
  gsap.set("#btn-show-more", { clearProps: "all" });
  gsap.set("#footer", { clearProps: "all" });
  gsap.set("#bg_img", { clearProps: "all" });
  gsap.set("#subscribe-group", { clearProps: "all" });
  gsap.set("#contact-modal", { clearProps: "all" });
  gsap.set("#contact-modal-content", { clearProps: "all" });
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

function showContactModal() {
  showContactModalAnimation();
}

function hideContactModal() {
  hideContactModalAnimation();
}

function showContactModalAnimation() {
  return new Promise((resolve) => {
    tlShowContactModal = gsap.timeline({ onComplete: () => resolve() });
    tlShowContactModal.to("#contact-modal", {
      duration: 0.1,
      display: "flex",
    });
    tlShowContactModal.to("#contact-modal-content", {
      duration: 0.5,
      opacity: 1,
      ease: "power4.out",
    });
  }, "-=0.1");
}

function hideContactModalAnimation() {
  tlShowContactModal.reverse();
}

function clearAllTimeouts(windowObject) {
  var id = Math.max(windowObject.setTimeout(noop, 1000));

  while (id--) {
    windowObject.clearInterval(id);
  }

  function noop() {}
}

async function subscribe(e) {
  e.preventDefault();
  const objFormData = Object.fromEntries(new FormData(e.target));
  subscribeMsg.className = "";
  subscribeMsg.innerHTML = "";
  btnSubscribe.innerHTML = `<div class="loading-animation"><div></div><div></div><div></div><div></div></div>`;
  btnSubscribe.disabled = true;
  const formValidation = await isValidSubscriber(objFormData);

  if (!formValidation) {
    btnSubscribe.innerHTML = `Subscribe`;
    btnSubscribe.disabled = false;
    setTimeout(() => {
      subscribeMsg.className = "";
      subscribeMsg.innerHTML = "";
    }, 10000);
    return;
  } else {
    await sendingEmailToUs({
      from: "Smilehood",
      to: "mysmilehood@gmail.com",
      subject: "New Subscriber!",
      text: `We have new subscriber with email: ${objFormData.email}!`,
    });
    btnSubscribe.innerHTML = `Subscribe`;
    btnSubscribe.disabled = false;
    formSubscribe.reset();
    subscribeMsg.className = "success-msg";
    subscribeMsg.innerHTML = "Thank you for Subscribing.";
    setTimeout(() => {
      subscribeMsg.className = "";
      subscribeMsg.innerHTML = "";
    }, 10000);
  }
}

function sandContact(e) {
  e.preventDefault();
  const objFormData = Object.fromEntries(new FormData(e.target));
  btnSend.innerHTML = `<div class="loading-animation"><div></div><div></div><div></div><div></div></div>`;
  btnSend.disabled = true;

  const formValidation = isValidContact(objFormData);

  if (!formValidation) {
    btnSend.innerHTML = `Send`;
    btnSend.disabled = false;
    setTimeout(() => {
      contactMsg.className = "";
      contactMsg.innerHTML = "";
    }, 10000);
    return;
  } else {
    btnSend.innerHTML = `Send`;
    btnSend.disabled = false;
    formContact.reset();
    contactMsg.className = "success-msg";
    contactMsg.innerHTML = "Thank you for getting in touch!";
    setTimeout(() => {
      contactMsg.className = "";
      contactMsg.innerHTML = "";
    }, 10000);
  }
}

async function isValidSubscriber(objFormData) {
  const { email } = objFormData;

  const emailValidation = await isTheEmailValidSubscription(email);

  if (!emailValidation.isValid) {
    subscribeMsg.className = "error-msg";
    subscribeMsg.innerHTML = emailValidation.msg;
    return false;
  }
  const isSuccessful = await subscribeFirebase(email);
  if (!isSuccessful) {
    subscribeMsg.className = "error-msg";
    subscribeMsg.innerHTML = "Something went wrong.";
    return false;
  }
  return true;
}

function isValidContact(objFormData) {
  const { name, email, message } = objFormData;
  const emailValidation = isTheEmailValidContact(email);
  const nameValidation = isNameValid(name);
  const messageValidation = isMessageValid(message);
  const arrErrors = [];

  if (!nameValidation.isValid) {
    arrErrors.push(nameValidation.msg);
  }

  if (!emailValidation.isValid) {
    arrErrors.push(emailValidation.msg);
  }

  if (!messageValidation.isValid) {
    arrErrors.push(messageValidation.msg);
  }

  if (
    !emailValidation.isValid ||
    !nameValidation.isValid ||
    !messageValidation.isValid
  ) {
    contactMsg.className = "error-msg";
    let innerHTML = "";
    arrErrors.forEach((message) => {
      innerHTML += message + "<br>";
    });
    contactMsg.innerHTML = innerHTML;
    return false;
  }
  return true;
}

async function isTheEmailValidSubscription(email) {
  if (!isEmailValid(email)) {
    return {
      isValid: false,
      msg: "Please enter a valid Email Address.",
    };
  }

  const isSubscribed = await isEmailDuplicate(email);

  if (isSubscribed) {
    return {
      isValid: false,
      msg: "You're Already Subscribed.",
    };
  }

  return {
    isValid: true,
  };
}

function isTheEmailValidContact(email) {
  if (!isEmailValid(email)) {
    return {
      isValid: false,
      msg: "Please enter a valid Email Address.",
    };
  }
  return {
    isValid: true,
  };
}

function isEmailDuplicate(field) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await firestore
        .collection("subscribers")
        .where("email", "==", field.toLowerCase())
        .get();

      if (!result.empty) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(false);
      console.log("Error getting documents: ", error);
    }
  });
}

function isNameValid(name) {
  if (!isRequiredFieldValid(name)) {
    return {
      isValid: false,
      msg: "The name is required!",
    };
  }

  if (!isMaxNumberValid(name, 20)) {
    return {
      isValid: false,
      msg: "The name needs to be less than 20 characters!",
    };
  }

  if (!isAlphaCharacterValid(name)) {
    return {
      isValid: false,
      msg: "Only Alpha characters are allowed!",
    };
  }
  return {
    isValid: true,
  };
}

function isMessageValid(message) {
  if (!isRequiredFieldValid(message)) {
    return {
      isValid: false,
      msg: "The message is required!",
    };
  }

  if (!isMaxNumberValid(message, 200)) {
    return {
      isValid: false,
      msg: "The message needs to be less than 200 characters!",
    };
  }
  return {
    isValid: true,
  };
}

function isEmailValid(field) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field)) return false;
  return true;
}

function isRequiredFieldValid(field) {
  if (!field) return false;
  return true;
}

function isMaxNumberValid(field, limit) {
  if (!(field.length <= limit)) return false;
  return true;
}

function isAlphaCharacterValid(field) {
  if (!/^[a-zA-Z]*$/.test(field)) return false;
  return true;
}

async function subscribeFirebase(email) {
  return new Promise(async (resolve, reject) => {
    try {
      await firestore.collection("subscribers").add({
        email: email.toLowerCase(),
      });
      resolve(true);
    } catch (error) {
      reject(false);
      console.error("Error adding document in the database: ", error);
    }
  });
}

function sendingEmailToUs(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const sendEmailToUs = functions.httpsCallable("sendEmailToUs");
      await sendEmailToUs(data);
      resolve(true);
    } catch (error) {
      console.log(error);
      reject(false);
    }
  });
}
