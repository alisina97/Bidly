package com.bidly.auction_system.controller;

import com.bidly.auction_system.model.AuctionItem;
import com.bidly.auction_system.service.AuctionItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auction-items")
public class AuctionItemController {

    @Autowired
    private AuctionItemService auctionItemService;

    // ✅ Add a new auction item
    @PostMapping("/add")
    public AuctionItem addAuctionItem(@RequestParam String itemName,
                                      @RequestParam String itemDescription,
                                      @RequestParam Long startingPrice,
                                      @RequestParam Long buyNowPrice,
                                      @RequestParam Long auctionTypeId,
                                      @RequestParam Long categoryId,
                                      @RequestParam Long userId) {  // Added userId
        return auctionItemService.addAuctionItem(itemName, itemDescription, startingPrice, buyNowPrice, auctionTypeId, categoryId, userId);
    }

    // ✅ Get all auction items
    @GetMapping
    public List<AuctionItem> getAllAuctionItems() {
        return auctionItemService.getAllAuctionItems();
    }

    // ✅ Get items by auction type
    @GetMapping("/auction-type/{auctionTypeId}")
    public List<AuctionItem> getItemsByAuctionType(@PathVariable Long auctionTypeId) {
        return auctionItemService.getItemsByAuctionType(auctionTypeId);
    }

    // ✅ Get items by category
    @GetMapping("/category/{categoryId}")
    public List<AuctionItem> getItemsByCategory(@PathVariable Long categoryId) {
        return auctionItemService.getItemsByCategory(categoryId);
    }

    // ✅ Get items by user ID
    @GetMapping("/user/{userId}")
    public List<AuctionItem> getItemsByUser(@PathVariable Long userId) {
        return auctionItemService.getItemsByUser(userId);
    }

    // ✅ Get auction item by ID
    @GetMapping("/{auctionItemId}")
    public ResponseEntity<?> getAuctionItemById(@PathVariable Long auctionItemId) {
        AuctionItem item = auctionItemService.getAuctionItemById(auctionItemId);
        if (item == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(item);
    }

    // ✅ Search items by keyword
    @GetMapping("/search")
    public List<AuctionItem> searchItems(@RequestParam String keyword) {
        return auctionItemService.searchAuctionItems(keyword);
    }
    
    // ✅ Update auction item
    @PutMapping("/update/{auctionItemId}")
    public AuctionItem updateAuctionItem(@PathVariable Long auctionItemId, @RequestBody AuctionItem updatedAuctionItem) {
        AuctionItem updatedItem = auctionItemService.updateAuctionItem(auctionItemId, updatedAuctionItem);
        return updatedItem;  // Return updated auction item
    }

    @GetMapping("/{auctionItemId}/buy-now-price")
    public ResponseEntity<?> getBuyNowPrice(@PathVariable Long auctionItemId) {
        try {
            Long buyNowPrice = auctionItemService.getBuyNowPrice(auctionItemId);
            return ResponseEntity.ok(buyNowPrice);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    



}
