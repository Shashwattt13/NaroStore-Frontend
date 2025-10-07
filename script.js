// ==========================================
// STATE MANAGEMENT
// ==========================================
let cart = [];
let isLoggedIn = false;
let currentUser = null;
let selectedProduct = null;
let selectedSize = null;
let selectedRating = 0;
let selectedReviewProductId = null;
let orderHistory = [];
let productReviews = {};
let customDesign = {
    productType: 'tshirt',
    baseColor: '#f5f5dc',
    text: '',
    textColor: '#000000',
    textFont: 'Arial',
    image: null,
    size: 'M',
    price: 1699
};

// ==========================================
// PRODUCTS DATA
// ==========================================
const products = [
    { id: 1, name: 'GenZ Vibes Tee', category: 'tshirts', price: 999, color: 'beige', icon: 'fa-tshirt', image: 'https://images.pexels.com/photos/10839519/pexels-photo-10839519.jpeg' },
    { id: 2, name: 'Aesthetic Crop Top', category: 'tshirts', price: 899, color: 'cream', icon: 'fa-tshirt', image: 'https://images.pexels.com/photos/2266551/pexels-photo-2266551.jpeg' },
    { id: 3, name: 'Minimalist Oversized Tee', category: 'tshirts', price: 1199, color: 'olive', icon: 'fa-tshirt', image: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=500&h=500&fit=crop' },
    { id: 4, name: 'Comfort Shorts', category: 'shorts', price: 1399, color: 'beige', icon: 'fa-person', image: 'https://images.pexels.com/photos/12149738/pexels-photo-12149738.jpeg' },
    { id: 5, name: 'Athletic Shorts', category: 'shorts', price: 1499, color: 'olive', icon: 'fa-person', image: 'https://images.pexels.com/photos/7107051/pexels-photo-7107051.jpeg' },
    { id: 6, name: 'Streetwear Cap', category: 'caps', price: 699, color: 'brown', icon: 'fa-hat-cowboy', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop' },
    { id: 7, name: 'Cargos', category: 'Lowers', price: 2099, color: 'cream', icon: 'fa-hat-cowboy', image: 'https://images.pexels.com/photos/11716437/pexels-photo-11716437.jpeg' },
    { id: 8, name: 'Cozy Ankle Socks', category: 'socks', price: 399, color: 'beige', icon: 'fa-socks', image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=500&h=500&fit=crop' },
    { id: 9, name: 'Oversized Hoodies', category: 'Hoodies', price: 1999, color: 'olive', icon: 'fa-socks', image: 'https://plus.unsplash.com/premium_photo-1682094910532-64389764422b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 10, name: 'Bold Statement Tee', category: 'tshirts', price: 899, color: 'brown', icon: 'fa-tshirt', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=500&fit=crop' },
    { id: 11, name: 'Retro Graphic Tee', category: 'tshirts', price: 1099, color: 'olive', icon: 'fa-tshirt', image: 'https://cdn.cssauthor.com/wp-content/uploads/2024/09/Free-Oversized-T-Shirt-Mockup-Template-PSD.jpg?strip=all&lossy=1&ssl=1' },
    { id: 12, name: 'Classic Denim Jeans', category: 'Jeans', price: 2199, color: 'beige', icon: 'fa-hat-cowboy', image: 'https://images.pexels.com/photos/19461552/pexels-photo-19461552.jpeg' }
];

let canvas, ctx;

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Naro Store - Initializing...');
    initializeProductReviews();
    loadProducts();
    setupEventListeners();
    setupCustomizeCanvas();
    animateOnScroll();
    console.log('Naro Store - Ready!');
});

// ==========================================
// EVENT LISTENERS SETUP
// ==========================================
function setupEventListeners() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    document.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', function(e) {
            document.querySelectorAll('.nav-link').forEach(function(l) {
                l.classList.remove('active');
            });
            e.target.classList.add('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });
    
    const cartBtn = document.getElementById('cart-btn');
    const userBtn = document.getElementById('user-btn');
    if (cartBtn) cartBtn.addEventListener('click', function() { openModal(document.getElementById('cart-modal')); });
    if (userBtn) userBtn.addEventListener('click', function() { openModal(document.getElementById('user-modal')); });
    
    document.getElementById('close-cart-modal').addEventListener('click', function() { closeModal(document.getElementById('cart-modal')); });
    document.getElementById('close-user-modal').addEventListener('click', function() { closeModal(document.getElementById('user-modal')); });
    document.getElementById('close-checkout-modal').addEventListener('click', function() { closeModal(document.getElementById('checkout-modal')); });
    document.getElementById('close-size-modal').addEventListener('click', function() {
        closeModal(document.getElementById('size-modal'));
        selectedProduct = null;
        selectedSize = null;
    });
    document.getElementById('close-review-modal').addEventListener('click', function() { closeModal(document.getElementById('review-modal')); });
    
    document.querySelectorAll('.auth-tab').forEach(function(tab) {
        tab.addEventListener('click', function(e) {
            document.querySelectorAll('.auth-tab').forEach(function(t) { t.classList.remove('active'); });
            e.target.classList.add('active');
            const tabName = e.target.dataset.tab;
            document.getElementById('login-form').classList.toggle('hidden', tabName !== 'login');
            document.getElementById('signup-form').classList.toggle('hidden', tabName !== 'signup');
            document.getElementById('admin-form').classList.toggle('hidden', tabName !== 'admin');
            document.getElementById('forgot-password-form').classList.add('hidden');
        });
    });
    
    document.getElementById('login-btn').addEventListener('click', handleLogin);
    document.getElementById('signup-btn').addEventListener('click', handleSignup);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('admin-login-btn').addEventListener('click', handleAdminLogin);
    
    document.getElementById('forgot-password-link').addEventListener('click', function(e) {
        e.preventDefault();
        showForgotPassword();
    });
    document.getElementById('back-to-login').addEventListener('click', function(e) {
        e.preventDefault();
        showLoginForm();
    });
    document.getElementById('reset-password-btn').addEventListener('click', handlePasswordReset);
    
    document.getElementById('view-profile').addEventListener('click', function() { showAccountSection('profile-section'); });
    document.getElementById('view-orders').addEventListener('click', function() { showAccountSection('orders-section'); });
    
    document.querySelectorAll('.size-option-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.size-option-btn').forEach(function(b) { b.classList.remove('selected'); });
            btn.classList.add('selected');
            selectedSize = btn.dataset.size;
        });
    });
    
    document.getElementById('confirm-add-to-cart').addEventListener('click', confirmAddToCart);
    document.getElementById('checkout-btn').addEventListener('click', function() {
        closeModal(document.getElementById('cart-modal'));
        openCheckout();
    });
    document.getElementById('place-order-btn').addEventListener('click', placeOrder);
    
    document.getElementById('search-input').addEventListener('input', filterProducts);
    document.getElementById('category-filter').addEventListener('change', filterProducts);
    document.getElementById('price-filter').addEventListener('change', filterProducts);
    document.getElementById('color-filter').addEventListener('change', filterProducts);
    
    document.querySelectorAll('.product-type-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.product-type-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            customDesign.productType = btn.dataset.type;
            updateCustomPreview();
        });
    });
    
    document.querySelectorAll('.color-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.color-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            customDesign.baseColor = btn.dataset.color;
            updateCustomPreview();
        });
    });
    
    document.getElementById('add-text-btn').addEventListener('click', function() {
        customDesign.text = document.getElementById('custom-text').value;
        customDesign.textColor = document.getElementById('text-color').value;
        customDesign.textFont = document.getElementById('text-font').value;
        updateCustomPreview();
    });
    
    document.getElementById('image-upload').addEventListener('change', handleImageUpload);
    
    document.querySelectorAll('.size-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.size-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            customDesign.size = btn.dataset.size;
        });
    });
    
    document.getElementById('reset-design').addEventListener('click', resetCustomDesign);
    document.getElementById('add-custom-to-cart').addEventListener('click', addCustomToCart);
    
    document.querySelectorAll('.star-input').forEach(function(star) {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.dataset.rating);
            updateStarRating(selectedRating);
        });
    });
    
    document.getElementById('submit-review-btn').addEventListener('click', submitReview);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function showToast(message, type) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + (type || 'success');
    setTimeout(function() { toast.classList.remove('show'); }, 3000);
}

