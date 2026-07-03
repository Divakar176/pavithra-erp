package com.pavithra.erp.controller.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class MaintenanceResponse {
    private Long id;
    private Long vehicleId;
    private String vehicleNumber;
    private LocalDate date;
    private String serviceType;
    private String vendorDetails;
    private Double sparePartsCost;
    private Double labourCost;
    private Double totalCost;
    private String billUrl;
}
