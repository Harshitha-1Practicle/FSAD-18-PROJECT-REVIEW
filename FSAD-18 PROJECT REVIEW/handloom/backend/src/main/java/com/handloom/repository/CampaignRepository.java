package com.handloom.repository;

import com.handloom.model.Campaign;
import com.handloom.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    Page<Campaign> findByCreatedBy(User user, Pageable pageable);
    List<Campaign> findByStatus(Campaign.CampaignStatus status);
    List<Campaign> findByStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
        Campaign.CampaignStatus status, LocalDate start, LocalDate end);
}
