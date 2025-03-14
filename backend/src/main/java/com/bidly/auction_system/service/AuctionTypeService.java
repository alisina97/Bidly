package com.bidly.auction_system.service;

import com.bidly.auction_system.model.AuctionType;
import com.bidly.auction_system.repository.AuctionTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuctionTypeService {

    @Autowired
    private AuctionTypeRepository auctionTypeRepository;

    // Add a new auction type
    public AuctionType addAuctionType(String auctionTypeName) {
        Optional<AuctionType> existingAuctionType = auctionTypeRepository.findByAuctionTypeName(auctionTypeName);
        if (existingAuctionType.isPresent()) {
            throw new RuntimeException("Auction Type with this name already exists!");
        }
        AuctionType auctionType = new AuctionType(auctionTypeName);
        return auctionTypeRepository.save(auctionType);
    }

    // Get all auction types
    public List<AuctionType> getAllAuctionTypes() {
        return auctionTypeRepository.findAll();
    }

    // Get an auction type by ID
    public AuctionType getAuctionTypeById(Long auctionTypeId) {
        return auctionTypeRepository.findById(auctionTypeId)
                .orElseThrow(() -> new RuntimeException("Auction Type not found!"));
    }
}
