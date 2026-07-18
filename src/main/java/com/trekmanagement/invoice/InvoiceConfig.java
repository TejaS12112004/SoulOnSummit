package com.trekmanagement.invoice;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app.invoice")
public class InvoiceConfig {
    
    private BigDecimal gstRate = new BigDecimal("18.00");
}
