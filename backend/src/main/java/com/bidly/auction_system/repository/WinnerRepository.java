package com.bidly.auction_system.repository;

import com.bidly.auction_system.model.Winner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WinnerRepository extends JpaRepository<Winner, Long> {
    Winner findByAuctionItemAuctionItemId(Long auctionItemId);
}
