package com.bidly.auction_system.service;

import com.bidly.auction_system.model.Address;
import com.bidly.auction_system.model.UserDetails;
import com.bidly.auction_system.model.Users;
import com.bidly.auction_system.repository.AddressRepository;
import com.bidly.auction_system.repository.UserDetailsRepository;
import com.bidly.auction_system.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsersService {

    @Autowired
    private UsersRepository userRepository;
    
    @Autowired
    private AddressRepository addressRepository;
    
    @Autowired
    private UserDetailsRepository userDetailsRepository;

    // Add a new user (with uniqueness check)
    public Users registerUser(String username, String email, String password, String firstName, String lastName, 
                              String country, String city, String postalCode, String streetNumber, String streetName, boolean isAdmin) {
        
        boolean emailExists = userRepository.findByEmail(email).isPresent();
        boolean usernameExists = userRepository.findByUsername(username).isPresent();

        if (emailExists && usernameExists) {
            throw new IllegalArgumentException("Both Username and Email already exist!");
        }
        if (emailExists) {
            throw new IllegalArgumentException("Email already exists!");
        }
        if (usernameExists) {
            throw new IllegalArgumentException("Username already exists!");
        }
        
        Address address = new Address(country, city, postalCode, streetName, streetNumber);
        address = addressRepository.save(address);
        
        Users user = new Users(username, email, password);
        user.setAdmin(isAdmin);
        user = userRepository.save(user);
        
        UserDetails userDetails = new UserDetails(user, firstName, lastName, address);
        userDetailsRepository.save(userDetails);
        
        return user;
    }

    // Get all users
    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by email
    public Optional<Users> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<Users> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    public boolean authenticateUser(String username, String password) {
        return userRepository.findByUsernameAndPassword(username, password).isPresent();
    }

    public Optional<Users> findByUsernameAndPassword(String username, String password) {
        return userRepository.findByUsernameAndPassword(username, password);
    }

    public boolean deleteUserById(Long userId) {
        if (userRepository.existsById(userId)) {
        	userDetailsRepository.deleteByUserId(userId);
            userRepository.deleteById(userId);
            addressRepository.deleteById(userId);
            return true;
        }
        return false;
    }

    // Promote a user to admin
    public boolean promoteUserToAdmin(Long userId) {
        Optional<Users> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            Users user = userOptional.get();
            user.setAdmin(true);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public Optional<Users> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean updateUserPassword(String username, String newPassword) {
        Optional<Users> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            return false;
        }

        Users user = userOptional.get();
        user.setPassword(newPassword);
        userRepository.save(user);
        return true;
    }
}
