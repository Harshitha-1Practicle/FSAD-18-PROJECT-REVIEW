package com.handloom.service;

import com.handloom.dto.ProductRequest;
import com.handloom.dto.ProductResponse;
import com.handloom.exception.ResourceNotFoundException;
import com.handloom.model.Product;
import com.handloom.model.User;
import com.handloom.repository.ProductRepository;
import com.handloom.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public ProductResponse createProduct(ProductRequest req) {
        User artisan = getCurrentUser();
        Product product = Product.builder()
                .name(req.getName()).description(req.getDescription())
                .price(req.getPrice()).stockQuantity(req.getStockQuantity())
                .category(req.getCategory()).fabric(req.getFabric())
                .weaveType(req.getWeaveType()).region(req.getRegion())
                .dimensions(req.getDimensions()).careInstructions(req.getCareInstructions())
                .images(req.getImages() != null ? req.getImages() : List.of())
                .artisan(artisan).build();
        return toResponse(productRepository.save(product));
    }

    public Page<ProductResponse> searchProducts(String search, String category, BigDecimal minPrice,
                                                 BigDecimal maxPrice, String region, int page, int size, String sort) {
        Product.Category cat = null;
        if (category != null && !category.isBlank()) {
            try { cat = Product.Category.valueOf(category.toUpperCase()); } catch (Exception ignored) {}
        }
        Sort sortObj = sort != null && sort.equals("price_asc") ? Sort.by("price").ascending()
                : sort != null && sort.equals("price_desc") ? Sort.by("price").descending()
                : sort != null && sort.equals("rating") ? Sort.by("averageRating").descending()
                : Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page, size, sortObj);
        return productRepository.searchProducts(search, cat, minPrice, maxPrice, region, pageable)
                .map(this::toResponse);
    }

    public ProductResponse getProduct(Long id) {
        return toResponse(productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found")));
    }

    public ProductResponse updateProduct(Long id, ProductRequest req) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setName(req.getName()); product.setDescription(req.getDescription());
        product.setPrice(req.getPrice()); product.setStockQuantity(req.getStockQuantity());
        product.setCategory(req.getCategory()); product.setFabric(req.getFabric());
        product.setWeaveType(req.getWeaveType()); product.setRegion(req.getRegion());
        if (req.getImages() != null) product.setImages(req.getImages());
        return toResponse(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        productRepository.deleteById(id);
    }

    public Page<ProductResponse> getArtisanProducts(int page, int size) {
        User artisan = getCurrentUser();
        return productRepository.findByArtisan(artisan, PageRequest.of(page, size, Sort.by("createdAt").descending()))
                .map(this::toResponse);
    }

    public List<ProductResponse> getTopSellingProducts() {
        return productRepository.findTopSellingProducts(PageRequest.of(0, 8)).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<ProductResponse> getLatestProducts() {
        return productRepository.findLatestProducts(PageRequest.of(0, 8)).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    private ProductResponse toResponse(Product p) {
        ProductResponse r = modelMapper.map(p, ProductResponse.class);
        r.setArtisanId(p.getArtisan().getId());
        r.setArtisanName(p.getArtisan().getFirstName() + " " + p.getArtisan().getLastName());
        r.setArtisanCountry(p.getArtisan().getCountry());
        return r;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
