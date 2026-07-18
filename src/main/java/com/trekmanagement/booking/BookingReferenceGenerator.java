package com.trekmanagement.booking;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.time.Year;

@Component
public class BookingReferenceGenerator {

    private final JdbcTemplate jdbcTemplate;

    public BookingReferenceGenerator(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Generates a unique booking reference in the format: SOS-YYYY-NNNNNN
     * Uses a PostgreSQL sequence `booking_ref_seq` created in Flyway V8.
     */
    public String generate() {
        Long nextVal = jdbcTemplate.queryForObject("SELECT nextval('booking_ref_seq')", Long.class);
        int year = Year.now().getValue();
        return String.format("SOS-%d-%06d", year, nextVal);
    }
}
