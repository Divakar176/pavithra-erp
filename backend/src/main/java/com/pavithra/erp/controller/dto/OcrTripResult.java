package com.pavithra.erp.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OcrTripResult {
    private String customerName;
    private String vehicleNumber;
    private String material;
    private Double loadWeightTons;
    private LocalDate date;
    private String rawText;
}
