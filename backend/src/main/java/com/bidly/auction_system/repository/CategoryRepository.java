package com.bidly.auction_system.repository;

import com.bidly.auction_system.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // ✅ Find category by name (useful for checking if it exists before adding)
    Optional<Category> findByCategoryName(String categoryName);
}
