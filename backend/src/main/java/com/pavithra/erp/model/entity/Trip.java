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
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(nullable = false)
    private String source;

    @Column(nullable = true)
    private String destination;

    private String material; // Blue Metal, Sand, Cement, etc.

    private Double loadWeight;

    @Column(nullable = false)
    private Double tripCharges;

    @Column(nullable = false)
    private String status; // PENDING, IN_PROGRESS, COMPLETED, CANCELLED

    @Builder.Default
    @Column(nullable = false, length = 20)
    private String paymentStatus = "UNPAID"; // UNPAID, PAID

    private LocalDate startDate;

    private LocalDate endDate; // set when trip is completed

    private Double distanceKm;

    private Double advancePaid; // advance given to driver before trip

    private Double driverSalary; // salary budgeted/paid for this trip

    private Double foodAmount; // driver bata/food allowance

    private Double materialPurchaseCost; // owner's own money spent to buy material before trip

    private Double dieselCost; // exact manual diesel cost

    // Fields for JCB / Heavy Machinery
    private Double startMeter;
    
    private Double endMeter;

    private String startTime; // Format HH:mm

    private String endTime; // Format HH:mm

    private Double breakHours;
    
    private Double totalHours;

    // Live Tracking Fields
    private Double currentLatitude;
    private Double currentLongitude;
    private LocalDateTime lastLocationUpdate;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isDeleted = false;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "trip")
    private java.util.List<Expense> expenses;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
