package com.bidly.auction_system.service;

import com.bidly.auction_system.model.UserDetails;
import com.bidly.auction_system.model.AuctionItem;
import com.bidly.auction_system.model.Address;
import com.bidly.auction_system.repository.UserDetailsRepository;
import com.bidly.auction_system.repository.AuctionItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    @Autowired
    private UserDetailsRepository userDetailsRepository;

    @Autowired
    private AuctionItemRepository auctionItemRepository;

    public Map<String, String> getUserPaymentDetails(Long userId, Long auctionItemId) {
        // Retrieve user details by userId
        UserDetails userDetails = userDetailsRepository.findByUserUserId(userId);
        if (userDetails == null) {
            throw new RuntimeException("User details not found for userId: " + userId);
        }

        // Retrieve auction item by auctionItemId
        AuctionItem auctionItem = auctionItemRepository.findById(auctionItemId)
                .orElseThrow(() -> new RuntimeException("Auction item not found for auctionItemId: " + auctionItemId));

        // Retrieve user address, handling possible null values
        Address address = userDetails.getAddress();
        if (address == null) {
            throw new RuntimeException("Address details not found for userId: " + userId);
        }

        // Prepare the payment information response
        Map<String, String> paymentInfo = new HashMap<>();
        paymentInfo.put("firstName", userDetails.getFirstName());
        paymentInfo.put("lastName", userDetails.getLastName());
        paymentInfo.put("streetNumber", address.getStreetNumber() != null ? address.getStreetNumber() : "N/A");
        paymentInfo.put("streetName", address.getStreetName() != null ? address.getStreetName() : "N/A");
        paymentInfo.put("city", address.getCity() != null ? address.getCity() : "N/A");
        paymentInfo.put("postalCode", address.getPostalCode() != null ? address.getPostalCode() : "N/A");
        paymentInfo.put("country", address.getCountry() != null ? address.getCountry() : "N/A");
        paymentInfo.put("price", auctionItem.getBuyNowPrice() != null ? String.valueOf(auctionItem.getBuyNowPrice()) : "0.00");

        return paymentInfo;
    }
}

