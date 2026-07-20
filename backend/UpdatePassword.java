import java.sql.*;
import java.security.SecureRandom;
import java.util.Base64;
import java.security.MessageDigest;
// We'll use a simple approach to generate bcrypt hash manually or just use the spring jar.
// Since we have the spring crypto jar downloaded earlier, let's use it!

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class UpdatePassword {
    public static void main(String[] args) throws Exception {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String newHash = encoder.encode("Divaes176@");
        System.out.println("Generated new hash: " + newHash);

        String url = "jdbc:mysql://localhost:3306/pavithra_erp_db?useSSL=false&allowPublicKeyRetrieval=true";
        String user = "root";
        String dbPassword = "root123";

        try (Connection conn = DriverManager.getConnection(url, user, dbPassword);
             PreparedStatement stmt = conn.prepareStatement("UPDATE users SET password = ? WHERE username = 'divakar'")) {
            stmt.setString(1, newHash);
            int rows = stmt.executeUpdate();
            System.out.println("Rows updated: " + rows);
            if (rows > 0) {
                System.out.println("Password for divakar has been successfully reset to Divaes176@!");
            } else {
                System.out.println("Could not find user divakar to update.");
            }
        }
    }
}
