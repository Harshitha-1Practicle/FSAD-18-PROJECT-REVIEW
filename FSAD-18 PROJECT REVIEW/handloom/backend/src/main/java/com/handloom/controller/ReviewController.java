package com.handloom.controller;

import com.handloom.dto.*;
import com.handloom.model.Review;
import com.handloom.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping("/products/public/{productId}/reviews")
    public ResponseEntity<ApiResponse<List<Review>>> getReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getProductReviews(productId)));
    }

    @PostMapping("/buyer/products/{productId}/reviews")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<ApiResponse<Review>> addReview(@PathVariable Long productId, @Valid @RequestBody ReviewRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Review added", reviewService.addReview(productId, req)));
    }

    @PatchMapping("/admin/reviews/{reviewId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Review>> approveReview(@PathVariable Long reviewId) {
        return ResponseEntity.ok(ApiResponse.success("Review approved", reviewService.approveReview(reviewId)));
    }
}
