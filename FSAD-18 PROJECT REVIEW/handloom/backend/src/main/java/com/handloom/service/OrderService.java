package com.handloom.service;

import com.handloom.dto.OrderRequest;
import com.handloom.dto.OrderResponse;
import com.handloom.exception.ResourceNotFoundException;
import com.handloom.model.*;
import com.handloom.repository.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public OrderResponse createOrder(OrderRequest req) {
        User buyer = getCurrentUser();
        List<OrderItem> items = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderRequest.OrderItemRequest itemReq : req.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            if (product.getStockQuantity() < itemReq.getQuantity())
                throw new IllegalArgumentException("Insufficient stock for: " + product.getName());
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subtotal = subtotal.add(itemTotal);
            items.add(OrderItem.builder().product(product).quantity(itemReq.getQuantity())
                    .unitPrice(product.getPrice()).totalPrice(itemTotal).build());
            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            product.setSalesCount(product.getSalesCount() + itemReq.getQuantity());
            productRepository.save(product);
        }

        BigDecimal shipping = subtotal.compareTo(BigDecimal.valueOf(100)) >= 0 ? BigDecimal.ZERO : BigDecimal.valueOf(9.99);
        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.05));
        BigDecimal total = subtotal.add(shipping).add(tax);

        Order order = Order.builder()
                .orderNumber("HL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .buyer(buyer).subtotal(subtotal).shippingCost(shipping).taxAmount(tax).totalAmount(total)
                .shippingFirstName(req.getShippingFirstName()).shippingLastName(req.getShippingLastName())
                .shippingAddress(req.getShippingAddress()).shippingCity(req.getShippingCity())
                .shippingState(req.getShippingState()).shippingCountry(req.getShippingCountry())
                .shippingZipCode(req.getShippingZipCode()).shippingPhone(req.getShippingPhone())
                .paymentMethod(req.getPaymentMethod()).paymentStatus(Order.PaymentStatus.PAID)
                .notes(req.getNotes()).build();
        order = orderRepository.save(order);
        for (OrderItem item : items) { item.setOrder(order); }
        order.setOrderItems(items);
        return toResponse(orderRepository.save(order));
    }

    public Page<OrderResponse> getBuyerOrders(int page, int size) {
        User buyer = getCurrentUser();
        return orderRepository.findByBuyer(buyer, PageRequest.of(page, size, Sort.by("createdAt").descending()))
                .map(this::toResponse);
    }

    public OrderResponse getOrder(Long id) {
        return toResponse(orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found")));
    }

    public Page<OrderResponse> getAllOrders(int page, int size) {
        return orderRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()))
                .map(this::toResponse);
    }

    public OrderResponse updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(Order.OrderStatus.valueOf(status));
        return toResponse(orderRepository.save(order));
    }

    private OrderResponse toResponse(Order o) {
        OrderResponse r = new OrderResponse();
        r.setId(o.getId()); r.setOrderNumber(o.getOrderNumber());
        r.setSubtotal(o.getSubtotal()); r.setShippingCost(o.getShippingCost());
        r.setTaxAmount(o.getTaxAmount()); r.setTotalAmount(o.getTotalAmount());
        r.setStatus(o.getStatus()); r.setPaymentStatus(o.getPaymentStatus());
        r.setShippingAddress(o.getShippingAddress()); r.setShippingCity(o.getShippingCity());
        r.setShippingCountry(o.getShippingCountry()); r.setTrackingNumber(o.getTrackingNumber());
        r.setCreatedAt(o.getCreatedAt());
        r.setOrderItems(o.getOrderItems().stream().map(i -> {
            OrderResponse.OrderItemDto d = new OrderResponse.OrderItemDto();
            d.setProductId(i.getProduct().getId()); d.setProductName(i.getProduct().getName());
            d.setQuantity(i.getQuantity()); d.setUnitPrice(i.getUnitPrice()); d.setTotalPrice(i.getTotalPrice());
            if (!i.getProduct().getImages().isEmpty()) d.setProductImage(i.getProduct().getImages().get(0));
            return d;
        }).collect(Collectors.toList()));
        return r;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
