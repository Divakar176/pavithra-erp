import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class CheckAiven {
    public static void main(String[] args) {
        String url = "jdbc:mysql://mysql-3cf0c353-diva-6648.l.aivencloud.com:12108/defaultdb?sslMode=REQUIRED";
        String user = "avnadmin";
        String password = "AVNS_9Y5_n3TBKiDGViDpuuk";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {
            
            System.out.println("Connected to Aiven!");
            ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM vehicles");
            if (rs.next()) {
                System.out.println("Vehicles count in Aiven: " + rs.getInt(1));
            }
            
            rs = stmt.executeQuery("SELECT COUNT(*) FROM trips");
            if (rs.next()) {
                System.out.println("Trips count in Aiven: " + rs.getInt(1));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
