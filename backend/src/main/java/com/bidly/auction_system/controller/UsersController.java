
package com.bidly.auction_system.controller;

import com.bidly.auction_system.model.Users;
import com.bidly.auction_system.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;


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


    //  Get all users
    @GetMapping
    public List<Users> getAllUsers() {
        return userService.getAllUsers();
    }

    //  Get user by email
    // @GetMapping("/email")
    // public Optional<Users> getUserByEmail(@RequestParam String email) {
    //     return userService.getUserByEmail(email);
    // }
    
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        Optional<Users> user = userService.getUserById(userId);
        return user.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> credentials, HttpSession session) {
        String username = credentials.get("username");
        String password = credentials.get("password");
    
        Optional<Users> user = userService.findByUsernameAndPassword(username, password); // ✅ Fetch user directly
    
        if (user.isPresent()) {
            session.setAttribute("user_id", user.get().getUserId()); // ✅ Store user_id in session
            return ResponseEntity.ok("Login Successful! User ID stored in session.");
        }
    
        return ResponseEntity.status(401).body("Invalid Username or Password");
    }

    @GetMapping("/me")
public ResponseEntity<?> getLoggedInUserId(HttpSession session) {
    Object userIdObj = session.getAttribute("user_id");

    if (userIdObj == null) {
        return ResponseEntity.status(401).body("User session not found.");
    }

    return ResponseEntity.ok(Map.of("user_id", userIdObj));
}

@PostMapping("/logout")
public ResponseEntity<String> logout(HttpSession session) {
    session.invalidate();  // ✅ Clears session data
    return ResponseEntity.ok("User logged out successfully.");
}

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        boolean deleted = userService.deleteUserById(userId);
        if (deleted) {
            return ResponseEntity.ok("User deleted successfully.");
        } else {
            return ResponseEntity.status(404).body("User not found.");
        }
    }
}