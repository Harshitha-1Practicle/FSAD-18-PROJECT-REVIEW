package com.handloom.service;

import com.handloom.dto.ReviewRequest;
import com.handloom.exception.ResourceNotFoundException;
import com.handloom.model.*;
import com.handloom.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Review addReview(Long productId, ReviewRequest req) {
        User buyer = getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        if (reviewRepository.existsByProductAndBuyer(product, buyer))
            throw new IllegalArgumentException("You have already reviewed this product");
        Review review = Review.builder().product(product).buyer(buyer)
                .rating(req.getRating()).comment(req.getComment()).build();
        review = reviewRepository.save(review);
        updateProductRating(product);
        return review;
    }

    public List<Review> getProductReviews(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return reviewRepository.findByProductAndApproved(product, true);
    }

    public Review approveReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        review.setApproved(true);
        review = reviewRepository.save(review);
        updateProductRating(review.getProduct());
        return review;
    }

    private void updateProductRating(Product product) {
        Double avg = reviewRepository.getAverageRatingForProduct(product);
        long count = reviewRepository.findByProductAndApproved(product, true).size();
        product.setAverageRating(avg != null ? avg : 0.0);
        product.setReviewCount((int) count);
        productRepository.save(product);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
