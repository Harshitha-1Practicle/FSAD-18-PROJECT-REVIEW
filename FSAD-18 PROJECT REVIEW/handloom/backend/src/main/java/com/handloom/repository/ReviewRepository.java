package com.handloom.repository;

import com.handloom.model.Review;
import com.handloom.model.Product;
import com.handloom.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductAndApproved(Product product, boolean approved);
    boolean existsByProductAndBuyer(Product product, User buyer);
    Page<Review> findByApproved(boolean approved, Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product = :product AND r.approved = true")
    Double getAverageRatingForProduct(Product product);
}
