package com.pavithra.erp;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.sql.*;

public class ResetPassword {
    public static void main(String[] args) throws Exception {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String newHash = encoder.encode("Divaes176@");
        
        String url = "jdbc:mysql://mysql-3cf0c353-diva-6648.l.aivencloud.com:12108/defaultdb?sslMode=REQUIRED";
        try (Connection conn = DriverManager.getConnection(url, "avnadmin", "AVNS_9Y5_n3TBKiDGViDpuuk");
             PreparedStatement stmt = conn.prepareStatement("UPDATE users SET password = ? WHERE username = 'divakar'")) {
            stmt.setString(1, newHash);
            int rows = stmt.executeUpdate();
            System.out.println("Rows updated in AIVEN DB: " + rows);
        }
    }
}
