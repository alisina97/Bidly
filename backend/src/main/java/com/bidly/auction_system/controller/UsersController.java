package com.bidly.auction_system.controller;

import com.bidly.auction_system.model.Users;
import com.bidly.auction_system.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private UsersService userService;

    //Register a new user
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(
            @RequestParam String username,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String country,
            @RequestParam String city,
            @RequestParam String postalCode,
            @RequestParam String streetNumber,
            @RequestParam String streetName) {

        try {
            userService.registerUser(username, email, password, firstName, lastName, country, city, postalCode, streetNumber, streetName);
            return ResponseEntity.ok("User registered successfully!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }


    // ✅ Get all users
    @GetMapping
    public List<Users> getAllUsers() {
        return userService.getAllUsers();
    }

    // ✅ Get user by email
    @GetMapping("/email")
    public Optional<Users> getUserByEmail(@RequestParam String email) {
        return userService.getUserByEmail(email);
    }
    
    
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        boolean isAuthenticated = userService.authenticateUser(username, password);

        if (isAuthenticated) {
            return ResponseEntity.ok("Login Successful!");  // ✅ HTTP 200 OK
        } else {
            return ResponseEntity.status(401).body("Invalid Username or Password");  // ❌ HTTP 401 Unauthorized
        }
    }


}
