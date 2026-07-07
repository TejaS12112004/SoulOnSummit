package com.trekmanagement.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app.mail")
public class MailConfig {

    private String fromAddress;
    private String fromName;
    private String baseUrl;
}
