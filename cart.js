// Make updateCartCount globally available
window.updateCartCount = function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElements = document.querySelectorAll('#cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
};

function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');

    if (!cartItemsContainer || !subtotalElement) return;

    cartItemsContainer.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        
        // Fix image path for display in cart
        const displayImagePath = item.image.startsWith('Products/') 
            ? item.image 
            : `Products/ProductImages/${item.image.split('/').pop()}`;
        
        itemElement.innerHTML = `
            <p class="item-id">${item.id}</p>
            <h2 class="item-name">${item.name}</h2>
            <p class="item-price">$${item.price}</p>
            <img src="${displayImagePath}" alt="${item.name}" width="50" height="50">
            <div class="quantity-controls">
                <button class="decrease-quantity" data-index="${index}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="increase-quantity" data-index="${index}">+</button>
            </div>
            <button class="remove-item" data-index="${index}">Remove item</button>
        `;
        cartItemsContainer.appendChild(itemElement);
        subtotal += parseFloat(item.price) * item.quantity;
    });

    subtotalElement.textContent = subtotal.toFixed(2);
    updateCartCount();
}

// Function to update quantity
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

// Function to remove an item
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
}

// Event delegation for cart controls
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('decrease-quantity')) {
        updateQuantity(e.target.dataset.index, -1);
    } else if (e.target.classList.contains('increase-quantity')) {
        updateQuantity(e.target.dataset.index, 1);
    } else if (e.target.classList.contains('remove-item')) {
        removeItem(e.target.dataset.index);
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cart-items')) {
        renderCartItems();
    }
    updateCartCount();
});



// cart.js - Complete solution with all dependencies

// ===== CART MANAGEMENT FUNCTIONS =====
const CART_KEY = 'byteforge_cart';

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function calculateSubtotal(cart) {
    return cart.reduce((total, item) => {
        const product = getProductById(item.id);
        return total + (product.price * item.quantity);
    }, 0);
}

function updateCartCount(count) {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.textContent = count;
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartCount(0);
}

// ===== PAYPAL INTEGRATION =====
function initPayPalButton() {
    // Check if button already exists to prevent duplicates
    if (document.querySelector('#paypal-button-container .paypal-buttons')) {
        return;
    }

    paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal'
        },

        createOrder: function(data, actions) {
            const cart = getCart();
            if (cart.length === 0) {
                alert('Your cart is empty');
                return;
            }

            const subtotal = calculateSubtotal(cart);
            const items = cart.map(item => {
                const product = getProductById(item.id);
                return {
                    name: product.name.substring(0, 127),
                    unit_amount: {
                        currency_code: "GBP",
                        value: product.price.toFixed(2)
                    },
                    quantity: item.quantity.toString(),
                    category: "PHYSICAL_GOODS"
                };
            });

            return actions.order.create({
                purchase_units: [{
                    amount: {
                        currency_code: "GBP",
                        value: subtotal.toFixed(2),
                        breakdown: {
                            item_total: {
                                currency_code: "GBP",
                                value: subtotal.toFixed(2)
                            }
                        }
                    },
                    items: items
                }]
            });
        },

        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert(`Payment completed! Order ID: ${data.orderID}`);
                clearCart();
                // Redirect or update UI as needed
                window.location.href = 'order-success.html?id=' + data.orderID;
            });
        },

        onError: function(err) {
            console.error('PayPal error:', err);
            alert("Payment failed. Please try again.");
        }
    }).render('#paypal-button-container');
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Load PayPal SDK only once
    if (!window.paypal) {
        const script = document.createElement('script');
        script.src = 'https://www.paypal.com/sdk/js?client-id=AYGQ7U9XZJmSiL9Q6QZ5Q4v6QZ5Q4v6QZ5Q4v6QZ5Q4v6QZ5Q4v6QZ5Q4v6&currency=GBP';
        script.onload = initPayPalButton;
        document.head.appendChild(script);
    } else {
        initPayPalButton();
    }

    // Initialize cart count
    updateCartCount(getCart().reduce((total, item) => total + item.quantity, 0));
});