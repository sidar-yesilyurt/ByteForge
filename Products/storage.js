// storage.js - Centralized product database

// Combined product categories
const allProducts = {
    PCs: [
        {
            id: 10,
            name: "RTX 5080 Gaming PC",
            price: 2400,
            image: "ProductImages/RTX 5080 Gaming PC.png",
            category: "PCs"
        },
        {
            id: 11,
            name: "Laptop",
            price: 999.99,
            image: "ProductImages/laptop.JPG",
            category: "PCs"
        },
        {
            id: 12,
            name: "Ochw Seven Gaming PC",
            price: 2560.99,
            image: "ProductImages/Ochw Seven gaming pc.png",
            category: "PCs"
        },
        {
            id: 13,
            name: "Vantage Core Gaming PC",
            price: 2400.99,
            image: "ProductImages/Vantage core gaming pc.png",
            category: "PCs"
        },
        {
            id: 14,
            name: "Stormforce 1TB Gaming PC",
            price: 2780.99,
            image: "ProductImages/Stormforce 1TB Gaming PC.png",
            category: "PCs"
        },
        {
            id: 15,
            name: "Lenovo IdeaPad Laptop",
            price: 500,
            image: "ProductImages/Lenovo IdeaPad laptop.png",
            category: "PCs"
        },
        {
            id: 16,
            name: "Opsys Manga-X Gaming PC",
            price: 3600.99,
            image: "ProductImages/Opsys Manga-X gaming pc.png",
            category: "PCs"
        },
        {
            id: 17,
            name: "GeoBook Laptop Minecraft Edition",
            price: 1200,
            image: "ProductImages/GeoBook Laptop Minecraft Edition.png",
            category: "PCs"
        },
        {
            id: 18,
            name: "ASUS Intel Celeron Laptop",
            price: 400,
            image: "ProductImages/ASUS intel celeron laptop.png",
            category: "PCs"
        },
        {
            id: 19,
            name: "Razer Blade Intel Core Laptop",
            price: 300,
            image: "ProductImages/Razer Blade Intel Core Laptop.png",
            category: "PCs"
        },
        {
            id: 20,
            name: "PLE Computers - Custom Gaming PC",
            price: 2200,
            image: "ProductImages/PLE Computers Custom Gaming PC.png",
            category: "PCs"
        },
        {
            id: 21,
            name: "Microsoft Surface Laptop",
            price: 250.99,
            image: "ProductImages/microsoft surface laptop.jpg",
            category: "PCs"
        },
        {
            id: 22,
            name: "Desktop Computer Tower PC",
            price: 100,
            image: "ProductImages/Desktop Computer Tower PC.jpg",
            category: "PCs"
        },
        {
            id: 23,
            name: "Elite X Gaming PC",
            price: 1266,
            image: "ProductImages/Elite X Gaming PC.jpg",
            category: "PCs"
        }
    ],
    hardware: [
        {
            id: 24,
            name: "GeForce Graphics Card",
            price: 249.99,
            image: "ProductImages/graphicscard.JPG",
            category: "Hardware"
        },
        {
            id: 25,
            name: "Intel Core i5 7400 3.0GHZ",
            price: 164.66,
            image: "ProductImages/intel core.jpg",
            category: "Hardware"
        },
        {
            id: 26,
            name: "Intel Core i7 4790 3.6GHZ",
            price: 204.69,
            image: "ProductImages/intel core i7.jpg",
            category: "Hardware"
        },
        {
            id: 27,
            name: '57" Monitor 240Hz',
            price: 799.99,
            image: "ProductImages/monitor.JPG",
            category: "Hardware"
        },
        {
            id: 28,
            name: 'Lenovo 23.8" Monitor',
            price: 570.99,
            image: "ProductImages/lenovo 23.8inch monitor.png",
            category: "Hardware"
        },
        {
            id: 29,
            name: "Intel Arc Graphics Card",
            price: 799.99,
            image: "ProductImages/Sparkle Intel Arc A770 Titan OC Edition Graphics Card.png",
            category: "Hardware"
        },
        {
            id: 30,
            name: 'Samsung 22" Monitor',
            price: 570.99,
            image: "ProductImages/samsung 22inch monitor.png",
            category: "Hardware"
        },
        {
            id: 31,
            name: "Asus Gaming Motherboard",
            price: 660.00,
            image: "ProductImages/Asus gaming motherboard.png",
            category: "Hardware"
        },
        {
            id: 32,
            name: 'Phillips 34" Monitor',
            price: 1100.00,
            image: "ProductImages/phillips 34inch monitor.jpg",
            category: "Hardware"
        },
        {
            id: 33,
            name: "Computer Case Fan",
            price: 15.00,
            image: "ProductImages/computer case fan.png",
            category: "Hardware"
        },
        {
            id: 34,
            name: "Cruical BX500 SSD",
            price: 30.00,
            image: "ProductImages/cruical bx500 SSD.png",
            category: "Hardware"
        },
        {
            id: 35,
            name: "Hypertec 4GB DDR3L Memory Module",
            price: 40.00,
            image: "ProductImages/Hypertec 4GB DDR3L Memory Module.png",
            category: "Hardware"
        },
        {
            id: 36,
            name: "Micro-ATX motherboard",
            price: 140.00,
            image: "ProductImages/micro-atx motherboard.png",
            category: "Hardware"
        },
        {
            id: 37,
            name: "Micron 16GB memory",
            price: 60.00,
            image: "ProductImages/Micron 16GB memory.png",
            category: "Hardware"
        },
        {
            id: 38,
            name: "RGB Fan",
            price: 89.99,
            image: "ProductImages/RGB fan.png",
            category: "Hardware"
        }
    ],
    consoles: [
        {
            id: 39,
            name: "Playstation 5",
            price: 889.99,
            image: "ProductImages/ps5.png",
            category: "Consoles"
        },
        {
            id: 40,
            name: "Nintendo Switch",
            price: 300,
            image: "ProductImages/switch.jpg",
            category: "Consoles"
        },
        {
            id: 41,
            name: "Playstation Vista",
            price: 389.99,
            image: "ProductImages/ps vita.jpg",
            category: "Consoles"
        },
        {
            id: 42,
            name: "Xbox 360",
            price: 329.99,
            image: "ProductImages/xbox360.png",
            category: "Consoles"
        },
        {
            id: 43,
            name: "Playstation 5 Slim",
            price: 999.99,
            image: "ProductImages/ps5slim.jpg",
            category: "Consoles"
        },
        {
            id: 44,
            name: "Xbox One",
            price: 899.99,
            image: "ProductImages/xbox one.png",
            category: "Consoles"
        },
        {
            id: 45,
            name: "Playstation Portable",
            price: 399.99,
            image: "ProductImages/psp.jpg",
            category: "Consoles"
        },
        {
            id: 46,
            name: "Nintendo Wii U",
            price: 600,
            image: "ProductImages/wii u.jpg",
            category: "Consoles"
        },
        {
            id: 47,
            name: "Xbox One S",
            price: 999.99,
            image: "ProductImages/xbox one s.jpg",
            category: "Consoles"
        },
        {
            id: 48,
            name: "Nintendo Wii",
            price: 300,
            image: "ProductImages/wii.jpg",
            category: "Consoles"
        },
        {
            id: 49,
            name: "Playstation 3",
            price: 69.99,
            image: "ProductImages/playstation 3.jpg",
            category: "Consoles"
        },
        {
            id: 50,
            name: "Xbox One X",
            price: 429.99,
            image: "ProductImages/xbox one x.jpg",
            category: "Consoles"
        },
        {
            id: 51,
            name: "Playstation 4 Pro",
            price: 199.99,
            image: "ProductImages/ps4pro.png",
            category: "Consoles"
        }
    ],
    accessories: [
        {
            id: 52,
            name: "Wireless Gaming Mouse",
            price: 79.99,
            image: "ProductImages/mouse.JPG",
            category: "Accessories"
        },
        {
            id: 53,
            name: "Watch",
            price: 499.99,
            image: "ProductImages/watch.JPG",
            category: "Accessories"
        },
        {
            id: 54,
            name: "Noise-Canceling Headphones",
            price: 129.99,
            image: "ProductImages/headphones.JPG",
            category: "Accessories"
        },
        {
            id: 55,
            name: "Sony Wireless Earbuds",
            price: 59.99,
            image: "ProductImages/sony earbuds wireless.png",
            category: "Accessories"
        },
        {
            id: 56,
            name: "Gaming Headset",
            price: 19.99,
            image: "ProductImages/gaming headset.jpg",
            category: "Accessories"
        },
        {
            id: 57,
            name: "Raycons Earbuds",
            price: 29.99,
            image: "ProductImages/raycons.png",
            category: "Accessories"
        },
        {
            id: 58,
            name: "Noise-Canceling Headphones",
            price: 49.99,
            image: "ProductImages/noise cancelling headphones.png",
            category: "Accessories"
        },
        {
            id: 59,
            name: "Sekonda Smart Watch",
            price: 99.99,
            image: "ProductImages/sekonda smart watch.jpg",
            category: "Accessories"
        },
        {
            id: 60,
            name: "Apple Smart Watch",
            price: 299.99,
            image: "ProductImages/apple watch.jpg",
            category: "Accessories"
        },
        {
            id: 61,
            name: "Samsung Galaxy Smart Watch",
            price: 299.99,
            image: "ProductImages/samsung galaxy watch.jpg",
            category: "Accessories"
        },
        {
            id: 62,
            name: "Logitech Gaming Mouse",
            price: 99.99,
            image: "ProductImages/logitech wireless gaming mouse.jpg",
            category: "Accessories"
        },
        {
            id: 63,
            name: "Iphone Charger",
            price: 30.00,
            image: "ProductImages/iphone charger.jpg",
            category: "Accessories"
        },
        {
            id: 64,
            name: "Reddragon Gaming Mouse",
            price: 89.99,
            image: "ProductImages/reddragon gaming mouse.png",
            category: "Accessories"
        },
        {
            id: 65,
            name: "Samsung Charger",
            price: 20.00,
            image: "ProductImages/samsung charger.jpg",
            category: "Accessories"
        },
        {
            id: 66,
            name: "Damysus Gaming Mouse",
            price: 89.99,
            image: "ProductImages/damysus gaming mouse.jpg",
            category: "Accessories"
        }
    ]
};

// Function to get all products from all categories
function getAllProducts() {
    return [
        ...allProducts.PCs,
        ...allProducts.hardware,
        ...allProducts.consoles,
        ...allProducts.accessories
    ];
}

// Function to get products by category
function getProductsByCategory(category) {
    switch(category.toLowerCase()) {
        case 'pcs': return allProducts.PCs;
        case 'hardware': return allProducts.hardware;
        case 'consoles': return allProducts.consoles;
        case 'accessories': return allProducts.accessories;
        default: return getAllProducts();
    }
}

// Function to get a single product by ID
function getProductById(id) {
    const all = getAllProducts();
    return all.find(product => product.id === id);
}