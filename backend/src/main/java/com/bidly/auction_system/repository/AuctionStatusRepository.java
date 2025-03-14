package com.bidly.auction_system.repository;

import com.bidly.auction_system.model.AuctionStatus;
import com.bidly.auction_system.model.AuctionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuctionStatusRepository extends JpaRepository<AuctionStatus, Long> {
    Optional<AuctionStatus> findByAuctionItem(AuctionItem auctionItem);
}