function showLoading() {
    document.getElementById('loading-spinner').classList.add('active');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.remove('active');
}

function openModal(modal) {
    if (modal) modal.classList.add('active');
}

function closeModal(modal) {
    if (modal) modal.classList.remove('active');
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('#theme-toggle i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email);
}

// ==========================================
// USER AUTHENTICATION
// ==========================================
function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showToast('Please enter a valid Gmail address', 'error');
        return;
    }
    
    showLoading();
    setTimeout(function() {
        isLoggedIn = true;
        currentUser = { name: email.split('@')[0], email: email };
        
        // Store user data
        storeUserData(currentUser);
        
        document.getElementById('user-auth').classList.add('hidden');
        document.getElementById('user-account').classList.remove('hidden');
        document.getElementById('user-name').textContent = currentUser.name;
        document.getElementById('user-email').textContent = currentUser.email;
        loadOrderHistory();
        hideLoading();
        showToast('Welcome back, ' + currentUser.name + '!', 'success');
    }, 1000);
}

function handleAdminLogin() {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Check admin credentials
    if (email === 'admin@narostore.com' && password === 'admin123') {
        showLoading();
        
        setTimeout(function() {
            // Store admin auth
            const adminData = {
                name: 'Admin User',
                email: email,
                role: 'admin',
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('naroAdminAuth', JSON.stringify(adminData));
            
            // Sync data to localStorage for admin panel
            syncDataToLocalStorage();
            
            hideLoading();
            
            // Close modal first
            closeModal(document.getElementById('user-modal'));
            
            showToast('Admin login successful! Redirecting...', 'success');
            
            setTimeout(function() {
                // Redirect to admin panel
                window.location.href = './admin.html';
            }, 1500);
        }, 1000);
    } else {
        showToast('Invalid admin credentials', 'error');
    }
}

function storeUserData(user) {
    const users = JSON.parse(localStorage.getItem('naroUsers') || '[]');
    const existingUserIndex = users.findIndex(function(u) { return u.email === user.email; });
    
    if (existingUserIndex === -1) {
        users.push({
            name: user.name,
            email: user.email,
            registeredDate: new Date().toLocaleDateString('en-IN'),
            orderCount: 0
        });
        localStorage.setItem('naroUsers', JSON.stringify(users));
    }
}

function syncDataToLocalStorage() {
    // Sync orders
    if (orderHistory.length > 0) {
        localStorage.setItem('naroOrders', JSON.stringify(orderHistory));
    }
    
    // Sync products
    localStorage.setItem('naroProducts', JSON.stringify(products));
    
    // Sync reviews
    localStorage.setItem('naroReviews', JSON.stringify(productReviews));
}

function handleSignup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    if (!name || !email || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showToast('Please enter a valid Gmail address', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    showLoading();
    setTimeout(function() {
        isLoggedIn = true;
        currentUser = { name: name, email: email };
        document.getElementById('user-auth').classList.add('hidden');
        document.getElementById('user-account').classList.remove('hidden');
        document.getElementById('user-name').textContent = currentUser.name;
        document.getElementById('user-email').textContent = currentUser.email;
        orderHistory = [];
        loadOrderHistory();
        hideLoading();
        showToast('Account created successfully!', 'success');
    }, 1000);
}

function handleLogout() {
    isLoggedIn = false;
    currentUser = null;
    document.getElementById('user-auth').classList.remove('hidden');
    document.getElementById('user-account').classList.add('hidden');
    document.getElementById('profile-section').classList.add('hidden');
    document.getElementById('orders-section').classList.add('hidden');
    closeModal(document.getElementById('user-modal'));
    showToast('Logged out successfully', 'success');
}

function showAccountSection(sectionId) {
    document.getElementById('profile-section').classList.add('hidden');
    document.getElementById('orders-section').classList.add('hidden');
    document.getElementById(sectionId).classList.remove('hidden');
}

function showForgotPassword() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('forgot-password-form').classList.remove('hidden');
}

function showLoginForm() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('forgot-password-form').classList.add('hidden');
}

