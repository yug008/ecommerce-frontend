# 🛒 ShopEase - Ecommerce Frontend

A modern and responsive ecommerce frontend built with React and Tailwind CSS, featuring a complete shopping experience with cart management, Razorpay payment integration, and an admin panel.

## 🔗 Links
- **Live Site:** https://ecommerce-frontend-orcin-omega.vercel.app
- **Backend Repo:** https://github.com/yug008/ecommerce-backend
- **Frontend Repo:** https://github.com/yug008/ecommerce-frontend
  
## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | Frontend Framework |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Axios | API Calls |
| React Router DOM | Navigation |
| Razorpay Checkout JS | Payment UI |
| React Hot Toast | Notifications |
| Lucide React | Icons |
| Vercel | Deployment |

## ✨ Features

- 🔐 JWT Authentication (Register/Login)
- 🛍️ Product Listing with Search and Category Filter
- 🛒 Cart Management (Add, Remove, Clear)
- 📦 Order Placement with Delivery Address
- 💳 Razorpay Payment Integration
- 📋 Order History with Status Tracking
- 👨‍💼 Admin Panel (Add, Edit, Delete Products)
- 📱 Fully Responsive Design

## 📸 Pages

```
/           → Home (Products, Categories, Hero)
/login      → Login
/register   → Register
/cart       → Cart & Checkout
/orders     → Order History
/admin      → Admin Panel (Admin only)
```

## 🚀 Run Locally

```bash
# Clone the repo
git clone https://github.com/yug008/ecommerce-frontend.git

# Navigate to project
cd ecommerce-frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## ⚙️ Environment Variables

Create `.env` file in root:
```env
VITE_API_URL=http://localhost:8080
```

For production create `.env.production`:
```env
VITE_API_URL=https://your-backend.onrender.com
```

## 💳 Payment Flow

```
1. User adds products to cart
2. Proceeds to checkout → enters address
3. Backend creates Razorpay order
4. Razorpay checkout popup opens
5. User pays → payment verified by backend
6. Order status updated to PAID
7. Redirected to order history
```

## 👨‍💻 Author
**Yug Mehta**
- GitHub: [@yug008](https://github.com/yug008)
