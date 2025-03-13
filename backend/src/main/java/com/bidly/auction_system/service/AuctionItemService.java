package com.bidly.auction_system.service;

import com.bidly.auction_system.model.AuctionItem;
import com.bidly.auction_system.model.AuctionType;
import com.bidly.auction_system.model.Category;
import com.bidly.auction_system.model.Users;
import com.bidly.auction_system.repository.AuctionItemRepository;
import com.bidly.auction_system.repository.AuctionTypeRepository;
import com.bidly.auction_system.repository.CategoryRepository;
import com.bidly.auction_system.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuctionItemService {

    @Autowired
    private AuctionItemRepository auctionItemRepository;

    @Autowired
    private AuctionTypeRepository auctionTypeRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UsersRepository usersRepository; // Added repository for Users

    // ✅ Add a new auction item
    public AuctionItem addAuctionItem(String itemName, String itemDescription, Long startingPrice, Long buyNowPrice, Long auctionTypeId, Long categoryId, Long userId) {
        AuctionType auctionType = auctionTypeRepository.findById(auctionTypeId)
                .orElseThrow(() -> new RuntimeException("Auction Type not found!"));
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found!"));
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!")); // Fetch user

        AuctionItem item = new AuctionItem(itemName, itemDescription, startingPrice, buyNowPrice, auctionType, category, user);
        return auctionItemRepository.save(item);
    }

    // ✅ Get all auction items
    public List<AuctionItem> getAllAuctionItems() {
        return auctionItemRepository.findAll();
    }

    // ✅ Get auction items by auction type
    public List<AuctionItem> getItemsByAuctionType(Long auctionTypeId) {
        return auctionItemRepository.findByAuctionTypeAuctionTypeId(auctionTypeId);
    }

    // ✅ Get auction items by category
    public List<AuctionItem> getItemsByCategory(Long categoryId) {
        return auctionItemRepository.findByCategoryCategoryId(categoryId);
    }

    // ✅ Get auction items by user ID
    public List<AuctionItem> getItemsByUser(Long userId) {
        return auctionItemRepository.findByUserUserId(userId);
    }

    // ✅ Get auction item by ID
    public AuctionItem getAuctionItemById(Long auctionItemId) {
        return auctionItemRepository.findById(auctionItemId).orElse(null);
    }

    // ✅ Search auction items by keyword
    public List<AuctionItem> searchAuctionItems(String keyword) {
        return auctionItemRepository.searchAuctionItems(keyword);
    }

    public Long getBuyNowPrice(Long auctionItemId) {
        AuctionItem item = auctionItemRepository.findById(auctionItemId)
                .orElseThrow(() -> new RuntimeException("Auction item not found!"));
    
        if (item.getBuyNowPrice() == null) {
            throw new RuntimeException("Buy Now price is not set for this auction item.");
        }
    
        return item.getBuyNowPrice();
    }
    
    
    public AuctionItem updateAuctionItem(Long auctionItemId, AuctionItem updatedAuctionItem) {
        // Find the existing auction item by ID
        AuctionItem existingAuctionItem = auctionItemRepository.findByAuctionItemId(auctionItemId);

        // Update buy now price
        existingAuctionItem.setBuyNowPrice(updatedAuctionItem.getBuyNowPrice());

        // Save and return the updated auction item
        return auctionItemRepository.save(existingAuctionItem);
    }
}
