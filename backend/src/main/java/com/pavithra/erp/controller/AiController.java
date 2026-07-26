package com.pavithra.erp.controller;

import com.pavithra.erp.controller.dto.AiAuditResult;
import com.pavithra.erp.controller.dto.OcrResult;
import com.pavithra.erp.controller.dto.OcrTripResult;
import com.pavithra.erp.model.entity.Expense;
import com.pavithra.erp.service.AiService;
import com.pavithra.erp.service.OcrService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final OcrService ocrService;
    private final AiService aiService;

    @PostMapping("/ocr/extract")
    public ResponseEntity<OcrResult> extractReceiptData(@RequestParam("file") MultipartFile file) {
        System.out.println("Hey ! I received a file named :"+ file.getOriginalFilename());
        return ResponseEntity.ok(ocrService.extractTextFromReceipt(file));
    }

    @PostMapping("/ocr/extract-trip")
    public ResponseEntity<OcrTripResult> extractTripData(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ocrService.extractTripDataFromBill(file));
    }

    @PostMapping("/audit/expense")
    public ResponseEntity<AiAuditResult> auditExpense(
            @RequestBody Expense expense,
            @RequestParam("ocrRawText") String ocrRawText) {
        return ResponseEntity.ok(aiService.auditExpense(expense, ocrRawText));
    }

    @PostMapping("/bi/ask")
    public ResponseEntity<Map<String, String>> askBusinessIntelligence(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        String response = aiService.askBusinessIntelligence(query);
        return ResponseEntity.ok(Map.of("response", response));
    }
}
