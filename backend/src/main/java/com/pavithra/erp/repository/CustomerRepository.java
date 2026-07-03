package com.pavithra.erp.repository;

import com.pavithra.erp.model.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByMobile(String mobile);
    Optional<Customer> findByGstNumber(String gstNumber);
    List<Customer> findByIsDeletedFalse();
    List<Customer> findByIsDeletedTrue();
}
