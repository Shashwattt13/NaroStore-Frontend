# 🛍️ Naro Store - Modern E-Commerce Platform

A beautiful, feature-rich e-commerce website for GenZ fashion with a powerful admin dashboard. Built with vanilla HTML, CSS, and JavaScript - no frameworks needed!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Features

### 🎨 Customer Website
- **Modern UI/UX**: Minimalist design with smooth animations and transitions
- **Product Catalog**: Browse 12+ products across multiple categories (T-shirts, Shorts, Caps, Socks)
- **Product Reviews & Ratings**: ⭐ Interactive review system with 5-star ratings
- **Custom Product Designer**: 🎨 Live canvas editor to customize products
  - Upload custom images
  - Add text with font and color selection
  - Choose from 6 pastel colors
  - Select product type and size
  - Real-time preview
- **Smart Shopping Cart**: 
  - Size selection modal
  - Quantity management
  - Real-time total calculation
  - Persistent cart data
- **User Authentication**:
  - Login/Signup with Gmail validation
  - Forgot password feature
  - User profile management
  - Order history tracking
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Search & Filters**: Advanced product filtering by category, price, and color
- **Checkout System**: Complete order flow with confetti animation 🎉

### 👨‍💼 Admin Dashboard
- **Secure Authentication**: Admin-only access with credentials
- **Analytics Dashboard**:
  - Total orders, revenue, products, users
  - Recent orders list
  - Top products chart
  - Live clock with date/time
  - Welcome banner
- **Order Management**:
  - View all customer orders
  - Update order status (Processing → Shipped → Delivered)
  - Filter by status
  - Order tracking
- **Product Management**:
  - View all products
  - Edit/Delete products
  - Stock management
- **User Management**:
  - View registered users
  - User statistics
  - Order count per user
- **Review Moderation**:
  - View all product reviews
  - Delete inappropriate reviews
  - Monitor customer feedback
- **Settings Panel**: Store configuration and shipping settings
- **Mobile Responsive**: Hamburger menu, optimized layouts

## 🚀 Live Demo

[View Live Demo](#) *(Add your GitHub Pages link here)*

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: LocalStorage for data persistence
- **Icons**: Font Awesome 6.4.0
- **Design**: Custom CSS with CSS Variables for theming

## 📁 Project Structure

```
Naro-Store/
│
├── index.html              # Main customer website
├── style.css               # Main website styles
├── script.js               # Main website JavaScript
│
├── admin.html              # Admin dashboard
├── admin-style.css         # Admin dashboard styles
├── admin-script.js         # Admin dashboard JavaScript
│
└── README.md               # This file
```

## 🔧 Installation & Setup

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code, Sublime Text, etc.)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/naro-store.git
   cd naro-store
   ```

2. **Open the project**
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx http-server
     
     # Using VS Code Live Server extension
     Right-click index.html → Open with Live Server
     ```

3. **Access the website**
   - Customer Site: `http://localhost:8000/index.html`
   - Admin Panel: `http://localhost:8000/admin.html`

## 👤 Default Credentials

### Admin Login
- **Email**: `admin@narostore.com`
- **Password**: `admin123`

### Customer Login
- Any Gmail address (e.g., `user@gmail.com`)
- Any password (demo mode)

## 💡 Usage Guide

### For Customers

1. **Browse Products**
   - Navigate to Shop section
   - Use filters to find products
   - View ratings and reviews

2. **Customize Products**
   - Go to Customize section
   - Select product type
   - Choose color and size
   - Add text or upload image
   - Preview in real-time
   - Add to cart

3. **Place Orders**
   - Add products to cart
   - Select size for each item
   - Proceed to checkout
   - Fill shipping information
   - Confirm order

4. **Write Reviews**
   - Click "View Reviews" on any product
   - Rate with 1-5 stars
   - Write your review
   - Submit

### For Admin

1. **Login**
   - Click user icon on main website
   - Switch to "Admin" tab
   - Enter admin credentials
   - Redirects to admin dashboard

2. **Manage Orders**
   - View all customer orders
   - Update status to Shipped/Delivered
   - Track order details

3. **Moderate Reviews**
   - View all reviews
   - Delete inappropriate content

4. **Monitor Analytics**
   - Check total orders and revenue
   - View recent activity
   - Track user statistics

## 🎨 Color Palette

```css
--primary-green: #3d6b5e    /* Main brand color */
--dark-green: #2d5f4f       /* Darker shade */
--light-green: #5a9b87      /* Lighter shade */
--beige: #f5f5dc            /* Accent color */
--cream: #fffef9            /* Background */
--tan: #d2b48c              /* Secondary accent */
```

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: 480px - 768px
- **Small Mobile**: < 480px

## ✅ Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔐 Security Features

- Gmail-only authentication validation
- Password strength requirements (min 6 characters)
- Admin authentication with localStorage
- Input validation and sanitization
- Secure session management

## 📊 Data Storage

This project uses **localStorage** for data persistence:

- `naroOrders` - Customer orders
- `naroUsers` - Registered users
- `naroReviews` - Product reviews
- `naroProducts` - Product catalog
- `naroAdminAuth` - Admin authentication

**Note**: Data is stored locally in the browser. Clearing browser data will reset everything.

**Made with ❤️ for the community**

