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
        if (databaseUrl != null && databaseUrl.startsWith("postgres://")) {
            String dbUrl = databaseUrl.replace("postgres://", "jdbc:postgresql://");
            return DataSourceBuilder.create()
                    .url(dbUrl)
                    .username(databaseUsername)
                    .password(databasePassword)
                    .driverClassName("org.postgresql.Driver")
                    .build();
        }
        return DataSourceBuilder.create()
                .url(databaseUrl)
                .username(databaseUsername)
                .password(databasePassword)
                .driverClassName("org.postgresql.Driver") // Force postgresql driver since we are switching to Postgres on production
                .build();
    }
}
