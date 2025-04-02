package com.bidly.auction_system.service;

import com.bidly.auction_system.model.Bids;
import com.bidly.auction_system.model.Users;
import com.bidly.auction_system.model.AuctionItem;
import com.bidly.auction_system.model.AuctionStatus;
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

    @Autowired
    private AuctionStatusService auctionStatusService;

    @Autowired
    private AuctionItemService auctionItemService;



    

    //  Get all bids
    public List<Bids> getAllBids() {
        return bidsRepository.findAll();
    }

    //  Get a bid by ID
    public Optional<Bids> getBidById(Long bidId) {
        return bidsRepository.findById(bidId);
    }

    //  Get all bids for a specific auction item
    public List<Bids> getBidsForAuctionItem(Long auctionItemId) {
        AuctionItem auctionItem = auctionItemRepository.findById(auctionItemId)
                .orElseThrow(() -> new RuntimeException("Auction item not found!"));
        
        return bidsRepository.findByAuctionItem(auctionItem);
    }
    

    //  Get all bids placed by a user
    public List<Bids> getBidsByUser(Long userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        
        return bidsRepository.findByUser(user);
    }
    

    //  Get the highest bid for an auction item
    public Optional<Bids> getHighestBidForAuctionItem(Long auctionItemId) {
        AuctionItem auctionItem = auctionItemRepository.findById(auctionItemId)
                .orElseThrow(() -> new RuntimeException("Auction item not found!"));
        return Optional.ofNullable(
            bidsRepository.findTopByAuctionItemOrderByBidAmountDesc(auctionItem)
        );
    }
    
    // Place a new bid using @RequestParam values

    public Bids placeBid(Long userId, Long auctionItemId, Long bidAmount) {
        // Validate user
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    
        //  Validate auction item
        AuctionItem auctionItem = auctionItemRepository.findById(auctionItemId)
                .orElseThrow(() -> new RuntimeException("Auction item not found!"));
    
        //  Fetch auction status BEFORE placing a bid
        AuctionStatus auctionStatus = auctionStatusService.getAuctionStatusByItemId(auctionItemId);
    
        //  Prevent bids on SOLD auctions BEFORE saving the bid
        if (auctionStatus.getItemStatus() == AuctionStatus.ItemStatus.SOLD) {
            throw new IllegalStateException("Bidding is closed for this auction (marked as SOLD).");
        }
    
        //  Retrieve the highest bid
        Optional<Bids> highestBid = Optional.ofNullable(
            bidsRepository.findTopByAuctionItemOrderByBidAmountDesc(auctionItem)
        );
    
        // bid must be higher than the current highest bid
        if (highestBid.isPresent() && bidAmount <= highestBid.get().getBidAmount()) {
            throw new IllegalArgumentException("Bid amount must be greater than the current highest bid of $" 
                                               + highestBid.get().getBidAmount());
        }
    
        //  Create and save the new bid 
        Bids bid = new Bids(auctionItem, user, bidAmount, LocalDateTime.now());
        Bids savedBid = bidsRepository.save(bid);
    
        // Update auction status price
        auctionStatusService.updateCurrentPrice(auctionItemId, bidAmount);
    
        return savedBid;
    }

    public Bids buyNow(Long userId, Long auctionItemId) {
        //  Validate user
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    
        //  Validate auction item
        AuctionItem auctionItem = auctionItemRepository.findById(auctionItemId)
                .orElseThrow(() -> new RuntimeException("Auction item not found!"));
    
        //  Fetch auction status BEFORE placing a bid
        AuctionStatus auctionStatus = auctionStatusService.getAuctionStatusByItemId(auctionItemId);
    
        //  Prevent buying if already SOLD
        if (auctionStatus.getItemStatus() == AuctionStatus.ItemStatus.SOLD) {
            throw new IllegalStateException("This auction has already been sold.");
        }
    
        //  Get the "Buy Now" price from AuctionItemService
        Long buyNowPrice = auctionItemService.getBuyNowPrice(auctionItemId);
    
        //  Create and save the bid at the Buy Now price
        Bids buyNowBid = new Bids(auctionItem, user, buyNowPrice, LocalDateTime.now());
        Bids savedBid = bidsRepository.save(buyNowBid);
    
        //  Mark the auction as SOLD
        auctionStatusService.markAsSold(auctionItemId);
        auctionStatusService.updateCurrentPrice(auctionItemId, buyNowPrice);

    
        return savedBid;
    }
        
    
    

    //  Delete a bid
    public void deleteBid(Long bidId) {
        bidsRepository.deleteById(bidId);
    }
}
