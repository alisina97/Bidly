package com.bidly.auction_system.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.Duration;

@Entity
@Data
@Table(name = "auction_status")
@Getter
@Setter
public class AuctionStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment primary key
    @Column(name = "status_id")
    private Long auctionStatusId;

    @OneToOne(optional = false) // One-to-One relationship (Mandatory)
    @JoinColumn(name = "auction_item_id", nullable = false, unique = true) // FK linking to AuctionItem
    private AuctionItem auctionItem;

    @Column(nullable = false, name = "current_price")
    private Double currentPrice;

    @Column(nullable = false , name = "remaining_time")
    private Duration remainingTime; // Time left for auction

    @Enumerated(EnumType.STRING) // Store enum as a string
    @Column(nullable = false , name = "item_status")
    private ItemStatus itemStatus;

    public AuctionStatus() {}

    public AuctionStatus(AuctionItem auctionItem, Double currentPrice, Duration remainingTime, ItemStatus itemStatus) {
        this.auctionItem = auctionItem;
        this.currentPrice = currentPrice;
        this.remainingTime = remainingTime;
        this.itemStatus = itemStatus;
    }

    // Enum for item status (SOLD or NOT_SOLD)
    public enum ItemStatus {
        SOLD, NOT_SOLD
    }
}
