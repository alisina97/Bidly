package com.bidly.auction_system.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Bids") 
public class Bids {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment primary key
    @Column(name = "bid_id")
    private Long bidId;
		    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // ✅ FK linking to User, removed `unique = true`
    private Users user; // ✅ Ensure that the entity is `User`, not `Users`

    @ManyToOne
    @JoinColumn(name = "auction_item_id", nullable = false) // ✅ FK linking to AuctionItem
    private AuctionItem auctionItem;
	    
    @Column(name = "bid_amount", nullable = false) // ✅ Corrected typo
    private Long bidAmount;

    @Column(name = "bid_time", nullable = false) // ✅ Correct placement of `name`
    private LocalDateTime bidTime; // Represents bid placement time
    
    // Default constructor
    public Bids() {}

    // Constructor
    public Bids(AuctionItem auctionItem, Users user, Long bidAmount, LocalDateTime bidTime) {
        this.auctionItem = auctionItem;
        this.user = user;
        this.bidAmount = bidAmount;
        this.bidTime = bidTime;
    }
}

