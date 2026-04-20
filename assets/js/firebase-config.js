
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-Firestore.js";





const firebaseConfig = {
    apiKey: "AIzaSyDBDP8ojIY9PlLmwyxTgv3I_onK7Lv6190",
    authDomain: "smart-city-4f88a.firebaseapp.com",
    projectId: "smart-city-4f88a",
    storageBucket: "smart-city-4f88a.firebasestorage.app",
    messagingSenderId: "152479122237",
    appId: "1:152479122237:web:7a84c9418e991c3972bb54"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db }