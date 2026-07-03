package com.pavithra.erp.service;

import com.pavithra.erp.model.entity.Vehicle;
import com.pavithra.erp.model.entity.VehicleDocument;
import com.pavithra.erp.repository.VehicleDocumentRepository;
import com.pavithra.erp.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final VehicleDocumentRepository documentRepository;
    private final VehicleRepository vehicleRepository;

    private final String UPLOAD_DIR = "secure_uploads/vehicles/";

    public VehicleDocument uploadVehicleDocument(Long vehicleId, String name, String type, MultipartFile file) throws IOException {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String storedFilename = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(storedFilename);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        VehicleDocument document = VehicleDocument.builder()
                .vehicle(vehicle)
                .name(name)
                .type(type)
                .filePath(filePath.toString())
                .originalFilename(originalFilename)
                .fileSize(file.getSize())
                .build();

        return documentRepository.save(document);
    }

    public List<VehicleDocument> getDocumentsByVehicleId(Long vehicleId) {
        return documentRepository.findByVehicleIdOrderByUploadedAtDesc(vehicleId);
    }

    public Resource loadDocumentAsResource(Long documentId) throws Exception {
        VehicleDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        Path filePath = Paths.get(document.getFilePath()).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists()) {
            return resource;
        } else {
            throw new RuntimeException("File not found");
        }
    }

    public void deleteDocument(Long documentId) throws IOException {
        VehicleDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        Path filePath = Paths.get(document.getFilePath()).normalize();
        Files.deleteIfExists(filePath);

        documentRepository.delete(document);
    }
}
