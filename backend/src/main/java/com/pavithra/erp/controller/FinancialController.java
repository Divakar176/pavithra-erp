package com.pavithra.erp.controller;

import com.pavithra.erp.service.FinancialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/finances")
@RequiredArgsConstructor
public class FinancialController {

    private final FinancialService financialService;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Double>> getFinancialSummary() {
        // Always returns current month summary — no params required
        return ResponseEntity.ok(financialService.getCurrentMonthSummary());
    }

    @GetMapping("/yearly-trend")
    public ResponseEntity<List<Map<String, Object>>> getYearlyTrend(@RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(financialService.getYearlyProfitTrend(year));
    }

    @GetMapping("/vehicle-profit")
    public ResponseEntity<List<Map<String, Object>>> getVehicleProfit() {
        return ResponseEntity.ok(financialService.getVehicleWiseProfit());
    }

    @GetMapping("/custom-vehicle-report")
    public ResponseEntity<List<Map<String, Object>>> getCustomVehicleReport(
            @RequestParam(defaultValue = "monthly") String period,
            @RequestParam(required = false) Long vehicleId) {
        return ResponseEntity.ok(financialService.getCustomVehicleReport(period, vehicleId));
    }

    @GetMapping("/expense-breakdown")
    public ResponseEntity<Map<String, Double>> getExpenseBreakdown() {
        return ResponseEntity.ok(financialService.getExpenseCategoryBreakdown());
    }

    @GetMapping("/kpis")
    public ResponseEntity<Map<String, Object>> getDashboardKpis() {
        return ResponseEntity.ok(financialService.getDashboardKpis());
    }

    @GetMapping("/period-summary")
    public ResponseEntity<Map<String, Double>> getPeriodSummary(@RequestParam(defaultValue = "monthly") String period) {
        return ResponseEntity.ok(financialService.getPeriodSummary(period));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportOverallReport() {
        String csvData = financialService.generateOverallCsvReport();
        byte[] output = csvData.getBytes();

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=overall_financial_report.csv");
        headers.setContentType(MediaType.parseMediaType("text/csv"));

        return ResponseEntity.ok()
                .headers(headers)
                .body(output);
    }

    @GetMapping("/driver-salaries")
    public ResponseEntity<List<com.pavithra.erp.dto.DriverSalaryResponse>> getDriverSalaries() {
        return ResponseEntity.ok(financialService.getDriverSalaries());
    }

    @GetMapping("/documents")
    public ResponseEntity<List<com.pavithra.erp.model.entity.Expense>> getDocuments() {
        return ResponseEntity.ok(financialService.getDocuments());
    }
}
