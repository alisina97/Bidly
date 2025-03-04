package com.bidly.auction_system.service;

import com.bidly.auction_system.model.Bids;
import com.bidly.auction_system.repository.BidsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BidsService {

    @Autowired
    private BidsRepository bidsRepository;

    // Retrieve all bids
    public List<Bids> getAllBids() {
        return bidsRepository.findAll();
    }

    // Retrieve a bid by ID
    public Optional<Bids> getBidById(Long bidId) {
        return bidsRepository.findById(bidId);
    }

    // Retrieve all bids for an auction item
    public List<Bids> getBidsForAuctionItem(Long auctionItemId) {
        return bidsRepository.findByAuctionItemAuctionItemId(auctionItemId);
    }

    // Retrieve all bids by a specific user
    public List<Bids> getBidsByUser(Long userId) {
        return bidsRepository.findByUserUserId(userId);
    }

    // Get the highest bid for an auction item
    public Optional<Bids> getHighestBidForAuctionItem(Long auctionItemId) {
        return Optional.ofNullable(bidsRepository.findTopByAuctionItemAuctionItemIdOrderByBidAmountDesc(auctionItemId));
    }

    // Place a bid
    public Bids placeBid(Bids bid) {
        return bidsRepository.save(bid);
    }

    // Delete a bid
    public void deleteBid(Long bidId) {
        bidsRepository.deleteById(bidId);
    }
}
