package com.handloom.dto;

import com.handloom.model.Product;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private Product.Category category;
    private String fabric;
    private String weaveType;
    private String region;
    private String dimensions;
    private String careInstructions;
    private List<String> images;
    private Product.ProductStatus status;
    private Double averageRating;
    private Integer reviewCount;
    private Integer salesCount;
    private Long artisanId;
    private String artisanName;
    private String artisanCountry;
    private LocalDateTime createdAt;
}
