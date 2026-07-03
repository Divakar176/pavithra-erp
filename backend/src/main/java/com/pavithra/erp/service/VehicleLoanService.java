package com.pavithra.erp.service;

import com.pavithra.erp.model.entity.VehicleLoan;
import com.pavithra.erp.repository.VehicleLoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleLoanService {

    private final VehicleLoanRepository vehicleLoanRepository;

    public VehicleLoan addLoan(VehicleLoan loan) {
        return vehicleLoanRepository.save(loan);
    }

    public List<VehicleLoan> getAllLoans() {
        return vehicleLoanRepository.findAll();
    }

    public List<VehicleLoan> getLoansByVehicle(Long vehicleId) {
        return vehicleLoanRepository.findByVehicleId(vehicleId);
    }

    public void deleteLoan(Long id) {
        vehicleLoanRepository.deleteById(id);
    }
}
