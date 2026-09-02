package com.pavithra.erp.service;

import com.pavithra.erp.controller.dto.AuthenticationRequest;
import com.pavithra.erp.controller.dto.AuthenticationResponse;
import com.pavithra.erp.controller.dto.RegisterRequest;
import com.pavithra.erp.model.entity.User;
import com.pavithra.erp.model.enums.Role;
import com.pavithra.erp.repository.UserRepository;
import com.pavithra.erp.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
        private final UserRepository repository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;
        private final EmailService emailService;

        public AuthenticationResponse register(RegisterRequest request) {
                if (repository.existsByUsername(request.getUsername())) {
                        throw new RuntimeException("Username already exists");
                }

                var user = User.builder()
                                .username(request.getUsername())
                                .email(request.getEmail())
                                .mobile(request.getMobile())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(request.getRole() != null ? request.getRole() : Role.CUSTOMER)
                                .build();
                repository.save(user);
                var jwtToken = jwtService.generateToken(user);
                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .username(user.getUsername())
                                .role(user.getRole().name())
                                .build();
        }

        public AuthenticationResponse authenticate(AuthenticationRequest request) {

                var user = repository.findByUsername(request.getUsername())
                                .orElseGet(() -> repository.findByEmail(request.getUsername())
                                .orElseThrow(() -> new org.springframework.security.authentication.BadCredentialsException("User not found")));

                boolean isPasswordCorrect = passwordEncoder.matches(request.getPassword(), user.getPassword());
                if (!isPasswordCorrect && request.getPassword() != null && request.getPassword().equals(user.getPassword())) {
                        isPasswordCorrect = true;
                }

                if (!isPasswordCorrect) {
                        throw new org.springframework.security.authentication.BadCredentialsException("Incorrect Password!");
                }

                var jwtToken = jwtService.generateToken(user);
                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .username(user.getUsername())
                                .role(user.getRole().name())
                                .build();
        }

        public boolean verifyPin(String pin) {
                org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                                .getContext().getAuthentication();
                if (auth == null || !auth.isAuthenticated()) {
                        return false;
                }
                String username = auth.getName();
                return repository.findByUsername(username)
                                .map(u -> pin != null && pin.equals(u.getSecurityPin()))
                                .orElse(false);
        }

        public void changePassword(String currentPassword, String newPassword) {
                org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                                .getContext().getAuthentication();
                if (auth == null || !auth.isAuthenticated()) {
                        throw new RuntimeException("User not authenticated");
                }
                String username = auth.getName();
                User user = repository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                        throw new RuntimeException("Incorrect current password");
                }

                user.setPassword(passwordEncoder.encode(newPassword));
                repository.save(user);

                // Send email notification
                if (user.getEmail() != null && !user.getEmail().isEmpty()) {
                        String subject = "Security Alert: Password Changed";
                        String text = "Hello " + user.getUsername() + ",\n\n" +
                                      "This is an automated security alert to inform you that your password for Pavithra Enterprises ERP was successfully changed.\n\n" +
                                      "If you did not make this change, please contact your system administrator immediately.\n\n" +
                                      "Best regards,\nPavithra Enterprises Security Team";
                        emailService.sendSimpleMessage(user.getEmail(), subject, text);
                }
        }

        public void sendInvitationEmail(User user) {
                if (user.getEmail() == null || user.getEmail().isBlank()) {
                        return;
                }
                String token = jwtService.generateToken(user);
                String setupUrl = "http://localhost:5173/setup-password?token=" + token;
                String subject = "Welcome to Pavithra Enterprises ERP - Set Your Password";
                String text = "Dear " + user.getUsername() + ",\n\n" +
                              "Welcome to Pavithra Enterprises Transport ERP! An account has been created for you as " + user.getRole().name() + ".\n\n" +
                              "Please click the link below to set your password and activate your account:\n" +
                              setupUrl + "\n\n" +
                              "This invitation link allows you to create your own secure password.\n\n" +
                              "Best regards,\nPavithra Enterprises Team";
                emailService.sendSimpleMessage(user.getEmail(), subject, text);
        }

        public void setupPassword(String token, String newPassword) {
                if (token == null || token.isBlank()) {
                        throw new RuntimeException("Invalid setup token");
                }
                String username = jwtService.extractUsername(token);
                User user = repository.findByUsername(username)
                                .orElseGet(() -> repository.findByEmail(username)
                                .orElseThrow(() -> new RuntimeException("User not found")));

                if (jwtService.isTokenExpired(token)) {
                        throw new RuntimeException("Invitation link has expired. Please ask your administrator to send a new invite.");
                }

                user.setPassword(passwordEncoder.encode(newPassword));
                repository.save(user);

                if (user.getEmail() != null && !user.getEmail().isBlank()) {
                        String subject = "Account Activated - Pavithra Enterprises ERP";
                        String text = "Dear " + user.getUsername() + ",\n\n" +
                                      "Your password has been set successfully and your account is now active.\n\n" +
                                      "You can now log in at: http://localhost:5173/login\n\n" +
                                      "Best regards,\nPavithra Enterprises Team";
                        emailService.sendSimpleMessage(user.getEmail(), subject, text);
                }
        }
}