function handlePasswordReset() {
    const email = document.getElementById('reset-email').value;
    
    if (!validateEmail(email)) {
        showToast('Please enter a valid Gmail address', 'error');
        return;
    }
    
    showLoading();
    setTimeout(function() {
        hideLoading();
        showToast('Password reset link sent to ' + email, 'success');
        showLoginForm();
        document.getElementById('reset-email').value = '';
    }, 1500);
}

// ==========================================
// ORDER HISTORY
// ==========================================
function loadOrderHistory() {
    const orderList = document.getElementById('order-list');
    
    if (orderHistory.length === 0) {
        orderList.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--tan);">No orders yet</p>';
        return;
    }
    
    orderList.innerHTML = '';
    orderHistory.forEach(function(order) {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        const statusClass = order.status.toLowerCase().replace(' ', '-');
        const itemsList = order.items.map(function(item) {
            return item.name + ' x' + item.quantity;
        }).join(', ');
        
        orderItem.innerHTML = 
            '<div class="order-info">' +
                '<h4>Order #' + order.id + '</h4>' +
                '<p>Date: ' + order.date + '</p>' +
                '<p style="font-size:0.9rem;color:var(--text-color);opacity:0.8;">' + itemsList + '</p>' +
                '<p style="font-size:1.1rem;font-weight:600;color:var(--accent-green);margin-top:0.5rem;">Total: ₹' + order.total + '</p>' +
                '<p class="order-status ' + statusClass + '">' + order.status + '</p>' +
            '</div>' +
            '<button class="btn btn-sm" onclick="trackOrder(\'' + order.id + '\')">Track Order</button>';
        
        orderList.appendChild(orderItem);
    });
}

