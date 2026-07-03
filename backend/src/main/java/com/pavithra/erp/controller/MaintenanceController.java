package com.pavithra.erp.controller;

import com.pavithra.erp.controller.dto.MaintenanceRequest;
import com.pavithra.erp.controller.dto.MaintenanceResponse;
import com.pavithra.erp.service.MaintenanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/maintenance")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @PostMapping
    public ResponseEntity<MaintenanceResponse> addMaintenanceLog(@RequestBody MaintenanceRequest request) {
        return ResponseEntity.ok(maintenanceService.addMaintenanceLog(request));
    }

    @GetMapping
    public ResponseEntity<List<MaintenanceResponse>> getAllMaintenanceLogs() {
        return ResponseEntity.ok(maintenanceService.getAllMaintenanceLogs());
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<MaintenanceResponse>> getLogsByVehicle(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceLogsByVehicle(vehicleId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLog(@PathVariable Long id) {
        maintenanceService.deleteMaintenanceLog(id);
        return ResponseEntity.ok().build();
    }
}
