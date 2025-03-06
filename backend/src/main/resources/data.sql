-- Insert Users
INSERT INTO users (username, email, password) VALUES
                                                  ('admin', 'admin@example.com', 'admin123'),
                                                  ('user1', 'user1@example.com', 'password1'),
                                                  ('user2', 'user2@example.com', 'password2'),
                                                  ('demo', 'demo@example.com', 'password123'),
                                                  ('john_doe', 'john.doe@example.com', 'hashed_password_123'),
                                                  ('alice_smith', 'alice.smith@example.com', 'hashed_password_456'),
                                                  ('bob_jones', 'bob.jones@example.com', 'hashed_password_789');

-- Insert Addresses
INSERT INTO addresses (country, city, postal_code, street_name, street_number) VALUES
                                                                                   ('Canada', 'Toronto', 'M5A 1A1', 'Main Street', '123'),
                                                                                   ('Canada', 'Vancouver', 'V6B 1G1', 'Queen Street', '456'),
                                                                                   ('Canada', 'Montreal', 'H3B 2T1', 'King Street', '789');

-- Insert User Details (Ensure User IDs exist in the users table)
INSERT INTO user_details (user_id, address_id, first_name, last_name) VALUES
                                                                          (1, 1, 'John', 'Doe'),
                                                                          (2, 2, 'Alice', 'Smith'),
                                                                          (3, 3, 'Bob', 'Jones');

-- Insert Auction Types
INSERT INTO auction_types (auction_type_name) VALUES
                                                  ('Standard Auction'),
                                                  ('Buy Now'),
                                                  ('Reserve Auction');

-- Insert Categories
INSERT INTO categories (category_name) VALUES
                                           ('Electronics'),
                                           ('Furniture'),
                                           ('Vehicles');

-- Insert Auction Items
INSERT INTO auction_items (item_name, item_description, starting_price, buy_now_price, auction_type_id, category_id) VALUES
                                                                                                                         ('iPhone 14', 'Latest model in excellent condition', 600.00, 850.00, 1, 1),
                                                                                                                         ('Sofa Set', 'Comfortable 3-piece sofa set', 250.00, 500.00, 2, 2),
                                                                                                                         ('Toyota Camry', '2018 model, low mileage', 12000.00, 15000.00, 3, 3);

-- Insert Auction Status
INSERT INTO auction_status (auction_item_id, current_price, remaining_time, item_status) VALUES
                                                                                             (1, 650.00, 172800, 'SOLD'), -- 2 days = 2 * 24 * 60 * 60 = 172800 seconds
                                                                                             (2, 300.00, 432000, 'SOLD'), -- 5 days = 5 * 24 * 60 * 60 = 432000 seconds
                                                                                             (3, 13000.00, 604800, 'SOLD'); -- 7 days = 7 * 24 * 60 * 60 = 604800 seconds

-- Insert Bids (Ensure user and auction item IDs exist)
INSERT INTO bids (auction_item_id, user_id, bid_amount, bid_time) VALUES
                                                                      (1, 2, 620, '2025-03-01 10:30:00'),
                                                                      (1, 3, 650, '2025-03-01 12:15:00'),
                                                                      (2, 1, 275, '2025-03-02 14:45:00'),
                                                                      (3, 2, 12500, '2025-03-03 09:00:00'),
                                                                      (3, 3, 13000, '2025-03-03 11:00:00');