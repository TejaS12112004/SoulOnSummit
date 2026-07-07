package com.trekmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class TrekManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(TrekManagementApplication.class, args);
    }
}
