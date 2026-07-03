package com.pavithra.erp.repository;

import com.pavithra.erp.model.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByDateBetween(LocalDate startDate, LocalDate endDate);
    List<Income> findByTripId(Long tripId);

    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.date BETWEEN :startDate AND :endDate")
    Double sumAmountByDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT MONTH(i.date), SUM(i.amount) FROM Income i WHERE YEAR(i.date) = :year GROUP BY MONTH(i.date)")
    List<Object[]> monthlyIncomeTotals(@Param("year") int year);
}

