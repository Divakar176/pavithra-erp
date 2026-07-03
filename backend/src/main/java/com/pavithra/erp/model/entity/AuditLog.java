package com.pavithra.erp.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String username;

    @Column(nullable = false, length = 100)
    private String actionName; // e.g., "Deleted Vehicle", "Marked Trip Paid"

    @Column(nullable = false, length = 100)
    private String entityName; // e.g., "Vehicle", "Trip"

    @Column(nullable = true)
    private Long entityId;

    @Column(nullable = true, length = 500)
    private String details;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
