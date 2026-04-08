package com.handloom.service;

import com.handloom.dto.CampaignRequest;
import com.handloom.exception.ResourceNotFoundException;
import com.handloom.model.*;
import com.handloom.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CampaignService {
    private final CampaignRepository campaignRepository;
    private final UserRepository userRepository;

    public Campaign createCampaign(CampaignRequest req) {
        User creator = getCurrentUser();
        Campaign c = Campaign.builder()
                .title(req.getTitle()).description(req.getDescription())
                .bannerImage(req.getBannerImage()).startDate(req.getStartDate())
                .endDate(req.getEndDate()).type(req.getType())
                .targetAudience(req.getTargetAudience()).discountCode(req.getDiscountCode())
                .discountPercentage(req.getDiscountPercentage()).createdBy(creator).build();
        return campaignRepository.save(c);
    }

    public Page<Campaign> getCampaigns(int page, int size) {
        User user = getCurrentUser();
        return campaignRepository.findByCreatedBy(user, PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    public List<Campaign> getActiveCampaigns() {
        LocalDate now = LocalDate.now();
        return campaignRepository.findByStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                Campaign.CampaignStatus.ACTIVE, now, now);
    }

    public Campaign updateCampaignStatus(Long id, String status) {
        Campaign c = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
        c.setStatus(Campaign.CampaignStatus.valueOf(status));
        return campaignRepository.save(c);
    }

    public Campaign updateCampaign(Long id, CampaignRequest req) {
        Campaign c = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
        c.setTitle(req.getTitle()); c.setDescription(req.getDescription());
        c.setStartDate(req.getStartDate()); c.setEndDate(req.getEndDate());
        c.setTargetAudience(req.getTargetAudience()); c.setDiscountCode(req.getDiscountCode());
        c.setDiscountPercentage(req.getDiscountPercentage());
        return campaignRepository.save(c);
    }

    public void deleteCampaign(Long id) { campaignRepository.deleteById(id); }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
