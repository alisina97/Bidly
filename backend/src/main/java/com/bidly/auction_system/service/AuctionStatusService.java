package com.bidly.auction_system.service;

import com.bidly.auction_system.model.*;
import com.bidly.auction_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

@Service
public class AuctionStatusService {

    @Autowired
    private AuctionStatusRepository AuctionStatusRepository; 

    @Autowired
    private BidsRepository BidsRepository; 

    @Autowired
    private WinnerRepository WinnerRepository; 


    public AuctionStatus createAuctionStatus(Long auctionItemId, Double startingPrice, Duration duration) {
        AuctionItem auctionItem = new AuctionItem();
        auctionItem.setAuctionItemId(auctionItemId);

        AuctionStatus auctionStatus = new AuctionStatus();
        auctionStatus.setAuctionItem(auctionItem);
        auctionStatus.setCurrentPrice(startingPrice);
        auctionStatus.setRemainingTime(duration);
        auctionStatus.setItemStatus(AuctionStatus.ItemStatus.NOT_SOLD);

        return AuctionStatusRepository.save(auctionStatus);
    }

    public AuctionStatus updateCurrentPrice(Long auctionItemId, Double newPrice) {
        AuctionStatus auctionStatus = getAuctionStatusByItemId(auctionItemId);
        auctionStatus.setCurrentPrice(newPrice);
        return AuctionStatusRepository.save(auctionStatus);
    }

    public AuctionStatus markAsSold(Long auctionItemId) {
        AuctionStatus auctionStatus = getAuctionStatusByItemId(auctionItemId);
    
        if (auctionStatus.getItemStatus() == AuctionStatus.ItemStatus.SOLD) {
            throw new RuntimeException("Auction is already marked as sold.");
        }
    
        Optional<Bids> highestBid = Optional.ofNullable(BidsRepository.findTopByAuctionItemAuctionItemIdOrderByBidAmountDesc(auctionItemId));
    
        if (highestBid.isEmpty()) {
            throw new RuntimeException("No bids placed. Auction cannot be marked as sold.");
        }
    
        Bids winningBid = highestBid.get();
        Users winnerUser = winningBid.getUser();
    
        Winner winner = new Winner(auctionStatus.getAuctionItem(), winnerUser, winningBid.getBidAmount());
        WinnerRepository.save(winner);
    
        auctionStatus.setItemStatus(AuctionStatus.ItemStatus.SOLD);
        return AuctionStatusRepository.save(auctionStatus);
    }
    

    // ✅ Get auction status by auction item ID
    public AuctionStatus getAuctionStatusByItemId(Long auctionItemId) {
        return AuctionStatusRepository.findByAuctionItemAuctionItemId(auctionItemId)
                .orElseThrow(() -> new RuntimeException("Auction Status not found!"));
    }
}
