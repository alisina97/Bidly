package com.bidly.auction_system.repository;

import com.bidly.auction_system.model.UserDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDetailsRepository extends JpaRepository<UserDetails, Long> {
    // ✅ Find UserDetails by User ID
    UserDetails findByUserUserId(Long userId);
}
