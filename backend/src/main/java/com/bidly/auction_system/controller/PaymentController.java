package com.bidly.auction_system.controller;

import com.bidly.auction_system.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/user-details")
    public Map<String, String> getUserPaymentDetails(@RequestParam Long userId, @RequestParam Long auctionItemId) {
        return paymentService.getUserPaymentDetails(userId, auctionItemId);
    }
}
