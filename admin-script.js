// ==========================================
// ADMIN AUTHENTICATION CHECK
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin panel loading...');
    
    // Check if admin is logged in
    const adminData = localStorage.getItem('naroAdminAuth');
    
    if (!adminData) {
        console.log('No admin auth found, redirecting to main site...');
        alert('Please login as admin first!');
        window.location.href = './index.html';
        return;
    }
    
    const admin = JSON.parse(adminData);
    console.log('Admin logged in:', admin.email);
    
    document.getElementById('admin-name').textContent = admin.name;
    document.getElementById('admin-email').textContent = admin.email;
    
    updateClock();
    setInterval(updateClock, 1000);
    
    loadDashboardData();
    setupEventListeners();
});

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(function(item) {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            switchSection(section);
        });
    });
    
    // Logout
    document.getElementById('admin-logout').addEventListener('click', handleLogout);
    
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // Sidebar toggle for mobile
    document.getElementById('sidebar-toggle').addEventListener('click', function() {
        document.getElementById('admin-sidebar').classList.toggle('active');
    });
    
    // Mobile menu button
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            document.getElementById('admin-sidebar').classList.toggle('active');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('admin-sidebar');
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && e.target !== mobileBtn && e.target !== sidebarToggle && 
                !mobileBtn.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
}

function switchSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(function(item) {
        item.classList.remove('active');
    });
    document.querySelector('[data-section="' + sectionName + '"]').classList.add('active');
    
    // Update sections
    document.querySelectorAll('.admin-section').forEach(function(section) {
        section.classList.remove('active');
    });
    document.getElementById(sectionName + '-section').classList.add('active');
    
    // Update title
    const titles = {
        dashboard: 'Dashboard',
        products: 'Products Management',
        orders: 'Orders Management',
        users: 'Users Management',
        reviews: 'Reviews Management',
        settings: 'Settings'
    };
    document.getElementById('page-title').textContent = titles[sectionName];
    
    // Load section data
    loadSectionData(sectionName);
}

// ==========================================
// LOAD DASHBOARD DATA
// ==========================================
function loadDashboardData() {
    // Get data from localStorage
    const orders = JSON.parse(localStorage.getItem('naroOrders') || '[]');
    const users = JSON.parse(localStorage.getItem('naroUsers') || '[]');
    const products = JSON.parse(localStorage.getItem('naroProducts') || '[]');
    
    // Calculate stats
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(function(sum, order) {
        return sum + order.total;
    }, 0);
    const totalProducts = products.length || 12; // Default 12 products
    const totalUsers = users.length;
    
    // Update stats
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('total-revenue').textContent = '₹' + totalRevenue;
    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('total-users').textContent = totalUsers;
    
    // Load recent orders
    loadRecentOrders(orders);
}

function loadRecentOrders(orders) {
    const container = document.getElementById('recent-orders');
    
    if (orders.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:2rem;opacity:0.6;">No orders yet</p>';
        return;
    }
    
    const recentOrders = orders.slice(0, 5);
    container.innerHTML = '';
    
    recentOrders.forEach(function(order) {
        const orderDiv = document.createElement('div');
        orderDiv.style.cssText = 'padding:1rem;border-bottom:1px solid var(--border-color);';
        orderDiv.innerHTML = 
            '<div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">' +
                '<strong>Order #' + order.id + '</strong>' +
                '<span class="status-badge status-' + order.status.toLowerCase() + '">' + order.status + '</span>' +
            '</div>' +
            '<div style="font-size:0.9rem;color:var(--text-light);">' +
                '<div>' + order.date + '</div>' +
                '<div style="font-weight:600;color:var(--primary-green);margin-top:0.25rem;">₹' + order.total + '</div>' +
            '</div>';
        container.appendChild(orderDiv);
    });
}

// ==========================================
// LOAD SECTION DATA
// ==========================================
function loadSectionData(section) {
    switch(section) {
        case 'products':
            loadProducts();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'users':
            loadUsers();
            break;
        case 'reviews':
            loadReviews();
            break;
    }
}

