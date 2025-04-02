package com.bidly.auction_system.service;

import com.bidly.auction_system.model.AuctionItem;
import com.bidly.auction_system.model.AuctionStatus;
import com.bidly.auction_system.model.Bids;
import com.bidly.auction_system.model.Users;
import com.bidly.auction_system.model.Winner;
import com.bidly.auction_system.repository.AuctionItemRepository;
import com.bidly.auction_system.repository.AuctionStatusRepository;
import com.bidly.auction_system.repository.BidsRepository;
import com.bidly.auction_system.repository.WinnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuctionStatusService {

    @Autowired
    private AuctionStatusRepository auctionStatusRepository;

    @Autowired
    private AuctionItemRepository auctionItemRepository;

    @Autowired
    private BidsRepository bidsRepository;

    @Autowired
    private WinnerRepository winnerRepository;

    /**
     *  Create a new Auction Status when the auction starts
     */
    public AuctionStatus createAuctionStatus(Long auctionItemId, Long startingPrice, Long endTimeEpoch) {
        //  Fetch auction item from database to ensure it contains full details
        AuctionItem auctionItem = auctionItemRepository.findById(auctionItemId)
                .orElseThrow(() -> new RuntimeException("Auction Item not found!"));

        AuctionStatus auctionStatus = new AuctionStatus();
        auctionStatus.setAuctionItem(auctionItem); //  Ensuring full details
        auctionStatus.setCurrentPrice(startingPrice);
        auctionStatus.setEndTimeEpoch(endTimeEpoch); // Store the absolute auction end time
        auctionStatus.setItemStatus(AuctionStatus.ItemStatus.NOT_SOLD);

        return auctionStatusRepository.save(auctionStatus);
    }

    /**
     *  Update current price when a new bid is placed
     */
    public AuctionStatus updateCurrentPrice(Long auctionItemId, Long newPrice) {
        AuctionStatus auctionStatus = getAuctionStatusByItemId(auctionItemId);
        auctionStatus.setCurrentPrice(newPrice);
        return auctionStatusRepository.save(auctionStatus);
    }

    /**
     *  Mark an auction as SOLD and determine the winner
     */
    public AuctionStatus markAsSold(Long auctionItemId) {
        //  Fetch auction status
        AuctionStatus auctionStatus = getAuctionStatusByItemId(auctionItemId);
    
        //  Prevent marking an already SOLD auction
        if (auctionStatus.getItemStatus() == AuctionStatus.ItemStatus.SOLD) {
            throw new RuntimeException("Auction is already marked as sold.");
        }
    
        //  Find the highest bid for the auction
        Optional<Bids> highestBid = Optional.ofNullable(
                bidsRepository.findTopByAuctionItemOrderByBidAmountDesc(auctionStatus.getAuctionItem())
        );
    
        //  If no bids exist, mark as SOLD without assigning a winner
        if (highestBid.isEmpty()) {
            auctionStatus.setItemStatus(AuctionStatus.ItemStatus.SOLD);
            return auctionStatusRepository.save(auctionStatus);
        }
    
        //  Assign the highest bidder as the winner
        Bids winningBid = highestBid.get();
        Users winnerUser = winningBid.getUser();
    
        //  Save the winner in the Winner table
        Winner winner = new Winner(auctionStatus.getAuctionItem(), winnerUser, winningBid.getBidAmount());
        winnerRepository.save(winner);
    
        //  Mark auction as SOLD
        auctionStatus.setItemStatus(AuctionStatus.ItemStatus.SOLD);
        return auctionStatusRepository.save(auctionStatus);
    }
    

    /**
     *  Get Auction Status by Auction Item ID (Fix incorrect repository query)
     */
    public AuctionStatus getAuctionStatusByItemId(Long auctionItemId) {
        // Fetch the auction item first
        AuctionItem auctionItem = auctionItemRepository.findById(auctionItemId)
                .orElseThrow(() -> new RuntimeException("Auction item not found!"));

        return auctionStatusRepository.findByAuctionItem(auctionItem)
                .orElseThrow(() -> new RuntimeException("Auction Status not found!"));
    }
}
