package com.handloom.controller;

import com.handloom.dto.*;
import com.handloom.model.Campaign;
import com.handloom.service.CampaignService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CampaignController {
    private final CampaignService campaignService;

    @GetMapping("/campaigns/public/active")
    public ResponseEntity<ApiResponse<List<Campaign>>> getActiveCampaigns() {
        return ResponseEntity.ok(ApiResponse.success(campaignService.getActiveCampaigns()));
    }

    @PostMapping("/marketing/campaigns")
    @PreAuthorize("hasRole('MARKETING_SPECIALIST')")
    public ResponseEntity<ApiResponse<Campaign>> createCampaign(@Valid @RequestBody CampaignRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Campaign created", campaignService.createCampaign(req)));
    }

    @GetMapping("/marketing/campaigns")
    @PreAuthorize("hasRole('MARKETING_SPECIALIST')")
    public ResponseEntity<ApiResponse<Page<Campaign>>> getMyCampaigns(
            @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="10") int size) {
        return ResponseEntity.ok(ApiResponse.success(campaignService.getCampaigns(page, size)));
    }

    @PutMapping("/marketing/campaigns/{id}")
    @PreAuthorize("hasRole('MARKETING_SPECIALIST')")
    public ResponseEntity<ApiResponse<Campaign>> updateCampaign(@PathVariable Long id, @Valid @RequestBody CampaignRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Campaign updated", campaignService.updateCampaign(id, req)));
    }

    @PatchMapping("/marketing/campaigns/{id}/status")
    @PreAuthorize("hasRole('MARKETING_SPECIALIST')")
    public ResponseEntity<ApiResponse<Campaign>> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success("Status updated", campaignService.updateCampaignStatus(id, status)));
    }

    @DeleteMapping("/marketing/campaigns/{id}")
    @PreAuthorize("hasRole('MARKETING_SPECIALIST')")
    public ResponseEntity<ApiResponse<Void>> deleteCampaign(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.ok(ApiResponse.success("Campaign deleted", null));
    }
}
