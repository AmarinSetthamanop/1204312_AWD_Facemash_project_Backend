// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdTPopDlJ6xezxc9KFyXCLoREEkSS2ecs",
  authDomain: "facemashprojectfontend.firebaseapp.com",
  projectId: "facemashprojectfontend",
  storageBucket: "facemashprojectfontend.appspot.com",
  messagingSenderId: "282299831299",
  appId: "1:282299831299:web:263f3651a76cd24d8fea36",
  measurementId: "G-4D0SXMGCGT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);