package com.bidly.auction_system.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "user_details")
public class UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment user_details_id
    private Long userDetailsId;
    
    

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true) // FK linking to User
    private User user;

    @ManyToOne
    @JoinColumn(name = "address_id", nullable = false) // ✅ FK linking to Address
    private Address address;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    

    public UserDetails() {}

    public UserDetails(User user, String firstName, String lastName, Address address) {
        this.user = user;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
    }
}
