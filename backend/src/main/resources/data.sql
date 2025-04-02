-- Insert Users
INSERT INTO users (username, email, password, is_admin) VALUES
    ('admin', 'admin@example.com', 'admin123', true),
    ('user1', 'user1@example.com', 'password1', false),
    ('user2', 'user2@example.com', 'password2', false);


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
                                                  ('Buy Now');

-- Insert Categories
INSERT INTO categories (category_name) VALUES
                                           ('Electronics'),
                                           ('Furniture'),
                                           ('Vehicles');


                                                                      
