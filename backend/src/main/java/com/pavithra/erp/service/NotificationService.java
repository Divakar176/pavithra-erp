package com.pavithra.erp.service;

import com.pavithra.erp.model.entity.Notification;
import com.pavithra.erp.model.entity.VehicleLoan;
import com.pavithra.erp.repository.NotificationRepository;
import com.pavithra.erp.repository.VehicleLoanRepository;
import com.pavithra.erp.repository.VehicleRepository;
import com.pavithra.erp.model.entity.Vehicle;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final VehicleLoanRepository vehicleLoanRepository;
    private final VehicleRepository vehicleRepository;

    public List<Notification> getUnreadNotifications() {
        return notificationRepository.findByIsReadFalseOrderByCreatedAtDesc();
    }

    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(notification -> {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        });
    }
    
    public void markAllAsRead() {
        List<Notification> unread = notificationRepository.findByIsReadFalseOrderByCreatedAtDesc();
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }

    @Scheduled(cron = "0 0 8 * * ?") // Run at 8:00 AM every day
    public void checkEmiDates() {
        log.info("Checking upcoming EMI dates for notifications...");
        List<VehicleLoan> activeLoans = vehicleLoanRepository.findByStatus("Active");
        LocalDate today = LocalDate.now();

        for (VehicleLoan loan : activeLoans) {
            int emiDate = loan.getEmiDate();
            int currentDay = today.getDayOfMonth();
            
            // Check if EMI is due in the next 3 days or today
            int daysUntilEmi = emiDate - currentDay;
            
            // Handle month wraparound roughly (e.g., today is 28th, EMI is 2nd)
            if (daysUntilEmi < 0) {
                int daysInMonth = today.lengthOfMonth();
                daysUntilEmi = (daysInMonth - currentDay) + emiDate;
            }
            
            if (daysUntilEmi >= 0 && daysUntilEmi <= 3) {
                String message = String.format("EMI Alert: EMI of ₹%.0f for vehicle %s (Bank: %s) is due in %d days.",
                        loan.getEmiAmount(), 
                        loan.getVehicle().getVehicleNumber(),
                        loan.getBankName(),
                        daysUntilEmi);
                
                Notification notification = Notification.builder()
                        .message(message)
                        .type("EMI_ALERT")
                        .isRead(false)
                        .build();
                notificationRepository.save(notification);
            }
        }
    }

    // Mock implementation for Twilio / WhatsApp Business API
    public void sendWhatsAppAlert(String mobileNumber, String message) {
        // In reality, use Twilio API: Message.creator(new com.twilio.type.PhoneNumber("whatsapp:"+mobileNumber), ...).create();
        log.info("Sending WhatsApp Alert to {}: {}", mobileNumber, message);
    }

    public void sendSmsAlert(String mobileNumber, String message) {
        log.info("Sending SMS Alert to {}: {}", mobileNumber, message);
    }
    
    @Scheduled(cron = "0 0 9 * * ?") // Run at 9:00 AM every day
    public void checkExpiriesAndAlert() {
        log.info("Checking for document expiries and triggering automatic alerts...");
        List<Vehicle> vehicles = vehicleRepository.findAll();
        LocalDate today = LocalDate.now();
        
        for (Vehicle vehicle : vehicles) {
            checkAndAlertDocument(vehicle.getVehicleNumber(), "Insurance", vehicle.getInsuranceExpiry(), today);
            checkAndAlertDocument(vehicle.getVehicleNumber(), "FC", vehicle.getFcExpiry(), today);
            checkAndAlertDocument(vehicle.getVehicleNumber(), "Road Tax", vehicle.getTaxExpiry(), today);
            checkAndAlertDocument(vehicle.getVehicleNumber(), "National Permit", vehicle.getPermitExpiry(), today);
            checkAndAlertDocument(vehicle.getVehicleNumber(), "Pollution Certificate", vehicle.getPollutionExpiry(), today);
        }
    }
    
    private void checkAndAlertDocument(String vehicleNumber, String docName, LocalDate expiryDate, LocalDate today) {
        if (expiryDate == null) return;
        
        long daysLeft = java.time.temporal.ChronoUnit.DAYS.between(today, expiryDate);
        if (daysLeft <= 30 && daysLeft >= 0) {
            String message = String.format("EXPIRY ALERT: %s for Vehicle %s is expiring in %d days!", docName, vehicleNumber, daysLeft);
            
            // Check if we already have an unread notification for this exact message to avoid spamming
            boolean exists = notificationRepository.findByIsReadFalseOrderByCreatedAtDesc().stream()
                .anyMatch(n -> n.getMessage().equals(message));
                
            if (!exists) {
                Notification notification = Notification.builder()
                        .message(message)
                        .type("DOCUMENT_ALERT")
                        .isRead(false)
                        .build();
                notificationRepository.save(notification);
            }
        } else if (daysLeft < 0) {
            String message = String.format("CRITICAL: %s for Vehicle %s has EXPIRED %d days ago!", docName, vehicleNumber, Math.abs(daysLeft));
            
            boolean exists = notificationRepository.findByIsReadFalseOrderByCreatedAtDesc().stream()
                .anyMatch(n -> n.getMessage().equals(message));
                
            if (!exists) {
                Notification notification = Notification.builder()
                        .message(message)
                        .type("DOCUMENT_ALERT")
                        .isRead(false)
                        .build();
                notificationRepository.save(notification);
            }
        }
    }
}
