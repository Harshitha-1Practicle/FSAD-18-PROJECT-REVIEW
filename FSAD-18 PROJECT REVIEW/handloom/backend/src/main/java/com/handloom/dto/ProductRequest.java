package com.handloom.dto;

import com.handloom.model.Product;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequest {
    @NotBlank private String name;
    private String description;
    @NotNull @Positive private BigDecimal price;
    @NotNull private Integer stockQuantity;
    @NotNull private Product.Category category;
    private String fabric;
    private String weaveType;
    private String region;
    private String dimensions;
    private String careInstructions;
    private List<String> images;
}
