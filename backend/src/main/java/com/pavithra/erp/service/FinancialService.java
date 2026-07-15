package com.pavithra.erp.service;

import com.pavithra.erp.repository.ExpenseRepository;
import com.pavithra.erp.repository.IncomeRepository;
import com.pavithra.erp.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FinancialService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final TripRepository tripRepository;
    private final com.pavithra.erp.repository.VehicleRepository vehicleRepository;
    private final com.pavithra.erp.repository.MaintenanceLogRepository maintenanceLogRepository;

    /**
     * Returns P&L summary for the CURRENT month automatically.
     */
    public Map<String, Double> getCurrentMonthSummary() {
        YearMonth now = YearMonth.now();
        return calculateMonthlyProfit(now.getYear(), now.getMonthValue());
    }

    public Map<String, Double> calculateMonthlyProfit(int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        Double ledgerIncome = incomeRepository.sumAmountByDateBetween(startDate, endDate);
        Double ledgerExpense = expenseRepository.sumAmountByDateBetween(startDate, endDate);
        Double tripIncome = tripRepository.sumTripChargesByDateBetween(startDate, endDate);
        Double tripExpense = tripRepository.sumTripExpensesByDateBetween(startDate, endDate);
        Double maintenanceExpense = maintenanceLogRepository.sumTotalCostByDateBetween(startDate, endDate);

        double totalIncome = (ledgerIncome != null ? ledgerIncome : 0.0) + (tripIncome != null ? tripIncome : 0.0);
        double totalExpense = (ledgerExpense != null ? ledgerExpense : 0.0) + (tripExpense != null ? tripExpense : 0.0)
                + (maintenanceExpense != null ? maintenanceExpense : 0.0);

        double netProfit = totalIncome - totalExpense;

        Map<String, Double> result = new HashMap<>();
        result.put("totalIncome", totalIncome);
        result.put("totalExpense", totalExpense);
        result.put("netProfit", netProfit);
        return result;
    }

    /**
     * Returns month-by-month income, expense, and net profit for the current year.
     * Used for the bar/line chart on the Finances page.
     */
    public List<Map<String, Object>> getYearlyProfitTrend() {
        int year = java.time.Year.now().getValue();
        String[] monthNames = { "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };

        // Build month -> total maps
        List<Object[]> incomeRows = incomeRepository.monthlyIncomeTotals(year);
        List<Object[]> expenseRows = expenseRepository.monthlyExpenseTotals(year);
        List<Object[]> maintenanceRows = maintenanceLogRepository.monthlyMaintenanceTotals(year);

        Map<Integer, Double> incomeMap = new HashMap<>();
        Map<Integer, Double> expenseMap = new HashMap<>();
        for (int m = 1; m <= 12; m++) {
            incomeMap.put(m, 0.0);
            expenseMap.put(m, 0.0);
        }

        for (Object[] row : incomeRows) {
            incomeMap.put(((Number) row[0]).intValue(), row[1] != null ? ((Number) row[1]).doubleValue() : 0.0);
        }
        for (Object[] row : expenseRows) {
            expenseMap.put(((Number) row[0]).intValue(), row[1] != null ? ((Number) row[1]).doubleValue() : 0.0);
        }
        for (Object[] row : maintenanceRows) {
            int m = ((Number) row[0]).intValue();
            double val = row[1] != null ? ((Number) row[1]).doubleValue() : 0.0;
            expenseMap.put(m, expenseMap.get(m) + val);
        }

        List<Map<String, Object>> result = new java.util.ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            double inc = incomeMap.get(m);
            double exp = expenseMap.get(m);
            Map<String, Object> entry = new HashMap<>();
            entry.put("month", monthNames[m - 1]);
            entry.put("income", inc);
            entry.put("expense", exp);
            entry.put("profit", inc - exp);
            result.add(entry);
        }
        return result;
    }

    /**
     * Returns expense breakdown by category for the donut chart.
     */
    public Map<String, Double> getExpenseCategoryBreakdown() {
        List<Object[]> rows = expenseRepository.sumAmountGroupByType();
        Map<String, Double> result = new HashMap<>();
        for (Object[] row : rows) {
            String type = (String) row[0];
            Double total = row[1] != null ? ((Number) row[1]).doubleValue() : 0.0;
            result.put(type, total);
        }

        // Add maintenance costs
        Double totalMaintenance = maintenanceLogRepository.sumTotalCostByDateBetween(LocalDate.of(2000, 1, 1),
                LocalDate.now().plusYears(100));
        if (totalMaintenance != null && totalMaintenance > 0) {
            result.put("Maintenance", totalMaintenance);
        }

        return result;
    }

    /**
     * Returns P&L summary for TODAY automatically.
     */
    public Map<String, Double> getTodaySummary() {
        LocalDate today = LocalDate.now();
        Double ledgerIncome = incomeRepository.sumAmountByDateBetween(today, today);
        Double ledgerExpense = expenseRepository.sumAmountByDateBetween(today, today);
        Double tripIncome = tripRepository.sumTripChargesByDateBetween(today, today);
        Double tripExpense = tripRepository.sumTripExpensesByDateBetween(today, today);
        Double maintenanceExpense = maintenanceLogRepository.sumTotalCostByDateBetween(today, today);

        double totalIncome = (ledgerIncome != null ? ledgerIncome : 0.0) + (tripIncome != null ? tripIncome : 0.0);
        double totalExpense = (ledgerExpense != null ? ledgerExpense : 0.0) + (tripExpense != null ? tripExpense : 0.0)
                + (maintenanceExpense != null ? maintenanceExpense : 0.0);

        double netProfit = totalIncome - totalExpense;

        Map<String, Double> result = new HashMap<>();
        result.put("totalIncome", totalIncome);
        result.put("totalExpense", totalExpense);
        result.put("netProfit", netProfit);
        return result;
    }

    /**
     * Returns top-level KPIs: activeTrips, totalVehicles, monthlyRevenue,
     * monthlyExpense, and today metrics.
     */
    public Map<String, Object> getDashboardKpis() {
        Map<String, Double> monthly = getCurrentMonthSummary();
        Map<String, Double> today = getTodaySummary();
        long activeTrips = tripRepository.findByStatus("IN_PROGRESS").size()
                + tripRepository.findByStatus("PENDING").size();
        // Since we don't have vehicleRepo injected here natively, we use trip count as
        // a placeholder,
        // but for exact total vehicles we really need vehicleRepository.
        // For the sake of the dashboard, the frontend will just use the length of the
        // /vehicles array anyway.

        Map<String, Object> kpis = new HashMap<>();
        kpis.put("activeTrips", activeTrips);
        kpis.put("monthlyRevenue", monthly.get("totalIncome"));
        kpis.put("monthlyExpense", monthly.get("totalExpense"));
        kpis.put("netProfit", monthly.get("netProfit"));
        kpis.put("todayIncome", today.get("totalIncome"));
        kpis.put("todayExpense", today.get("totalExpense"));
        kpis.put("todayProfit", today.get("netProfit"));
        return kpis;
    }

    public List<Map<String, Object>> getVehicleWiseProfit() {
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        List<com.pavithra.erp.model.entity.Vehicle> vehicles = vehicleRepository.findAll();
        LocalDate startOfMonth = YearMonth.now().atDay(1);
        LocalDate endOfMonth = YearMonth.now().atEndOfMonth();

        List<com.pavithra.erp.model.entity.Trip> allTrips = tripRepository.findAll();
        List<com.pavithra.erp.model.entity.Expense> allExpenses = expenseRepository.findAll();

        for (com.pavithra.erp.model.entity.Vehicle v : vehicles) {
            double totalIncome = 0;
            for (com.pavithra.erp.model.entity.Trip t : allTrips) {
                if (t.getVehicle() != null && t.getVehicle().getId().equals(v.getId())
                        && t.getEndDate() != null && !t.getEndDate().isBefore(startOfMonth)
                        && !t.getEndDate().isAfter(endOfMonth)) {
                    totalIncome += (t.getTripCharges() != null ? t.getTripCharges() : 0);
                }
            }

            double totalExpense = 0;
            for (com.pavithra.erp.model.entity.Expense e : allExpenses) {
                if (e.getVehicle() != null && e.getVehicle().getId().equals(v.getId())
                        && !e.getDate().isBefore(startOfMonth) && !e.getDate().isAfter(endOfMonth)) {
                    totalExpense += (e.getAmount() != null ? e.getAmount() : 0);
                }
            }

            Map<String, Object> map = new HashMap<>();
            map.put("vehicleNumber", v.getVehicleNumber());
            map.put("income", totalIncome);
            map.put("expense", totalExpense);
            map.put("profit", totalIncome - totalExpense);
            result.add(map);
        }
        result.sort((a, b) -> Double.compare((Double) b.get("profit"), (Double) a.get("profit")));
        return result;
    }

    public List<Map<String, Object>> getCustomVehicleReport(String period, Long vehicleId) {
        LocalDate startDate;
        LocalDate endDate = LocalDate.now();

        switch (period != null ? period.toLowerCase() : "all_time") {
            case "daily":
                startDate = endDate;
                break;
            case "weekly":
                startDate = endDate.minusDays(endDate.getDayOfWeek().getValue() - 1);
                break;
            case "yearly":
                startDate = endDate.withDayOfYear(1);
                break;
            case "monthly":
                startDate = endDate.withDayOfMonth(1);
                break;
            case "all_time":
            default:
                startDate = LocalDate.of(2000, 1, 1);
                break;
        }

        List<com.pavithra.erp.model.entity.Vehicle> targetVehicles = new java.util.ArrayList<>();
        if (vehicleId != null) {
            vehicleRepository.findById(vehicleId).ifPresent(targetVehicles::add);
        } else {
            targetVehicles = vehicleRepository.findAll();
        }

        List<Map<String, Object>> reportList = new java.util.ArrayList<>();

        List<com.pavithra.erp.model.entity.Trip> allTrips = tripRepository.findAll();
        List<com.pavithra.erp.model.entity.Expense> allExpenses = expenseRepository.findAll();
        // add new lines because vehicle wise not showing properly
        List<com.pavithra.erp.model.entity.MaintenanceLog> allMaintenance = maintenanceLogRepository.findAll();

        for (com.pavithra.erp.model.entity.Vehicle v : targetVehicles) {
            double tripRevenue = 0;
            double tripDiesel = 0;
            double tripSalary = 0;
            double tripFood = 0;
            double tripMaterialPurchase = 0;

            for (com.pavithra.erp.model.entity.Trip t : allTrips) {
                if (t.getVehicle() != null && t.getVehicle().getId().equals(v.getId()) &&
                        t.getEndDate() != null && !t.getEndDate().isBefore(startDate)
                        && !t.getEndDate().isAfter(endDate)) {
                    tripRevenue += (t.getTripCharges() != null ? t.getTripCharges() : 0);
                    tripDiesel += (t.getDieselCost() != null ? t.getDieselCost() : 0);
                    tripSalary += (t.getDriverSalary() != null ? t.getDriverSalary() : 0);
                    tripFood += (t.getFoodAmount() != null ? t.getFoodAmount() : 0);
                    tripMaterialPurchase += (t.getMaterialPurchaseCost() != null ? t.getMaterialPurchaseCost() : 0);
                }
            }

            double externalDiesel = 0;
            double externalSalary = 0;
            double maintenance = 0;
            double otherExpenses = 0;

            for (com.pavithra.erp.model.entity.Expense e : allExpenses) {
                if (e.getVehicle() != null && e.getVehicle().getId().equals(v.getId())
                        && e.getDate() != null && !e.getDate().isBefore(startDate) && !e.getDate().isAfter(endDate)) {

                    double amt = e.getAmount() != null ? e.getAmount() : 0;
                    String type = e.getExpenseType() != null ? e.getExpenseType() : "";

                    if (type.equalsIgnoreCase("Fuel")) {
                        externalDiesel += amt;
                    } else if (type.equalsIgnoreCase("Driver Salary")) {
                        externalSalary += amt;
                    } else if (type.equalsIgnoreCase("Maintenance") || type.equalsIgnoreCase("Repair")) {
                        maintenance += amt;
                    } else {
                        otherExpenses += amt;
                    }
                }
            }
            // this is new loop

            for (com.pavithra.erp.model.entity.MaintenanceLog m : allMaintenance) {
                if (m.getVehicle() != null && m.getVehicle().getId().equals(v.getId())
                        && m.getDate() != null && !m.getDate().isBefore(startDate) && !m.getDate().isAfter(endDate)) {

                    maintenance += (m.getTotalCost() != null ? m.getTotalCost() : 0);
                }
            }

            double totalDiesel = tripDiesel + externalDiesel;
            double totalSalary = tripSalary + externalSalary;
            double totalFood = tripFood;
            otherExpenses += tripMaterialPurchase;

            double totalExpense = totalDiesel + totalSalary + totalFood + maintenance + otherExpenses;
            double netProfit = tripRevenue - totalExpense;

            Map<String, Object> map = new HashMap<>();
            map.put("vehicleId", v.getId());
            map.put("vehicleNumber", v.getVehicleNumber());
            map.put("revenue", tripRevenue);
            map.put("dieselCost", totalDiesel);
            map.put("driverSalary", totalSalary);
            map.put("foodCost", totalFood);
            map.put("maintenanceCost", maintenance);
            map.put("otherExpenses", otherExpenses);
            map.put("totalExpense", totalExpense);
            map.put("netProfit", netProfit);

            reportList.add(map);
        }

        reportList.sort((a, b) -> Double.compare((Double) b.get("netProfit"), (Double) a.get("netProfit")));
        return reportList;
    }

    public Map<String, Double> getPeriodSummary(String period) {
        LocalDate startDate;
        LocalDate endDate = LocalDate.now();

        switch (period.toLowerCase()) {
            case "all_time":
                startDate = LocalDate.of(2000, 1, 1);
                break;
            case "daily":
                startDate = endDate;
                break;
            case "weekly":
                startDate = endDate.minusDays(endDate.getDayOfWeek().getValue() - 1); // Start of week (Monday)
                break;
            case "yearly":
                startDate = endDate.withDayOfYear(1); // Start of year
                break;
            case "monthly":
            default:
                startDate = endDate.withDayOfMonth(1); // Start of month
                break;
        }

        Double ledgerIncome = incomeRepository.sumAmountByDateBetween(startDate, endDate);
        Double ledgerExpense = expenseRepository.sumAmountByDateBetween(startDate, endDate);
        Double dieselSpend = expenseRepository.sumAmountByDateBetweenAndExpenseType(startDate, endDate, "Fuel");

        Double tripIncome = tripRepository.sumTripChargesByDateBetween(startDate, endDate);
        Double tripExpenses = tripRepository.sumTripExpensesByDateBetween(startDate, endDate);
        Double maintenanceExpense = maintenanceLogRepository.sumTotalCostByDateBetween(startDate, endDate);

        double totalIncome = (ledgerIncome != null ? ledgerIncome : 0.0) + (tripIncome != null ? tripIncome : 0.0);
        double totalExpense = (ledgerExpense != null ? ledgerExpense : 0.0)
                + (tripExpenses != null ? tripExpenses : 0.0) + (maintenanceExpense != null ? maintenanceExpense : 0.0);
        if (dieselSpend == null)
            dieselSpend = 0.0;

        // Let's add Trip's diesel costs to dieselSpend using DB query directly
        Double tripDiesel = tripRepository.sumTripDieselCostByDateBetween(startDate, endDate);
        if (tripDiesel != null) {
            dieselSpend += tripDiesel;
        }

        if (dieselSpend == null)
            dieselSpend = 0.0;

        double netProfit = totalIncome - totalExpense;

        double totalInvestment = 0.0;
        List<com.pavithra.erp.model.entity.Vehicle> allVehicles = vehicleRepository.findAll();
        for (com.pavithra.erp.model.entity.Vehicle v : allVehicles) {
            if (v.getPurchasePrice() != null) {
                totalInvestment += v.getPurchasePrice();
            }
        }

        Map<String, Double> result = new HashMap<>();
        result.put("totalIncome", totalIncome);
        result.put("totalExpense", totalExpense);
        result.put("netProfit", netProfit);
        result.put("dieselSpend", dieselSpend);
        result.put("totalInvestment", totalInvestment);
        return result;
    }

    public String generateOverallCsvReport() {
        StringBuilder csv = new StringBuilder();

        // 1. Get Overall Summary
        Map<String, Double> summary = getPeriodSummary("all_time");

        csv.append("--- OVERALL FINANCIAL REPORT ---\n\n");
        csv.append("1. SUMMARY\n");
        csv.append("Metric,Amount (INR)\n");
        csv.append("Total Income,").append(summary.get("totalIncome")).append("\n");
        csv.append("Total Expense,").append(summary.get("totalExpense")).append("\n");
        csv.append("Net Profit,").append(summary.get("netProfit")).append("\n");
        csv.append("Total Capital Investment,").append(summary.get("totalInvestment")).append("\n\n");

        // 2. Expense Breakdown
        csv.append("2. EXPENSE BREAKDOWN\n");
        csv.append("Category,Total Spent (INR)\n");
        Map<String, Double> breakdown = getExpenseCategoryBreakdown();
        for (Map.Entry<String, Double> entry : breakdown.entrySet()) {
            csv.append(entry.getKey()).append(",").append(entry.getValue()).append("\n");
        }

        // Add Trip Expenses to breakdown
        double tripDiesel = 0, tripSalary = 0, tripFood = 0, tripMaterial = 0;
        List<com.pavithra.erp.model.entity.Trip> allTrips = tripRepository.findByStatus("COMPLETED");
        for (com.pavithra.erp.model.entity.Trip t : allTrips) {
            tripDiesel += (t.getDieselCost() != null ? t.getDieselCost() : 0);
            tripSalary += (t.getDriverSalary() != null ? t.getDriverSalary() : 0);
            tripFood += (t.getFoodAmount() != null ? t.getFoodAmount() : 0);
            tripMaterial += (t.getMaterialPurchaseCost() != null ? t.getMaterialPurchaseCost() : 0);
        }
        if (tripDiesel > 0)
            csv.append("Trip Diesel Cost,").append(tripDiesel).append("\n");
        if (tripSalary > 0)
            csv.append("Trip Driver Salary,").append(tripSalary).append("\n");
        if (tripFood > 0)
            csv.append("Trip Driver Food,").append(tripFood).append("\n");
        if (tripMaterial > 0)
            csv.append("Trip Material Cost,").append(tripMaterial).append("\n");

        csv.append("\n");

        // 3. Investment Breakdown (Vehicles)
        csv.append("3. INVESTMENT BREAKDOWN (VEHICLES)\n");
        csv.append("Vehicle Number,Type,Purchase Price (INR)\n");
        List<com.pavithra.erp.model.entity.Vehicle> allVehicles = vehicleRepository.findAll();
        for (com.pavithra.erp.model.entity.Vehicle v : allVehicles) {
            String price = v.getPurchasePrice() != null ? String.valueOf(v.getPurchasePrice()) : "0.0";
            csv.append(v.getVehicleNumber()).append(",")
                    .append(v.getType()).append(",")
                    .append(price).append("\n");
        }

        return csv.toString();
    }

    public List<com.pavithra.erp.dto.DriverSalaryResponse> getDriverSalaries() {
        List<com.pavithra.erp.dto.DriverSalaryResponse> result = new java.util.ArrayList<>();
        List<com.pavithra.erp.model.entity.Trip> allTrips = tripRepository.findAll();
        List<com.pavithra.erp.model.entity.Expense> allDriverExpenses = expenseRepository.findAll().stream()
                .filter(e -> e.getDriver() != null)
                .toList();

        Map<Long, com.pavithra.erp.dto.DriverSalaryResponse> map = new HashMap<>();

        for (com.pavithra.erp.model.entity.Trip t : allTrips) {
            if (t.getDriver() != null) {
                Long driverId = t.getDriver().getId();
                com.pavithra.erp.dto.DriverSalaryResponse dto = map.getOrDefault(driverId,
                        com.pavithra.erp.dto.DriverSalaryResponse.builder()
                                .driverId(driverId)
                                .driverName(t.getDriver().getUsername())
                                .mobile(t.getDriver().getMobile())
                                .totalTripSalary(0.0)
                                .totalAdvances(0.0)
                                .totalTrips(0)
                                .build());
                dto.setTotalTrips(dto.getTotalTrips() + 1);
                if (t.getDriverSalary() != null) {
                    dto.setTotalTripSalary(dto.getTotalTripSalary() + t.getDriverSalary());
                }
                map.put(driverId, dto);
            }
        }

        // Add expenses
        for (com.pavithra.erp.model.entity.Expense e : allDriverExpenses) {
            Long driverId = e.getDriver().getId();
            com.pavithra.erp.dto.DriverSalaryResponse dto = map.getOrDefault(driverId,
                    com.pavithra.erp.dto.DriverSalaryResponse.builder()
                            .driverId(driverId)
                            .driverName(e.getDriver().getUsername())
                            .mobile(e.getDriver().getMobile())
                            .totalTripSalary(0.0)
                            .totalAdvances(0.0)
                            .totalTrips(0)
                            .build());

            if (e.getAmount() != null) {
                dto.setTotalAdvances(dto.getTotalAdvances() + e.getAmount());
            }
            map.put(driverId, dto);
        }

        // Calculate net payable
        for (com.pavithra.erp.dto.DriverSalaryResponse dto : map.values()) {
            dto.setNetPayable(dto.getTotalTripSalary() - dto.getTotalAdvances());
            result.add(dto);
        }

        return result;
    }

    public List<com.pavithra.erp.model.entity.Expense> getDocuments() {
        return expenseRepository.findByBillUrlIsNotNullAndBillUrlNot("");
    }
}
