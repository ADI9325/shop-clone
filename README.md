# 🛒 ShopClone - E-commerce Website
A modern, responsive e-commerce web application built with React and Vite, featuring a complete shopping experience with product browsing, cart management, and checkout functionality.

## 🌟 Features

### 🏪 Core E-commerce Functionality
- **Product Catalog** - Browse thousands of products with categories
- **Product Search** - Real-time search with filters and sorting
- **Shopping Cart** - Add, remove, and manage cart items
- **Product Details** - Detailed product pages with image galleries
- **Responsive Design** - Optimized for desktop, tablet, and mobile

### 🎨 User Interface
- **Modern Design** - Clean, professional UI with smooth animations
- **Category Browsing** - Filter products by categories
- **Price Filtering** - Search by price range and ratings
- **Sticky Navigation** - Enhanced user experience with sticky filters
- **Loading States** - Smooth loading animations and error handling

### 🛍️ Shopping Experience
- **Persistent Cart** - Cart items saved in localStorage
- **Real-time Updates** - Dynamic cart counter and totals
- **Promo Codes** - Discount system with promotional codes
- **Checkout Process** - Complete checkout flow with order summary
- **Free Shipping** - Automatic free shipping on orders over $50

## 🚀 Demo

Visit the live demo: [ShopClone Demo](https://shop-clone-fyfi.onrender.com)

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: Platzi Fake Store API
- **State Management**: React Context API
- **Storage**: localStorage for cart persistence

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
git clone https://github.com/ADI9325/shop-clone.git


2. **Install dependencies**

   npm install

3. **Start the development server**
   npm run dev


4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

shopclone/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   └── Modal.jsx
│   │   ├── product/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   └── ProductFilter.jsx
│   │   ├── cart/
│   │   │   ├── Cart.jsx
│   │   │   ├── CartItem.jsx
│   │   │   ├── CartSummary.jsx
│   │   │   └── MiniCart.jsx
│   │   └── auth/
│   │       ├── Login.jsx
│   │       └── Signup.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetailsPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── Checkout.jsx
│   │   ├── About.jsx
│   │   └── NotFound.jsx
│   ├── context/
│   │   └── CartContext.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md

## 🎯 Key Components

### CartContext
Manages global cart state with localStorage persistence:
- Add/remove items
- Update quantities
- Calculate totals
- Apply discounts

### API Service
Centralized API management for:
- Product fetching
- Category management
- Search functionality
- Error handling

### Responsive Design
- Mobile-first approach
- Sticky navigation
- Animated interactions
- Modern UI patterns

## 🌐 API Integration

This project uses the [Platzi Fake Store API](https://fakeapi.platzi.com/) for product data:

- **Products**: `https://api.escuelajs.co/api/v1/products`
- **Categories**: `https://api.escuelajs.co/api/v1/categories`
- **Users**: `https://api.escuelajs.co/api/v1/users`
- **Authentication**: `https://api.escuelajs.co/api/v1/auth`

## 🎨 Features Showcase

### Smart Search & Filtering
- Real-time search with debouncing
- Category-based filtering
- Price range selection
- Rating-based filtering
- Sort by price, name, date

### Shopping Cart
- Persistent storage across sessions
- Real-time cart updates
- Quantity management
- Promo code system
- Shipping calculation
- Tax calculation

### User Experience
- Smooth page transitions
- Loading animations
- Error handling with retry options
- Mobile-responsive design
- Accessibility features

## 🚀 Available Scripts

# Development
npm run dev          # Start development server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint


## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

VITE_API_BASE_URL=https://api.escuelajs.co/api/v1


### Tailwind Configuration
The project uses custom Tailwind configuration for:
- Custom colors
- Extended spacing
- Animation utilities
- Responsive design


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- [Platzi Fake Store API](https://fakeapi.platzi.com/) for providing the product data
- [Lucide React](https://lucide.dev/) for the beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the fast build tool

## 📞 Contact

Aditya Bagade - [adityabagade04@gmail.com]

Project Link: [https://github.com/ADI9325/shop-clone](https://github.com/ADI9325/shop-clone)


⭐ **Star this repository if you found it helpful!**