# Padma Sai Sarees Home - E-Commerce Platform

A modern, responsive e-commerce web application built for Padma Sai Sarees Home using Next.js 14, MongoDB, and Tailwind CSS. The platform features user authentication, a comprehensive product catalog, shopping cart functionality, mock checkout, and an admin dashboard.

## 🚀 Key Features

*   **Modern Hero UI**: Responsive landing page with featured collections and new arrivals.
*   **Product Catalog**: Robust filtering (Category, Price), sorting, and search capabilities.
*   **Product Details**: High-quality image gallery, size/color selection, and detailed descriptions.
*   **Shopping Cart**: Real-time cart management with local storage persistence.
*   **Checkout**: Seamless checkout flow with address form and order summary (Mock Payment).
*   **User Authentication**: Secure Sign Up and Login using NextAuth.js (Credentials).
*   **Admin Panel**:
    *   Dashboard with Sales/Order statistics.
    *   Product Management (List & Add).
    *   Order Management (View Status).
*   **Responsive Design**: Mobile-first approach using Tailwind CSS.

## 🛠 Tech Stack

*   **Frontend**: Next.js 14 (App Router), React, TypeScript
*   **Styling**: Tailwind CSS v4, Lucide React (Icons), Framer Motion
*   **Backend**: Next.js Server Actions & API Routes
*   **Database**: MongoDB (with Mongoose ODM)
*   **Auth**: NextAuth.js v5 (Beta)
*   **Performance**: Server-Side Rendering (SSR) & Static Generation (SSG)

## ⚙️ Setup Instructions

### Prerequisites
*   Node.js (v18+)
*   MongoDB Instance (Local or Atlas)

### 1. Clone & Install
```bash
git clone <repo-url>
cd padmasaisaresshome
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:

```env
MONGODB_URI="mongodb://localhost:27017/padmasaisaresshome"
AUTH_SECRET="your_secret_key_here_at_least_32_chars"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Seed Database (Important!)
To populate the database with dummy categories, products, and a default admin user:
1.  Run the development server: `npm run dev`
2.  Open your browser and visit: `http://localhost:3000/api/seed`
3.  You should see a JSON response confirming success.

**Default Accounts:**
*   **Admin**: `admin@example.com` / `123456`
*   **User**: `user@example.com` / `123456`

### 4. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` to browse the shop.

## 📂 Project Structure

```
/src
  /app          # Next.js App Router
    /api        # API Routes (Seed, Orders, Auth)
    /(admin)    # Admin Dashboard Pages
    /(shop)     # Shop Pages (optional grouping)
    /login      # Auth Pages
  /components   # Reusable UI Components
    /shared     # Navbar, Footer, CartProvider
    /shop       # ProductCard, Gallery, Filters
  /lib          # Utilities (DB, Auth)
  /models       # Mongoose Schemas (User, Product, Order)
```

## 📝 Admin Guide

1.  Log in with the Admin credentials.
2.  Navigate to `/admin` to see the dashboard.
3.  Go to `Products` to manage inventory.
4.  Go to `Orders` to view incoming orders.

## 💳 Payment Note
This demo uses a Mock Payment implementation. No real charges are processed. The structure is ready for Stripe/Razorpay integration.
