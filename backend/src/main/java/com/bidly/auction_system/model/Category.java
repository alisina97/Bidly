package com.bidly.auction_system.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "categories", uniqueConstraints = {
    @UniqueConstraint(columnNames = "categoryName") // Ensure categoryName is unique
})
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment categoryId
    @Column(name = "category_id")
    private Long categoryId;

    @Column(nullable = false, unique = true, name = "category_name") // Unique category name
    private String categoryName;

    public Category() {}

    public Category(String categoryName) {
        this.categoryName = categoryName;
    }
}
