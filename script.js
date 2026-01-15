// Product Data
const products = [
    {
        id: 1,
        name: "Zenith X1 Carbon Laptop",
        category: "laptop",
        price: 365000,
        rating: 4.8,
        image: "assets/laptop.png",
        specs: "i7 12th Gen, 16GB RAM, 512GB SSD"
    },
    {
        id: 2,
        name: "Nebula Pro Gaming PC",
        category: "gaming",
        price: 699000,
        rating: 5.0,
        image: "assets/desktop.png",
        specs: "RTX 4080, Ryzen 9, 32GB RAM"
    },
    {
        id: 3,
        name: "Mechanical RGB Keyboard",
        category: "accessory",
        price: 35000,
        rating: 4.7,
        image: "assets/accessory.png",
        specs: "Blue Switches, RGB, Macro Keys"
    },
    {
        id: 4,
        name: "Titan Workstation Desktop",
        category: "desktop",
        price: 530000,
        rating: 4.6,
        image: "assets/desktop.png",
        specs: "Xeon W, 64GB RAM, 2TB SSD"
    },
    {
        id: 5,
        name: "Stealth 15 Air Laptop",
        category: "laptop",
        price: 275000,
        rating: 4.5,
        image: "assets/laptop.png",
        specs: "Ryzen 7, 16GB RAM, 1TB SSD"
    },
    {
        id: 6,
        name: "Viper Ultimate Mouse",
        category: "accessory",
        price: 25000,
        rating: 4.9,
        image: "assets/accessory.png",
        specs: "20k DPI, Wireless, 70g"
    },
    {
        id: 7,
        name: "Hyperion Gaming Tower",
        category: "gaming",
        price: 925000,
        rating: 5.0,
        image: "assets/desktop.png",
        specs: "RTX 4090, i9 13900K, 64GB RAM"
    },
    {
        id: 8,
        name: "Pro Streamer Bundle",
        category: "accessory",
        price: 85000,
        rating: 4.8,
        image: "assets/accessory.png",
        specs: "Mic, Cam, Light, Stream Deck"
    },
    {
        id: 9,
        name: "Galaxy Book Ultra",
        category: "laptop",
        price: 445000,
        rating: 4.7,
        image: "assets/laptop.png",
        specs: "OLED Screen, i9, 32GB RAM"
    },
    {
        id: 10,
        name: "Core Office Desktop",
        category: "desktop",
        price: 195000,
        rating: 4.2,
        image: "assets/desktop.png",
        specs: "i5, 8GB RAM, 256GB SSD"
    }
];

// State
let cart = [];
let currentCategory = 'all';

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCart');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const cartCountElement = document.querySelector('.cart-count');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Initialize
function init() {
    renderProducts(products);
    setupEventListeners();
    setupRevealAnimation();
}

// Reveal Animation Logic
function setupRevealAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-vertical, .reveal-left, .reveal-right').forEach(el => {
        observer.observe(el);
    });
}

// Render Products
function renderProducts(productsToRender) {
    productsGrid.innerHTML = '';

    if (productsToRender.length === 0) {
        productsGrid.innerHTML = '<p class="no-results">No products found matching your criteria.</p>';
        return;
    }

    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-details">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    ${getStarRating(product.rating)}
                    <span>(${product.rating})</span>
                </div>
                <p style="font-size: 0.8rem; color: #666; margin-bottom: 0.5rem;">${product.specs}</p>
                <div class="product-price-row">
                    <div class="product-price">Rs. ${product.price.toLocaleString()}</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

// Utility: Generate Star Rating HTML
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHtml = '';

    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    // Fill remaining with empty stars if needed (optional, assuming 5 max)
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    return starsHtml;
}

// Event Listeners
function setupEventListeners() {
    // Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active class
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Filter products
            currentCategory = e.target.dataset.filter;
            filterProducts();
        });
    });

    // Search
    searchBtn.addEventListener('click', filterProducts);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') filterProducts();
    });

    // Cart Toggle
    cartBtn.addEventListener('click', () => {
        cartOverlay.classList.add('show');
    });

    closeCartBtn.addEventListener('click', () => {
        cartOverlay.classList.remove('show');
    });

    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) {
            cartOverlay.classList.remove('show');
        }
    });

    // Mobile Menu
    menuToggle.addEventListener('click', () => {
        const isFlex = navLinks.style.display === 'flex';
        navLinks.style.display = isFlex ? 'none' : 'flex';
        if (!isFlex) {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'white';
            navLinks.style.padding = '1rem';
            navLinks.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        } else {
            navLinks.style = ''; // Reset inline styles
        }
    });
}

// Filter Logic
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();

    const filtered = products.filter(product => {
        const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    renderProducts(filtered);
}

// Cart Logic
// Expose specific functions to window for onclick handlers
window.addToCart = function (productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    // Show feedback (could be a toast, for now just open cart or badge animation)
    const btn = document.querySelector(`button[onclick="addToCart(${productId})"]`);
    if (btn) {
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.backgroundColor = '#10b981';
        btn.style.color = 'white';
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.backgroundColor = '';
            btn.style.color = '';
        }, 1000);
    }
};

window.removeFromCart = function (productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
};

window.updateQuantity = function (productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
};

function updateCartUI() {
    // Update Count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;

    // Update List
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty</p>';
        cartTotalElement.textContent = 'Rs. 0';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">Rs. ${item.price.toLocaleString()}</div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 5px;">
                    <button onclick="updateQuantity(${item.id}, -1)" style="padding: 2px 6px; border: 1px solid #ccc; cursor: pointer;">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" style="padding: 2px 6px; border: 1px solid #ccc; cursor: pointer;">+</button>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    // Update Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = 'Rs. ' + total.toLocaleString();
}

// Start
init();
