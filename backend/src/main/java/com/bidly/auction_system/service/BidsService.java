package com.bidly.auction_system.service;

import com.bidly.auction_system.model.Bids;
import com.bidly.auction_system.model.Users;
import com.bidly.auction_system.model.AuctionItem;
import com.bidly.auction_system.repository.BidsRepository;
import com.bidly.auction_system.repository.UsersRepository;
import com.bidly.auction_system.repository.AuctionItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BidsService {

    @Autowired
    private BidsRepository bidsRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private AuctionItemRepository auctionItemRepository;

    // ✅ Get all bids
    public List<Bids> getAllBids() {
        return bidsRepository.findAll();
    }

    // ✅ Get a bid by ID
    public Optional<Bids> getBidById(Long bidId) {
        return bidsRepository.findById(bidId);
    }

    // ✅ Get all bids for a specific auction item
    public List<Bids> getBidsForAuctionItem(Long auctionItemId) {
        return bidsRepository.findByAuctionItemAuctionItemId(auctionItemId);
    }

    // ✅ Get all bids placed by a user
    public List<Bids> getBidsByUser(Long userId) {
        return bidsRepository.findByUserUserId(userId);
    }

    // ✅ Get the highest bid for an auction item
    public Optional<Bids> getHighestBidForAuctionItem(Long auctionItemId) {
        return Optional.ofNullable(bidsRepository.findTopByAuctionItemAuctionItemIdOrderByBidAmountDesc(auctionItemId));
    }

    // ✅ Place a new bid using @RequestParam values
    public Bids placeBid(Long userId, Long auctionItemId, Long bidAmount) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        AuctionItem auctionItem = auctionItemRepository.findById(auctionItemId)
                .orElseThrow(() -> new RuntimeException("Auction item not found!"));

        Bids bid = new Bids();
        bid.setUser(user);
        bid.setAuctionItem(auctionItem);
        bid.setBidAmount(bidAmount);
        bid.setBidTime(LocalDateTime.now());

        return bidsRepository.save(bid);
    }

    // ✅ Delete a bid
    public void deleteBid(Long bidId) {
        bidsRepository.deleteById(bidId);
    }
}
