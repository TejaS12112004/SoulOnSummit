package com.trekmanagement.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class DashboardResponse {
    private DashboardStats stats;
    private List<RevenueData> revenueTimeline;
    private List<BookingData> monthlyBookings;
    private List<CategoryData> trekCategories;
    private List<RecentBooking> recentBookings;
    private List<RecentActivity> recentActivity;
    private List<UpcomingBatch> upcomingBatches;

    @Data
    @Builder
    public static class DashboardStats {
        private long totalBookings;
        private BigDecimal totalRevenue;
        private long activeUsers; // We map this to totalUsers as per user instruction
        private long upcomingDepartures;
    }

    @Data
    @Builder
    public static class RevenueData {
        private String month;
        private BigDecimal amount;
    }

    @Data
    @Builder
    public static class BookingData {
        private String month;
        private long count;
    }

    @Data
    @Builder
    public static class CategoryData {
        private String name;
        private long value;
        private String color;
    }

    @Data
    @Builder
    public static class RecentBooking {
        private String id; // bookingReference
        private String user;
        private String trek;
        private String date; // departure start date formatted
        private BigDecimal amount;
        private String status;
    }

    @Data
    @Builder
    public static class RecentActivity {
        private String id;
        private String type; // "booking" | "user"
        private String message;
        private String timeAgo;
        private java.time.Instant timestamp; // For sorting, exclude from JSON if possible, or leave it
    }

    @Data
    @Builder
    public static class UpcomingBatch {
        private String id;
        private String trekName;
        private String date; // formatted start date
        private int registered;
        private int capacity;
    }
}
