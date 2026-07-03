package com.pavithra.erp.controller;

import com.pavithra.erp.model.entity.VehicleLoan;
import com.pavithra.erp.service.VehicleLoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/loans")
@RequiredArgsConstructor
public class VehicleLoanController {

    private final VehicleLoanService vehicleLoanService;

    @PostMapping
    public ResponseEntity<VehicleLoan> createLoan(@RequestBody VehicleLoan loan) {
        return ResponseEntity.ok(vehicleLoanService.addLoan(loan));
    }

    @GetMapping
    public ResponseEntity<List<VehicleLoan>> getAllLoans() {
        return ResponseEntity.ok(vehicleLoanService.getAllLoans());
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<VehicleLoan>> getLoansByVehicle(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(vehicleLoanService.getLoansByVehicle(vehicleId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoan(@PathVariable Long id) {
        vehicleLoanService.deleteLoan(id);
        return ResponseEntity.noContent().build();
    }
}