function loadProducts() {
    const container = document.getElementById('products-table');
    const products = JSON.parse(localStorage.getItem('naroProducts') || '[]');
    
    if (products.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:2rem;">No products found</p>';
        return;
    }
    
    let html = '<table><thead><tr>' +
        '<th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>' +
        '</tr></thead><tbody>';
    
    products.forEach(function(product) {
        html += '<tr>' +
            '<td>' + product.id + '</td>' +
            '<td>' + product.name + '</td>' +
            '<td>' + product.category + '</td>' +
            '<td>₹' + product.price + '</td>' +
            '<td>In Stock</td>' +
            '<td>' +
                '<button class="btn btn-sm btn-warning" style="margin-right:0.5rem;">Edit</button>' +
                '<button class="btn btn-sm btn-danger">Delete</button>' +
            '</td>' +
        '</tr>';
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

function loadOrders() {
    const container = document.getElementById('orders-table');
    const orders = JSON.parse(localStorage.getItem('naroOrders') || '[]');
    
    if (orders.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:2rem;">No orders found</p>';
        return;
    }
    
    let html = '<table><thead><tr>' +
        '<th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th>' +
        '</tr></thead><tbody>';
    
    orders.forEach(function(order) {
        const itemsCount = order.items.reduce(function(sum, item) {
            return sum + item.quantity;
        }, 0);
        
        html += '<tr>' +
            '<td><strong>' + order.id + '</strong></td>' +
            '<td>' + order.date + '</td>' +
            '<td>' + itemsCount + ' items</td>' +
            '<td>₹' + order.total + '</td>' +
            '<td><span class="status-badge status-' + order.status.toLowerCase() + '">' + order.status + '</span></td>' +
            '<td>' +
                '<button class="btn btn-sm btn-success" onclick="updateOrderStatus(\'' + order.id + '\', \'shipped\')">Ship</button>' +
                '<button class="btn btn-sm btn-primary" onclick="updateOrderStatus(\'' + order.id + '\', \'delivered\')" style="margin-left:0.5rem;">Deliver</button>' +
            '</td>' +
        '</tr>';
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

function updateOrderStatus(orderId, newStatus) {
    const orders = JSON.parse(localStorage.getItem('naroOrders') || '[]');
    const orderIndex = orders.findIndex(function(o) { return o.id === orderId; });
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
        localStorage.setItem('naroOrders', JSON.stringify(orders));
        showToast('Order status updated to ' + newStatus, 'success');
        loadOrders();
        loadDashboardData();
    }
}

function loadUsers() {
    const container = document.getElementById('users-table');
    const users = JSON.parse(localStorage.getItem('naroUsers') || '[]');
    
    if (users.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:2rem;">No users found</p>';
        return;
    }
    
    let html = '<table><thead><tr>' +
        '<th>Name</th><th>Email</th><th>Registered</th><th>Orders</th><th>Actions</th>' +
        '</tr></thead><tbody>';
    
    users.forEach(function(user) {
        html += '<tr>' +
            '<td>' + user.name + '</td>' +
            '<td>' + user.email + '</td>' +
            '<td>' + user.registeredDate + '</td>' +
            '<td>' + (user.orderCount || 0) + '</td>' +
            '<td>' +
                '<button class="btn btn-sm btn-warning">View Details</button>' +
            '</td>' +
        '</tr>';
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

function loadReviews() {
    const container = document.getElementById('admin-reviews-list');
    const reviews = JSON.parse(localStorage.getItem('naroReviews') || '{}');
    
    let allReviews = [];
    Object.keys(reviews).forEach(function(productId) {
        reviews[productId].forEach(function(review) {
            allReviews.push({
                ...review,
                productId: productId
            });
        });
    });
    
    if (allReviews.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:2rem;">No reviews found</p>';
        return;
    }
    
    container.innerHTML = '';
    allReviews.forEach(function(review, index) {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'admin-review-item';
        
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        
        reviewDiv.innerHTML = 
            '<div class="review-content">' +
                '<div class="review-header-admin">' +
                    '<strong>' + review.author + '</strong>' +
                    '<span class="review-rating-admin">' + stars + '</span>' +
                '</div>' +
                '<div style="font-size:0.85rem;color:var(--text-light);margin-bottom:0.5rem;">' +
                    'Product ID: ' + review.productId + ' | ' + review.date +
                '</div>' +
                '<div>' + review.text + '</div>' +
            '</div>' +
            '<div>' +
                '<button class="btn btn-sm btn-danger" onclick="deleteReview(' + index + ', ' + review.productId + ')">Delete</button>' +
            '</div>';
        
        container.appendChild(reviewDiv);
    });
}

function deleteReview(index, productId) {
    const reviews = JSON.parse(localStorage.getItem('naroReviews') || '{}');
    if (reviews[productId] && reviews[productId][index]) {
        reviews[productId].splice(index, 1);
        localStorage.setItem('naroReviews', JSON.stringify(reviews));
        showToast('Review deleted successfully', 'success');
        loadReviews();
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('naroAdminAuth');
        window.location.href = 'index.html';
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('#theme-toggle i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
}

function showToast(message, type) {
    const toast = document.getElementById('admin-toast');
    toast.textContent = message;
    toast.className = 'toast show ' + (type || 'success');
    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

function updateClock() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    const timeString = now.toLocaleDateString('en-IN', options);
    const clockElement = document.getElementById('current-time');
    if (clockElement) {
        clockElement.textContent = timeString;
    }
}