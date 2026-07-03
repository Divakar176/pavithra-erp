package com.pavithra.erp.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AiAuditResult {
    private int fraudScore; // 0-100
    private int riskScore; // 0-100
    private String explanation;
    private List<String> recommendations;
    private List<String> suspiciousPatternsDetected;
}
