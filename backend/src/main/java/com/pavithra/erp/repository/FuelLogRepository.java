package com.pavithra.erp.repository;

import com.pavithra.erp.model.entity.FuelLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FuelLogRepository extends JpaRepository<FuelLog, Long> {
    List<FuelLog> findByVehicleId(Long vehicleId);
    List<FuelLog> findByDateBetween(LocalDate startDate, LocalDate endDate);
}
