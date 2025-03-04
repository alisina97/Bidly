package com.bidly.auction_system.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "auction_types", uniqueConstraints = {
    @UniqueConstraint(columnNames = "auction_type_name") // Ensure auctionTypeName is unique
})
public class AuctionType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "auction_type_id")
    private Long auctionTypeId;

    @Column(name = "auction_type_name", nullable = false, unique = true) // Corrected column mapping
    private String auctionTypeName;

    public AuctionType() {}

    public AuctionType(String auctionTypeName) {
        this.auctionTypeName = auctionTypeName;
    }
}
