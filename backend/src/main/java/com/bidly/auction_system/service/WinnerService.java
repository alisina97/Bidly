package com.bidly.auction_system.service;

import com.bidly.auction_system.model.Winner;
import com.bidly.auction_system.model.Users;
import com.bidly.auction_system.model.AuctionItem;
import com.bidly.auction_system.repository.WinnerRepository;
import com.bidly.auction_system.repository.UsersRepository;
import com.bidly.auction_system.repository.AuctionItemRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WinnerService {

    @Autowired
    private WinnerRepository winnerRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private AuctionItemRepository auctionItemRepository;

    // 1. Get the winner by auction item ID
    public Winner getWinnerByAuctionItemId(Long auctionItemId) {
        return winnerRepository.findByAuctionItemAuctionItemId(auctionItemId);
    }

    // 2. Check if a user is the winner
    public boolean isUserWinner(Long userId, Long auctionItemId) {
        Winner winner = winnerRepository.findByAuctionItemAuctionItemId(auctionItemId);
        return winner != null && winner.getUser().getUserId().equals(userId);
    }

    // 3. Add a winner to the database
    public Winner addWinner(Long userId, Long auctionItemId, Long winningPrice) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        AuctionItem auctionItem = auctionItemRepository.findById(auctionItemId)
                .orElseThrow(() -> new RuntimeException("Auction item not found!"));

        // paidFor defaults to false, so it’s unpaid at creation
        Winner winner = new Winner(auctionItem, user, winningPrice);
        return winnerRepository.save(winner);
    }

    /**
     * 4. Mark a winner as paid. You can find the winner either by
     *    `winnerId` or `auctionItemId`. Here we show an example by
     *    looking up via `auctionItemId`.
     */
    public Winner markWinnerAsPaid(Long auctionItemId) {
        Winner winner = winnerRepository.findByAuctionItemAuctionItemId(auctionItemId);
        if (winner == null) {
            throw new RuntimeException("Winner not found for auction item ID: " + auctionItemId);
        }
        // Set paidFor to true
        winner.setPaidFor(true);
        return winnerRepository.save(winner);
    }

    /**
     * 5. Check if the winner for a specific auction item has paid.
     */
    public boolean isPaidFor(Long auctionItemId) {
        Winner winner = winnerRepository.findByAuctionItemAuctionItemId(auctionItemId);
        return (winner != null && winner.isPaidFor());
    }
    
    
    public List<Winner> getWinnersByUserId(Long userId) {
        return winnerRepository.findByUserUserId(userId);
    }
}