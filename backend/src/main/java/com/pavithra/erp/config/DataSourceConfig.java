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

    @Value("${DATABASE_USERNAME:}")
    private String databaseUsername;

    @Value("${DATABASE_PASSWORD:}")
    private String databasePassword;

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
        return DataSourceBuilder.create()
                .url(databaseUrl)
                .username(databaseUsername)
                .password(databasePassword)
                .driverClassName("org.postgresql.Driver")
                .build();
    }
}
