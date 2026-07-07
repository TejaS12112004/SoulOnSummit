package com.trekmanagement.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app.jwt")
public class JwtConfig {

    /** Base64-encoded HS256 secret — minimum 256 bits */
    private String secret;

    /** Access token TTL in milliseconds (default: 15 min) */
    private long accessTokenExpiryMs;

    /** Refresh token TTL in days (default: 30 days) */
    private int refreshTokenExpiryDays;
}