function trackOrder(orderId) {
    const order = orderHistory.find(function(o) { return o.id === orderId; });
    if (order) {
        showToast('Order #' + orderId + ' - Status: ' + order.status, 'success');
    }
}

// ==========================================
// PRODUCTS
// ==========================================
function loadProducts() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    products.forEach(function(product) {
        grid.appendChild(createProductCard(product));
    });
    console.log('Products loaded:', products.length);
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    
    const rating = getProductRating(product.id);
    const stars = '★'.repeat(Math.floor(rating.average)) + '☆'.repeat(5 - Math.floor(rating.average));
    
    card.innerHTML = 
        '<div class="product-image" style="background-image: url(' + product.image + '); background-size: cover; background-position: center;">' +
            '<span class="product-badge">New</span>' +
        '</div>' +
        '<div class="product-info">' +
            '<h3>' + product.name + '</h3>' +
            '<p>' + product.category.charAt(0).toUpperCase() + product.category.slice(1) + '</p>' +
            '<div class="product-rating-summary">' +
                '<span class="star-rating">' + stars + '</span>' +
                '<span class="rating-count">(' + rating.count + ')</span>' +
            '</div>' +
            '<div class="product-footer">' +
                '<button class="view-reviews-btn" data-product-id="' + product.id + '">View Reviews</button>' +
                '<span class="product-price">₹' + product.price.toFixed(0) + '</span>' +
                '<button class="add-to-cart-btn" data-product-id="' + product.id + '">' +
                    '<i class="fas fa-cart-plus"></i>' +
                '</button>' +
            '</div>' +
        '</div>';
    
    card.querySelector('.add-to-cart-btn').addEventListener('click', function() {
        addToCart(parseInt(this.getAttribute('data-product-id')));
    });
    
    card.querySelector('.view-reviews-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        openReviewModal(parseInt(this.getAttribute('data-product-id')));
    });
    
    return card;
}

