package com.bidly.auction_system.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "winners")
public class Winner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "winner_id")
    private Long winnerId;

    @OneToOne
    @JoinColumn(name = "auction_item_id", nullable = false, unique = true)
    private AuctionItem auctionItem;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Column(nullable = false, name = "winning_price")
    private Long winningPrice; // 

    @Column(nullable = false, name = "paid_for")
    private boolean paidFor = false;
    // Manually define constructor 
    public Winner(AuctionItem auctionItem, Users user, Long winningPrice) {
        this.auctionItem = auctionItem;
        this.user = user;
        this.winningPrice = winningPrice;
    }
}