<h1 align="center">Smilehood Landing Page</h1>
<p align="center">
Website: <a href="https://smilehood-landing-page.netlify.app/">https://smilehood.org/</a>
</p>

<p align="center">
<img src="https://res.cloudinary.com/suv4o/image/upload/c_scale,q_10,w_600/v1628508423/github/smilehood-landing-page_bz5b8d.gif"/>
</p>

<p align="center">
This is the landing page of Smilehood. The main product is still in the early stages of development. <br><br>
This website was custom-built with HTML, CSS and Vanilla JS. By considering the latest technology, <a href="https://vitejs.dev/">Vite.js</a> was the chosen build tool that bundled our code to highly optimised static assets for production. The interactivity of the website is enhanced through animations — one of the latest trends that is prominent in current-day websites. The animations were built with the help of <a href="https://greensock.com/gsap/">GSAP</a> (GreenSock Animation Platform), the most robust JavaScript animation library of current times. The media content is hosted and managed by <a href="https://cloudinary.com/">Cloudinary</a>. This allows for images to be delivered in the correct format and size on every browser. Feel free to jump on the link above to engage with the website.
</p>

<h2 align="center">Main project overview</h2>

<p align="center">
Smilehood Platform is seed funded product and we have secured a long-term investor. We are currently at the MVP stage of the product. <br>
Smilehoods harnesses the power of social media technology to empower people to come together around a cause. We aim to change the face of fundraising by developing a platform upon which fundraisers and donors, celebrities and fans, brands and customers can connect, interact and collaborate for good. Smilehood strives to be the greatest fundraising engine ever created, where every interaction on the platform brings a smile to someone.<br>
Smilehood creates dream moments and makes a smile happen for everyone. Celebrities' credibility makes the campaigns legit and by reporting and notifying the donors about campaign outcomes, they can have peace of mind when they know that they made a smile happen for the right person.
</p>
<h2 align="center">Getting Started is Simple</h2>

#### Install dependencies

```
npm install
```

#### Configure your Firebase

Create a file `firebase-init.js` at the root level of the project and add the code below. Make sure to enter your own: _apiKey_, _authDomain_, _databaseURL_, _projectId_, _storageBucket_, _messagingSenderId_, _appId_ and _measurementId_ from your firebase project. More details on how to create a firebase project can be found [here]("https://firebase.google.com/docs/web/setup").

```js
import firebase from "firebase/app";
import "firebase/analytics";

import "firebase/firestore";
import "firebase/functions";

const firebaseConfig = {
  apiKey: "YOUR FIREBASE API KEY",
  authDomain: "YOUR FIREBASE AUTH DOMAIN",
  databaseURL: "YOUR FIREBASE DATABASE URL",
  projectId: "YOUR FIREBASE PROJECT ID",
  storageBucket: "YOUR FIREBASE STORAGE BUCKET",
  messagingSenderId: "YOUR FIREBASE MESSAGING SENDER ID",
  appId: "YOUR FIREBASE APP ID",
  measurementId: "YOUR FIREBASE MEASUREMENT ID",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();
export const functions = firebase.functions();
```

#### Deploy a Firebase Cloud Function

You will need a Firebase Cloud Function to handle the sending of emails. Firstly, initialise the Firebase function and then deploy the function to your firebase project. More details on Firebase Cloud Functions can be found [here]("https://firebase.google.com/docs/functions").

Use the code template below to write your function. We recommend using [Nodemailer](https://nodemailer.com/about/) npm package for sending email. Otherwise, it can also be entirely up to you.

```js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendEmailToUs = functions.https.onCall((data) => {
  // YOUR FUNCTION CODE HERE
});
```

#### Serve at localhost:3000

```
npm run dev
```

#### Building for Production

```
npm run build
```
