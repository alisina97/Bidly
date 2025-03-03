package com.bidly.auction_system.service;

import com.bidly.auction_system.model.Category;
import com.bidly.auction_system.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // ✅ Add a new category
    public Category addCategory(String categoryName) {
        Optional<Category> existingCategory = categoryRepository.findByCategoryName(categoryName);
        if (existingCategory.isPresent()) {
            throw new RuntimeException("Category with this name already exists!");
        }
        Category category = new Category(categoryName);
        return categoryRepository.save(category);
    }

    // ✅ Get all categories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // ✅ Get a category by ID
    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found!"));
    }
}
