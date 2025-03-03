-- Drop and recreate the schema
DROP SCHEMA IF EXISTS bidly_schema CASCADE;
CREATE SCHEMA IF NOT EXISTS bidly_schema;

-- Set the search path to the schema
SET SEARCH_PATH = bidly_schema;

-- Drop tables if they exist
DROP TABLE IF EXISTS Bids, Auction_Status, Auction_Items, Auction_Types, Categories, Users, User_Details, LIVES_AT CASCADE;

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
                                     user_id SERIAL PRIMARY KEY,
                                     username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
    );

-- Create User_Details table
CREATE TABLE IF NOT EXISTS User_Details (
                                            address_id SERIAL PRIMARY KEY,
                                            user_id INT UNIQUE REFERENCES bidly_schema.Users(user_id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL
    );

-- Create Address table (LIVES_AT)
CREATE TABLE IF NOT EXISTS LIVES_AT (
                                        address_id INT PRIMARY KEY REFERENCES bidly_schema.User_Details(address_id) ON DELETE CASCADE,
    street_name VARCHAR(100) NOT NULL,
    street_number VARCHAR(10) NOT NULL,
    city VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL
    );

-- Create Auction_Types table
CREATE TABLE IF NOT EXISTS Auction_Types (
                                             auction_type_id SERIAL PRIMARY KEY,
                                             auction_name VARCHAR(50) UNIQUE NOT NULL
    );

-- Create Categories table
CREATE TABLE IF NOT EXISTS Categories (
                                          category_id SERIAL PRIMARY KEY,
                                          category_name VARCHAR(50) UNIQUE NOT NULL
    );

-- Create Auction_Items table
CREATE TABLE IF NOT EXISTS Auction_Items (
                                             item_id SERIAL PRIMARY KEY,
                                             item_name VARCHAR(100) NOT NULL,
    item_description TEXT,
    starting_price DECIMAL(10,2) NOT NULL,
    buy_now_price DECIMAL(10,2),
    auction_type_id INT REFERENCES bidly_schema.Auction_Types(auction_type_id) ON DELETE SET NULL,
    category_id INT REFERENCES bidly_schema.Categories(category_id) ON DELETE SET NULL
    );

-- Create Auction_Status table
CREATE TABLE IF NOT EXISTS Auction_Status (
                                              status_id SERIAL PRIMARY KEY,
                                              item_id INT UNIQUE REFERENCES bidly_schema.Auction_Items(item_id) ON DELETE CASCADE,
    current_price DECIMAL(10,2) NOT NULL,
    remaining_time INTERVAL NOT NULL,
    item_status VARCHAR(20) CHECK (item_status IN ('active', 'closed', 'pending')) NOT NULL
    );

-- Create Bids table
CREATE TABLE IF NOT EXISTS Bids (
                                    bid_id SERIAL PRIMARY KEY,
                                    item_id INT REFERENCES bidly_schema.Auction_Items(item_id) ON DELETE CASCADE,
    user_id INT REFERENCES bidly_schema.Users(user_id) ON DELETE CASCADE,
    bid_amount DECIMAL(10,2) NOT NULL CHECK (bid_amount > 0),
    bid_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- ===========================================
-- Inserting Sample Data
-- ===========================================

-- Insert Users
INSERT INTO bidly_schema.Users (username, password, email) VALUES
                                                               ('john_doe', 'hashed_password_123', 'john.doe@example.com'),
                                                               ('alice_smith', 'hashed_password_456', 'alice.smith@example.com'),
                                                               ('bob_jones', 'hashed_password_789', 'bob.jones@example.com');

-- Insert User_Details
INSERT INTO bidly_schema.User_Details (user_id, first_name, last_name) VALUES
                                                                           (1, 'John', 'Doe'),
                                                                           (2, 'Alice', 'Smith'),
                                                                           (3, 'Bob', 'Jones');

-- Insert LIVES_AT (Addresses)
INSERT INTO bidly_schema.LIVES_AT (address_id, street_name, street_number, city, country, postal_code) VALUES
                                                                                                           (1, 'Main Street', '123', 'Toronto', 'Canada', 'M5A 1A1'),
                                                                                                           (2, 'Queen Street', '456', 'Vancouver', 'Canada', 'V6B 1G1'),
                                                                                                           (3, 'King Street', '789', 'Montreal', 'Canada', 'H3B 2T1');

-- Insert Auction Types
INSERT INTO bidly_schema.Auction_Types (auction_name) VALUES
                                                          ('Standard Auction'),
                                                          ('Buy Now'),
                                                          ('Reserve Auction');

-- Insert Categories
INSERT INTO bidly_schema.Categories (category_name) VALUES
                                                        ('Electronics'),
                                                        ('Furniture'),
                                                        ('Vehicles');

-- Insert Auction Items
INSERT INTO bidly_schema.Auction_Items (item_name, item_description, starting_price, buy_now_price, auction_type_id, category_id) VALUES
                                                                                                                                      ('iPhone 14', 'Latest model in excellent condition', 600.00, 850.00, 1, 1),
                                                                                                                                      ('Sofa Set', 'Comfortable 3-piece sofa set', 250.00, 500.00, 2, 2),
                                                                                                                                      ('Toyota Camry', '2018 model, low mileage', 12000.00, 15000.00, 3, 3);

-- Insert Auction Status
INSERT INTO bidly_schema.Auction_Status (item_id, current_price, remaining_time, item_status) VALUES
                                                                                                  (1, 650.00, '2 days', 'active'),
                                                                                                  (2, 300.00, '5 days', 'active'),
                                                                                                  (3, 13000.00, '7 days', 'active');

-- Insert Bids
INSERT INTO bidly_schema.Bids (item_id, user_id, bid_amount, bid_time) VALUES
                                                                           (1, 2, 620.00, '2025-03-01 10:30:00'),
                                                                           (1, 3, 650.00, '2025-03-01 12:15:00'),
                                                                           (2, 1, 275.00, '2025-03-02 14:45:00'),
                                                                           (3, 2, 12500.00, '2025-03-03 09:00:00'),
                                                                           (3, 3, 13000.00, '2025-03-03 11:00:00');
