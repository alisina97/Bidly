package com.bidly.auction_system.controller;

import com.bidly.auction_system.model.UserDetails;
import com.bidly.auction_system.service.UserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
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
}
