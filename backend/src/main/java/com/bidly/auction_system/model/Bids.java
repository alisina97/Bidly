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
    @JoinColumn(name = "user_id", nullable = false) 
    private Users user; 
    @ManyToOne
    @JoinColumn(name = "auction_item_id", nullable = false) 
    private AuctionItem auctionItem;
	    
    @Column(name = "bid_amount", nullable = false) 
    private Long bidAmount;

    @Column(name = "bid_time", nullable = false) 
    private LocalDateTime bidTime; 
    
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

