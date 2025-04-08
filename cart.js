// Make updateCartCount globally available
window.updateCartCount = function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElements = document.querySelectorAll('#cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
};

// Function to render cart items
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
        initPayPalButton(); // Initialize PayPal even with empty cart
        return;
    }

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        
        // Fix image path for display in cart
        let displayImagePath = item.image;
        if (!displayImagePath.startsWith('http')) {
            if (!displayImagePath.includes('Products/ProductImages/') && 
                !displayImagePath.includes('ProductImages/')) {
                displayImagePath = `Products/ProductImages/${displayImagePath.split('/').pop()}`;
            }
        }
        
        itemElement.innerHTML = `
            <div class="item-info">
                <p class="item-sku">Item #${item.id}</p>
                <h2 class="item-name">${item.name}</h2>
                <img src="${displayImagePath}" alt="${item.name}" width="100">
                <p class="item-price">£${parseFloat(item.price).toFixed(2)}</p>
                
                <div class="quantity-selector">
                    <label for="quantity-${index}">Quantity:</label>
                    <div class="quantity-controls">
                        <button class="decrease-quantity" data-index="${index}">-</button>
                        <span class="quantity" id="quantity-${index}">${item.quantity}</span>
                        <button class="increase-quantity" data-index="${index}">+</button>
                    </div>
                </div>
                
                <button class="remove-item" data-index="${index}">Remove item</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
        subtotal += parseFloat(item.price) * item.quantity;
    });

    subtotalElement.textContent = subtotal.toFixed(2);
    updateCartCount();
    
    // Initialize PayPal buttons after rendering cart
    initPayPalButton();
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
        updateQuantity(parseInt(e.target.dataset.index), -1);
    } else if (e.target.classList.contains('increase-quantity')) {
        updateQuantity(parseInt(e.target.dataset.index), 1);
    } else if (e.target.classList.contains('remove-item')) {
        removeItem(parseInt(e.target.dataset.index));
    }
});

// PayPal Integration
function initPayPalButton() {
    // Make sure the PayPal SDK is loaded and container exists
    if (window.paypal && document.getElementById('paypal-button-container')) {
        // Clear any existing buttons
        document.getElementById('paypal-button-container').innerHTML = '';
        
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = parseFloat(document.getElementById('subtotal').textContent);
        
        // If cart is empty, show a message
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
            
            // Set up the transaction
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
            
            // Finalize the transaction
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(orderData) {
                    // Successful payment
                    const paymentResult = document.createElement('div');
                    paymentResult.classList.add('payment-success');
                    paymentResult.innerHTML = 'Payment successful! Order ID: ' + orderData.id;
                    document.getElementById('paypal-button-container').appendChild(paymentResult);
                    
                    // Clear the cart after successful payment
                    localStorage.removeItem('cart');
                    updateCartCount();
                    
                    // Redirect to confirmation page or show confirmation message
                    setTimeout(() => {
                        alert('Thank you for your order! Order ID: ' + orderData.id);
                        // Optionally redirect: window.location.href = 'confirmation.html?order=' + orderData.id;
                    }, 2000);
                });
            },
            
            // Handle errors
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cart-items')) {
        renderCartItems();
    }
    updateCartCount();
});
