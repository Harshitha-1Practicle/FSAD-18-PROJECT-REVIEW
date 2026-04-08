package com.handloom.controller;

import com.handloom.dto.*;
import com.handloom.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping("/products/public/search")
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> search(
            @RequestParam(required=false) String search,
            @RequestParam(required=false) String category,
            @RequestParam(required=false) BigDecimal minPrice,
            @RequestParam(required=false) BigDecimal maxPrice,
            @RequestParam(required=false) String region,
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="12") int size,
            @RequestParam(required=false) String sort) {
        return ResponseEntity.ok(ApiResponse.success(productService.searchProducts(search, category, minPrice, maxPrice, region, page, size, sort)));
    }

    @GetMapping("/products/public/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(productService.getProduct(id)));
    }

    @GetMapping("/products/public/top-selling")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getTopSelling() {
        return ResponseEntity.ok(ApiResponse.success(productService.getTopSellingProducts()));
    }

    @GetMapping("/products/public/latest")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getLatest() {
        return ResponseEntity.ok(ApiResponse.success(productService.getLatestProducts()));
    }

    @PostMapping("/artisan/products")
    @PreAuthorize("hasRole('ARTISAN')")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody ProductRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Product created", productService.createProduct(req)));
    }

    @GetMapping("/artisan/products")
    @PreAuthorize("hasRole('ARTISAN')")
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getMyProducts(
            @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="10") int size) {
        return ResponseEntity.ok(ApiResponse.success(productService.getArtisanProducts(page, size)));
    }

    @PutMapping("/artisan/products/{id}")
    @PreAuthorize("hasRole('ARTISAN')")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Product updated", productService.updateProduct(id, req)));
    }

    @DeleteMapping("/artisan/products/{id}")
    @PreAuthorize("hasRole('ARTISAN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted", null));
    }
}
