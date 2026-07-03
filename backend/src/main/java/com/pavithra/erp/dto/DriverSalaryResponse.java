package com.pavithra.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriverSalaryResponse {
    private Long driverId;
    private String driverName;
    private String mobile;
    private Double totalTripSalary;
    private Double totalAdvances;
    private Double netPayable;
    private Integer totalTrips;
}
