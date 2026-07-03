package com.pavithra.erp.repository;

import com.pavithra.erp.model.entity.VehicleLoan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleLoanRepository extends JpaRepository<VehicleLoan, Long> {
    List<VehicleLoan> findByVehicleId(Long vehicleId);
    List<VehicleLoan> findByStatus(String status);
}
