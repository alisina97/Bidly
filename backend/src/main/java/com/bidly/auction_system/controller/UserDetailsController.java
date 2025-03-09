package com.bidly.auction_system.controller;

import com.bidly.auction_system.model.UserDetails;
import com.bidly.auction_system.service.UserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-details")
public class UserDetailsController {

    @Autowired
    private UserDetailsService userDetailsService;

    //  Link a user to an address with first & last name
    @PostMapping("/link")
    public UserDetails linkUserToAddress(@RequestParam Long userId,
                                         @RequestParam String firstName,
                                         @RequestParam String lastName,
                                         @RequestParam Long addressId) {
        return userDetailsService.linkUserToAddress(userId, firstName, lastName, addressId);
    }


    @GetMapping("/details/{userId}")
    public ResponseEntity<?> getUserDetails(@PathVariable Long userId) {
        try {
            UserDetails details = userDetailsService.getUserDetailsByUserId(userId);
            return ResponseEntity.ok(details);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

}
