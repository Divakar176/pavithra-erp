package com.pavithra.erp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Value("${DATABASE_USERNAME:root}")
    private String databaseUsername;

    @Value("${DATABASE_PASSWORD:root123}")
    private String databasePassword;

    @Value("${spring.datasource.url:jdbc:mysql://localhost:3306/pavithra_erp_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}")
    private String defaultUrl;

    @Bean
    public DataSource dataSource() {
        if (databaseUrl != null && (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://"))) {
            String prefix = databaseUrl.startsWith("postgres://") ? "postgres://" : "postgresql://";
            String withoutScheme = databaseUrl.substring(prefix.length());
            int atIndex = withoutScheme.lastIndexOf('@');
            String username = databaseUsername;
            String password = databasePassword;
            String hostPortDb = withoutScheme;

            if (atIndex != -1) {
                String userInfo = withoutScheme.substring(0, atIndex);
                hostPortDb = withoutScheme.substring(atIndex + 1);
                int colonIndex = userInfo.indexOf(':');
                if (colonIndex != -1) {
                    username = userInfo.substring(0, colonIndex);
                    password = userInfo.substring(colonIndex + 1);
                } else {
                    username = userInfo;
                }
            }

            String dbUrl = "jdbc:postgresql://" + hostPortDb;
            if (dbUrl.contains("?")) {
                dbUrl += "&sslmode=require";
            } else {
                dbUrl += "?sslmode=require";
            }

            return DataSourceBuilder.create()
                    .url(dbUrl)
                    .username(username)
                    .password(password)
                    .driverClassName("org.postgresql.Driver")
                    .build();
        }
        
        // Fallback for local development if DATABASE_URL is not provided or not postgres
        String url = (databaseUrl != null && !databaseUrl.isEmpty()) ? databaseUrl : defaultUrl;
        return DataSourceBuilder.create()
                .url(url)
                .username(databaseUsername)
                .password(databasePassword)
                // Let Spring Boot infer the driver class from the URL
                .build();
    }
}
