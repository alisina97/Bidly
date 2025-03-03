package com.bidly.auction_system.repository;

import com.bidly.auction_system.model.AuctionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuctionItemRepository extends JpaRepository<AuctionItem, Long> {
    // ✅ Get all items by auction type
    List<AuctionItem> findByAuctionTypeAuctionTypeId(Long auctionTypeId);

    // ✅ Get all items by category
    List<AuctionItem> findByCategoryCategoryId(Long categoryId);
}