function filterProducts() {
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    const priceRange = document.getElementById('price-filter').value;
    const color = document.getElementById('color-filter').value;
    
    const filtered = products.filter(function(product) {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery);
        const matchesCategory = category === 'all' || product.category === category;
        const matchesColor = color === 'all' || product.color === color;
        
        let matchesPrice = true;
        if (priceRange !== 'all') {
            const parts = priceRange.split('-');
            const min = parseFloat(parts[0]);
            const max = parts[1] ? parseFloat(parts[1]) : Infinity;
            matchesPrice = product.price >= min && product.price <= max;
        }
        
        return matchesSearch && matchesCategory && matchesColor && matchesPrice;
    });
    
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    
    if (filtered.length === 0) {
        grid.innerHTML = '<p style="text-align:center;grid-column:1/-1;padding:3rem;color:var(--tan);">No products found</p>';
    } else {
        filtered.forEach(function(product) {
            grid.appendChild(createProductCard(product));
        });
    }
}

// ==========================================
// REVIEWS & RATINGS
// ==========================================
function initializeProductReviews() {
    productReviews = {
        1: [
            { author: 'Rahul K.', rating: 5, text: 'Amazing quality! Fits perfectly and the fabric is great.', date: '5 Oct 2025' },
            { author: 'Priya S.', rating: 4, text: 'Good product, loved the design. Delivery was fast.', date: '3 Oct 2025' }
        ],
        2: [
            { author: 'Amit P.', rating: 5, text: 'Perfect for summer! Very comfortable and stylish.', date: '4 Oct 2025' }
        ],
        3: [
            { author: 'Neha M.', rating: 4, text: 'Great oversized fit. Material is soft and breathable.', date: '2 Oct 2025' },
            { author: 'Rohan T.', rating: 5, text: 'Best t-shirt I have bought! Worth every penny.', date: '1 Oct 2025' }
        ],
        6: [
            { author: 'Vikram R.', rating: 5, text: 'Cool cap! Goes with everything.', date: '30 Sep 2025' }
        ]
    };
}

function getProductRating(productId) {
    const reviews = productReviews[productId] || [];
    if (reviews.length === 0) return { average: 0, count: 0 };
    
    const sum = reviews.reduce(function(total, review) {
        return total + review.rating;
    }, 0);
    
    return {
        average: (sum / reviews.length).toFixed(1),
        count: reviews.length
    };
}

function openReviewModal(productId) {
    selectedReviewProductId = productId;
    const product = products.find(function(p) { return p.id === productId; });
    
    document.getElementById('review-product-name').textContent = product.name + ' - Reviews';
    selectedRating = 0;
    updateStarRating(0);
    document.getElementById('review-name').value = '';
    document.getElementById('review-text').value = '';
    loadReviews(productId);
    openModal(document.getElementById('review-modal'));
}

function loadReviews(productId) {
    const reviewsList = document.getElementById('reviews-list');
    const reviews = productReviews[productId] || [];
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<div class="no-reviews-message">No reviews yet. Be the first to review!</div>';
        return;
    }
    
    reviewsList.innerHTML = '';
    reviews.forEach(function(review) {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        
        reviewItem.innerHTML = 
            '<div class="review-header">' +
                '<span class="review-author">' + review.author + '</span>' +
                '<span class="review-rating">' + stars + '</span>' +
            '</div>' +
            '<div class="review-date">' + review.date + '</div>' +
            '<div class="review-text">' + review.text + '</div>';
        
        reviewsList.appendChild(reviewItem);
    });
}

