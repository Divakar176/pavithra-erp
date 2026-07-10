package com.pavithra.erp.controller;

import com.pavithra.erp.model.entity.User;
import com.pavithra.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import com.pavithra.erp.controller.dto.ChangePasswordRequest;
import com.pavithra.erp.service.AuthenticationService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository repository;
    private final AuthenticationService authenticationService;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @PostMapping("/drivers")
    public ResponseEntity<User> createDriver(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String mobile = payload.get("mobile");
        
        User user = User.builder()
                .username(payload.get("username"))
                .email(email != null && email.isBlank() ? null : email)
                .mobile(mobile != null && mobile.isBlank() ? null : mobile)
                .password(passwordEncoder.encode("Driver123@"))
                .securityPin("1234")
                .role(com.pavithra.erp.model.entity.Role.DRIVER)
                .build();
        repository.save(user);
        return ResponseEntity.ok(user);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @GetMapping("/drivers")
    public ResponseEntity<List<User>> getDrivers() {
        // Return only drivers (or everyone if role is not fully strict yet, but we have
        // Role.DRIVER)
        List<User> drivers = repository.findAll().stream()
                .filter(u -> "DRIVER".equals(u.getRole().name()) || "SUPER_ADMIN".equals(u.getRole().name()) || "ADMIN".equals(u.getRole().name()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(drivers);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @PutMapping("/drivers/{id}")
    public ResponseEntity<User> updateDriver(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        User user = repository.findById(id).orElseThrow(() -> new RuntimeException("Driver not found"));
        if (payload.containsKey("mobile")) {
            String mobile = payload.get("mobile");
            user.setMobile(mobile != null && mobile.isBlank() ? null : mobile);
        }
        if (payload.containsKey("email")) {
            String email = payload.get("email");
            user.setEmail(email != null && email.isBlank() ? null : email);
        }
        if (payload.containsKey("username")) {
            user.setUsername(payload.get("username"));
        }
        repository.save(user);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            authenticationService.changePassword(request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
