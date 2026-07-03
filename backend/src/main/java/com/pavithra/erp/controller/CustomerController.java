package com.pavithra.erp.controller;

import com.pavithra.erp.model.entity.Customer;
import com.pavithra.erp.model.entity.CustomerPayment;
import com.pavithra.erp.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService service;

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        return ResponseEntity.ok(service.addCustomer(customer));
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(service.getAllCustomers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getCustomerById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        return ResponseEntity.ok(service.updateCustomer(id, customer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        service.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/archived")
    public ResponseEntity<List<Customer>> getArchivedCustomers() {
        return ResponseEntity.ok(service.getArchivedCustomers());
    }

    @PostMapping("/{id}/restore")
    public ResponseEntity<Void> restoreCustomer(@PathVariable Long id) {
        service.restoreCustomer(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/payments")
    public ResponseEntity<CustomerPayment> addPayment(@PathVariable Long id, @RequestBody CustomerPayment payment) {
        return ResponseEntity.ok(service.addPayment(id, payment));
    }

    @GetMapping("/{id}/payments")
    public ResponseEntity<List<CustomerPayment>> getCustomerPayments(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPaymentsByCustomerId(id));
    }
}
