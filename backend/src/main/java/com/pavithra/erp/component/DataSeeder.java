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
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

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
                if (userRepository.count() == 0) {
                        log.info("Starting database seeding...");

                        // 1. Seed Users
                        User superAdmin = userRepository.save(User.builder()
                                        .username("divakar")
                                        .email("divakar@pavithraerp.com")
                                        .mobile("0000000001")
                                        .password(passwordEncoder.encode("Divaes176@"))
                                        .role(Role.SUPER_ADMIN)
                                        .build());

                        User Admin = userRepository.save(User.builder()
                                        .username("Elumalai")
                                        .email("ecrelumlai@gmail.com")
                                        .mobile("8056673379")
                                        .password(passwordEncoder.encode("Elumalai176@"))
                                        .securityPin("1234")
                                        .role(Role.ADMIN)
                                        .build());

                        User driver1 = userRepository.save(User.builder()
                                        .username("kumar")
                                        .email("kumar@pavithraerp.com")
                                        .mobile("9876543210")
                                        .password(passwordEncoder.encode("driver123"))
                                        .role(Role.DRIVER)
                                        .build());

                        User driver2 = userRepository.save(User.builder()
                                        .username("selvam")
                                        .email("selvam@pavithraerp.com")
                                        .mobile("9876543211")
                                        .password(passwordEncoder.encode("driver123"))
                                        .role(Role.DRIVER)
                                        .build());

                        User owner1 = userRepository.save(User.builder()
                                        .username("Ranjith")
                                        .email("owner1@pavithraerp.com")
                                        .mobile("1111111111")
                                        .password(passwordEncoder.encode("Ranjith176@"))
                                        .securityPin("1111")
                                        .role(Role.SUPER_ADMIN)
                                        .build());

                        User owner2 = userRepository.save(User.builder()
                                        .username("owner2")
                                        .email("owner2@pavithraerp.com")
                                        .mobile("2222222222")
                                        .password(passwordEncoder.encode("password"))
                                        .securityPin("2222")
                                        .role(Role.SUPER_ADMIN)
                                        .build());

                        User owner3 = userRepository.save(User.builder()
                                        .username("owner3")
                                        .email("owner3@pavithraerp.com")
                                        .mobile("3333333333")
                                        .password(passwordEncoder.encode("password"))
                                        .securityPin("3333")
                                        .role(Role.SUPER_ADMIN)
                                        .build());

                        // 2. Seed Vehicles
                        List<Vehicle> vehicles = new ArrayList<>();
                        LocalDate now = LocalDate.now();

                        vehicles.add(vehicleRepository.save(Vehicle.builder()
                                        .vehicleNumber("TN 22 AB 1234").type("Tipper Lorry").status("In-Trip")
                                        .insuranceExpiry(now.plusDays(4)) // Urgent Alert!
                                        .permitExpiry(now.plusMonths(6)).fcExpiry(now.plusMonths(12))
                                        .pollutionExpiry(now.plusMonths(1))
                                        .build()));

                        vehicles.add(vehicleRepository.save(Vehicle.builder()
                                        .vehicleNumber("TN 19 BR 5776").type("Tipper Lorry").status("In-Trip")
                                        .insuranceExpiry(now.plusMonths(3))
                                        .permitExpiry(now.plusDays(11)) // Warning Alert!
                                        .fcExpiry(now.plusMonths(8)).pollutionExpiry(now.plusMonths(2))
                                        .build()));

                        vehicles.add(vehicleRepository.save(Vehicle.builder()
                                        .vehicleNumber("TN 22 CD 5678").type("Container Lorry").status("Active")
                                        .containerSize("20ft").maxLoadTons(8)
                                        .insuranceExpiry(now.plusMonths(5))
                                        .permitExpiry(now.plusMonths(4)).fcExpiry(now.plusMonths(3))
                                        .pollutionExpiry(now.plusDays(20)) // Warning Alert!
                                        .build()));

                        vehicles.add(vehicleRepository.save(Vehicle.builder()
                                        .vehicleNumber("TN 19 GH 9012").type("Container Lorry").status("Active")
                                        .containerSize("32ft").maxLoadTons(15)
                                        .insuranceExpiry(now.plusMonths(2))
                                        .permitExpiry(now.plusMonths(8)).fcExpiry(now.plusMonths(10))
                                        .pollutionExpiry(now.plusMonths(3))
                                        .build()));

                        vehicles.add(vehicleRepository.save(Vehicle.builder()
                                        .vehicleNumber("TN 22 EF 3456").type("Container Lorry").status("In-Trip")
                                        .containerSize("20ft").maxLoadTons(8)
                                        .insuranceExpiry(now.plusMonths(7))
                                        .permitExpiry(now.plusMonths(9)).fcExpiry(now.plusDays(17)) // Warning Alert!
                                        .pollutionExpiry(now.plusMonths(4))
                                        .build()));

                        vehicles.add(vehicleRepository.save(Vehicle.builder()
                                        .vehicleNumber("TN 01 AB 9999").type("Open Truck").status("Active")
                                        .insuranceExpiry(now.plusMonths(1))
                                        .permitExpiry(now.plusMonths(2)).fcExpiry(now.plusMonths(3))
                                        .pollutionExpiry(now.plusMonths(1))
                                        .build()));

                        vehicles.add(vehicleRepository.save(Vehicle.builder()
                                        .vehicleNumber("TN 02 XY 1234").type("Tipper Lorry").status("Maintenance")
                                        .insuranceExpiry(now.plusMonths(5))
                                        .permitExpiry(now.plusMonths(5)).fcExpiry(now.plusMonths(6))
                                        .pollutionExpiry(now.plusMonths(2))
                                        .build()));

                        vehicles.add(vehicleRepository.save(Vehicle.builder()
                                        .vehicleNumber("TN 03 ZA 5555").type("Container Lorry").status("Active")
                                        .containerSize("40ft").maxLoadTons(20)
                                        .insuranceExpiry(now.plusMonths(8))
                                        .permitExpiry(now.plusMonths(10)).fcExpiry(now.plusMonths(11))
                                        .pollutionExpiry(now.plusMonths(5))
                                        .build()));

                        vehicles.add(vehicleRepository.save(Vehicle.builder()
                                        .vehicleNumber("TN 04 CD 7777").type("Tanker").status("In-Trip")
                                        .insuranceExpiry(now.plusMonths(12))
                                        .permitExpiry(now.plusMonths(12)).fcExpiry(now.plusMonths(12))
                                        .pollutionExpiry(now.plusMonths(6))
                                        .build()));

                        vehicles.add(vehicleRepository.save(Vehicle.builder()
                                        .vehicleNumber("TN 05 EF 8888").type("Refrigerator Truck").status("Active")
                                        .insuranceExpiry(now.plusMonths(3))
                                        .permitExpiry(now.plusMonths(4)).fcExpiry(now.plusMonths(5))
                                        .pollutionExpiry(now.plusMonths(3))
                                        .build()));

                        // 3. Seed Customers
                        List<Customer> customers = new ArrayList<>();
                        customers.add(customerRepository.save(Customer.builder().name("Sri Ram Constructions")
                                        .mobile("9999999901").gstNumber("33AAAAA0001A1Z1").build()));
                        customers.add(customerRepository.save(Customer.builder().name("Madurai Blue Metals")
                                        .mobile("9999999902").gstNumber("33BBBBB0002B1Z2").build()));
                        customers.add(customerRepository.save(Customer.builder().name("Chennai Builders")
                                        .mobile("9999999903").gstNumber("33CCCCC0003C1Z3").build()));
                        customers.add(customerRepository.save(Customer.builder().name("Salem Sands Ltd")
                                        .mobile("9999999904").gstNumber("33DDDDD0004D1Z4").build()));
                        customers.add(customerRepository.save(Customer.builder().name("Coimbatore Cement Traders")
                                        .mobile("9999999905").gstNumber("33EEEEE0005E1Z5").build()));

                        // 4. Seed Trips & Expenses & Incomes
                        Random random = new Random();
                        LocalDate today = LocalDate.now();
                        String[] sources = { "Chennai", "Madurai", "Coimbatore", "Salem", "Trichy" };
                        String[] destinations = { "Bangalore", "Cochin", "Hyderabad", "Trivandrum", "Pondicherry" };
                        String[] materials = { "Blue Metal", "Sand", "Cement", "Bricks", "Steel" };

                        for (int i = 1; i <= 10; i++) {
                                Vehicle v = vehicles.get(random.nextInt(vehicles.size()));
                                Customer c = customers.get(random.nextInt(customers.size()));
                                User d = (i % 2 == 0) ? driver1 : driver2;

                                boolean isCompleted = (i <= 7); // 7 completed, 3 in progress
                                LocalDate startDate = today.minusDays(random.nextInt(30) + 1);

                                Trip trip = Trip.builder()
                                                .vehicle(v)
                                                .driver(d)
                                                .customer(c)
                                                .source(sources[random.nextInt(sources.length)])
                                                .destination(destinations[random.nextInt(destinations.length)])
                                                .material(materials[random.nextInt(materials.length)])
                                                .loadWeight(10.0 + random.nextInt(20))
                                                .tripCharges(15000.0 + random.nextInt(20000))
                                                .status(isCompleted ? "COMPLETED" : "IN_PROGRESS")
                                                .startDate(startDate)
                                                .endDate(isCompleted ? startDate.plusDays(random.nextInt(3) + 1) : null)
                                                .distanceKm(300.0 + random.nextInt(500))
                                                .advancePaid(5000.0)
                                                .driverSalary(2000.0 + random.nextInt(1000))
                                                .build();

                                trip = tripRepository.save(trip);

                                // Expenses for the trip
                                expenseRepository.save(Expense.builder()
                                                .trip(trip).vehicle(v)
                                                .expenseType("Fuel").amount(5000.0 + random.nextInt(5000))
                                                .date(startDate).paidTo("Indian Oil").paymentMode("UPI")
                                                .build());

                                expenseRepository.save(Expense.builder()
                                                .trip(trip).vehicle(v)
                                                .expenseType("Toll").amount(500.0 + random.nextInt(1000))
                                                .date(startDate).paidTo("NHAI").paymentMode("Cash")
                                                .build());

                                if (random.nextBoolean()) {
                                        expenseRepository.save(Expense.builder()
                                                        .trip(trip).vehicle(v)
                                                        .expenseType("Maintenance")
                                                        .amount(2000.0 + random.nextInt(3000))
                                                        .date(startDate.plusDays(1)).paidTo("Local Mechanic")
                                                        .paymentMode("Cash")
                                                        .build());
                                }

                                if (random.nextBoolean()) {
                                        expenseRepository.save(Expense.builder()
                                                        .trip(trip).vehicle(v)
                                                        .expenseType("Hotel").amount(800.0 + random.nextInt(1000))
                                                        .date(startDate.plusDays(1)).paidTo("Highway Inn")
                                                        .paymentMode("Cash")
                                                        .build());
                                }

                                // If completed, log income
                                if (isCompleted) {
                                        incomeRepository.save(Income.builder()
                                                        .trip(trip)
                                                        .incomeType("Trip Income")
                                                        .amount(trip.getTripCharges())
                                                        .date(trip.getEndDate())
                                                        .description("Payment from " + c.getName())
                                                        .build());
                                }
                        }

                        // Add some monthly fixed expenses (not trip related)
                        expenseRepository.save(Expense.builder()
                                        .vehicle(vehicles.get(0))
                                        .expenseType("Loan EMI").amount(15000.0)
                                        .date(today.minusDays(5)).paidTo("HDFC Bank").paymentMode("Bank Transfer")
                                        .build());

                        log.info("Database seeding completed successfully.");
                } else {
                        // Ensure existing users have a PIN (specifically the original divakar user)
                        List<User> existingUsers = userRepository.findAll();
                        for (User u : existingUsers) {
                                if (u.getSecurityPin() == null || u.getSecurityPin().isEmpty()) {
                                        u.setSecurityPin("1234");
                                        userRepository.save(u);
                                }
                        }

                        log.info("Users already exist. Skipping database seeding. Ensured all users have security PINs.");
                }
        }
}
