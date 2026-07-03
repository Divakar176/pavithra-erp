package com.pavithra.erp.repository;

import com.pavithra.erp.model.entity.MaintenanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog, Long> {
    List<MaintenanceLog> findByVehicleId(Long vehicleId);
    List<MaintenanceLog> findByDateBetween(LocalDate startDate, LocalDate endDate);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(m.totalCost) FROM MaintenanceLog m WHERE m.date BETWEEN :startDate AND :endDate")
    Double sumTotalCostByDateBetween(@org.springframework.data.repository.query.Param("startDate") LocalDate startDate, @org.springframework.data.repository.query.Param("endDate") LocalDate endDate);

    @org.springframework.data.jpa.repository.Query("SELECT MONTH(m.date), SUM(m.totalCost) FROM MaintenanceLog m WHERE YEAR(m.date) = :year GROUP BY MONTH(m.date)")
    List<Object[]> monthlyMaintenanceTotals(@org.springframework.data.repository.query.Param("year") int year);
}
