// products.js
document.addEventListener("DOMContentLoaded", function() {
    const productGrid = document.querySelector(".product-grid");
    
    // Update the cart count on page load
    updateCartCount();

    // Function to create product HTML
    function createProductHTML(product) {
        return `
            <div class="product">
                <a href="product-details.html?id=${product.id}" class="product-link">
                    <img src="${product.image}" alt="${product.name}" width="100" height="200">
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                </a>
                <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
    }

    // Function to append products to the DOM
    function appendProducts(products) {
        productGrid.innerHTML = ''; // Clear existing products
        products.forEach(product => {
            const productHTML = createProductHTML(product);
            productGrid.innerHTML += productHTML;
        });
    }

    // Determine which products to show based on URL
    const path = window.location.pathname;
    let productsToShow = [];
    
    if (path.includes("Accessories.html")) {
        productsToShow = getProductsByCategory('accessories');
    } else if (path.includes("Consoles.html")) {
        productsToShow = getProductsByCategory('consoles');
    } else if (path.includes("Hardware.html")) {
        productsToShow = getProductsByCategory('hardware');
    } else if (path.includes("PCs.html")) {
        productsToShow = getProductsByCategory('PCs');
    } else if (path.includes("Products.html")) {
        productsToShow = getAllProducts();
    }

    appendProducts(productsToShow);

    // Add event listeners for "Add to Cart" buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = parseInt(e.target.getAttribute('data-id'));
            const product = getProductById(productId);
            
            if (product) {
                // Ensure correct image path before adding to cart
                const productWithCorrectImage = {
                    ...product,
                    image: product.image.startsWith('Products/ProductImages/') 
                        ? product.image 
                        : `Products/ProductImages/${product.image.split('/').pop()}`
                };
                addToCart(productWithCorrectImage);
            }
        }
    });
    
    // Cart functions
    function addToCart(item) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
        // Ensure the image path is correct
        const correctImagePath = item.image.startsWith('Products/ProductImages/') 
            ? item.image 
            : `Products/ProductImages/${item.image.split('/').pop()}`;
    
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...item,
                quantity: 1,
                image: correctImagePath
            });
        }
    
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = document.getElementById('cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
});