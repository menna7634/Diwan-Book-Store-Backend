# 📚 Diwan Bookstore — Backend API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

**RESTful API for the Diwan online bookstore, built with Node.js, Express, and MongoDB.**

</div>

---

## ✨ Features

- 🔐 JWT authentication with access & refresh tokens
- 📧 Optional email verification and password reset via Gmail
- 🛍️ Books catalog with full-text search, filters, and pagination
- 🛒 Per-user shopping cart with quantity management
- 📦 Order placement with stock validation and status transitions
- ⭐ Reviews — only for delivered purchases, one per user per book
- 🖼️ Book cover image upload via Cloudinary
- 🛡️ Rate limiting, Helmet security headers, CORS
- 📋 Structured logging with Pino

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens) |
| Validation | Joi |
| Image Upload | Cloudinary + Multer |
| Email | Nodemailer (Gmail) |
| Logging | Pino + pino-pretty |
| Security | Helmet, express-rate-limit, CORS |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `18+`
- MongoDB instance (local or Atlas)
- Cloudinary account
- Gmail account (optional, for email verification)

### Installation

```bash
git clone https://github.com/menna7634/diwan-backend.git
cd diwan-backend
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
NODE_ENV=development
PORT=3000

MONGODB_URL=mongodb://localhost:27017/diwan
FRONTEND_URL=http://localhost:4200

JWT_SECRET=your_jwt_secret_here
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30

# Email Verification (optional)
ENABLE_EMAIL_VERIFICATION=false
VERIFICATION_TOKEN_EXPIRATION_HOURS=24
MAIL_GMAIL_USER=your@gmail.com
MAIL_APP_PASSWORD=your_app_password

# Cloudinary (required)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Logger
LOGGER_ENABLED=true
LOGGER_LEVEL=info
```

### Run

```bash
# Development
npm run dev

# Production
npm start
```

Server runs on **http://localhost:3000**

### Seed Database

```bash
node src/database/seeders/seed.js
```

> ⚠️ This will **drop the database** and reseed with sample data (users, books, orders, etc.)

---

## 📁 Project Structure

```
src/
├── app.js                  # Express app setup
├── server.js               # Entry point
├── routes/
│   └── index.js            # Route aggregator
├── database/
│   ├── connection.js
│   ├── models/             # Mongoose models
│   └── seeders/            # DB seeders
├── modules/
│   ├── auth/               # Login, register, tokens
│   ├── users/              # Profile routes
│   ├── books/              # Books CRUD
│   ├── authors/            # Authors CRUD
│   ├── categories/         # Categories CRUD
│   ├── cart/               # Cart management
│   ├── orders/             # Order placement & status
│   └── reviews/            # Book reviews
└── shared/
    ├── config/             # Environment config
    ├── middleware/         # Auth, rate limiter, notFound
    ├── services/           # Mail service
    └── utils/              # Helpers (pagination, errors, logger, cloudinary)
```

---

## 🗺️ API Endpoints

### Auth — `/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/login` | Login | Public |
| POST | `/auth/register` | Register | Public |
| POST | `/auth/refresh` | Refresh access token | Public |
| POST | `/auth/logout` | Logout | 🔒 User |
| GET | `/auth/verify?token=` | Verify email | Public |
| POST | `/auth/forget-password` | Request password reset | Public |
| POST | `/auth/reset-password` | Reset password with token | Public |

### Profile — `/profile`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/profile` | Get own profile | 🔒 User |
| PATCH | `/profile` | Update profile / change password | 🔒 User |

### Books — `/books`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/books` | List books (search, filter, paginate) | Public |
| GET | `/books/:id` | Get single book | Public |
| POST | `/books` | Create book (with cover image) | 🔑 Admin |
| PATCH | `/books/:id` | Update book | 🔑 Admin |
| DELETE | `/books/:id` | Delete book | 🔑 Admin |

**Query params for `GET /books`:** `page`, `limit`, `search`, `sort`, `order`, `minPrice`, `maxPrice`, `authorIds`, `categoryIds`, `categoryMode`

### Authors — `/authors`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/authors` | List authors | Public |
| POST | `/authors` | Create author | 🔑 Admin |
| PATCH | `/authors/:id` | Update author | 🔑 Admin |

### Categories — `/categories`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/categories` | List categories | Public |
| POST | `/categories` | Create category | 🔑 Admin |
| PUT | `/categories/:id` | Update category | 🔑 Admin |
| DELETE | `/categories/:id` | Delete category | 🔑 Admin |

### Cart — `/cart`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/cart` | Get cart | 🔒 User |
| POST | `/cart/items` | Add item | 🔒 User |
| PATCH | `/cart/items/:bookId` | Set quantity | 🔒 User |
| PATCH | `/cart/items/:bookId/increase` | Increase quantity | 🔒 User |
| PATCH | `/cart/items/:bookId/decrease` | Decrease quantity | 🔒 User |
| DELETE | `/cart/items/:bookId` | Remove item | 🔒 User |
| DELETE | `/cart` | Clear cart | 🔒 User |

### Orders — `/order`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/order` | Place order | 🔒 User |
| GET | `/order/my` | Get my orders | 🔒 User |
| GET | `/order/:orderId` | Get order by ID | 🔒 User |
| GET | `/order` | Get all orders | 🔑 Admin |
| PATCH | `/order/:orderId` | Update order/payment status | 🔑 Admin |

### Reviews — `/reviews`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/reviews?book_id=` | Get book reviews | Public |
| POST | `/reviews` | Add review | 🔒 User |
| DELETE | `/reviews/:id` | Delete own review | 🔒 User |

> ℹ️ Users can only review books they have **purchased and received** (order status: `delivered`)

---

## 🔄 Status Transitions

**Order Status:**
```
placed → processing → shipped → delivered
              ↓
           cancelled
```

**Payment Status:**
```
pending → paid → refunded
       ↓
     failed
```

---

## 🔒 Security

- Rate limiting: 100 req / 15 min globally; stricter limits on auth routes (5 req / 15 min)
- Helmet security headers on all responses
- JWT tokens verified on every protected route
- Passwords hashed with bcrypt (12 rounds)
- Sensitive fields redacted from logs (`password`, `Authorization` header)

---

## 👥 Team

| GitHub | Name |
|---|---|
| [@bieno12](https://github.com/bieno12) | Zeyad Shahin |
| [@Mostafa-Khalifaa](https://github.com/Mostafa-Khalifaa) | Mostafa Khalifa |
| [@menna7634](https://github.com/menna7634) | Menna Mohamed |
| [@Khaleddd11](https://github.com/Khaleddd11) | Khaled Cherif |

---

## 📄 License

This project is for educational purposes.
