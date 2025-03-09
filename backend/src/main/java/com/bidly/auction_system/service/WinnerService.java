package com.bidly.auction_system.service;

import com.bidly.auction_system.model.Winner;
import com.bidly.auction_system.model.Users;
import com.bidly.auction_system.model.AuctionItem;
import com.bidly.auction_system.repository.WinnerRepository;
import com.bidly.auction_system.repository.UsersRepository;
import com.bidly.auction_system.repository.AuctionItemRepository;
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

    //  Get the winner by auction item ID
    public Winner getWinnerByAuctionItemId(Long auctionItemId) {
        return winnerRepository.findByAuctionItemAuctionItemId(auctionItemId);
    }

    //  Check if a user is the winner
    public boolean isUserWinner(Long userId, Long auctionItemId) {
        Winner winner = winnerRepository.findByAuctionItemAuctionItemId(auctionItemId);
        return winner != null && winner.getUser().getUserId().equals(userId);
    }

    //  Add a winner to the database
    public Winner addWinner(Long userId, Long auctionItemId, Long winningPrice) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        AuctionItem auctionItem = auctionItemRepository.findById(auctionItemId)
                .orElseThrow(() -> new RuntimeException("Auction item not found!"));

        Winner winner = new Winner(auctionItem, user, winningPrice);
        return winnerRepository.save(winner);
    }
}
