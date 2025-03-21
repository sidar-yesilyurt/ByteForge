// Function to render cart items
function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const cartCountElement = document.getElementById('cart-count');

    // Clear existing items
    cartItemsContainer.innerHTML = '';

    let subtotal = 0;

    // Render each item in the cart
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <p class="item-id">${item.id}</p>
            <h2 class="item-name">${item.name}</h2>
            <p class="item-price">$${item.price}</p>
            <img src="${item.image}" alt="${item.name}" width="50" height="50">
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

    // Update subtotal
    subtotalElement.textContent = subtotal.toFixed(2);

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}

// Function to update quantity
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart[index];

    if (item) {
        item.quantity += change;

        if (item.quantity <= 0) {
            cart.splice(index, 1); // Remove item if quantity is 0
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems(); // Re-render the cart
    }
}

// Function to remove an item from the cart
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1); // Remove the item at the specified index
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems(); // Re-render the cart
}

// Event listeners for quantity controls and remove buttons
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('decrease-quantity')) {
        const index = e.target.getAttribute('data-index');
        updateQuantity(index, -1);
    } else if (e.target.classList.contains('increase-quantity')) {
        const index = e.target.getAttribute('data-index');
        updateQuantity(index, 1);
    } else if (e.target.classList.contains('remove-item')) {
        const index = e.target.getAttribute('data-index');
        removeItem(index);
    }
});

// Render cart items on page load
document.addEventListener('DOMContentLoaded', renderCartItems);