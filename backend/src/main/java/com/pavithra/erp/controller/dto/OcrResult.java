package com.pavithra.erp.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OcrResult {
    private String vendorName;
    private String gstNumber;
    private LocalDate date;
    private Double amount;
    private String invoiceNumber;
    private String rawText;
}
