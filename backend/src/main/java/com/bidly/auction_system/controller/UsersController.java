package com.bidly.auction_system.controller;

import com.bidly.auction_system.model.Users;
import com.bidly.auction_system.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private UsersService userService;

    // ✅ Register a new user
    @PostMapping("/register")
    public Users registerUser(@RequestParam String username,
                             @RequestParam String email,
                             @RequestParam String password) {
        return userService.registerUser(username, email, password);
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
}
