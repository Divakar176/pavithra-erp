package com.pavithra.erp.controller;

import com.pavithra.erp.dto.DriverAttendanceRequest;
import com.pavithra.erp.model.entity.DriverAttendance;
import com.pavithra.erp.model.entity.User;
import com.pavithra.erp.repository.DriverAttendanceRepository;
import com.pavithra.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
public class DriverAttendanceController {

    private final DriverAttendanceRepository repository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<DriverAttendance>> getAttendance(
            @RequestParam String startDate, 
            @RequestParam String endDate) {
        return ResponseEntity.ok(repository.findByDateBetween(LocalDate.parse(startDate), LocalDate.parse(endDate)));
    }

    @PostMapping("/batch")
    public ResponseEntity<Void> markAttendanceBatch(@RequestBody List<DriverAttendanceRequest> requests) {
        for (DriverAttendanceRequest req : requests) {
            DriverAttendance attendance = repository.findByDriverIdAndDate(req.getDriverId(), req.getDate())
                    .orElseGet(() -> {
                        DriverAttendance newAtt = new DriverAttendance();
                        User driver = userRepository.findById(req.getDriverId())
                                .orElseThrow(() -> new RuntimeException("Driver not found"));
                        newAtt.setDriver(driver);
                        newAtt.setDate(req.getDate());
                        return newAtt;
                    });
            attendance.setStatus(req.getStatus());
            attendance.setRemarks(req.getRemarks());
            repository.save(attendance);
        }
        return ResponseEntity.ok().build();
    }
}
