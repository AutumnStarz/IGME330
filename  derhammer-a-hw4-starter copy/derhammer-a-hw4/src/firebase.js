import { initializeApp } from "https://www.gstatic.com/firebasejs/LINK-TO-LATEST-VERSION-FIREBASE.js";
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, ref, set, push, onValue, increment } from  "https://www.gstatic.com/firebasejs/LINK-TO-LATEST-VERSION-FIREBASE.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  // PUT YER CREDENTIALS HERE
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app);
const db = getDatabase();

const likedDogsPath = "df-liked-dogs/";

const pushLikedDogToCloud = dog => {
  dog.likes = increment(1);
  const favRef = ref(db, `${likedDogsPath}${dog.hash}`);
  set(favRef, dog); // `dog` is an object with `.title`, `.url`, `.likes` properties etc
};

// You might get awway with exporting fewer functions than this
export { db, likedDogsPath, ref, set, push, pushLikedDogToCloud, onValue };