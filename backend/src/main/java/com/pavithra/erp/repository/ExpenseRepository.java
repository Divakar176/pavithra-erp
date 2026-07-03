package com.pavithra.erp.repository;

import com.pavithra.erp.model.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByDateBetween(LocalDate startDate, LocalDate endDate);
    List<Expense> findByTripId(Long tripId);
    List<Expense> findByVehicleId(Long vehicleId);
    List<Expense> findByExpenseType(String expenseType);
    List<Expense> findByBillUrlIsNotNullAndBillUrlNot(String emptyString);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.date BETWEEN :startDate AND :endDate")
    Double sumAmountByDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.date BETWEEN :startDate AND :endDate AND e.expenseType = :type")
    Double sumAmountByDateBetweenAndExpenseType(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("type") String type);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.trip.id = :tripId AND e.expenseType = :type")
    Double sumAmountByTripIdAndType(@Param("tripId") Long tripId, @Param("type") String type);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.trip.id = :tripId")
    Double sumAmountByTripId(@Param("tripId") Long tripId);

    @Query("SELECT e.expenseType, SUM(e.amount) FROM Expense e GROUP BY e.expenseType")
    List<Object[]> sumAmountGroupByType();

    @Query("SELECT MONTH(e.date), SUM(e.amount) FROM Expense e WHERE YEAR(e.date) = :year GROUP BY MONTH(e.date)")
    List<Object[]> monthlyExpenseTotals(@Param("year") int year);
}

