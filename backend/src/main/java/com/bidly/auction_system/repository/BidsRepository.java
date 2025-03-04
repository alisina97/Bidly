package com.bidly.auction_system.repository;

import com.bidly.auction_system.model.Bids;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BidsRepository extends JpaRepository<Bids, Long> {

    // Find all bids for a specific auction item
    List<Bids> findByAuctionItemAuctionItemId(Long auctionItemId);

    // Find all bids by a specific user
    List<Bids> findByUserUserId(Long userId);

    // Get the highest bid for an auction item
    Bids findTopByAuctionItemAuctionItemIdOrderByBidAmountDesc(Long auctionItemId);
}
