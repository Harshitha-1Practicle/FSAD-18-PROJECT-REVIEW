package com.handloom.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    @NotNull private List<OrderItemRequest> items;
    @NotBlank private String shippingFirstName;
    @NotBlank private String shippingLastName;
    @NotBlank private String shippingAddress;
    @NotBlank private String shippingCity;
    @NotBlank private String shippingState;
    @NotBlank private String shippingCountry;
    @NotBlank private String shippingZipCode;
    private String shippingPhone;
    private String paymentMethod;
    private String notes;

    @Data
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
    }
}
