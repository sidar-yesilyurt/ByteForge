import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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

// DOM Elements - accessing the html
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignUp = document.getElementById('showSignUp');
const showLogin = document.getElementById('showLogin');
const forgotPassword = document.getElementById('forgotPassword');
const loginMessage = document.getElementById('loginMessage');
const signupMessage = document.getElementById('signupMessage');

// Function to get query parameters from the URL
// Function to get query parameters from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Check the query parameter and show the appropriate form
const formType = getQueryParam('form');
console.log("Form type:", formType); // Debugging: Check the query parameter value

if (formType === 'login') {
    console.log("Showing login form");
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
} else if (formType === 'signup') {
    console.log("Showing signup form");
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
} else {
    console.log("No form type specified, defaulting to login");
    loginForm.style.display = 'block'; // If nothing selected login form is shown as default
    signupForm.style.display = 'none';
}

// Toggle between Login and Signup forms
showSignUp.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User logged in:", user.uid); // Debugging
            window.location.href = '../index.html'; // Redirect to homepage
        })
        .catch((error) => {
            alert("Invalid login credentials. Please try again.");
            loginMessage.style.display = 'block';
            loginMessage.innerText = error.message;
        });
});

// Signup
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const firstName = document.getElementById('signupFirstName').value;
    const lastName = document.getElementById('signupLastName').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                email: email,
                firstName: firstName,
                lastName: lastName
            };

            // Save additional user data to Firestore
            const docRef = doc(db, "users", user.uid);
            setDoc(docRef, userData)
                .then(() => {
                    console.log("User data saved to Firestore:", userData); // Debugging
                    window.location.href = 'index.html'; // Redirect to homepage
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        })
        .catch((error) => {
            signupMessage.style.display = 'block';
            signupMessage.innerText = error.message;
        });
});

// Forgot Password
forgotPassword.addEventListener('click', (e) => {
    e.preventDefault();
    const email = prompt("Please enter your email address:");
    if (email) {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Password reset email sent. Check your inbox.");
            })
            .catch((error) => {
                alert(error.message);
            });
    }
});

// Utility function to show messages
function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}

