package com.pavithra.erp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DataSourceConfig {

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Value("${DATABASE_USERNAME:}")
    private String databaseUsername;

    @Value("${DATABASE_PASSWORD:}")
    private String databasePassword;

    @Bean
    public DataSource dataSource() throws URISyntaxException {
        if (databaseUrl != null && databaseUrl.startsWith("postgres://")) {
            URI dbUri = new URI(databaseUrl);
            String username = databaseUsername;
            String password = databasePassword;
            if (dbUri.getUserInfo() != null) {
                String[] userInfo = dbUri.getUserInfo().split(":");
                username = userInfo[0];
                if (userInfo.length > 1) {
                    password = userInfo[1];
                }
            }
            int port = dbUri.getPort() == -1 ? 5432 : dbUri.getPort();
            String query = dbUri.getQuery();
            String sslParams = "sslmode=require";
            if (query != null && !query.isEmpty()) {
                sslParams = query + "&" + sslParams;
            }
            String dbUrl = "jdbc:postgresql://" + dbUri.getHost() + ":" + port + dbUri.getPath() + "?" + sslParams;

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
