package com.handloom.repository;

import com.handloom.model.Product;
import com.handloom.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByArtisan(User artisan, Pageable pageable);

    Page<Product> findByStatus(Product.ProductStatus status, Pageable pageable);

    Page<Product> findByCategory(Product.Category category, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%',:search,'%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%',:search,'%'))) AND " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:region IS NULL OR LOWER(p.region) LIKE LOWER(CONCAT('%',:region,'%')))")
    Page<Product> searchProducts(
            @Param("search") String search,
            @Param("category") Product.Category category,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("region") String region,
            Pageable pageable
    );

    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' ORDER BY p.salesCount DESC")
    List<Product> findTopSellingProducts(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' ORDER BY p.createdAt DESC")
    List<Product> findLatestProducts(Pageable pageable);

    long countByStatus(Product.ProductStatus status);

    long countByArtisan(User artisan);
}
