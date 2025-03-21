document.addEventListener("DOMContentLoaded", function() {
    const productGrid = document.querySelector(".product-grid");
    
    // Update the cart count on page load
    updateCartCount();

    // Function to create product HTML
    function createProductHTML(product) {
        return `
            <div class="product">
                <img src="${product.image}" alt="${product.name}" width="100" height="200">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <a href="#" class="btn add-to-cart" data-id="${product.id}">Add to Cart</a>
            </div>
        `;
    }

    // Function to append products to the DOM
    function appendProducts(products) {
        products.forEach(product => {
            const productHTML = createProductHTML(product);
            productGrid.innerHTML += productHTML;
        });
    }

    // Append products based on the current page
    if (window.location.pathname.includes("Accessories.html")) {
        appendProducts(accessories);
    } else if (window.location.pathname.includes("Consoles.html")) {
        appendProducts(consoles);
    } else if (window.location.pathname.includes("Hardware.html")) {
        appendProducts(hardware);
    } else if (window.location.pathname.includes("PCs.html")) {
        appendProducts(PCs);
    } else if (window.location.pathname.includes("Products.html")) {
        // Show all products on the main products page
        appendProducts([...PCs, ...hardware, ...consoles, ...accessories]);
    }

    // Add event listeners for "Add to Cart" buttons
    document.querySelectorAll('.product .btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product info from parent element
            const productElement = this.closest('.product');
            const productId = this.getAttribute('data-id');
            const productName = productElement.querySelector('h3').textContent;
            const productPrice = parseFloat(productElement.querySelector('p').textContent.replace('$', ''));
            const productImage = productElement.querySelector('img').getAttribute('src');
            
            // Add product to cart
            addToCart({
                id: parseInt(productId),
                name: productName,
                price: productPrice,
                image: productImage
            });
            
        });
    });
    
    function addToCart(item) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
        // Ensure the image path is absolute
        const absoluteImagePath = `/Products/${item.image}`;
    
        if (existingItem) {
            existingItem.quantity += 1; // Increase quantity if item already exists
        } else {
            item.quantity = 1; // Add new item with quantity 1
            item.image = absoluteImagePath; // Update the image path to absolute
            cart.push(item);
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