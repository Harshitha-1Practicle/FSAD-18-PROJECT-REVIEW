package com.handloom.dto;

import com.handloom.model.Campaign;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CampaignRequest {
    @NotBlank private String title;
    private String description;
    private String bannerImage;
    @NotNull private LocalDate startDate;
    @NotNull private LocalDate endDate;
    private Campaign.CampaignType type;
    private String targetAudience;
    private String discountCode;
    private Double discountPercentage;
}
