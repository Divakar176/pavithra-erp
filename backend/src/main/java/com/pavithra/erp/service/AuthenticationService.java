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
                                .orElseThrow(() -> new org.springframework.security.authentication.BadCredentialsException(
                                                "User not found"));

                boolean isPasswordCorrect = passwordEncoder.matches(request.getPassword(), user.getPassword());

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

}
