package com.pavithra.erp.repository;

import com.pavithra.erp.model.entity.VehicleDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleDocumentRepository extends JpaRepository<VehicleDocument, Long> {
    List<VehicleDocument> findByVehicleIdOrderByUploadedAtDesc(Long vehicleId);
}
