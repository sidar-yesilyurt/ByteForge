// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBe4_6QE_J9Yw5TnKiYkdZmnrPL_gVMfRk",
    authDomain: "byteforge-2813d.firebaseapp.com",
    projectId: "byteforge-2813d",
    storageBucket: "byteforge-2813d.firebasestorage.app",
    messagingSenderId: "848461771510",
    appId: "1:848461771510:web:1d1fd1742cfed8a56032d7",
    measurementId: "G-BN7R1SEQ41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const loggedOutActions = document.getElementById('logged-out-actions');
const loggedInActions = document.getElementById('logged-in-actions');
const userNameSpan = document.getElementById('userName');
const logoutButton = document.getElementById('logout');

// Observe authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        loggedOutActions.style.display = 'none';
        loggedInActions.style.display = 'flex';

        // Fetch user data from Firestore
        const userDocRef = doc(db, "users", user.uid);
        getDoc(userDocRef).then((doc) => {
            if (doc.exists()) {
                const userData = doc.data();
                userNameSpan.textContent = `${userData.firstName} ${userData.lastName}`;
            }
        }).catch((error) => {
            console.error("Error fetching user data:", error);
        });

        // Update cart count when user logs in
        console.log("User logged in. Updating cart count..."); // Debugging
        updateCartCount();
    } else {
        // User is signed out
        loggedOutActions.style.display = 'flex';
        loggedInActions.style.display = 'none';
    }
});
// Logout functionality
logoutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log("User signed out");
    }).catch((error) => {
        // An error happened.
        console.error("Error signing out:", error);
    });
});