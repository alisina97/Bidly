package com.bidly.auction_system.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "auction_items")
public class AuctionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment primary key
    @Column(name = "auction_item_id")
    private Long auctionItemId;

    @Column(nullable = false, name = "item_name")
    private String itemName;

    @Column(nullable = false, length = 500, name = "item_description")
    private String itemDescription;

    @Column(nullable = false, name = "starting_price")
    private Long startingPrice;

    @Column(nullable = false, name = "buy_now_price")
    private Long buyNowPrice;

    //  Mandatory Many-to-One relationship with AuctionType
    @ManyToOne(optional = false)
    @JoinColumn(name = "auction_type_id", nullable = false) // FK linking to AuctionType
    private AuctionType auctionType;

    //  Mandatory Many-to-One relationship with Category
    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id", nullable = false) // FK linking to Category
    private Category category;

    //  Mandatory Many-to-One relationship with Users
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false) // FK linking to Users entity
    private Users user;

    public AuctionItem() {}

    public AuctionItem(String itemName, String itemDescription, Long startingPrice, Long buyNowPrice, AuctionType auctionType, Category category, Users user) {
        this.itemName = itemName;
        this.itemDescription = itemDescription;
        this.startingPrice = startingPrice;
        this.buyNowPrice = buyNowPrice;
        this.auctionType = auctionType;
        this.category = category;
        this.user = user;
    }
}
