package com.bidly.auction_system.controller;

import com.bidly.auction_system.model.Address;
import com.bidly.auction_system.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;

    // ✅ Add a new address
    @PostMapping("/add")
    public Address addAddress(@RequestParam String country,
                              @RequestParam String city,
                              @RequestParam String postalCode,
                              @RequestParam String streetName,
                              @RequestParam String streetNumber) {
        return addressService.addAddress(country, city, postalCode, streetName, streetNumber);
    }

    // ✅ Get all addresses
    @GetMapping
    public List<Address> getAllAddresses() {
        return addressService.getAllAddresses();
    }

    // ✅ Get address by ID
    @GetMapping("/{addressId}")
    public Address getAddressById(@PathVariable Long addressId) {
        return addressService.getAddressById(addressId);
    }
}
