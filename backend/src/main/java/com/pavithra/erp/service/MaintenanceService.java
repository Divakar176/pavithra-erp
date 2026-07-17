package com.pavithra.erp.service;

import com.pavithra.erp.controller.dto.MaintenanceRequest;
import com.pavithra.erp.controller.dto.MaintenanceResponse;
import com.pavithra.erp.model.entity.MaintenanceLog;
import com.pavithra.erp.model.entity.Vehicle;
import com.pavithra.erp.repository.MaintenanceLogRepository;
import com.pavithra.erp.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceLogRepository maintenanceLogRepository;
    private final VehicleRepository vehicleRepository;

    public MaintenanceResponse addMaintenanceLog(MaintenanceRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        MaintenanceLog log = MaintenanceLog.builder()
                .vehicle(vehicle)
                .date(request.getDate())
                .serviceType(request.getServiceType())
                .vendorDetails(request.getVendorDetails())
                .sparePartsCost(request.getSparePartsCost())
                .labourCost(request.getLabourCost())
                .totalCost(request.getTotalCost())
                .billUrl(request.getBillUrl())
                .build();

        MaintenanceLog saved = maintenanceLogRepository.save(log);
        return mapToResponse(saved);
    }

    public MaintenanceResponse updateMaintenanceLog(Long id, MaintenanceRequest request) {
        MaintenanceLog log = maintenanceLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance log not found"));
        
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        log.setVehicle(vehicle);
        log.setDate(request.getDate());
        log.setServiceType(request.getServiceType());
        log.setVendorDetails(request.getVendorDetails());
        log.setSparePartsCost(request.getSparePartsCost());
        log.setLabourCost(request.getLabourCost());
        log.setTotalCost(request.getTotalCost());
        log.setBillUrl(request.getBillUrl());

        MaintenanceLog updated = maintenanceLogRepository.save(log);
        return mapToResponse(updated);
    }

    public List<MaintenanceResponse> getAllMaintenanceLogs() {
        return maintenanceLogRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<MaintenanceResponse> getMaintenanceLogsByVehicle(Long vehicleId) {
        return maintenanceLogRepository.findByVehicleId(vehicleId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteMaintenanceLog(Long id) {
        maintenanceLogRepository.deleteById(id);
    }

    private MaintenanceResponse mapToResponse(MaintenanceLog log) {
        return MaintenanceResponse.builder()
                .id(log.getId())
                .vehicleId(log.getVehicle().getId())
                .vehicleNumber(log.getVehicle().getVehicleNumber())
                .date(log.getDate())
                .serviceType(log.getServiceType())
                .vendorDetails(log.getVendorDetails())
                .sparePartsCost(log.getSparePartsCost())
                .labourCost(log.getLabourCost())
                .totalCost(log.getTotalCost())
                .billUrl(log.getBillUrl())
                .build();
    }
}
