package com.bidly.auction_system.service;

import com.bidly.auction_system.model.AuctionStatus;
import com.bidly.auction_system.repository.AuctionStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Service
public class AuctionStatusService {

    @Autowired
    private AuctionStatusRepository auctionStatusRepository;

    // ✅ Update current price (when a new bid is placed)
    public AuctionStatus updateCurrentPrice(Long auctionItemId, Double newPrice) {
        AuctionStatus auctionStatus = getAuctionStatusByItemId(auctionItemId);
        auctionStatus.setCurrentPrice(newPrice); // ✅ Lombok automatically generates this setter
        return auctionStatusRepository.save(auctionStatus);
    }

    // ✅ Mark item as SOLD
    public AuctionStatus markAsSold(Long auctionItemId) {
        AuctionStatus auctionStatus = getAuctionStatusByItemId(auctionItemId);
        auctionStatus.setItemStatus(AuctionStatus.ItemStatus.SOLD); // ✅ Lombok automatically generates this setter
        return auctionStatusRepository.save(auctionStatus);
    }

    // ✅ Get auction status by auction item ID
    public AuctionStatus getAuctionStatusByItemId(Long auctionItemId) {
        return auctionStatusRepository.findByAuctionItemAuctionItemId(auctionItemId)
                .orElseThrow(() -> new RuntimeException("Auction Status not found!"));
    }
}
