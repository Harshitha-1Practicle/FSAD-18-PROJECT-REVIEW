package com.handloom.service;

import com.handloom.dto.DashboardStats;
import com.handloom.model.*;
import com.handloom.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final CampaignRepository campaignRepository;

    public DashboardStats getDashboardStats() {
        BigDecimal revenue = orderRepository.getTotalRevenue();
        return DashboardStats.builder()
                .totalUsers(userRepository.count())
                .totalArtisans(userRepository.countByRole(User.Role.ARTISAN))
                .totalBuyers(userRepository.countByRole(User.Role.BUYER))
                .totalProducts(productRepository.count())
                .activeProducts(productRepository.countByStatus(Product.ProductStatus.ACTIVE))
                .totalOrders(orderRepository.count())
                .pendingOrders(orderRepository.countByStatus(Order.OrderStatus.PENDING))
                .totalRevenue(revenue != null ? revenue : BigDecimal.ZERO)
                .totalCampaigns(campaignRepository.count())
                .activeCampaigns(campaignRepository.findByStatus(Campaign.CampaignStatus.ACTIVE).size())
                .build();
    }

    public Page<User> getAllUsers(int page, int size) {
        return userRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    public User updateUserStatus(Long id, boolean active) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(active);
        return userRepository.save(user);
    }

    public void deleteUser(Long id) { userRepository.deleteById(id); }
}