function updateStarRating(rating) {
    document.querySelectorAll('.star-input').forEach(function(star, index) {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function submitReview() {
    const name = document.getElementById('review-name').value.trim();
    const text = document.getElementById('review-text').value.trim();
    
    if (!name) {
        showToast('Please enter your name', 'error');
        return;
    }
    
    if (!text) {
        showToast('Please write a review', 'error');
        return;
    }
    
    if (selectedRating === 0) {
        showToast('Please select a rating', 'error');
        return;
    }
    
    showLoading();
    setTimeout(function() {
        const newReview = {
            author: name,
            rating: selectedRating,
            text: text,
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        };
        
        if (!productReviews[selectedReviewProductId]) {
            productReviews[selectedReviewProductId] = [];
        }
        
        productReviews[selectedReviewProductId].unshift(newReview);
        loadReviews(selectedReviewProductId);
        selectedRating = 0;
        updateStarRating(0);
        document.getElementById('review-name').value = '';
        document.getElementById('review-text').value = '';
        loadProducts();
        hideLoading();
        showToast('Review submitted successfully!', 'success');
    }, 1000);
}

// ==========================================
// CART - SIZE SELECTION
// ==========================================
function addToCart(productId) {
    const product = products.find(function(p) { return p.id === productId; });
    if (!product) return;
    
    selectedProduct = product;
    selectedSize = null;
    
    document.getElementById('size-product-name').textContent = product.name;
    document.getElementById('size-product-price').textContent = '₹' + product.price.toFixed(0);
    const sizeImage = document.querySelector('.size-product-image');
    sizeImage.style.backgroundImage = 'url(' + product.image + ')';
    sizeImage.style.backgroundSize = 'cover';
    sizeImage.style.backgroundPosition = 'center';
    sizeImage.innerHTML = '';
    
    document.querySelectorAll('.size-option-btn').forEach(function(btn) {
        btn.classList.remove('selected');
    });
    
    openModal(document.getElementById('size-modal'));
}

function confirmAddToCart() {
    if (!selectedProduct) {
        showToast('No product selected', 'error');
        return;
    }
    if (!selectedSize) {
        showToast('Please select a size', 'error');
        return;
    }
    
    const existingItem = cart.find(function(item) {
        return item.id === selectedProduct.id && item.size === selectedSize && !item.custom;
    });
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            quantity: 1,
            size: selectedSize,
            icon: selectedProduct.icon,
            image: selectedProduct.image,
            custom: false
        });
    }
    
    updateCart();
    closeModal(document.getElementById('size-modal'));
    selectedProduct = null;
    selectedSize = null;
    showToast('Added to cart! Size: ' + selectedSize, 'success');
}

// ==========================================
// CART MANAGEMENT
// ==========================================
function updateCart() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    const totalItems = cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '₹0';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(function(item, index) {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        let imageHtml = '<i class="fas ' + item.icon + '"></i>';
        if (item.custom && item.imageData) {
            imageHtml = '<img src="' + item.imageData + '" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">';
        } else if (item.image) {
            imageHtml = '<img src="' + item.image + '" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">';
        }
        
        cartItem.innerHTML = 
            '<div class="cart-item-image">' + imageHtml + '</div>' +
            '<div class="cart-item-details">' +
                '<h4>' + item.name + '</h4>' +
                (item.custom ? '<span style="font-size:0.85rem;color:var(--olive);">Custom Design</span>' : '') +
                (item.size ? '<p class="cart-item-size">Size: ' + item.size + '</p>' : '') +
                '<p class="cart-item-price">₹' + item.price.toFixed(0) + '</p>' +
                '<div class="cart-item-controls">' +
                    '<button class="qty-btn" data-index="' + index + '" data-change="-1"><i class="fas fa-minus"></i></button>' +
                    '<span class="cart-item-qty">' + item.quantity + '</span>' +
                    '<button class="qty-btn" data-index="' + index + '" data-change="1"><i class="fas fa-plus"></i></button>' +
                    '<button class="remove-item" data-index="' + index + '"><i class="fas fa-trash"></i></button>' +
                '</div>' +
            '</div>';
        
        cartItems.appendChild(cartItem);
    });
    
    document.querySelectorAll('.qty-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            updateQuantity(parseInt(this.dataset.index), parseInt(this.dataset.change));
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(function(btn) {
        btn.addEventListener('click', function() {
            removeFromCart(parseInt(this.dataset.index));
        });
    });
    
    cartTotal.textContent = '₹' + total.toFixed(0);
}

function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        updateCart();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    showToast('Item removed from cart', 'success');
}

