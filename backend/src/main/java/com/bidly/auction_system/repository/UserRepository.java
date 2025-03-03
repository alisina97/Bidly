package com.bidly.auction_system.repository;

import com.bidly.auction_system.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email); // Find user by email
    Optional<User> findByUsername(String username); // Find user by username
}
