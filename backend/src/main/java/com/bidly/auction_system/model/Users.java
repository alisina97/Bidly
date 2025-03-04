package com.bidly.auction_system.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email"),
    @UniqueConstraint(columnNames = "username")
})
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment user_id (PK)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, unique = true, name = "username") // Unique username
    private String username;

    @Column(nullable = false, unique = true, name = "email") // Unique email
    private String email;

    @Column(nullable = false, name = "password") // Password (hashed in real apps)
    private String password;

    // Default constructor
    public Users() {}

    public Users(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
