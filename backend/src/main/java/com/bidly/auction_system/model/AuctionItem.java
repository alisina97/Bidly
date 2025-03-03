package com.bidly.auction_system.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "auction_items")
public class AuctionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment primary key
    private Long auctionItemId;

    @Column(nullable = false)
    private String itemName;

    @Column(nullable = false, length = 500)
    private String itemDescription;

    @Column(nullable = false)
    private Double startingPrice;

    @Column(nullable = false)
    private Double buyNowPrice;

    // ✅ Mandatory Many-to-One relationship with AuctionType
    @ManyToOne(optional = false)
    @JoinColumn(name = "auctionTypeId", nullable = false) // FK linking to AuctionType
    private AuctionType auctionType;

    // ✅ Mandatory Many-to-One relationship with Category
    @ManyToOne(optional = false)
    @JoinColumn(name = "categoryId", nullable = false) // FK linking to Category
    private Category category;

    public AuctionItem() {}

    public AuctionItem(String itemName, String itemDescription, Double startingPrice, Double buyNowPrice, AuctionType auctionType, Category category) {
        this.itemName = itemName;
        this.itemDescription = itemDescription;
        this.startingPrice = startingPrice;
        this.buyNowPrice = buyNowPrice;
        this.auctionType = auctionType;
        this.category = category;
    }
}
