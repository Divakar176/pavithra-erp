import java.io.BufferedReader;
import java.io.FileReader;
import java.io.PrintWriter;

public class RescueData {
    public static void main(String[] args) throws Exception {
        BufferedReader reader = new BufferedReader(new FileReader("export_for_live.sql"));
        PrintWriter writer = new PrintWriter("export_rescued.sql", "UTF-8");
        
        String line;
        while ((line = reader.readLine()) != null) {
            if (line.startsWith("INSERT INTO `trips` VALUES")) {
                line = line.replace("INSERT INTO `trips` VALUES", 
                    "INSERT INTO `trips` (advance_paid, break_hours, diesel_cost, distance_km, driver_salary, end_date, end_meter, food_amount, is_deleted, load_weight, material_purchase_cost, start_date, start_meter, total_hours, trip_charges, created_at, customer_id, driver_id, id, updated_at, vehicle_id, payment_status, destination, end_time, material, source, start_time, status, current_latitude, current_longitude, last_location_update) VALUES");
                writer.println(line);
            } else if (line.startsWith("INSERT INTO `vehicles` VALUES")) {
                line = line.replace("INSERT INTO `vehicles` VALUES", 
                    "INSERT INTO `vehicles` (fc_expiry, insurance_expiry, is_deleted, max_load_tons, dummy_1, permit_expiry, dummy_2, purchase_price, created_at, id, updated_at, billing_type, container_size, monthly_contract_amount, status, type, vehicle_number) VALUES");
                writer.println(line);
            } else if (line.startsWith("INSERT INTO `customers` VALUES")) {
                line = line.replace("INSERT INTO `customers` VALUES", 
                    "INSERT INTO `customers` (is_deleted, outstanding_balance, created_at, id, updated_at, address, contract_details, email, gst_number, mobile, name) VALUES");
                writer.println(line);
            } else if (line.startsWith("INSERT INTO `users` VALUES")) {
                line = line.replace("INSERT INTO `users` VALUES", 
                    "INSERT INTO `users` (created_at, id, updated_at, email, mobile, password, security_pin, username, role) VALUES");
                writer.println(line);
            } else if (line.startsWith("INSERT INTO ")) {
                // Ignore other tables (incomes, expenses, etc) to avoid errors
                // We only care about rescuing the main data
            } else {
                writer.println(line);
            }
        }
        writer.close();
        reader.close();
        System.out.println("Rescued!");
    }
}
