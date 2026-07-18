// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyASJ7cJKFskjkY8BomxZZZHQAaBYPIFNs8",
    authDomain: "rovan-store.firebaseapp.com",
    databaseURL: "https://rovan-store-default-rtdb.firebaseio.com",
    projectId: "rovan-store",
    storageBucket: "rovan-store.firebasestorage.app",
    messagingSenderId: "24046570512",
    appId: "1:24046570512:web:b5b7f5bc47ffc112838e95",
    measurementId: "G-YYV1X1T9G8"
    };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);