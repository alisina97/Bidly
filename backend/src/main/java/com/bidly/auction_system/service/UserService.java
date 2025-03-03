package com.bidly.auction_system.service;

import com.bidly.auction_system.model.User;
import com.bidly.auction_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    // ✅ Add a new user (with uniqueness check)
    public User registerUser(String username, String email, String password) {
        if (repository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email already exists!");
        }
        if (repository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username already exists!");
        }
        User user = new User(username, email, password);
        return repository.save(user);
    }

    // ✅ Get all users
    public List<User> getAllUsers() {
        return repository.findAll();
    }

    // ✅ Get user by email
    public Optional<User> getUserByEmail(String email) {
        return repository.findByEmail(email);
    }
}
