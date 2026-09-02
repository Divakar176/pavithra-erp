package com.pavithra.erp.controller;

import com.pavithra.erp.controller.dto.AuthenticationRequest;
import com.pavithra.erp.controller.dto.AuthenticationResponse;
import com.pavithra.erp.controller.dto.RegisterRequest;
import com.pavithra.erp.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        System.out.println("ATTEMPTING LOGIN FOR: " + request.getUsername() + " WITH PASSWORD: " + request.getPassword());
        try {
            return ResponseEntity.ok(service.authenticate(request));
        } catch (Exception e) {
            System.out.println("LOGIN FAILED: " + e.getMessage());
            throw e;
        }
    }

    @PostMapping("/verify-pin")
    public ResponseEntity<java.util.Map<String, Boolean>> verifyPin(
            @RequestBody java.util.Map<String, String> request
    ) {
        return ResponseEntity.ok(java.util.Map.of("success", service.verifyPin(request.get("pin"))));
    }

    @PostMapping("/setup-password")
    public ResponseEntity<?> setupPassword(@RequestBody java.util.Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("newPassword");
            service.setupPassword(token, newPassword);
            return ResponseEntity.ok(java.util.Map.of("message", "Password configured successfully! You can now log in."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
