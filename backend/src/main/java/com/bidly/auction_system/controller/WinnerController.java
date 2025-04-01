package com.bidly.auction_system.controller;

import com.bidly.auction_system.model.Winner;
import com.bidly.auction_system.service.WinnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/winners")
public class WinnerController {

    @Autowired
    private WinnerService winnerService;

    /**
     * 1) Get the winner for a specific auction item by its ID
     */
    @GetMapping("/{auctionItemId}")
    public Winner getWinner(@PathVariable Long auctionItemId) {
        return winnerService.getWinnerByAuctionItemId(auctionItemId);
    }

    /**
     * 2) Check if a specific user is the winner of an auction
     */
    @GetMapping("/is-winner")
    public boolean isUserWinner(@RequestParam Long userId, @RequestParam Long auctionItemId) {
        return winnerService.isUserWinner(userId, auctionItemId);
    }

    /**
     * 3) Add a winner record (assign a user as winner of an item)
     */
    @PostMapping("/add")
    public Winner addWinner(@RequestParam Long userId,
                            @RequestParam Long auctionItemId,
                            @RequestParam Long winningPrice) {
        return winnerService.addWinner(userId, auctionItemId, winningPrice);
    }

    /**
     * 4) Mark the winner as having paid for the item
     */
    @PostMapping("/mark-paid")
    public Winner markWinnerAsPaid(@RequestParam Long auctionItemId) {
        return winnerService.markWinnerAsPaid(auctionItemId);
    }

    /**
     * 5) Check if the auction item is paid
     */
    @GetMapping("/is-paid")
    public boolean isPaid(@RequestParam Long auctionItemId) {
        return winnerService.isPaidFor(auctionItemId);
    }
}