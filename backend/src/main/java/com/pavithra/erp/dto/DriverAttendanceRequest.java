package com.pavithra.erp.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DriverAttendanceRequest {
    private Long driverId;
    private LocalDate date;
    private String status;
    private String remarks;
}
