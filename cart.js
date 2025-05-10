// cart.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

// Firebase setup - these are like, your keys to the database!  Don't share 'em!
const firebaseConfig = {
    apiKey: "AIzaSyBe4_6QE_J9Yw5TnKiYkdZmnrPL_gVMfRk",
    authDomain: "byteforge-2813d.firebaseapp.com",
    projectId: "byteforge-2813d",
    storageBucket: "byteforge-2813d.firebasestorage.app",
    messagingSenderId: "848461771510",
    appId: "1:848461771510:web:1d1fd1742cfed8a56032d7",
    measurementId: "G-BN7R1SEQ41"
};

// Init Firebase - this is where we actually connect to Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let currentLoggedInUser = null;  // Keep track of who's logged in

// Listen for auth changes (login/logout)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User logged in - store their info
        currentLoggedInUser = user;
        console.log("User logged in:", user.email); // Good for debugging!
    } else {
        // User logged out
        currentLoggedInUser = null;
        console.log("User logged out");
    }
});

// Update cart item count in UI - this shows the number in the little cart icon
window.updateCartCount = function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || []; // Get cart from storage, or empty array
    const cartCountElements = document.querySelectorAll('#cart-count'); // Get all elements with this ID
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // Sum up all the quantities
    cartCountElements.forEach(element => {
        element.textContent = totalItems; // Update the text in each element
    });
    console.log("Cart count updated:", totalItems);
};

// Render items in the cart page - this is where the items are displayed in the cart
function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || []; // Get cart data
    const cartItemsContainer = document.getElementById('cart-items'); // Where we'll put the items
    const subtotalElement = document.getElementById('subtotal');    // Where the subtotal goes

    if (!cartItemsContainer || !subtotalElement) {
        console.error("Couldn't find cart elements in the HTML!"); // BIG PROBLEM if this happens
        return; // Stop the function to prevent errors
    }

    cartItemsContainer.innerHTML = ""; // Clear out any old stuff in the cart display
    let subtotal = 0; // Start the subtotal at zero

    if (cart.length === 0) {
        // If the cart is empty, show a message
        cartItemsContainer.innerHTML = '<div class="empty-cart"><p>Your basket is empty.</p><a href="index.html" class="continue-shopping">Continue Shopping</a></div>';
        subtotalElement.textContent = '0.00'; // Subtotal is zero
        updateCartCount(); // Make sure the cart count is also zero
        initPayPalButton(); // Initialize PayPal (important, even when empty)
        return; // Stop here, nothing else to do
    }

    // Loop through each item in the cart and create HTML elements to display them
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div'); // Create a new div for each item
        itemElement.classList.add('cart-item'); // Add a CSS class for styling

        // Handle image paths, just in case they're messed up
        let displayImagePath = item.image;
        if (!displayImagePath.startsWith('http')) {
            if (!displayImagePath.startsWith('../')) {
                displayImagePath = '../' + displayImagePath;
            }
        }

        // Build the HTML for the item display.  Use template literals (``) for easy formatting!
        itemElement.innerHTML = `
            <div class="item-info">
                <img src="${displayImagePath}" alt="${item.name}">
                <div class="item-details">
                    <p class="item-name">${item.name}</p>
                    <p class="item-price">£${(item.price * item.quantity).toFixed(2)}</p>
                    <p class="item-quantity">Quantity: ${item.quantity}
                        <button class="increase-quantity" data-index="${index}">+</button>  
                        <button class="decrease-quantity" data-index="${index}">-</button>
                    </p>
                </div>
            </div>
            <button class="remove-item" data-index="${index}">Remove</button>
        `;

        // Get the increase/decrease/remove buttons *for this item*
        const increaseButton = itemElement.querySelector('.increase-quantity');
        increaseButton.addEventListener('click', () => updateQuantity(index, 1)); // Use updateQuantity!

        const decreaseButton = itemElement.querySelector('.decrease-quantity');
        decreaseButton.addEventListener('click', () => updateQuantity(index, -1)); //  And here too!

        const removeButton = itemElement.querySelector('.remove-item');
        removeButton.addEventListener('click', () => removeItem(index));

        cartItemsContainer.appendChild(itemElement); // Add the item's HTML to the container
        subtotal += item.price * item.quantity; // Add to the subtotal
    });

    subtotalElement.textContent = subtotal.toFixed(2); // Display the formatted subtotal
    initPayPalButton(); // Initialize PayPal
    console.log("Cart rendered with", cart.length, "items, Subtotal: ", subtotal);
}

// Update item quantity - this function is called when you click + or -
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Get the cart
    const item = cart[index]; // Get the specific item we're changing

    if (item) {
        item.quantity += change; // Change the quantity

        if (item.quantity <= 0) {
            cart.splice(index, 1); // Remove the item if quantity goes to zero or below
            console.log("Item removed from cart at index", index);
        } else {
             console.log("Quantity of item at index", index, "updated to", item.quantity);
        }

        localStorage.setItem('cart', JSON.stringify(cart)); // Save the updated cart
        renderCartItems(); // Re-render the cart display
        updateCartCount(); // Update the cart count
    } else {
        console.warn("updateQuantity: Item at index", index, "not found in cart!"); // Error handling
    }
}

