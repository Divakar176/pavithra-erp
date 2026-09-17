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

                // 2. Ensure all 12 vehicles exist and are active
                log.info("Ensuring 12 real vehicles exist in database...");

                // Restore any archived vehicles
                List<Vehicle> archivedVehicles = vehicleRepository.findByIsDeletedTrue();
                for (Vehicle v : archivedVehicles) {
                        v.setIsDeleted(false);
                        vehicleRepository.save(v);
                }

                // Save or activate initial real fleet (12 Vehicles)
                String[][] realVehicles = {
                        {"TN 19 BU 1792", "Tipper Lorry", "PER_TRIP", "Active"},
                        {"TN 57 AC 5727", "Tipper Lorry", "MONTHLY", "Active"},
                        {"TN 19 T 7672", "JCB", "HOURLY", "Active"},
                        {"TN 19 BX 8021", "JCB", "HOURLY", "Active"},
                        {"TN 59 CF 6093", "Container Lorry", "PER_TRIP", "Active"},
                        {"TN 19 BS 4030", "Container Lorry", "PER_TRIP", "Active"},
                        {"TN 19 HARVEST", "Harvesting Machine", "HOURLY", "Active"},
                        {"TN 19 BU 8687", "Bike", "OWN_USE", "Active"},
                        {"TN 15 MC 0200", "Open Type Lorry", "PER_TRIP", "Active"},
                        {"TN 19 BS 9631", "Cars", "PER_TRIP", "Active"},
                        {"TN 25 AZ 1234", "Tipper Lorry", "PER_TRIP", "Active"},
                        {"TN 25 TR 4455", "Tractor", "PER_TRIP", "Active"}
                };

                for (String[] v : realVehicles) {
                        var existingOpt = vehicleRepository.findByVehicleNumber(v[0]);
                        if (existingOpt.isEmpty()) {
                                vehicleRepository.save(Vehicle.builder()
                                        .vehicleNumber(v[0])
                                        .type(v[1])
                                        .billingType(v[2])
                                        .status(v[3])
                                        .insuranceExpiry(LocalDate.now().plusMonths(6))
                                        .fcExpiry(LocalDate.now().plusMonths(8))
                                        .taxExpiry(LocalDate.now().plusMonths(12))
                                        .permitExpiry(LocalDate.now().plusMonths(10))
                                        .pollutionExpiry(LocalDate.now().plusMonths(3))
                                        .isDeleted(false)
                                        .build());
                        } else {
                                Vehicle vExisting = existingOpt.get();
                                if (Boolean.TRUE.equals(vExisting.getIsDeleted())) {
                                        vExisting.setIsDeleted(false);
                                        vehicleRepository.save(vExisting);
                                }
                        }
                }
                log.info("Completed vehicle seeding check (12 vehicles ready).");

                // Restore any archived trips
                List<Trip> archivedTrips = tripRepository.findByIsDeletedTrue();
                for (Trip t : archivedTrips) {
                        t.setIsDeleted(false);
                        tripRepository.save(t);
                }

                // 3. Seed Customers & Trips if active trips are empty
                if (tripRepository.findByIsDeletedFalse().isEmpty()) {
                        log.info("Seeding initial trips into database...");

                        Customer cust1 = customerRepository.save(Customer.builder()
                                        .name("Sri Infrastructure Ltd")
                                        .mobile("9840123456")
                                        .gstNumber("33AAAAA0000A1Z5")
                                        .address("Chennai Highway, Villupuram")
                                        .outstandingBalance(45000.0)
                                        .isDeleted(false)
                                        .build());

                        Customer cust2 = customerRepository.save(Customer.builder()
                                        .name("Ramesh Builders")
                                        .mobile("9840987654")
                                        .gstNumber("33BBBBB1111B2Z6")
                                        .address("Gudiyatham Road, Vellore")
                                        .outstandingBalance(28000.0)
                                        .isDeleted(false)
                                        .build());

                        List<Vehicle> vehicles = vehicleRepository.findAll();
                        List<User> drivers = userRepository.findAll().stream()
                                        .filter(u -> Role.DRIVER.equals(u.getRole()))
                                        .toList();

                        User defaultDriver = drivers.isEmpty() ? userRepository.findAll().get(0) : drivers.get(0);
                        Vehicle v1 = vehicles.isEmpty() ? null : vehicles.get(0);
                        Vehicle v2 = vehicles.size() > 1 ? vehicles.get(1) : v1;
                        Vehicle v3 = vehicles.size() > 2 ? vehicles.get(2) : v1;
                        Vehicle v4 = vehicles.size() > 4 ? vehicles.get(4) : v1;

                        // Trip 1 (Completed & Paid)
                        tripRepository.save(Trip.builder()
                                        .source("Tiruvannamalai")
                                        .destination("Chennai Port")
                                        .material("M-Sand")
                                        .loadWeight(25.0)
                                        .distanceKm(195.0)
                                        .tripCharges(22000.0)
                                        .dieselCost(6500.0)
                                        .driverSalary(2000.0)
                                        .foodAmount(600.0)
                                        .startDate(LocalDate.now().minusDays(5))
                                        .endDate(LocalDate.now().minusDays(4))
                                        .status("COMPLETED")
                                        .paymentStatus("PAID")
                                        .vehicle(v1)
                                        .driver(defaultDriver)
                                        .customer(cust1)
                                        .isDeleted(false)
                                        .build());

                        // Trip 2 (Completed & Unpaid)
                        tripRepository.save(Trip.builder()
                                        .source("Vellore")
                                        .destination("Bangalore Electronic City")
                                        .material("Blue Metal")
                                        .loadWeight(30.0)
                                        .distanceKm(210.0)
                                        .tripCharges(28000.0)
                                        .dieselCost(8000.0)
                                        .driverSalary(2500.0)
                                        .foodAmount(800.0)
                                        .startDate(LocalDate.now().minusDays(3))
                                        .endDate(LocalDate.now().minusDays(2))
                                        .status("COMPLETED")
                                        .paymentStatus("UNPAID")
                                        .vehicle(v2)
                                        .driver(defaultDriver)
                                        .customer(cust2)
                                        .isDeleted(false)
                                        .build());

                        // Trip 3 (In Progress)
                        tripRepository.save(Trip.builder()
                                        .source("Coimbatore")
                                        .destination("Madurai Quarry")
                                        .material("Gravel")
                                        .loadWeight(20.0)
                                        .distanceKm(215.0)
                                        .tripCharges(19500.0)
                                        .dieselCost(5500.0)
                                        .driverSalary(1800.0)
                                        .foodAmount(500.0)
                                        .startDate(LocalDate.now().minusDays(1))
                                        .status("IN_PROGRESS")
                                        .paymentStatus("UNPAID")
                                        .vehicle(v3)
                                        .driver(defaultDriver)
                                        .customer(cust1)
                                        .isDeleted(false)
                                        .build());

                        // Trip 4 (Pending)
                        tripRepository.save(Trip.builder()
                                        .source("Salem")
                                        .destination("Trichy Bypass")
                                        .material("Cement Bags")
                                        .loadWeight(28.0)
                                        .distanceKm(145.0)
                                        .tripCharges(16500.0)
                                        .dieselCost(4800.0)
                                        .driverSalary(1500.0)
                                        .foodAmount(400.0)
                                        .startDate(LocalDate.now())
                                        .status("PENDING")
                                        .paymentStatus("UNPAID")
                                        .vehicle(v4)
                                        .driver(defaultDriver)
                                        .customer(cust2)
                                        .isDeleted(false)
                                        .build());

                        log.info("Seeded initial trip records into database.");
                }
        }
}
