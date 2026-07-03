package com.pavithra.erp.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripExpenseSummary {

    private Long tripId;
    private String source;
    private String destination;
    private String vehicleNumber;
    private String customerName;
    private String status;

    private Double tripIncome;       // tripCharges billed to customer

    private Double fuelCost;         // sum of fuel-type expenses for this trip
    private Double driverSalary;     // driverSalary field on Trip entity
    private Double tollCharges;      // sum of Toll expenses
    private Double maintenanceCost;  // sum of Maintenance/Repair expenses
    private Double hotelCost;        // sum of Hotel expenses
    private Double miscCost;         // sum of Miscellaneous/other expenses

    private Double totalExpenses;    // sum of all expense categories
    private Double netProfit;        // tripIncome - totalExpenses
}
