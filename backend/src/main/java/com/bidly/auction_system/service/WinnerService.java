package com.bidly.auction_system.service;

import com.bidly.auction_system.model.Winner;
import com.bidly.auction_system.repository.WinnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WinnerService {

    @Autowired
    private WinnerRepository winnerRepository;

    // Get the winner by auction item ID
    public Winner getWinnerByAuctionItemId(Long auctionItemId) {
        return winnerRepository.findByAuctionItemAuctionItemId(auctionItemId);
    }

    // Check if a user is the winner
    public boolean isUserWinner(Long userId, Long auctionItemId) {
        Winner winner = winnerRepository.findByAuctionItemAuctionItemId(auctionItemId);
        return winner != null && winner.getUser().getUserId().equals(userId);
    }
}
