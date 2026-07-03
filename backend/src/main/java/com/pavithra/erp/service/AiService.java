package com.pavithra.erp.service;

import com.pavithra.erp.controller.dto.AiAuditResult;
import com.pavithra.erp.model.entity.Expense;
import com.pavithra.erp.model.entity.Trip;
import com.pavithra.erp.repository.ExpenseRepository;
import com.pavithra.erp.repository.TripRepository;
import com.pavithra.erp.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiService {

    private final TripRepository tripRepository;
    private final ExpenseRepository expenseRepository;
    private final VehicleRepository vehicleRepository;

    /**
     * Audits an expense against OCR text. Flags anomalies using real amount thresholds.
     */
    public AiAuditResult auditExpense(Expense expense, String ocrRawText) {
        boolean hasDiscrepancy = false;
        List<String> patterns = new ArrayList<>();

        if (expense.getExpenseType().equalsIgnoreCase("Hotel") && expense.getAmount() > 5000) {
            hasDiscrepancy = true;
            patterns.add("High Hotel Amount (>₹5000)");
        }
        if (expense.getExpenseType().equalsIgnoreCase("Fuel") && expense.getAmount() > 15000) {
            hasDiscrepancy = true;
            patterns.add("High Fuel Cost Anomaly (>₹15000 in one entry)");
        }
        if (ocrRawText != null && !ocrRawText.isBlank()) {
            // If OCR text mentions a vendor but paidTo doesn't match
            if (expense.getPaidTo() != null && !ocrRawText.toLowerCase().contains(expense.getPaidTo().toLowerCase())) {
                hasDiscrepancy = true;
                patterns.add("Vendor Name Mismatch (OCR vs recorded)");
            }
        }

        return AiAuditResult.builder()
                .fraudScore(hasDiscrepancy ? 82 : 10)
                .riskScore(hasDiscrepancy ? 88 : 12)
                .explanation(hasDiscrepancy
                    ? "Anomaly detected: " + String.join("; ", patterns)
                    : "Expense looks normal. Amount is within expected range and all vendor details match.")
                .recommendations(hasDiscrepancy
                    ? List.of("Request manual review by Admin", "Ask driver/operator for original bill", "Cross-check with fuel station records")
                    : List.of("Auto-approve expense", "Archive bill for audit trail"))
                .suspiciousPatternsDetected(patterns)
                .build();
    }

    /**
     * Answers natural language questions using real aggregated DB data.
     */
    public String askBusinessIntelligence(String query) {
        String q = query.toLowerCase();

        // Most profitable route
        if (q.contains("profitable route") || q.contains("best route") || q.contains("top route")) {
            return getMostProfitableRoute();
        }

        // Highest maintenance vehicle
        if (q.contains("maintenance") && (q.contains("highest") || q.contains("most") || q.contains("expensive"))) {
            return getHighestMaintenanceVehicle();
        }

        // Total trips / active trips
        if (q.contains("trip") && (q.contains("total") || q.contains("how many") || q.contains("count"))) {
            long total = tripRepository.count();
            long active = tripRepository.findByStatus("IN_PROGRESS").size();
            long completed = tripRepository.findByStatus("COMPLETED").size();
            return String.format("You have %d total trips recorded — %d currently IN PROGRESS and %d COMPLETED.", total, active, completed);
        }

        // Fuel cost
        if (q.contains("fuel") && (q.contains("total") || q.contains("cost") || q.contains("spent"))) {
            double totalFuel = orZero(expenseRepository.sumAmountGroupByType().stream()
                    .filter(r -> "Fuel".equalsIgnoreCase((String) r[0]))
                    .mapToDouble(r -> r[1] != null ? ((Number) r[1]).doubleValue() : 0.0).sum());
            return String.format("Total fuel expenditure across all trips is ₹%.0f.", totalFuel);
        }

        // Pending trips
        if (q.contains("pending")) {
            long pending = tripRepository.findByStatus("PENDING").size();
            return String.format("There are %d trips with PENDING status waiting to be dispatched.", pending);
        }

        // Fleet count
        if (q.contains("vehicle") || q.contains("fleet")) {
            long vehicles = vehicleRepository.count();
            return String.format("Your fleet currently has %d registered vehicles.", vehicles);
        }

        // Default: give a summary of key metrics
        long totalTrips = tripRepository.count();
        long activeTrips = tripRepository.findByStatus("IN_PROGRESS").size();
        Map<String, Double> typeBreakdown = new HashMap<>();
        for (Object[] row : expenseRepository.sumAmountGroupByType()) {
            typeBreakdown.put((String) row[0], row[1] != null ? ((Number) row[1]).doubleValue() : 0.0);
        }
        double totalExp = typeBreakdown.values().stream().mapToDouble(Double::doubleValue).sum();
        return String.format(
            "Fleet Summary: %d total trips (%d active). Total expenses recorded: ₹%.0f across %d categories. Ask me about profitable routes, fuel costs, or maintenance trends!",
            totalTrips, activeTrips, totalExp, typeBreakdown.size()
        );
    }

    private String getMostProfitableRoute() {
        List<Trip> completedTrips = tripRepository.findByStatus("COMPLETED");
        if (completedTrips.isEmpty()) {
            return "No completed trips found yet. Complete some trips to see route profitability analysis.";
        }

        // Group by "source → destination" and calculate income - expenses
        Map<String, List<Trip>> byRoute = completedTrips.stream()
            .collect(Collectors.groupingBy(t -> t.getSource() + " → " + t.getDestination()));

        String bestRoute = "";
        double bestProfit = Double.NEGATIVE_INFINITY;

        for (Map.Entry<String, List<Trip>> entry : byRoute.entrySet()) {
            double routeIncome = entry.getValue().stream()
                .mapToDouble(t -> t.getTripCharges() != null ? t.getTripCharges() : 0.0).sum();
            double routeExpenses = entry.getValue().stream()
                .mapToDouble(t -> {
                    Double exp = expenseRepository.sumAmountByTripId(t.getId());
                    double salary = t.getDriverSalary() != null ? t.getDriverSalary() : 0.0;
                    return (exp != null ? exp : 0.0) + salary;
                }).sum();
            double routeProfit = routeIncome - routeExpenses;
            if (routeProfit > bestProfit) {
                bestProfit = routeProfit;
                bestRoute = entry.getKey();
            }
        }

        return String.format(
            "Based on your completed trip data, the most profitable route is '%s' with a net profit of ₹%.0f. It had %d trips on record.",
            bestRoute, bestProfit, byRoute.get(bestRoute).size()
        );
    }

    private String getHighestMaintenanceVehicle() {
        List<Object[]> rows = expenseRepository.sumAmountGroupByType();
        // Fallback: scan all maintenance-type expenses grouped by vehicle
        // We'll scan trips and their maintenance expenses
        List<Expense> maintenanceExpenses = expenseRepository.findByExpenseType("Maintenance");
        maintenanceExpenses.addAll(expenseRepository.findByExpenseType("Repair"));

        if (maintenanceExpenses.isEmpty()) {
            return "No maintenance or repair expenses recorded yet.";
        }

        Map<String, Double> vehicleMaintenanceCost = new HashMap<>();
        for (Expense e : maintenanceExpenses) {
            String vNum = "Unknown";
            if (e.getVehicle() != null) {
                vNum = e.getVehicle().getVehicleNumber();
            } else if (e.getTrip() != null && e.getTrip().getVehicle() != null) {
                vNum = e.getTrip().getVehicle().getVehicleNumber();
            }
            vehicleMaintenanceCost.merge(vNum, e.getAmount(), Double::sum);
        }

        String worstVehicle = vehicleMaintenanceCost.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey).orElse("Unknown");
        double worstCost = vehicleMaintenanceCost.getOrDefault(worstVehicle, 0.0);

        return String.format(
            "Vehicle %s has the highest maintenance/repair cost at ₹%.0f. Consider scheduling a full service check.",
            worstVehicle, worstCost
        );
    }

    private double orZero(double val) {
        return Double.isNaN(val) ? 0.0 : val;
    }
}
