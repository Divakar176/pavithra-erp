package com.pavithra.erp.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String vehicleNumber;

    @Column(nullable = false)
    private String type; // Lorry, Container Lorry, JCB, Tractor, Harvesting Machine, etc.

    @Column(nullable = false)
    private String status = "Active"; // Active, Maintenance, In-Trip

    private String billingType = "PER_TRIP"; // PER_TRIP or MONTHLY

    private Integer maxLoadTons;
    private String containerSize; // e.g., "20ft", "24ft", "32ft"

    private Double purchasePrice; // Initial investment / cost of the vehicle

    private String rcDetails;

    private LocalDate insuranceExpiry;
    
    private LocalDate fcExpiry;
    
    private LocalDate taxExpiry;
    
    private LocalDate permitExpiry;
    
    private LocalDate pollutionExpiry;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isDeleted = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
