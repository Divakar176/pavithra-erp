package com.pavithra.erp.repository;

import com.pavithra.erp.model.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByVehicleId(Long vehicleId);
    List<Trip> findByDriverId(Long driverId);
    List<Trip> findByCustomerId(Long customerId);
    List<Trip> findByStatus(String status);
    List<Trip> findByIsDeletedFalse();
    List<Trip> findByIsDeletedTrue();

    @org.springframework.data.jpa.repository.Query("SELECT SUM(t.tripCharges) FROM Trip t WHERE t.isDeleted = false AND t.status = 'COMPLETED' AND COALESCE(t.endDate, t.startDate, CURRENT_DATE) BETWEEN :startDate AND :endDate")
    Double sumTripChargesByDateBetween(@org.springframework.data.repository.query.Param("startDate") java.time.LocalDate startDate, @org.springframework.data.repository.query.Param("endDate") java.time.LocalDate endDate);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(COALESCE(t.dieselCost, 0) + COALESCE(t.driverSalary, 0) + COALESCE(t.foodAmount, 0) + COALESCE(t.materialPurchaseCost, 0)) FROM Trip t WHERE t.isDeleted = false AND t.status = 'COMPLETED' AND COALESCE(t.endDate, t.startDate, CURRENT_DATE) BETWEEN :startDate AND :endDate")
    Double sumTripExpensesByDateBetween(@org.springframework.data.repository.query.Param("startDate") java.time.LocalDate startDate, @org.springframework.data.repository.query.Param("endDate") java.time.LocalDate endDate);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(t.dieselCost) FROM Trip t WHERE t.isDeleted = false AND t.status = 'COMPLETED' AND COALESCE(t.endDate, t.startDate, CURRENT_DATE) BETWEEN :startDate AND :endDate")
    Double sumTripDieselCostByDateBetween(@org.springframework.data.repository.query.Param("startDate") java.time.LocalDate startDate, @org.springframework.data.repository.query.Param("endDate") java.time.LocalDate endDate);
}
