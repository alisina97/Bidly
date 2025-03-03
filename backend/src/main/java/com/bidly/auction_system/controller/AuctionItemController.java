package com.bidly.auction_system.controller;

import com.bidly.auction_system.model.AuctionItem;
import com.bidly.auction_system.service.AuctionItemService;
import org.springframework.beans.factory.annotation.Autowired;
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
                                      @RequestParam Double startingPrice,
                                      @RequestParam Double buyNowPrice,
                                      @RequestParam Long auctionTypeId,
                                      @RequestParam Long categoryId) {
        return auctionItemService.addAuctionItem(itemName, itemDescription, startingPrice, buyNowPrice, auctionTypeId, categoryId);
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
}
