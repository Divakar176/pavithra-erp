package com.pavithra.erp.repository;

import com.pavithra.erp.model.entity.DriverAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DriverAttendanceRepository extends JpaRepository<DriverAttendance, Long> {
    List<DriverAttendance> findByDateBetween(LocalDate startDate, LocalDate endDate);
    List<DriverAttendance> findByDriverIdAndDateBetween(Long driverId, LocalDate startDate, LocalDate endDate);
    Optional<DriverAttendance> findByDriverIdAndDate(Long driverId, LocalDate date);
}
