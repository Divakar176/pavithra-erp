package com.pavithra.erp.service;

import com.pavithra.erp.model.entity.Expense;
import com.pavithra.erp.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public Expense addExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public List<Expense> getExpensesByTripId(Long tripId) {
        return expenseRepository.findByTripId(tripId);
    }

    public List<Expense> getExpensesByDateRange(LocalDate from, LocalDate to) {
        return expenseRepository.findByDateBetween(from, to);
    }

    public List<Expense> getExpensesByType(String type) {
        return expenseRepository.findByExpenseType(type);
    }

    public Expense updateExpense(Long id, Expense updated) {
        Expense existing = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
        existing.setExpenseType(updated.getExpenseType());
        existing.setAmount(updated.getAmount());
        existing.setDate(updated.getDate());
        existing.setTrip(updated.getTrip());
        existing.setVehicle(updated.getVehicle());
        existing.setPaidTo(updated.getPaidTo());
        existing.setPaymentMode(updated.getPaymentMode());
        existing.setBillUrl(updated.getBillUrl());
        existing.setDescription(updated.getDescription());
        return expenseRepository.save(existing);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    /**
     * Returns a map of expense category -> total amount for the pie/donut chart.
     */
    public Map<String, Double> getExpenseCategoryTotals() {
        List<Object[]> rows = expenseRepository.sumAmountGroupByType();
        Map<String, Double> result = new HashMap<>();
        for (Object[] row : rows) {
            String type = (String) row[0];
            Double total = row[1] != null ? ((Number) row[1]).doubleValue() : 0.0;
            result.put(type, total);
        }
        return result;
    }

    /**
     * Returns monthly expense totals for a given year [1..12] → amount.
     */
    public Map<Integer, Double> getMonthlyExpenseTotals(int year) {
        List<Object[]> rows = expenseRepository.monthlyExpenseTotals(year);
        Map<Integer, Double> result = new HashMap<>();
        for (int m = 1; m <= 12; m++) result.put(m, 0.0);
        for (Object[] row : rows) {
            int month = ((Number) row[0]).intValue();
            double total = row[1] != null ? ((Number) row[1]).doubleValue() : 0.0;
            result.put(month, total);
        }
        return result;
    }
}
