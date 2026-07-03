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

}
