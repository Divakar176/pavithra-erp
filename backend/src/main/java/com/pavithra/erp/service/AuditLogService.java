package com.pavithra.erp.service;

import com.pavithra.erp.model.entity.AuditLog;
import com.pavithra.erp.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository repository;

    public void logAction(String actionName, String entityName, Long entityId, String details) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = (auth != null && auth.getName() != null) ? auth.getName() : "System";

        AuditLog log = AuditLog.builder()
                .username(username)
                .actionName(actionName)
                .entityName(entityName)
                .entityId(entityId)
                .details(details)
                .build();
        repository.save(log);
    }

    public List<AuditLog> getAllLogs() {
        return repository.findAllByOrderByCreatedAtDesc();
    }
}
