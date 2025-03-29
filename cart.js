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