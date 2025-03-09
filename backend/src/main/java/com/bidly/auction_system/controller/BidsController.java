package com.bidly.auction_system.controller;

import com.bidly.auction_system.model.Bids;
import com.bidly.auction_system.service.BidsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bids")
public class BidsController {

    @Autowired
    private BidsService bidsService;

    // ✅ Get all bids
    @GetMapping
    public List<Bids> getAllBids() {
        return bidsService.getAllBids();
    }

    // ✅ Get a bid by ID
    @GetMapping("/{bidId}")
    public Optional<Bids> getBidById(@PathVariable Long bidId) {
        return bidsService.getBidById(bidId);
    }

    // ✅ Get all bids for a specific auction item
    @GetMapping("/auction/{auctionItemId}")
    public List<Bids> getBidsForAuctionItem(@PathVariable Long auctionItemId) {
        return bidsService.getBidsForAuctionItem(auctionItemId);
    }

    // ✅ Get all bids placed by a user
    @GetMapping("/user/{userId}")
    public List<Bids> getBidsByUser(@PathVariable Long userId) {
        return bidsService.getBidsByUser(userId);
    }

    // ✅ Get the highest bid for an auction item
    @GetMapping("/auction/{auctionItemId}/highest")
    public Optional<Bids> getHighestBidForAuctionItem(@PathVariable Long auctionItemId) {
        return bidsService.getHighestBidForAuctionItem(auctionItemId);
    }

    // ✅ Place a new bid using @RequestParam
    @PostMapping("/add")
    public Bids placeBid(
            @RequestParam Long userId,
            @RequestParam Long auctionItemId,
            @RequestParam Long bidAmount) {
        return bidsService.placeBid(userId, auctionItemId, bidAmount);
    }

    // ✅ Delete a bid
    @DeleteMapping("/{bidId}")
    public void deleteBid(@PathVariable Long bidId) {
        bidsService.deleteBid(bidId);
    }
}
