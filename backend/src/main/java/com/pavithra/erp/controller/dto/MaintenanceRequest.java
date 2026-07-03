package com.pavithra.erp.controller.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class MaintenanceRequest {
    private Long vehicleId;
    private LocalDate date;
    private String serviceType;
    private String vendorDetails;
    private Double sparePartsCost;
    private Double labourCost;
    private Double totalCost;
    private String billUrl;
}
