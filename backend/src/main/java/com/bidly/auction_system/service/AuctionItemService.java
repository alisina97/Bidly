package com.bidly.auction_system.service;

import com.bidly.auction_system.model.AuctionItem;
import com.bidly.auction_system.model.AuctionType;
import com.bidly.auction_system.model.Category;
import com.bidly.auction_system.repository.AuctionItemRepository;
import com.bidly.auction_system.repository.AuctionTypeRepository;
import com.bidly.auction_system.repository.CategoryRepository;
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

    // ✅ Add a new auction item
    public AuctionItem addAuctionItem(String itemName, String itemDescription, Double startingPrice, Double buyNowPrice, Long auctionTypeId, Long categoryId) {
        AuctionType auctionType = auctionTypeRepository.findById(auctionTypeId).orElseThrow(() -> new RuntimeException("Auction Type not found!"));
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Category not found!"));

        AuctionItem item = new AuctionItem(itemName, itemDescription, startingPrice, buyNowPrice, auctionType, category);
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


    public AuctionItem getAuctionItemById(Long auctionItemId) {
        return auctionItemRepository.findById(auctionItemId).orElse(null);
    }



    public List<AuctionItem> searchAuctionItems(String keyword) {
        return auctionItemRepository.searchAuctionItems(keyword);
    }
}