// ==========================================
// CHECKOUT
// ==========================================
function openCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    const summaryItems = document.getElementById('summary-items');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');
    
    summaryItems.innerHTML = '';
    let subtotal = 0;
    
    cart.forEach(function(item) {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        let itemDetails = item.name + ' x ' + item.quantity;
        if (item.size) itemDetails += ' (Size: ' + item.size + ')';
        summaryItem.innerHTML = '<span>' + itemDetails + '</span><span>₹' + itemTotal.toFixed(0) + '</span>';
        summaryItems.appendChild(summaryItem);
    });
    
    const shipping = 50;
    const total = subtotal + shipping;
    summarySubtotal.textContent = '₹' + subtotal.toFixed(0);
    summaryTotal.textContent = '₹' + total.toFixed(0);
    
    openModal(document.getElementById('checkout-modal'));
}

function placeOrder() {
    // Validate shipping information
    const name = document.getElementById('checkout-name').value.trim();
    const email = document.getElementById('checkout-email').value.trim();
    const phone = document.getElementById('checkout-phone').value.trim();
    const address = document.getElementById('checkout-address').value.trim();
    const city = document.getElementById('checkout-city').value.trim();
    const pin = document.getElementById('checkout-pin').value.trim();
    const state = document.getElementById('checkout-state').value.trim();
    
    // Validate all fields
    if (!name || !email || !phone || !address || !city || !pin || !state) {
        showToast('Please fill all shipping information', 'error');
        return;
    }
    
    // Validate email format
    if (!email.includes('@') || !email.includes('.')) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Validate phone number (10 digits)
    if (phone.length < 10) {
        showToast('Please enter a valid 10-digit phone number', 'error');
        return;
    }
    
    // Validate PIN code (6 digits)
    if (pin.length !== 6 || isNaN(pin)) {
        showToast('Please enter a valid 6-digit PIN code', 'error');
        return;
    }
    
    showLoading();
    
    setTimeout(function() {
        const orderId = 'ORD' + Date.now();
        const orderDate = new Date().toLocaleDateString('en-IN', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        });
        
        const cartTotal = cart.reduce(function(sum, item) {
            return sum + (item.price * item.quantity);
        }, 0) + 50;
        
        const newOrder = {
            id: orderId,
            date: orderDate,
            items: cart.map(function(item) {
                return {
                    name: item.name,
                    quantity: item.quantity,
                    size: item.size,
                    price: item.price
                };
            }),
            total: cartTotal,
            status: 'Processing',
            shippingInfo: {
                name: name,
                email: email,
                phone: phone,
                address: address,
                city: city,
                pin: pin,
                state: state
            }
        };
        
        orderHistory.unshift(newOrder);
        
        // Sync to localStorage for admin
        localStorage.setItem('naroOrders', JSON.stringify(orderHistory));
        
        hideLoading();
        closeModal(document.getElementById('checkout-modal'));
        cart = [];
        updateCart();
        
        // Show success message without confetti
        showToast('Order placed successfully! Redirecting to payment... Order #' + orderId, 'success');
        
        // Clear form
        document.getElementById('checkout-name').value = '';
        document.getElementById('checkout-email').value = '';
        document.getElementById('checkout-phone').value = '';
        document.getElementById('checkout-address').value = '';
        document.getElementById('checkout-city').value = '';
        document.getElementById('checkout-pin').value = '';
        document.getElementById('checkout-state').value = '';
        
        if (isLoggedIn) {
            loadOrderHistory();
        }
        
        // Simulate redirect to payment gateway after 2 seconds
        setTimeout(function() {
            showToast('Payment gateway integration coming soon!', 'success');
        }, 2000);
    }, 1500);
}

function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confetti = [];
    const colors = ['#f5f5dc', '#808000', '#d2b48c', '#8fbc8f', '#8b7355'];
    
    for (let i = 0; i < 150; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 10,
            tiltAngleIncremental: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }
    
    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach(function(p, i) {
            ctx.beginPath();
            ctx.lineWidth = p.r / 2;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
            ctx.stroke();
            p.tiltAngle += p.tiltAngleIncremental;
            p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
            p.x += Math.sin(p.d);
            p.tilt = Math.sin(p.tiltAngle - i / 3) * 15;
            if (p.y > canvas.height) confetti.splice(i, 1);
        });
        if (confetti.length > 0) requestAnimationFrame(drawConfetti);
    }
    drawConfetti();
}

