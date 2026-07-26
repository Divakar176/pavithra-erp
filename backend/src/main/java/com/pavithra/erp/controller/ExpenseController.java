package com.pavithra.erp.controller;

import com.pavithra.erp.model.entity.Expense;
import com.pavithra.erp.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

       @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense) {
        return ResponseEntity.ok(expenseService.addExpense(expense));
    }


    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<Expense>> getExpensesByTripId(@PathVariable Long tripId) {
        return ResponseEntity.ok(expenseService.getExpensesByTripId(tripId));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Expense>> getExpensesByType(@PathVariable String type) {
        return ResponseEntity.ok(expenseService.getExpensesByType(type));
    }

    @GetMapping("/range")
    public ResponseEntity<List<Expense>> getExpensesByDateRange(
            @RequestParam String from,
            @RequestParam String to) {
        return ResponseEntity.ok(expenseService.getExpensesByDateRange(
                LocalDate.parse(from), LocalDate.parse(to)));
    }

    @GetMapping("/by-category")
    public ResponseEntity<Map<String, Double>> getExpenseCategoryTotals() {
        return ResponseEntity.ok(expenseService.getExpenseCategoryTotals());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
        return ResponseEntity.ok(expenseService.updateExpense(id, expense));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}
