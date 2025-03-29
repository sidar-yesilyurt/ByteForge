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
        console.log("User logged in. Updating cart count...");
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
        console.log("User signed out");
    }).catch((error) => {
        console.error("Error signing out:", error);
    });
});

// ======================
// Carousel Functionality (only on homepage)
// ======================
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    const carouselSlide = document.querySelector(".carousel-slide");
    const carouselImages = document.querySelectorAll(".carousel-slide img");
    
    if (carouselSlide && carouselImages.length > 0) {
        // ... (keep all your existing carousel code here)
    }
}

// ======================
// Homepage Products (only on index.html)
// ======================
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    const productsIndex = [
        {
            id: 1,
            name: "Laptop",
            price: 999.99,
            image: "Products/ProductImages/laptop.JPG"
        },
        {
            id: 2,
            name: "Watch",
            price: 499.99,
            image: "Products/ProductImages/watch.JPG"
        },
        {
            id: 3,
            name: "Noise-Canceling Headphones",
            price: 129.99,
            image: "Products/ProductImages/headphones.JPG"
        },
        {
            id: 4,
            name: "57\" Monitor 240Hz",
            price: 799.99,
            image: "Products/ProductImages/monitor.JPG"
        },
        {
            id: 5,
            name: "Wireless Gaming Mouse",
            price: 79.99,
            image: "Products/ProductImages/mouse.JPG"
        },
        {
            id: 6,
            name: "GeForce Graphics Card",
            price: 249.99,
            image: "Products/ProductImages/graphicscard.JPG"
        }
    ];

    const productGrid = document.getElementById("product-grid");
    
    if (productGrid) {
        productsIndex.forEach(product => {
            const productElement = document.createElement("div");
            productElement.classList.add("product");
            productElement.innerHTML = `
                <a href="Products/product-details.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}" width="100" height="200">
                    <h3>${product.name}</h3>
                    <p>$${product.price}</p>
                </a>
                <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
            `;
            productGrid.appendChild(productElement);
        });

        // Event delegation for add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                e.preventDefault();
                const productId = e.target.getAttribute('data-id');
                const product = productsIndex.find(p => p.id == productId);
                addToCart(product);
            }
        });
    }
}

// ======================
// Cart Functions (global)
// ======================
function addToCart(item) {
    console.log("Adding item to cart:", item); // Debugging: Log the item being added
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        item.quantity = 1;
        cart.push(item);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}
window.updateCartCount = function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountLoggedOut = document.querySelector('#logged-out-actions #cart-count');
    const cartCountLoggedIn = document.querySelector('#logged-in-actions #cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cartCountLoggedOut) cartCountLoggedOut.textContent = totalItems;
    if (cartCountLoggedIn) cartCountLoggedIn.textContent = totalItems;
};

// Initialize on auth state change
onAuthStateChanged(auth, (user) => {
    // ... your existing auth code
    updateCartCount(); // Add this line
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', updateCartCount);

// ======================
// Chatbox Functionality
// ======================
const chatbox = document.querySelector('.chatbox');
const chatboxToggle = document.querySelector('.chatbox-toggle');
const chatboxBody = document.querySelector('.chatbox-body');
const chatForm = document.getElementById('chat-form');

if (chatboxBody) chatboxBody.style.display = 'none';

if (chatboxToggle) {
    chatboxToggle.addEventListener('click', () => {
        if (chatboxBody.style.display === 'none' || chatboxBody.style.display === '') {
            chatboxBody.style.display = 'block';
        } else {
            chatboxBody.style.display = 'none';
        }
    });
}

if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        chatForm.reset();
        alert('Your message has been sent!');
        if (chatboxBody) chatboxBody.style.display = 'none';
    });
}