package com.bidly.auction_system.repository;

import com.bidly.auction_system.model.AuctionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AuctionTypeRepository extends JpaRepository<AuctionType, Long> {
    //  Find auction type by name 
    Optional<AuctionType> findByAuctionTypeName(String auctionTypeName);
}
