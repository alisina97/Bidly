package com.bidly.auction_system.controller;

import com.bidly.auction_system.model.Category;
import com.bidly.auction_system.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // ✅ Add a new category
    @PostMapping("/add")
    public Category addCategory(@RequestParam String categoryName) {
        return categoryService.addCategory(categoryName);
    }

    // ✅ Get all categories
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    // ✅ Get a category by ID
    @GetMapping("/{categoryId}")
    public Category getCategoryById(@PathVariable Long categoryId) {
        return categoryService.getCategoryById(categoryId);
    }
}