// Remove item from cart - this is called when you click the Remove button
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Get the cart
    cart.splice(index, 1); // Remove the item at the specified index
    localStorage.setItem('cart', JSON.stringify(cart)); // Save the cart
    renderCartItems(); // Re-render
    updateCartCount(); // Update count
    console.log("Item removed from cart at index", index);
}



// Initialize PayPal button - this sets up the PayPal payment stuff
function initPayPalButton() {
    if (window.paypal && document.getElementById('paypal-button-container')) {
        // Clear any existing PayPal buttons
        document.getElementById('paypal-button-container').innerHTML = '';
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = parseFloat(document.getElementById('subtotal').textContent);

        if (cart.length === 0 || subtotal <= 0) {
            document.getElementById('paypal-button-container').innerHTML =
                '<p class="payment-error">Add items to your cart before checkout</p>';
            return;
        }

        // Use the PayPal SDK to create the button
        paypal.Buttons({
            style: {
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'checkout'
            },

            // Set up the payment details
            createOrder: function (data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            currency_code: 'GBP',
                            value: subtotal.toFixed(2) // Use the subtotal from the page
                        }
                    }]
                });
            },

            // Handle the payment approval
            onApprove: function (data, actions) {
                return actions.order.capture().then(function (details) {
                    // Payment was successful!  Show a message, clear the cart, etc.
                    const paymentResult = document.createElement('div');
                    paymentResult.classList.add('payment-success');
                    paymentResult.innerHTML = 'Payment successful! Order ID: ' + details.id;
                    document.getElementById('paypal-button-container').appendChild(paymentResult);

                    const invoiceHTML = generateInvoiceHTML(cart, details, currentLoggedInUser);
                    displayInvoice(invoiceHTML, details, cart);

                    localStorage.removeItem('cart'); // Clear the cart!
                    updateCartCount(); // Update the display
                    console.log("Payment successful. Order details:", details);
                });
            },

            // Handle errors
            onError: function (err) {
                console.error('PayPal error:', err);
                const paymentError = document.createElement('div');
                paymentError.classList.add('payment-error');
                paymentError.innerHTML = 'Payment failed. Please try again.';
                document.getElementById('paypal-button-container').appendChild(paymentError);
            }
        }).render('#paypal-button-container'); // Put the button in the right place
    }
}

// Generate invoice HTML - this creates the HTML for the invoice
function generateInvoiceHTML(cart, paymentDetails, user) {
    let purchaserEmail = 'Guest'; // Default email

     if (user && user.email) {
        purchaserEmail = user.email;
    } else if (paymentDetails && paymentDetails.payer && paymentDetails.payer.email_address) {
        purchaserEmail = paymentDetails.payer.email_address;
    }

    let invoiceHTML = `
        <h2>Your Purchase Invoice</h2>
        <p>Order ID: ${paymentDetails.id}</p>
        <p>Purchaser Email: ${purchaserEmail}</p>
        <p>Purchase Date: ${new Date().toLocaleString()}</p>
        <table>
            <thead>
                <tr><th>Item</th><th>Quantity</th><th>Price</th><th>Total</th></tr>
            </thead>
            <tbody>
    `;

    let total = 0;
    cart.forEach(item => {
        const itemTotal = (parseFloat(item.price) * item.quantity).toFixed(2);
        invoiceHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>£${parseFloat(item.price).toFixed(2)}</td>
                <td>£${itemTotal}</td>
            </tr>
        `;
        total += parseFloat(itemTotal);
    });

    invoiceHTML += `
            </tbody>
            <tfoot>
                <tr><td colspan="3">Subtotal</td><td>£${total.toFixed(2)}</td></tr>
                <tr><td colspan="3">Total</td><td>£${total.toFixed(2)}</td></tr>
            </tfoot>
        </table>
    `;

    return invoiceHTML;
}

// Display invoice on page - this shows the invoice to the user
function displayInvoice(invoiceHTML, paymentDetails, cart) {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = invoiceHTML; // Put the invoice HTML into the cart container

    const downloadInvoiceButton = document.createElement('button');
    downloadInvoiceButton.id = 'download-invoice';
    downloadInvoiceButton.textContent = 'Download Invoice';
    downloadInvoiceButton.addEventListener('click', () => {
        downloadInvoice(invoiceHTML, paymentDetails.id); // Call function to download
    });

    cartItemsContainer.appendChild(downloadInvoiceButton); // Add the download button
}

// Initialize cart functions on page load - this is where it all starts!
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cart-items')) {
        renderCartItems(); // Render the cart if we're on the cart page
    }
    updateCartCount(); // Always update the cart count
    console.log("Cart functions initialized");
});

// Function to trigger invoice download - this makes the browser download the invoice
function downloadInvoice(invoiceHTML, orderId) {
    const element = document.createElement('a'); // Create a link element
    const file = new Blob([invoiceHTML], { type: 'text/html' }); // Create a Blob (like a file)
    element.href = URL.createObjectURL(file); // Create a URL for the Blob
    element.download = `invoice_${orderId}.html`; // Set the filename
    document.body.appendChild(element); // Add the link to the page
    element.click(); // Simulate a click to start the download
    document.body.removeChild(element); // Remove the link
    console.log("Invoice downloaded for Order ID:", orderId);
}
