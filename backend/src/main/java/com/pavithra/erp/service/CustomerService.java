package com.pavithra.erp.service;

import com.pavithra.erp.model.entity.Customer;
import com.pavithra.erp.model.entity.CustomerPayment;
import com.pavithra.erp.repository.CustomerPaymentRepository;
import com.pavithra.erp.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository repository;
    private final CustomerPaymentRepository paymentRepository;

    public Customer addCustomer(Customer customer) {
        return repository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return repository.findByIsDeletedFalse();
    }

    public Customer getCustomerById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public Customer updateCustomer(Long id, Customer customerDetails) {
        Customer customer = getCustomerById(id);
        customer.setName(customerDetails.getName());
        customer.setMobile(customerDetails.getMobile());
        customer.setEmail(customerDetails.getEmail());
        customer.setAddress(customerDetails.getAddress());
        customer.setGstNumber(customerDetails.getGstNumber());
        customer.setContractDetails(customerDetails.getContractDetails());
        return repository.save(customer);
    }

    public void deleteCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customer.setIsDeleted(true);
        repository.save(customer);
    }

    public List<Customer> getArchivedCustomers() {
        return repository.findByIsDeletedTrue();
    }

    public void restoreCustomer(Long id) {
        Customer customer = repository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found"));
        customer.setIsDeleted(false);
        repository.save(customer);
    }

    @Transactional
    public CustomerPayment addPayment(Long customerId, CustomerPayment payment) {
        Customer customer = getCustomerById(customerId);
        
        // Subtract from outstanding balance
        double currentBalance = customer.getOutstandingBalance() == null ? 0.0 : customer.getOutstandingBalance();
        customer.setOutstandingBalance(currentBalance - payment.getAmount());
        repository.save(customer);

        payment.setCustomer(customer);
        return paymentRepository.save(payment);
    }

    public List<CustomerPayment> getPaymentsByCustomerId(Long customerId) {
        return paymentRepository.findByCustomerIdOrderByPaymentDateDesc(customerId);
    }
}
