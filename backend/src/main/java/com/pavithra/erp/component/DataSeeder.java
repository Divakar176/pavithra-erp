package com.pavithra.erp.component;

import com.pavithra.erp.model.entity.*;
import com.pavithra.erp.model.enums.Role;
import com.pavithra.erp.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

        private final UserRepository userRepository;
        private final VehicleRepository vehicleRepository;
        private final CustomerRepository customerRepository;
        private final TripRepository tripRepository;
        private final ExpenseRepository expenseRepository;
        private final IncomeRepository incomeRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        @Transactional
        public void run(String... args) throws Exception {
                // 1. Seed Users if not present
                if (userRepository.findByUsername("divakar").isEmpty()) {
                        log.info("Starting database user seeding...");

                        if (!userRepository.existsByUsername("divakar") &&
                            !userRepository.existsByEmail("divakar@pavithraerp.com") &&
                            userRepository.findByMobile("0000000001").isEmpty()) {
                                userRepository.save(User.builder()
                                                .username("divakar")
                                                .email("divakar@pavithraerp.com")
                                                .mobile("0000000001")
                                                .password(passwordEncoder.encode("Divaes176@"))
                                                .role(Role.SUPER_ADMIN)
                                                .securityPin("1234")
                                                .build());
                        }

                        if (!userRepository.existsByUsername("Elumalai") &&
                            !userRepository.existsByEmail("ecrelumlai@gmail.com") &&
                            userRepository.findByMobile("8056673379").isEmpty()) {
                                userRepository.save(User.builder()
                                                .username("Elumalai")
                                                .email("ecrelumlai@gmail.com")
                                                .mobile("8056673379")
                                                .password(passwordEncoder.encode("Elumalai176@"))
                                                .securityPin("1234")
                                                .role(Role.ADMIN)
                                                .build());
                        }

                        if (!userRepository.existsByUsername("Ranjith") &&
                            !userRepository.existsByEmail("owner1@pavithraerp.com") &&
                            userRepository.findByMobile("1111111111").isEmpty()) {
                                userRepository.save(User.builder()
                                                .username("Ranjith")
                                                .email("owner1@pavithraerp.com")
                                                .mobile("1111111111")
                                                .password(passwordEncoder.encode("Ranjith176@"))
                                                .securityPin("1111")
                                                .role(Role.SUPER_ADMIN)
                                                .build());
                        }

                        log.info("User database seeding completed.");
                } else {
                        // Ensure existing users have a PIN
                        List<User> existingUsers = userRepository.findAll();
                        for (User u : existingUsers) {
                                if (u.getSecurityPin() == null || u.getSecurityPin().isEmpty()) {
                                        u.setSecurityPin("1234");
                                        userRepository.save(u);
                                }
                        }
                }

                // 2. Seed Vehicles if active vehicles count is 0
                if (vehicleRepository.findByIsDeletedFalse().isEmpty()) {
                        log.info("Seeding vehicles into database...");

                        // If archived vehicles exist, restore them first
                        List<Vehicle> archived = vehicleRepository.findByIsDeletedTrue();
                        if (!archived.isEmpty()) {
                                for (Vehicle v : archived) {
                                        v.setIsDeleted(false);
                                        vehicleRepository.save(v);
                                }
                                log.info("Restored {} archived vehicles.", archived.size());
                        } else {
                                // Save initial fleet
                                vehicleRepository.save(Vehicle.builder()
                                                .vehicleNumber("TN 25 AZ 1234")
                                                .type("Tipper Lorry")
                                                .status("Active")
                                                .billingType("PER_TRIP")
                                                .maxLoadTons(25)
                                                .insuranceExpiry(LocalDate.now().plusMonths(6))
                                                .fcExpiry(LocalDate.now().plusMonths(8))
                                                .taxExpiry(LocalDate.now().plusMonths(12))
                                                .permitExpiry(LocalDate.now().plusMonths(10))
                                                .pollutionExpiry(LocalDate.now().plusMonths(3))
                                                .isDeleted(false)
                                                .build());

                                vehicleRepository.save(Vehicle.builder()
                                                .vehicleNumber("TN 25 B 5678")
                                                .type("Container Lorry")
                                                .status("Active")
                                                .billingType("PER_TRIP")
                                                .containerSize("32 FT")
                                                .maxLoadTons(30)
                                                .insuranceExpiry(LocalDate.now().plusMonths(4))
                                                .fcExpiry(LocalDate.now().plusMonths(5))
                                                .taxExpiry(LocalDate.now().plusMonths(9))
                                                .permitExpiry(LocalDate.now().plusMonths(7))
                                                .pollutionExpiry(LocalDate.now().plusMonths(2))
                                                .isDeleted(false)
                                                .build());

                                vehicleRepository.save(Vehicle.builder()
                                                .vehicleNumber("TN 25 C 9012")
                                                .type("Open Type Lorry")
                                                .status("Active")
                                                .billingType("PER_TRIP")
                                                .maxLoadTons(20)
                                                .insuranceExpiry(LocalDate.now().plusMonths(5))
                                                .fcExpiry(LocalDate.now().plusMonths(6))
                                                .taxExpiry(LocalDate.now().plusMonths(11))
                                                .permitExpiry(LocalDate.now().plusMonths(8))
                                                .pollutionExpiry(LocalDate.now().plusMonths(4))
                                                .isDeleted(false)
                                                .build());

                                vehicleRepository.save(Vehicle.builder()
                                                .vehicleNumber("TN 25 JCB 001")
                                                .type("JCB")
                                                .status("Active")
                                                .billingType("MONTHLY")
                                                .monthlyContractAmount(75000.0)
                                                .insuranceExpiry(LocalDate.now().plusMonths(7))
                                                .fcExpiry(LocalDate.now().plusMonths(9))
                                                .taxExpiry(LocalDate.now().plusMonths(10))
                                                .permitExpiry(LocalDate.now().plusMonths(12))
                                                .pollutionExpiry(LocalDate.now().plusMonths(5))
                                                .isDeleted(false)
                                                .build());

                                vehicleRepository.save(Vehicle.builder()
                                                .vehicleNumber("TN 25 HAR 007")
                                                .type("Harvesting Machine")
                                                .status("Active")
                                                .billingType("MONTHLY")
                                                .monthlyContractAmount(90000.0)
                                                .insuranceExpiry(LocalDate.now().plusMonths(8))
                                                .fcExpiry(LocalDate.now().plusMonths(10))
                                                .taxExpiry(LocalDate.now().plusMonths(11))
                                                .permitExpiry(LocalDate.now().plusMonths(12))
                                                .pollutionExpiry(LocalDate.now().plusMonths(6))
                                                .isDeleted(false)
                                                .build());

                                vehicleRepository.save(Vehicle.builder()
                                                .vehicleNumber("TN 25 TR 4455")
                                                .type("Tractor")
                                                .status("Active")
                                                .billingType("PER_TRIP")
                                                .maxLoadTons(10)
                                                .insuranceExpiry(LocalDate.now().plusMonths(9))
                                                .fcExpiry(LocalDate.now().plusMonths(11))
                                                .taxExpiry(LocalDate.now().plusMonths(12))
                                                .permitExpiry(LocalDate.now().plusMonths(12))
                                                .pollutionExpiry(LocalDate.now().plusMonths(5))
                                                .isDeleted(false)
                                                .build());

                                log.info("Seeded 6 initial vehicles into database.");
                        }
                }
        }
}
