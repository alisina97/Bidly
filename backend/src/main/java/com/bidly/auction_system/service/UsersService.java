package com.bidly.auction_system.service;

import com.bidly.auction_system.model.Users;
import com.bidly.auction_system.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsersService {

    @Autowired
    private UsersRepository repository;

    // ✅ Add a new user (with uniqueness check)
    public Users registerUser(String username, String email, String password) {
        if (repository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email already exists!");
        }
        if (repository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username already exists!");
        }
        Users user = new Users(username, email, password);
        return repository.save(user);
    }

    // ✅ Get all users
    public List<Users> getAllUsers() {
        return repository.findAll();
    }

    // ✅ Get user by email
    public Optional<Users> getUserByEmail(String email) {
        return repository.findByEmail(email);
    }
}
