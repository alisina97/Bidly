package com.bidly.auction_system.service;

import com.bidly.auction_system.model.Address;
import com.bidly.auction_system.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    // ✅ Add a new address
    public Address addAddress(String country, String city, String postalCode, String streetName, String streetNumber) {
        Address address = new Address(country, city, postalCode, streetName, streetNumber);
        return addressRepository.save(address);
    }

    // ✅ Get all addresses
    public List<Address> getAllAddresses() {
        return addressRepository.findAll();
    }

    // ✅ Get an address by ID
    public Address getAddressById(Long addressId) {
        return addressRepository.findById(addressId).orElseThrow(() -> new RuntimeException("Address not found!"));
    }
}
