package com.bidly.auction_system.service;

import com.bidly.auction_system.model.UserDetails;
import com.bidly.auction_system.model.AuctionItem;
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
        UserDetails userDetails = userDetailsRepository.findByUserUserId(userId);
        AuctionItem auctionItem = auctionItemRepository.findById(auctionItemId)
                .orElseThrow(() -> new RuntimeException("Auction item not found!"));

        if (userDetails == null) {
            throw new RuntimeException("User details not found!");
        }

        Map<String, String> paymentInfo = new HashMap<>();
        
        paymentInfo.put("firstName", userDetails.getFirstName());
        paymentInfo.put("lastName", userDetails.getLastName());
        paymentInfo.put("streetNumber", userDetails.getAddress().getStreetNumber());
        paymentInfo.put("streetName", userDetails.getAddress().getStreetName());
        paymentInfo.put("city", userDetails.getAddress().getCity());
        paymentInfo.put("province", userDetails.getAddress().getPostalCode()); // Assuming province is in postalCode
        paymentInfo.put("country", userDetails.getAddress().getCountry());
        paymentInfo.put("price", String.valueOf(auctionItem.getBuyNowPrice())); // Extract price

        return paymentInfo;
    }
}

