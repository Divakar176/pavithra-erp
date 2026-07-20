import java.sql.*;

public class CheckDb {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:mysql://localhost:3306/pavithra_erp_db?useSSL=false&allowPublicKeyRetrieval=true";
        String user = "root";
        String password = "root123";
        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT username, password FROM users WHERE username='divakar'")) {
            if (rs.next()) {
                System.out.println("FOUND: " + rs.getString(1) + " / " + rs.getString(2));
            } else {
                System.out.println("USER NOT FOUND in pavithra_erp_db!");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