// ==========================================
// CUSTOMIZE SECTION
// ==========================================
function setupCustomizeCanvas() {
    canvas = document.getElementById('preview-canvas');
    ctx = canvas.getContext('2d');
    updateCustomPreview();
}

function updateCustomPreview() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = customDesign.baseColor;
    
    switch(customDesign.productType) {
        case 'tshirt': drawTShirt(); break;
        case 'shorts': drawShorts(); break;
        case 'cap': drawCap(); break;
        case 'socks': drawSocks(); break;
    }
    
    if (customDesign.image) {
        ctx.drawImage(customDesign.image, 120, 180, 160, 160);
    }
    
    if (customDesign.text) {
        ctx.fillStyle = customDesign.textColor;
        ctx.font = 'bold 32px ' + customDesign.textFont;
        ctx.textAlign = 'center';
        ctx.fillText(customDesign.text, 200, 250);
    }
}

function drawTShirt() {
    ctx.beginPath();
    ctx.moveTo(100,100); ctx.lineTo(80,140); ctx.lineTo(100,180);
    ctx.lineTo(100,400); ctx.lineTo(300,400); ctx.lineTo(300,180);
    ctx.lineTo(320,140); ctx.lineTo(300,100); ctx.lineTo(250,80);
    ctx.lineTo(150,80); ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 2; ctx.stroke();
}

function drawShorts() {
    ctx.beginPath();
    ctx.moveTo(120,150); ctx.lineTo(100,350); ctx.lineTo(140,450);
    ctx.lineTo(180,350); ctx.lineTo(200,150); ctx.lineTo(220,350);
    ctx.lineTo(260,450); ctx.lineTo(300,350); ctx.lineTo(280,150);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 2; ctx.stroke();
}

function drawCap() {
    ctx.beginPath();
    ctx.arc(200,200,120,0,Math.PI,true);
    ctx.lineTo(280,220); ctx.lineTo(350,240); ctx.lineTo(350,260);
    ctx.lineTo(50,260); ctx.lineTo(50,240); ctx.lineTo(120,220);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 2; ctx.stroke();
}

function drawSocks() {
    ctx.beginPath();
    ctx.moveTo(150,100); ctx.lineTo(140,400); ctx.lineTo(160,450);
    ctx.lineTo(180,400); ctx.lineTo(170,100); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(230,100); ctx.lineTo(220,400); ctx.lineTo(240,450);
    ctx.lineTo(260,400); ctx.lineTo(250,100); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 2; ctx.stroke();
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            customDesign.image = img;
            updateCustomPreview();
            showToast('Image uploaded successfully!', 'success');
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function resetCustomDesign() {
    customDesign = {
        productType: 'tshirt',
        baseColor: '#f5f5dc',
        text: '',
        textColor: '#000000',
        textFont: 'Arial',
        image: null,
        size: 'M',
        price: 1299
    };
    document.getElementById('custom-text').value = '';
    document.querySelectorAll('.product-type-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelector('.product-type-btn[data-type="tshirt"]').classList.add('active');
    document.querySelectorAll('.color-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelector('.color-btn').classList.add('active');
    document.querySelectorAll('.size-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelector('.size-btn[data-size="M"]').classList.add('active');
    updateCustomPreview();
    showToast('Design reset', 'success');
}

function addCustomToCart() {
    cart.push({
        id: Date.now(),
        name: 'Custom ' + customDesign.productType.charAt(0).toUpperCase() + customDesign.productType.slice(1),
        price: customDesign.price,
        quantity: 1,
        size: customDesign.size,
        icon: 'fa-palette',
        custom: true,
        design: customDesign,
        imageData: canvas.toDataURL()
    });
    updateCart();
    showToast('Custom design added to cart! Size: ' + customDesign.size, 'success');
}

// ==========================================
// ANIMATIONS
// ==========================================
function animateOnScroll() {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(function(el) {
        observer.observe(el);
    });
}

document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});