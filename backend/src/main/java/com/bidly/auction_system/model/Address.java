package com.bidly.auction_system.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "addresses") // ✅ Explicitly define table name
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment address_id
    private Long addressId;

    @Column(nullable = false)
    private String country;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String postalCode;

    @Column(nullable = false)
    private String streetName;

    @Column(nullable = false)
    private String streetNumber;

    public Address() {}

    public Address(String country, String city, String postalCode, String streetName, String streetNumber) {
        this.country = country;
        this.city = city;
        this.postalCode = postalCode;
        this.streetName = streetName;
        this.streetNumber = streetNumber;
    }
}

