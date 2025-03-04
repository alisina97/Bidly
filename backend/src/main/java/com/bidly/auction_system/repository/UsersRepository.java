package com.bidly.auction_system.repository;

import com.bidly.auction_system.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByEmail(String email); // Find user by email
    Optional<Users> findByUsername(String username); // Find user by username
}
