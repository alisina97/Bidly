package com.bidly.auction_system.repository;

import com.bidly.auction_system.model.AuctionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuctionItemRepository extends JpaRepository<AuctionItem, Long> {
    // ✅ Get all items by auction type
    List<AuctionItem> findByAuctionTypeAuctionTypeId(Long auctionTypeId);

    // ✅ Get all items by category
    List<AuctionItem> findByCategoryCategoryId(Long categoryId);

    // ✅ Search items by name or description
    @Query("SELECT a FROM AuctionItem a WHERE " +
            "LOWER(a.itemName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(a.itemDescription) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<AuctionItem> searchAuctionItems(@Param("keyword") String keyword);
}