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
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    UNIQUE (username),
    UNIQUE (email)
);


-- Create User_Details table
CREATE TABLE IF NOT EXISTS user_details (
    user_details_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES bidly_schema.users(user_id) ON DELETE CASCADE, 
    address_id INT UNIQUE NOT NULL REFERENCES bidly_schema.address(address_id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL
);


-- Create Address table (Address)
CREATE TABLE IF NOT EXISTS addresses (
    address_id SERIAL PRIMARY KEY,
    country VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    street_name VARCHAR(100) NOT NULL,
    street_number VARCHAR(10) NOT NULL
);



-- Create Auction_Types table
CREATE TABLE IF NOT EXISTS auction_types (
    auction_type_id SERIAL PRIMARY KEY,
    auction_name VARCHAR(50) UNIQUE NOT NULL
);


-- Create Categories table
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE NOT NULL
);


-- Create Auction_Items table to match Java entity
CREATE TABLE IF NOT EXISTS auction_items (
    auction_item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    item_description VARCHAR(500),     
    starting_price DOUBLE PRECISION NOT NULL,
    buy_now_price DOUBLE PRECISION,

    auction_type_id INT NOT NULL REFERENCES bidly_schema.auction_types(auction_type_id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES bidly_schema.categories(category_id) ON DELETE CASCADE
);


-- Create Auction_Status table
-- Create Auction_Status table to match Java entity
CREATE TABLE IF NOT EXISTS auction_status (
    status_id SERIAL PRIMARY KEY,     
    auction_item_id INT UNIQUE NOT NULL REFERENCES bidly_schema.auction_items(auction_item_id) ON DELETE CASCADE,
    
    current_price DOUBLE PRECISION NOT NULL,
    
    remaining_time INTERVAL NOT NULL,    
    item_status VARCHAR(20) CHECK (item_status IN ('SOLD', 'NOT_SOLD')) NOT NULL
);

CREATE TABLE IF NOT EXISTS Bids (
    bid_id SERIAL PRIMARY KEY,     
    auction_item_id INT NOT NULL REFERENCES bidly_schema.auction_items(auction_item_id) ON DELETE CASCADE,
    
    user_id INT NOT NULL REFERENCES bidly_schema.users(user_id) ON DELETE CASCADE,
    
    bid_amount BIGINT NOT NULL CHECK (bid_amount > 0),
    
    bid_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ===========================================
-- Inserting Sample Data
-- ===========================================

-- Insert Users
INSERT INTO bidly_schema.users (username, password, email) VALUES
    ('john_doe', 'hashed_password_123', 'john.doe@example.com'),
    ('alice_smith', 'hashed_password_456', 'alice.smith@example.com'),
    ('bob_jones', 'hashed_password_789', 'bob.jones@example.com');

-- Insert Addresses
INSERT INTO bidly_schema.addresses (country, city, postal_code, street_name, street_number) VALUES
    ('Canada', 'Toronto', 'M5A 1A1', 'Main Street', '123'),
    ('Canada', 'Vancouver', 'V6B 1G1', 'Queen Street', '456'),
    ('Canada', 'Montreal', 'H3B 2T1', 'King Street', '789');

-- Insert User_Details
INSERT INTO bidly_schema.user_details (user_id, address_id, first_name, last_name) VALUES
    (1, 1, 'John', 'Doe'),
    (2, 2, 'Alice', 'Smith'),
    (3, 3, 'Bob', 'Jones');

-- Insert Auction Types
INSERT INTO bidly_schema.auction_types (auction_name) VALUES
    ('Standard Auction'),
    ('Buy Now'),
    ('Reserve Auction');

-- Insert Categories
INSERT INTO bidly_schema.categories (category_name) VALUES
    ('Electronics'),
    ('Furniture'),
    ('Vehicles');

-- Insert Auction Items
INSERT INTO bidly_schema.auction_items (item_name, item_description, starting_price, buy_now_price, auction_type_id, category_id) VALUES
    ('iPhone 14', 'Latest model in excellent condition', 600.00, 850.00, 1, 1),
    ('Sofa Set', 'Comfortable 3-piece sofa set', 250.00, 500.00, 2, 2),
    ('Toyota Camry', '2018 model, low mileage', 12000.00, 15000.00, 3, 3);

-- Insert Auction Status
INSERT INTO public.auction_status (auction_item_id, current_price, remaining_time, item_status) VALUES
    (1, 650.00, 172800, 'SOLD'),  -- 2 days = 2 * 24 * 60 * 60 = 172800 seconds
    (2, 300.00, 432000, 'SOLD'),  -- 5 days = 5 * 24 * 60 * 60 = 432000 seconds
    (3, 13000.00, 604800, 'SOLD'); -- 7 days = 7 * 24 * 60 * 60 = 604800 seconds

-- Insert Bids
INSERT INTO bidly_schema.bids (auction_item_id, user_id, bid_amount, bid_time) VALUES
    (1, 2, 620, '2025-03-01 10:30:00'),
    (1, 3, 650, '2025-03-01 12:15:00'),
    (2, 1, 275, '2025-03-02 14:45:00'),
    (3, 2, 12500, '2025-03-03 09:00:00'),
    (3, 3, 13000, '2025-03-03 11:00:00');
