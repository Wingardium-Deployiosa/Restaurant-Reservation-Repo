-- Create database
CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(255)
);

-- Create restaurants table  
CREATE TABLE IF NOT EXISTS restaurants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_id BIGINT(20),
    owner_email VARCHAR(255),
    owner_password VARCHAR(255),
    image_url VARCHAR(255),
    name VARCHAR(255),
    address VARCHAR(255),
    cuisine_type VARCHAR(255),
    phone VARCHAR(255),
    opening_hours VARCHAR(255),
    total_tables INT,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id BIGINT(20),
    special_requests VARCHAR(255),
    status ENUM('CONFIRMED','PENDING','CANCELLED'),
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(255),
    reservation_date DATE,
    reservation_time TIME,
    party_size INT,
    user_id BIGINT(20),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert sample users
INSERT INTO users (name, email, password, role) VALUES 
('User', 'user@user.com', 'user', 'CUSTOMER'),
('Admin', 'admin@admin.com', 'admin', 'ADMIN')
ON DUPLICATE KEY UPDATE name=VALUES(name);