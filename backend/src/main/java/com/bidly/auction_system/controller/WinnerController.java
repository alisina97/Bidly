package com.bidly.auction_system.controller;

import com.bidly.auction_system.model.Winner;
import com.bidly.auction_system.service.WinnerService;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/winners")
public class WinnerController {

    @Autowired
    private WinnerService winnerService;

    //  Get the winner for a specific auction
    @GetMapping("/{auctionItemId}")
    public Winner getWinner(@PathVariable Long auctionItemId) {
        return winnerService.getWinnerByAuctionItemId(auctionItemId);
    }


    //  Check if a specific user is the winner of an auction
    @GetMapping("/is-winner")
    public boolean isUserWinner(@RequestParam Long userId, @RequestParam Long auctionItemId) {
        return winnerService.isUserWinner(userId, auctionItemId);
    }

    //  Add a winner (New)
    @PostMapping("/add")
    public Winner addWinner(@RequestParam Long userId, @RequestParam Long auctionItemId, @RequestParam Long winningPrice) {
        return winnerService.addWinner(userId, auctionItemId, winningPrice);
    }
}
