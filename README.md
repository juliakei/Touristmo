# TOURISTMO — Tourism Information and Booking Management System

TOURISTMO is a full-stack, responsive web application and REST API designed to help tourists discover destinations, explore tourism packages, find tour guides, and make secure reservations, complete with administrative and tour guide portals.

The project strictly aligns with the academic laboratory requirements:
- **Laboratory 03**: System Architecture (Client-Server 3-tier architecture with Express REST API and MySQL).
- **Laboratory 04**: Database Design (Relational schema with 6 core entities, primary/foreign keys, and referential integrity).
- **Laboratory 05**: REST API Design (`/api/v1` RESTful endpoints with query filtering, HTTP status codes, and standard error responses).
- **Laboratory 06**: Security & Authentication (JWT authentication, bcrypt password hashing, and Role-Based Access Control).

---

## Project Structure

```text
touristmo/
|-- backend/
|   |-- config/
|   |   |-- db.js
|   |-- controllers/
|   |   |-- authController.js
|   |   |-- destinationController.js
|   |   |-- packageController.js
|   |   |-- guideController.js
|   |   |-- bookingController.js
|   |   |-- paymentController.js
|   |-- middleware/
|   |   |-- auth.js
|   |-- routes/
|   |   |-- authRoutes.js
|   |   |-- destinationRoutes.js
|   |   |-- packageRoutes.js
|   |   |-- guideRoutes.js
|   |   |-- bookingRoutes.js
|   |   |-- paymentRoutes.js
|   |-- .env
|   |-- .env.example
|   |-- package.json
|   |-- server.js
|-- database/
|   |-- schema.sql
|-- frontend/
|   |-- assets/
|   |   |-- js/api.js
|   |   |-- styles/main.css
|   |-- index.html
|   |-- login.html
|   |-- register.html
|   |-- tourist-dashboard.html
|   |-- admin-dashboard.html
|   |-- guide-dashboard.html
|-- README.md
```

---

## Getting Started & Installation Guide

### Prerequisites
- Node.js (v18+ recommended)
- MySQL Server (XAMPP, WampServer, or native MySQL)

### Step 1: Database Setup
1. Open your MySQL client (phpMyAdmin, MySQL Workbench, or MySQL CLI).
2. Import the schema file located at `database/schema.sql`:
   ```sql
   SOURCE path/to/database/schema.sql;
   ```
   This creates the `touristmo_db` database, tables (`tourists`, `admins`, `tour_guides`, `destinations`, `packages`, `bookings`, `payments`), and seeds initial mock records.

### Step 2: Backend Setup & Execution
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `backend/.env` (if needed, default matches local MySQL root without password):
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=touristmo_db
   JWT_SECRET=touristmo_super_secret_jwt_key_2026
   ```
4. Start the backend server:
   ```bash
   npm start
   # or dev mode:
   npm run dev
   ```
   The API server will run on `http://localhost:5000`.

### Step 3: Frontend Access
Open any of the frontend HTML files in your browser (or serve via Live Server / http-server):
- **Public Home**: `frontend/index.html`
- **Login**: `frontend/login.html`
- **Register**: `frontend/register.html`
- **Tourist Dashboard**: `frontend/tourist-dashboard.html`
- **Admin Dashboard**: `frontend/admin-dashboard.html`
- **Tour Guide Portal**: `frontend/guide-dashboard.html`

---

## Default Seed Credentials for Testing

- **Administrator**:
  - Email: `admin@touristmo.com`
  - Password: `admin123`
- **Tour Guide**:
  - Email: `tane.guide@touristmo.com`
  - Password: `password`
- **Tourist**:
  - Email: `juan@example.com`
  - Password: `password` (or register a new tourist account via `register.html`)

---

## Summary of REST API Endpoints (`/api/v1`)
Total of 22 endpoints covering System Health, Authentication, Destinations, Packages, Tour Guides, Bookings, and Payments.
