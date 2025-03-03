package com.bidly.auction_system.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "auction_types", uniqueConstraints = {
    @UniqueConstraint(columnNames = "auctionTypeName") // Ensure auctionTypeName is unique
})
public class AuctionType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment auctionTypeId
    private Long auctionTypeId;

    @Column(nullable = false, unique = true) // Unique auction type name
    private String auctionTypeName;

    public AuctionType() {}

    public AuctionType(String auctionTypeName) {
        this.auctionTypeName = auctionTypeName;
    }
}
