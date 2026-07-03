package com.pavithra.erp.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_documents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(nullable = false, length = 100)
    private String name; // e.g., "RC Book", "Insurance Policy"

    @Column(nullable = false, length = 50)
    private String type; // e.g., "PDF", "IMAGE"

    @Column(nullable = false, length = 500)
    private String filePath; // Local path to the file

    @Column(nullable = false, length = 100)
    private String originalFilename;

    @Column(nullable = false)
    private Long fileSize; // in bytes

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime uploadedAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
