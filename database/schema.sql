-- TOURISTMO Database Schema
-- Aligned with Laboratory 04 Requirements

DROP DATABASE IF EXISTS touristmo_db;
CREATE DATABASE touristmo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE touristmo_db;

-- 1. Tourists Table
CREATE TABLE tourists (
    tourist_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Administrators Table
CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Tour Guides Table
CREATE TABLE tour_guides (
    guide_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    specialization VARCHAR(100),
    bio TEXT,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Destinations Table
CREATE TABLE destinations (
    destination_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    price_guide DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. Packages Table
CREATE TABLE packages (
    package_id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration_days INT NOT NULL,
    max_participants INT NOT NULL,
    start_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_package_destination FOREIGN KEY (destination_id) REFERENCES destinations(destination_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Bookings Table
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    tourist_id INT NOT NULL,
    package_id INT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    participants_count INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_tourist FOREIGN KEY (tourist_id) REFERENCES tourists(tourist_id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_package FOREIGN KEY (package_id) REFERENCES packages(package_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Payments Table
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Completed',
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Seed Initial Data
-- Default Admin: admin@touristmo.com / admin123 (hashed with bcrypt)
INSERT INTO admins (username, email, password_hash) VALUES
('admin', 'admin@touristmo.com', '$2b$10$39B2H0y28XzBfJ4aBvH8.u0H7yKx9fJ4aBvH8.u0H7yKx9fJ4aBvH8'); -- Note: we will insert real bcrypt hash in seeder/setup or startup script

-- Default Destinations
INSERT INTO destinations (name, description, location, price_guide, image_url) VALUES
('Bora Bora Tropical Escape', 'Experience crystal clear turquoise waters, overwater bungalows, and world-class coral reefs.', 'French Polynesia', 1200.00, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'),
('Swiss Alps Mountain Adventure', 'Majestic peaks, scenic train rides, pristine alpine lakes, and world-renowned ski resorts.', 'Switzerland', 950.00, 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99'),
('Kyoto Cultural Heritage', 'Ancient Buddhist temples, stunning Zen gardens, traditional wooden houses, and cherry blossoms.', 'Japan', 800.00, 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e');

-- Default Tour Guides
INSERT INTO tour_guides (first_name, last_name, email, password_hash, phone, specialization, bio, status) VALUES
('Tane', 'Tehea', 'tane.guide@touristmo.com', '$2b$10$39B2H0y28XzBfJ4aBvH8.u0H7yKx9fJ4aBvH8.u0H7yKx9fJ4aBvH8', '+68940123456', 'Marine Life & Snorkeling', 'Born and raised in Bora Bora with 10+ years of marine guiding experience.', 'Active'),
('Hans', 'Mueller', 'hans.guide@touristmo.com', '$2b$10$39B2H0y28XzBfJ4aBvH8.u0H7yKx9fJ4aBvH8.u0H7yKx9fJ4aBvH8', '+41223344556', 'Alpine Trekking', 'Certified mountain guide specializing in high-altitude safety and Swiss history.', 'Active');

-- Default Packages
INSERT INTO packages (destination_id, title, description, price, duration_days, max_participants, start_date) VALUES
(1, '7-Day Bora Bora Luxury Lagoon Retreat', 'All-inclusive overwater bungalow stay with guided snorkeling and sunset catamaran cruises.', 2499.00, 7, 12, '2026-06-01'),
(2, '5-Day Swiss Alps Glacier Express Tour', 'Scenic railway journey through the Alps with expert trekking and luxury alpine chalet accommodation.', 1899.00, 5, 15, '2026-07-10'),
(3, '6-Day Kyoto Heritage & Tea Ceremony', 'Immersive cultural tour exploring historic temples, tea ceremonies, and Arashiyama bamboo forest.', 1599.00, 6, 10, '2026-09-15');

-- Default Tourist
INSERT INTO tourists (first_name, last_name, email, password_hash, phone) VALUES
('Juan', 'Dela Cruz', 'juan@example.com', '$2b$10$39B2H0y28XzBfJ4aBvH8.u0H7yKx9fJ4aBvH8.u0H7yKx9fJ4aBvH8', '+639123456789');

-- Default Booking & Payment
INSERT INTO bookings (tourist_id, package_id, participants_count, total_price, status) VALUES
(1, 1, 2, 4998.00, 'Confirmed');

INSERT INTO payments (booking_id, amount, payment_method, payment_status) VALUES
(1, 4998.00, 'Credit Card', 'Completed');
