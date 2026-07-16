import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class UpdateVehicle {
    public static void main(String[] args) {
        try {
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/pavithra_erp_db", "root", "root123");
            PreparedStatement select = conn.prepareStatement("SELECT * FROM vehicles");
            ResultSet rs = select.executeQuery();
            boolean found = false;
            while(rs.next()) {
                found = true;
                System.out.println("Found vehicle: " + rs.getString("vehicle_number") + " Billing: " + rs.getString("billing_type") + " Amount: " + rs.getDouble("monthly_contract_amount"));
            }
            if(!found) {
                System.out.println("No vehicles found in DB!");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
