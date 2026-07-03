package com.pavithra.erp.service;

import com.pavithra.erp.controller.dto.OcrResult;
import com.pavithra.erp.controller.dto.OcrTripResult;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Service
public class OcrService {

    // Mock implementation for Google Vision API / Tesseract
    public OcrResult extractTextFromReceipt(MultipartFile file) {
        // In a real scenario, we would send the image to Google Vision API
        // String rawText = googleVisionClient.annotateImage(file.getBytes());
        // Then parse the rawText to extract structured fields.
        
        // Simulating processing delay
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        return OcrResult.builder()
                .vendorName("Indian Oil Corporation")
                .gstNumber("33AAAAA0000A1Z5")
                .date(LocalDate.now())
                .amount(4500.00)
                .invoiceNumber("IOCL-2023-9876")
                .rawText("INDIAN OIL CORPORATION LTD... TAX INVOICE... TOTAL AMOUNT 4500.00")
                .build();
    }

    public OcrTripResult extractTripDataFromBill(MultipartFile file) {
        // Simulate processing time
        try {
            Thread.sleep(1200);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Return simulated data based on user's weighment slip
        return OcrTripResult.builder()
                .customerName("PAVITHRA")
                .vehicleNumber("TN19BU1792")
                .material("M SAND")
                .loadWeightTons(31.64) // Net Weight from 31640.00Kg
                .date(LocalDate.of(2026, 3, 27))
                .rawText("SHARA BRICKS& MINERALS PRIVATE LIMITED WEIGHMENT SLIP... Customer: PAVITHRA... Vehicle: TN19BU1792... Net Weight: 31640.00Kg")
                .build();
    }
}
