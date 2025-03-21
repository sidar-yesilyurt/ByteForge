import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration
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

// Check authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log("User is logged in:", user.uid); // Debugging

        // Fetch user data from Firestore
        const docRef = doc(db, "users", user.uid);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    console.log("User Data from Firestore:", userData); // Debugging

                    // Display the user's name
                    const userNameElement = document.getElementById('userName');
                    userNameElement.innerText = `Welcome, ${userData.firstName} ${userData.lastName}`;
                } else {
                    console.log("No document found matching ID:", user.uid); // Debugging
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error); // Debugging
            });
    } else {
        // User is not signed in
        console.log("User is not logged in"); // Debugging
        window.location.href = '../index.html'; // Redirect to login page
    }
});

// Logout
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log("User signed out"); // Debugging
            window.location.href = '../index.html'; // Redirect to login page
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
});