package com.bidly.auction_system.controller;

import com.bidly.auction_system.model.AuctionType;
import com.bidly.auction_system.service.AuctionTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auction-types")
public class AuctionTypeController {

    @Autowired
    private AuctionTypeService auctionTypeService;

    // ✅ Add a new auction type
    @PostMapping("/add")
    public AuctionType addAuctionType(@RequestParam String auctionTypeName) {
        return auctionTypeService.addAuctionType(auctionTypeName);
    }

    // ✅ Get all auction types
    @GetMapping
    public List<AuctionType> getAllAuctionTypes() {
        return auctionTypeService.getAllAuctionTypes();
    }

    // ✅ Get an auction type by ID
    @GetMapping("/{auctionTypeId}")
    public AuctionType getAuctionTypeById(@PathVariable Long auctionTypeId) {
        return auctionTypeService.getAuctionTypeById(auctionTypeId);
    }
}
