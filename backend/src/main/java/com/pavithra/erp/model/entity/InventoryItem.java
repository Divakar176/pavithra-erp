package com.pavithra.erp.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "inventory_items")
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String itemName;

    private String sku; // Serial Number or Part Number

    @Column(nullable = false)
    private String category; // e.g., TIRES, OIL, BRAKES, GENERAL

    @Column(nullable = false)
    private Integer stockQuantity; // Current stock level

    @Column(nullable = false)
    private Integer reorderLevel; // Alert threshold

    private Double unitPrice; // Cost per unit

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
