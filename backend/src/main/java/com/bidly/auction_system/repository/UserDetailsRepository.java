package com.bidly.auction_system.repository;

import com.bidly.auction_system.model.UserDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface UserDetailsRepository extends JpaRepository<UserDetails, Long> {
    //  Find UserDetails by User ID
    UserDetails findByUserUserId(Long userId);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM UserDetails u WHERE u.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
}
