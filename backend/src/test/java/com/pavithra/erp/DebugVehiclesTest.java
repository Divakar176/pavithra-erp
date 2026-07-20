package com.pavithra.erp;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.pavithra.erp.repository.VehicleRepository;
import com.pavithra.erp.repository.TripRepository;

@SpringBootTest
public class DebugVehiclesTest {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private TripRepository tripRepository;

    @Test
    public void testFetchVehicles() {
        try {
            System.out.println("VEHICLE COUNT: " + vehicleRepository.findByIsDeletedFalse().size());
        } catch (Exception e) {
            System.out.println("VEHICLE FETCH FAILED");
            e.printStackTrace();
        }

        try {
            System.out.println("TRIP COUNT: " + tripRepository.findByIsDeletedFalse().size());
        } catch (Exception e) {
            System.out.println("TRIP FETCH FAILED");
            e.printStackTrace();
        }
    }
}
