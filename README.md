# ALGUD - Luxury Fashion E-commerce

A complete full-stack MERN e-commerce application for luxury clothing brand ALGUD.

## Features

- **Frontend**: React with Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express, MongoDB with Mongoose
- **Authentication**: JWT-based auth with role-based access
- **Payments**: Cashfree payment gateway integration
- **Admin Panel**: Complete product and order management
- **Image Hosting**: Google Drive integration for product images

## Quick Start

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/algud
JWT_SECRET=Algud@2026
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_ENV=sandbox
```

4. Start the server:
```bash
npm start
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file with:
```
VITE_API_URL=https://algud-server.onrender.com/api/api
```

4. Start the development server:
```bash
npm run dev
```

## Default Admin Credentials

- Email: `admin@algud.com`
- Password: `algud@admin`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user/admin
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/user` - Get user orders
- `GET /api/orders/admin` - Get all orders (admin)
- `PUT /api/orders/admin/:id` - Update order status (admin)

### Payment
- `POST /api/payment/create` - Create payment session
- `POST /api/payment/verify` - Verify payment

### Admin
- `GET /api/admin/revenue` - Get revenue analytics
- `GET /api/admin/dashboard` - Get dashboard stats

## Google Drive Image URLs

Use direct-view URLs for product images:
```
https://drive.google.com/uc?export=view&id=YOUR_FILE_ID
```

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS, Axios, React Router DOM, Chart.js
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- **Payment**: Cashfree
- **Image Hosting**: Google Drive

## Project Structure

```
algud/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
└── client/
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── pages/
    │   ├── services/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## License

MIT License
