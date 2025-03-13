package com.bidly.auction_system.controller;

import com.bidly.auction_system.model.AuctionStatus;
import com.bidly.auction_system.service.AuctionStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auction-status")
public class AuctionStatusController {

    @Autowired
    private AuctionStatusService auctionStatusService;

    // ✅ Create auction status for an item
    @PostMapping("/create")
    public AuctionStatus createAuctionStatus(@RequestParam Long auctionItemId,
                                             @RequestParam Long startingPrice,
                                             @RequestParam Long durationSeconds) {
        return auctionStatusService.createAuctionStatus(auctionItemId, startingPrice, durationSeconds);
    }

    // ✅ Get auction status by item ID
    @GetMapping("/{auctionItemId}")
    public AuctionStatus getAuctionStatusByItemId(@PathVariable Long auctionItemId) {
        return auctionStatusService.getAuctionStatusByItemId(auctionItemId);
    }

    // ✅ Update current price when bidding
    @PostMapping("/update-price")
    public AuctionStatus updateCurrentPrice(@RequestParam Long auctionItemId,
                                            @RequestParam Long newPrice) {
        return auctionStatusService.updateCurrentPrice(auctionItemId, newPrice);
    }

    // ✅ Mark item as SOLD
    @PostMapping("/mark-sold")
    public AuctionStatus markAsSold(@RequestParam Long auctionItemId) {
        return auctionStatusService.markAsSold(auctionItemId);
    }
}
