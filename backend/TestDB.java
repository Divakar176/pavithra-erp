import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class TestDB {
    public static void main(String[] args) {
        String url = "jdbc:mysql://mysql-3cf0c353-diva-6648.l.aivencloud.com:12108/defaultdb?sslMode=REQUIRED";
        String user = "avnadmin";
        String password = "AVNS_9Y5_n3TBKiDGViDpuuk";
        
        try {
            Connection conn = DriverManager.getConnection(url, user, password);
            System.out.println("Connection successful!");
        } catch (SQLException e) {
            System.out.println("Connection failed:");
            e.printStackTrace();
        }
    }
}
