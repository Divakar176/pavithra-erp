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
                if (userRepository.findByUsername("divakar").isEmpty()) {
                        log.info("Starting database seeding...");

                        // 1. Seed Users
                        if (!userRepository.existsByUsername("divakar") &&
                            !userRepository.existsByEmail("divakar@pavithraerp.com") &&
                            userRepository.findByMobile("0000000001").isEmpty()) {
                                userRepository.save(User.builder()
                                                .username("divakar")
                                                .email("divakar@pavithraerp.com")
                                                .mobile("0000000001")
                                                .password(passwordEncoder.encode("Divaes176@"))
                                                .role(Role.SUPER_ADMIN)
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

                        if (!userRepository.existsByUsername("owner2") &&
                            !userRepository.existsByEmail("owner2@pavithraerp.com") &&
                            userRepository.findByMobile("2222222222").isEmpty()) {
                                userRepository.save(User.builder()
                                                .username("owner2")
                                                .email("owner2@pavithraerp.com")
                                                .mobile("2222222222")
                                                .password(passwordEncoder.encode("password"))
                                                .securityPin("2222")
                                                .role(Role.SUPER_ADMIN)
                                                .build());
                        }

                        if (!userRepository.existsByUsername("owner3") &&
                            !userRepository.existsByEmail("owner3@pavithraerp.com") &&
                            userRepository.findByMobile("3333333333").isEmpty()) {
                                userRepository.save(User.builder()
                                                .username("owner3")
                                                .email("owner3@pavithraerp.com")
                                                .mobile("3333333333")
                                                .password(passwordEncoder.encode("password"))
                                                .securityPin("3333")
                                                .role(Role.SUPER_ADMIN)
                                                .build());
                        }

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
