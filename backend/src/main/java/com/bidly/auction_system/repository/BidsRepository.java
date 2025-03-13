package com.bidly.auction_system.repository;

import com.bidly.auction_system.model.Bids;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.bidly.auction_system.model.AuctionItem;
import com.bidly.auction_system.model.Users;


@Repository
public interface BidsRepository extends JpaRepository<Bids, Long> {

    // ✅ Find all bids for a specific auction item (Using object reference)
    List<Bids> findByAuctionItem(AuctionItem auctionItem);

    // ✅ Find all bids by a specific user (Using object reference)
    List<Bids> findByUser(Users user);

    // ✅ Get the highest bid for an auction item (Using object reference)
    Bids findTopByAuctionItemOrderByBidAmountDesc(AuctionItem auctionItem);
}
