// cart.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

// Firebase setup
const firebaseConfig = {
    apiKey: "AIzaSyBe4_6QE_J9Yw5TnKiYkdZmnrPL_gVMfRk",
    authDomain: "byteforge-2813d.firebaseapp.com",
    projectId: "byteforge-2813d",
    storageBucket: "byteforge-2813d.firebasestorage.app",
    messagingSenderId: "848461771510",
    appId: "1:848461771510:web:1d1fd1742cfed8a56032d7",
    measurementId: "G-BN7R1SEQ41"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let currentLoggedInUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User logged in
        currentLoggedInUser = user;
    } else {
        // User logged out
        currentLoggedInUser = null;
    }
});

// Update cart item count in UI
window.updateCartCount = function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElements = document.querySelectorAll('#cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
};

// Render items in the cart page
function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');

    if (!cartItemsContainer || !subtotalElement) return;

    cartItemsContainer.innerHTML = "";
    let subtotal = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart"><p>Your basket is empty.</p><a href="index.html" class="continue-shopping">Continue Shopping</a></div>';
        subtotalElement.textContent = '0.00';
        updateCartCount();
        initPayPalButton();
        return;
    }

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');

        let displayImagePath = item.image;
        if (!displayImagePath.startsWith('http')) {
            if (!displayImagePath.startsWith('../')) {
                displayImagePath = '../' + displayImagePath;
            }
        }

        itemElement.innerHTML = `
            <div class="item-info">
                <img src="${displayImagePath}" alt="${item.name}">
                <div class="item-details">
                    <p class="item-name">${item.name}</p>
                    <p class="item-price">£${(item.price * item.quantity).toFixed(2)}</p>
                    <p class="item-quantity">Quantity: ${item.quantity}
                        <button class="increase-qty" data-index="${index}">+</button>
                        <button class="decrease-qty" data-index="${index}">-</button>
                    </p>
                </div>
            </div>
            <button class="remove-item" data-index="${index}">Remove</button>
        `;

        const increaseButton = itemElement.querySelector('.increase-qty');
        increaseButton.addEventListener('click', () => adjustQuantity(index, 1));

        const decreaseButton = itemElement.querySelector('.decrease-qty');
        decreaseButton.addEventListener('click', () => adjustQuantity(index, -1));

        const removeButton = itemElement.querySelector('.remove-item');
        removeButton.addEventListener('click', () => removeItem(index));

        cartItemsContainer.appendChild(itemElement);
        subtotal += item.price * item.quantity;
    });

    subtotalElement.textContent = subtotal.toFixed(2);
    initPayPalButton();
}

// Update item quantity
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart[index];

    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
    }
}

// Remove item from cart
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
}

// Handle clicks on cart controls
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('decrease-quantity')) {
        updateQuantity(parseInt(e.target.dataset.index), -1);
    } else if (e.target.classList.contains('increase-quantity')) {
        updateQuantity(parseInt(e.target.dataset.index), 1);
    } else if (e.target.classList.contains('remove-item')) {
        removeItem(parseInt(e.target.dataset.index));
    }
});

// Initialize PayPal button
function initPayPalButton() {
    if (window.paypal && document.getElementById('paypal-button-container')) {
        document.getElementById('paypal-button-container').innerHTML = '';
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = parseFloat(document.getElementById('subtotal').textContent);

        if (cart.length === 0 || subtotal <= 0) {
            document.getElementById('paypal-button-container').innerHTML =
                '<p class="payment-error">Add items to your cart before checkout</p>';
            return;
        }

        paypal.Buttons({
            style: {
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'checkout'
            },
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            currency_code: 'GBP',
                            value: subtotal.toFixed(2)
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    const paymentResult = document.createElement('div');
                    paymentResult.classList.add('payment-success');
                    paymentResult.innerHTML = 'Payment successful! Order ID: ' + details.id;
                    document.getElementById('paypal-button-container').appendChild(paymentResult);

                    const invoiceHTML = generateInvoiceHTML(cart, details, currentLoggedInUser);
                    displayInvoice(invoiceHTML, details, cart);
                   

                    localStorage.removeItem('cart');
                    updateCartCount();
                });
            },
            onError: function(err) {
                console.error('PayPal error:', err);
                const paymentError = document.createElement('div');
                paymentError.classList.add('payment-error');
                paymentError.innerHTML = 'Payment failed. Please try again.';
                document.getElementById('paypal-button-container').appendChild(paymentError);
            }
        }).render('#paypal-button-container');
    }
}

// Generate invoice HTML
function generateInvoiceHTML(cart, paymentDetails, user) {
    let purchaserEmail = 'Guest';

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

// Display invoice on page
function displayInvoice(invoiceHTML, paymentDetails, cart) {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = invoiceHTML;

    const downloadInvoiceButton = document.createElement('button');
    downloadInvoiceButton.id = 'download-invoice';
    downloadInvoiceButton.textContent = 'Download Invoice';
    downloadInvoiceButton.addEventListener('click', () => {
        downloadInvoice(invoiceHTML, paymentDetails.id);
    });

    cartItemsContainer.appendChild(downloadInvoiceButton);
}

// Initialize cart functions on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cart-items')) {
        renderCartItems();
    }
    updateCartCount();
});

// Function to trigger invoice download
function downloadInvoice(invoiceHTML, orderId) {
    const element = document.createElement('a');
    const file = new Blob([invoiceHTML], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `invoice_${orderId}.html`; // Use order ID in filename
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
