package com.bidly.auction_system.service;

import com.bidly.auction_system.model.Address;
import com.bidly.auction_system.model.Users;
import com.bidly.auction_system.model.UserDetails;
import com.bidly.auction_system.repository.AddressRepository;
import com.bidly.auction_system.repository.UserDetailsRepository;
import com.bidly.auction_system.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsService {

    @Autowired
    private UserDetailsRepository userDetailsRepository;

    @Autowired
    private UsersRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    //  Link a user to an address with first and last name
    public UserDetails linkUserToAddress(Long userId, String firstName, String lastName, Long addressId) {
        Users user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found!"));
        Address address = addressRepository.findById(addressId).orElseThrow(() -> new RuntimeException("Address not found!"));

        UserDetails userDetails = new UserDetails(user, firstName, lastName, address);
        return userDetailsRepository.save(userDetails);
    }
}
