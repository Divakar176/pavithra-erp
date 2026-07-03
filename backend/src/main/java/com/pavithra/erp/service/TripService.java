package com.pavithra.erp.service;

import com.pavithra.erp.controller.dto.TripExpenseSummary;
import com.pavithra.erp.model.entity.Customer;
import com.pavithra.erp.model.entity.Trip;
import com.pavithra.erp.repository.CustomerRepository;
import com.pavithra.erp.repository.ExpenseRepository;
import com.pavithra.erp.repository.TripRepository;
import com.pavithra.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository repository;
    private final ExpenseRepository expenseRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public Trip addTrip(Trip trip) {
        // Handle on-the-fly customer creation
        if (trip.getCustomer() != null && trip.getCustomer().getId() == null && trip.getCustomer().getName() != null) {
            String tempId = java.util.UUID.randomUUID().toString().substring(0, 8);
            Customer newCustomer = Customer.builder()
                .name(trip.getCustomer().getName())
                // Set default empty strings with unique suffixes to avoid unique constraint violations
                .mobile("TEMP-" + tempId)
                .gstNumber("TEMP-" + tempId)
                .build();
            newCustomer = customerRepository.save(newCustomer);
            trip.setCustomer(newCustomer);
        }

        // Handle on-the-fly driver creation
        if (trip.getDriver() != null && trip.getDriver().getId() == null && trip.getDriver().getUsername() != null) {
            String tempId = java.util.UUID.randomUUID().toString().substring(0, 8);
            com.pavithra.erp.model.entity.User newDriver = com.pavithra.erp.model.entity.User.builder()
                .username(trip.getDriver().getUsername())
                .password("driver123") // placeholder password
                .role(com.pavithra.erp.model.enums.Role.DRIVER)
                .mobile("TEMP-" + tempId)
                .email("temp-" + tempId + "@example.com")
                .build();
            newDriver = userRepository.save(newDriver);
            trip.setDriver(newDriver);
        } else if (trip.getDriver() != null && trip.getDriver().getId() != null) {
            com.pavithra.erp.model.entity.User driver = userRepository.findById(trip.getDriver().getId()).orElse(trip.getDriver());
            trip.setDriver(driver);
        }

        // Do NOT override status — honor what the frontend sends (defaults to PENDING if not set)
        if (trip.getStatus() == null || trip.getStatus().isBlank()) {
            trip.setStatus("PENDING");
        }
        return repository.save(trip);
    }

    public List<Trip> getAllTrips() {
        return repository.findByIsDeletedFalse();
    }

    public Trip getTripById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Trip not found"));
    }

    public Trip updateTripStatus(Long id, String status) {
        Trip trip = getTripById(id);
        
        if ("COMPLETED".equals(status) && !"COMPLETED".equals(trip.getStatus())) {
            trip.setStatus(status);
            if (trip.getEndDate() == null) {
                trip.setEndDate(java.time.LocalDate.now());
            }
            
            if (trip.getTripCharges() != null && trip.getCustomer() != null && "UNPAID".equals(trip.getPaymentStatus())) {
                Customer customer = trip.getCustomer();
                double currentBal = customer.getOutstandingBalance() == null ? 0.0 : customer.getOutstandingBalance();
                customer.setOutstandingBalance(currentBal + trip.getTripCharges());
                customerRepository.save(customer);
            }
        } else {
            trip.setStatus(status);
        }
        
        return repository.save(trip);
    }

    public Trip updatePaymentStatus(Long id, String paymentStatus) {
        Trip trip = getTripById(id);
        String currentStatus = (trip.getPaymentStatus() == null || trip.getPaymentStatus().trim().isEmpty()) ? "UNPAID" : trip.getPaymentStatus();
        
        if ("PAID".equals(paymentStatus) && "UNPAID".equals(currentStatus)) {
            trip.setPaymentStatus("PAID");
            if (trip.getTripCharges() != null && trip.getCustomer() != null && "COMPLETED".equals(trip.getStatus())) {
                Customer customer = trip.getCustomer();
                double currentBal = customer.getOutstandingBalance() == null ? 0.0 : customer.getOutstandingBalance();
                customer.setOutstandingBalance(currentBal - trip.getTripCharges());
                customerRepository.save(customer);
            }
        } else if ("UNPAID".equals(paymentStatus) && "PAID".equals(currentStatus)) {
            trip.setPaymentStatus("UNPAID");
            if (trip.getTripCharges() != null && trip.getCustomer() != null && "COMPLETED".equals(trip.getStatus())) {
                Customer customer = trip.getCustomer();
                double currentBal = customer.getOutstandingBalance() == null ? 0.0 : customer.getOutstandingBalance();
                customer.setOutstandingBalance(currentBal + trip.getTripCharges());
                customerRepository.save(customer);
            }
        }
        
        Trip updatedTrip = repository.save(trip);
        auditLogService.logAction("Updated Payment Status", "Trip", id, "Marked trip " + id + " as " + paymentStatus);
        return updatedTrip;
    }

    public Trip updateTrip(Long id, Trip updated) {
        Trip existing = getTripById(id);
        
        // Ledger correction if charges change on an UNPAID COMPLETED trip
        if ("COMPLETED".equals(existing.getStatus()) && "UNPAID".equals(existing.getPaymentStatus()) && existing.getCustomer() != null) {
            double oldCharge = existing.getTripCharges() != null ? existing.getTripCharges() : 0.0;
            double newCharge = updated.getTripCharges() != null ? updated.getTripCharges() : 0.0;
            if (oldCharge != newCharge) {
                Customer customer = existing.getCustomer();
                double bal = customer.getOutstandingBalance() != null ? customer.getOutstandingBalance() : 0.0;
                customer.setOutstandingBalance(bal - oldCharge + newCharge);
                customerRepository.save(customer);
            }
        }

        existing.setSource(updated.getSource());
        existing.setDestination(updated.getDestination());
        existing.setMaterial(updated.getMaterial());
        existing.setLoadWeight(updated.getLoadWeight());
        existing.setTripCharges(updated.getTripCharges());
        existing.setStatus(updated.getStatus());
        existing.setStartDate(updated.getStartDate());
        existing.setEndDate(updated.getEndDate());
        existing.setDistanceKm(updated.getDistanceKm());
        existing.setAdvancePaid(updated.getAdvancePaid());
        existing.setDriverSalary(updated.getDriverSalary());
        existing.setFoodAmount(updated.getFoodAmount());
        existing.setMaterialPurchaseCost(updated.getMaterialPurchaseCost());
        existing.setDieselCost(updated.getDieselCost());
        
        // JCB Fields
        existing.setStartMeter(updated.getStartMeter());
        existing.setEndMeter(updated.getEndMeter());
        existing.setStartTime(updated.getStartTime());
        existing.setEndTime(updated.getEndTime());
        existing.setBreakHours(updated.getBreakHours());
        existing.setTotalHours(updated.getTotalHours());

        if (updated.getVehicle() != null) existing.setVehicle(updated.getVehicle());
        if (updated.getDriver() != null) existing.setDriver(updated.getDriver());
        if (updated.getCustomer() != null) existing.setCustomer(updated.getCustomer());
        return repository.save(existing);
    }

    public void deleteTrip(Long id) {
        Trip trip = getTripById(id);
        trip.setIsDeleted(true);
        repository.save(trip);
        auditLogService.logAction("Deleted Trip", "Trip", id, "Deleted trip " + id);
    }

    public List<Trip> getArchivedTrips() {
        return repository.findByIsDeletedTrue();
    }

    public void restoreTrip(Long id) {
        Trip trip = repository.findById(id).orElseThrow(() -> new RuntimeException("Trip not found"));
        trip.setIsDeleted(false);
        repository.save(trip);
    }

    /**
     * Calculates a full per-trip expense breakdown from Expense records linked to this trip.
     */
    public TripExpenseSummary getTripExpenseSummary(Long tripId) {
        Trip trip = getTripById(tripId);

        double fuelCost = orZero(expenseRepository.sumAmountByTripIdAndType(tripId, "Fuel"));
        double driverSalary = trip.getDriverSalary() != null ? trip.getDriverSalary() : 0.0;
        double tollCharges = orZero(expenseRepository.sumAmountByTripIdAndType(tripId, "Toll"));
        double maintenanceCost = orZero(expenseRepository.sumAmountByTripIdAndType(tripId, "Maintenance"))
                + orZero(expenseRepository.sumAmountByTripIdAndType(tripId, "Repair"));
        double hotelCost = orZero(expenseRepository.sumAmountByTripIdAndType(tripId, "Hotel")) + (trip.getFoodAmount() != null ? trip.getFoodAmount() : 0.0);
        double materialCost = trip.getMaterialPurchaseCost() != null ? trip.getMaterialPurchaseCost() : 0.0;
        double miscCost = orZero(expenseRepository.sumAmountByTripIdAndType(tripId, "Miscellaneous"))
                + orZero(expenseRepository.sumAmountByTripIdAndType(tripId, "Loan EMI"));

        double totalExpenses = fuelCost + driverSalary + tollCharges + maintenanceCost + hotelCost + materialCost + miscCost;
        double tripIncome = trip.getTripCharges() != null ? trip.getTripCharges() : 0.0;
        double netProfit = tripIncome - totalExpenses;

        return TripExpenseSummary.builder()
                .tripId(trip.getId())
                .source(trip.getSource())
                .destination(trip.getDestination())
                .vehicleNumber(trip.getVehicle() != null ? trip.getVehicle().getVehicleNumber() : "-")
                .customerName(trip.getCustomer() != null ? trip.getCustomer().getName() : "-")
                .status(trip.getStatus())
                .tripIncome(tripIncome)
                .fuelCost(fuelCost)
                .driverSalary(driverSalary)
                .tollCharges(tollCharges)
                .maintenanceCost(maintenanceCost)
                .hotelCost(hotelCost)
                .miscCost(miscCost)
                .totalExpenses(totalExpenses)
                .netProfit(netProfit)
                .build();
    }

    private double orZero(Double val) {
        return val != null ? val : 0.0;
    }
}
