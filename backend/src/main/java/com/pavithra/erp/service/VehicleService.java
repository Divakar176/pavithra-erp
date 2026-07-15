package com.pavithra.erp.service;

import com.pavithra.erp.repository.UserRepository;
import com.pavithra.erp.model.entity.Expense;
import com.pavithra.erp.model.entity.Income;
import com.pavithra.erp.model.entity.Trip;
import com.pavithra.erp.model.entity.Vehicle;
import com.pavithra.erp.repository.ExpenseRepository;
import com.pavithra.erp.repository.IncomeRepository;
import com.pavithra.erp.repository.TripRepository;
import com.pavithra.erp.repository.UserRepository;
import com.pavithra.erp.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository repository;
    private final TripRepository tripRepository;
    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final AuditLogService auditLogService;
    private final UserRepository UserRespository;

    public Vehicle addVehicle(Vehicle vehicle) {
        if (repository.findByVehicleNumber(vehicle.getVehicleNumber()).isPresent()) {
            throw new RuntimeException("Vehicle number already exists: " + vehicle.getVehicleNumber());
        }
        if (vehicle.getIsDeleted() == null) {
            vehicle.setIsDeleted(false);
        }
        return repository.save(vehicle);
    }

    public List<Vehicle> getAllVehicles() {
        return repository.findByIsDeletedFalse();
    }

    public Vehicle getVehicleById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Vehicle not found"));
    }

    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle vehicle = getVehicleById(id);

        // Check for duplicate vehicle number
        repository.findByVehicleNumber(vehicleDetails.getVehicleNumber())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new RuntimeException(
                                "Vehicle number already exists: " + vehicleDetails.getVehicleNumber());
                    }
                });

        vehicle.setVehicleNumber(vehicleDetails.getVehicleNumber());
        vehicle.setType(vehicleDetails.getType());
        vehicle.setStatus(vehicleDetails.getStatus());
        vehicle.setBillingType(vehicleDetails.getBillingType() != null ? vehicleDetails.getBillingType() : "PER_TRIP");
        vehicle.setMaxLoadTons(vehicleDetails.getMaxLoadTons());
        vehicle.setContainerSize(vehicleDetails.getContainerSize());
        vehicle.setPurchasePrice(vehicleDetails.getPurchasePrice());
        vehicle.setMonthlyContractAmount(vehicleDetails.getMonthlyContractAmount());
        vehicle.setRcDetails(vehicleDetails.getRcDetails());
        vehicle.setInsuranceExpiry(vehicleDetails.getInsuranceExpiry());
        vehicle.setFcExpiry(vehicleDetails.getFcExpiry());
        vehicle.setTaxExpiry(vehicleDetails.getTaxExpiry());
        vehicle.setPermitExpiry(vehicleDetails.getPermitExpiry());
        vehicle.setStatePermitExpiry(vehicleDetails.getStatePermitExpiry());
        vehicle.setPollutionExpiry(vehicleDetails.getPollutionExpiry());
        vehicle.setAssignedDriver(vehicleDetails.getAssignedDriver());
        return repository.save(vehicle);
    }

    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle vehicle = getVehicleById(id);
        vehicle.setIsDeleted(true);
        repository.save(vehicle);
        auditLogService.logAction("Deleted Vehicle", "Vehicle", id, "Deleted vehicle: " + vehicle.getVehicleNumber());
    }

    public List<Vehicle> getArchivedVehicles() {
        return repository.findByIsDeletedTrue();
    }

    public void restoreVehicle(Long id) {
        Vehicle vehicle = repository.findById(id).orElseThrow(() -> new RuntimeException("Vehicle not found"));
        vehicle.setIsDeleted(false);
        repository.save(vehicle);
    }
}
