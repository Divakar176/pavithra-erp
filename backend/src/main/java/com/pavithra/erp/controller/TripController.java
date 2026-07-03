package com.pavithra.erp.controller;

import com.pavithra.erp.controller.dto.TripExpenseSummary;
import com.pavithra.erp.model.entity.Trip;
import com.pavithra.erp.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService service;

    @PostMapping
    public ResponseEntity<Trip> createTrip(@RequestBody Trip trip) {
        return ResponseEntity.ok(service.addTrip(trip));
    }

    @GetMapping
    public ResponseEntity<List<Trip>> getAllTrips() {
        return ResponseEntity.ok(service.getAllTrips());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getTripById(id));
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<TripExpenseSummary> getTripExpenseSummary(@PathVariable Long id) {
        return ResponseEntity.ok(service.getTripExpenseSummary(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trip> updateTrip(@PathVariable Long id, @RequestBody Trip trip) {
        return ResponseEntity.ok(service.updateTrip(id, trip));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Trip> updateTripStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(service.updateTripStatus(id, status));
    }

    @PatchMapping("/{id}/payment-status")
    public ResponseEntity<Trip> updatePaymentStatus(@PathVariable Long id, @RequestParam String paymentStatus) {
        return ResponseEntity.ok(service.updatePaymentStatus(id, paymentStatus));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
        service.deleteTrip(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/archived")
    public ResponseEntity<List<Trip>> getArchivedTrips() {
        return ResponseEntity.ok(service.getArchivedTrips());
    }

    @PostMapping("/{id}/restore")
    public ResponseEntity<Void> restoreTrip(@PathVariable Long id) {
        service.restoreTrip(id);
        return ResponseEntity.noContent().build();
    }
}
