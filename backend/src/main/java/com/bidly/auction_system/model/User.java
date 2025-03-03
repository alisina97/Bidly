package com.bidly.auction_system.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email"),
    @UniqueConstraint(columnNames = "username")
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment user_id (PK)
    private Long userId;

    @Column(nullable = false, unique = true) // Unique username
    private String username;

    @Column(nullable = false, unique = true) // Unique email
    private String email;

    @Column(nullable = false) // Password (hashed in real apps)
    private String password;

    // Default constructor
    public User() {}

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
