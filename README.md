#  Delish - Food Delivery Website

**Group Number:** 23  
**Team Members:**  
- John Michael (S20220010054)  
- Rishika (S20220010211)  
- Aneesh (S20220010016)  
- Rahul Tarachand (S20220010223)  
- Mohiuddin (S20220010199)

---

##  Project Overview

Delish is a full-stack food delivery web application that enables users to discover, order food, and manage their food preferences seamlessly. The application also includes distinct dashboards for restaurant partners and admins, enabling robust food item management and order tracking. Built using modern web technologies (React, Node.js, MongoDB), it offers a dynamic and responsive user experience across all platforms.

---

## Features

- **Landing Page**: Visually appealing and responsive.
- **Profile Page**: Update user info, reset password.
- **Authentication**: Secure user & admin registration/login using JWT.
- **Food Catalog**: Browse food items with filters and prices.
- **Cart System**: Add, update, and remove items.
- **Search**: Quick search by name or category.
- **Order Placement**: Secure checkout and history tracking.
- **User Dashboard**: View orders, manage profile.
- **Admin Dashboard**: Manage food items and monitor orders.
- **Restaurant Dashboard**: Handle menu and orders from customers.
- **Mock Payment Page**: Simulated payment gateway for testing.
- **State Management**: Redux for scalable state handling.
- **React Hooks**: Manage UI state and lifecycle.
- **CSS Modules**: Mobile-first modular styling.
- **Forms & Listeners**: Validated and interactive forms.

---

##  Tech Stack

### Frontend:
- React, JavaScript
- Redux (State Management)
- CSS Modules

### Backend:
- Node.js, Express.js
- MongoDB Atlas, Mongoose
- JWT (Authentication)
- Handlebars (for Admin Panel)

---

##  Installation

### Prerequisites
- Node.js and npm
- MongoDB Atlas account
- Redis installed (for caching)

---

##  How to Run the Project

###  Option 1: Manual (Local) Setup

#### Clone the repo
```bash
git clone https://github.com/JohnMichael0311/DELISH_APP.git
cd DELISH_APP
````

####  Backend Setup

```bash
cd backend/src
npm install
```

Create a `.env` file in `backend/src/` with:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/Delish
JWT_SECRET=your_secret_key
```

Start Redis (in another terminal):

```bash
redis-server
```

Run backend:

```bash
npm run dev
```

####  Frontend Setup

```bash
cd ../../frontend
npm install
npm start
```

---

###  Option 2: Dockerized Setup (Recommended for Deployment/Test)

#### Requirements:

* Docker
* Docker Compose

#### Steps:

1. At root level of the repo, run:

```bash
docker-compose up --build
```

2. Access the application:

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend API: [http://localhost:5000](http://localhost:5000)
* Swagger Docs: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

## 🔗 Usage

* **Frontend**: [http://localhost:3000](http://localhost:3000)
* **Backend**: [http://localhost:5000](http://localhost:5000)

---

##  Final Enhancements for Review

###  Swagger Documentation

* Implemented for all RESTful APIs (Users, Orders, Food, Auth, Admin).
* Live interactive docs available at `/api-docs`.

###  GraphQL Integration

* Implemented with `express-graphql`.
* Supports flexible queries for dashboard views and nested data.

### Redis Caching

* Food catalog and search results cached using Redis.
* **Performance Improvement**: From \~600ms → \~50ms (10x faster response).

###  MongoDB Query Optimization

* Added indexes to fields like `food.name`, `user.email`, `order.status`.
* Used `.explain()` to optimize query plans and improve speed.

###  Unit Testing

* Tools: Jest, Supertest
* Coverage for: Auth, Cart, Order APIs, Search
* Test report available under `/tests/coverage`.

###  Docker Support

* Dockerized frontend and backend with `docker-compose.yml`.
* Simplifies deployment and testing across environments.

###  Continuous Integration (CI/CD)

* Configured with **GitHub Actions**
* Runs linting, tests, and deployment automatically.

###  Deployment

* **Frontend**: [Deployed on Vercel](https://vercel.com/)
* **Backend**: Deployed via Render or Railway
* All features functional in deployed environment.

---

##  B2B and B2C in Delish

###  B2B (Business to Business)

* Restaurant partners get their own dashboards to:

  * Add/edit/delete food items
  * View customer orders and statuses
* Future-ready for third-party integrations via APIs

  * e.g., Export order data to CRM, sync menu with inventory tools

###  B2C (Business to Consumer)

* End-users can:

  * Browse and order food
  * Manage cart and profile
  * Track orders and view history
* Fast search, seamless UI, secure order flow with JWT and cache enhancements

---

##  Future Enhancements

* Integration with a real payment gateway (e.g., PayPal, Stripe)
* Real-time order tracking and delivery updates via WebSockets
* Push notifications (web/mobile)
* Dynamic pricing/offers system for restaurants

---

##  License

This project is licensed under the **MIT License**.

---

##  Repository

[GitHub - DELISH\_APP](https://github.com/JohnMichael0311/delishAPP)

```
