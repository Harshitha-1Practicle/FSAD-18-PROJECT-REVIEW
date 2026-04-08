package com.handloom.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data @Builder
public class DashboardStats {
    private long totalUsers;
    private long totalArtisans;
    private long totalBuyers;
    private long totalProducts;
    private long activeProducts;
    private long totalOrders;
    private long pendingOrders;
    private BigDecimal totalRevenue;
    private long totalCampaigns;
    private long activeCampaigns;
}
