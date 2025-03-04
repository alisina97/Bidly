package com.bidly.auction_system.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "addresses") // ✅ Explicitly define table name
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment address_id
    @Column(name = "address_id")

    private Long addressId;

    @Column(nullable = false, name = "country")
    private String country;

    @Column(nullable = false, name = "city")
    private String city;

    @Column(nullable = false, name = "postal_code")
    private String postalCode;

    @Column(nullable = false, name = "street_name")
    private String streetName;

    @Column(nullable = false, name = "street_number")
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

