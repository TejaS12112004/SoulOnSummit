package com.trekmanagement.admin;

import com.trekmanagement.admin.dto.DashboardResponse;
import com.trekmanagement.admin.dto.DashboardResponse.*;
import com.trekmanagement.admin.dto.DifficultyStatProjection;
import com.trekmanagement.admin.dto.MonthlyStatProjection;
import com.trekmanagement.booking.Booking;
import com.trekmanagement.booking.BookingRepository;
import com.trekmanagement.booking.BookingStatus;
import com.trekmanagement.trek.DepartureStatus;
import com.trekmanagement.trek.TrekDeparture;
import com.trekmanagement.trek.TrekDepartureRepository;
import com.trekmanagement.trek.TrekRepository;
import com.trekmanagement.user.User;
import com.trekmanagement.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import java.time.YearMonth;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TrekDepartureRepository departureRepository;
    private final TrekRepository trekRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMM d, yyyy");

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getDashboardData() {
        LocalDate today = LocalDate.now();

        // 1. Stats
        BigDecimal revenue = bookingRepository.sumTotalRevenue();
        long totalUsers = userRepository.count();
        long upcomingDeparturesCount = departureRepository.countUpcomingActiveDepartures(DepartureStatus.OPEN, today);
        long totalBookings = bookingRepository.countByStatusIn(List.of(BookingStatus.CONFIRMED));

        DashboardStats stats = DashboardStats.builder()
                .totalBookings(totalBookings)
                .totalRevenue(revenue != null ? revenue : BigDecimal.ZERO)
                .activeUsers(totalUsers) // Using totalUsers as activeUsers
                .upcomingDepartures(upcomingDeparturesCount)
                .build();

        // 2. Monthly Charts (Last 6 months + Current month = 7 data points)
        List<RevenueData> revenueTimeline = new ArrayList<>();
        List<BookingData> monthlyBookings = new ArrayList<>();
        
        YearMonth currentMonth = YearMonth.now();
        Instant sixMonthsAgo = currentMonth.minusMonths(6).atDay(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        
        List<MonthlyStatProjection> rawMonthlyStats = bookingRepository.getMonthlyStats(sixMonthsAgo);
        Map<YearMonth, MonthlyStatProjection> statsMap = rawMonthlyStats.stream()
                .collect(Collectors.toMap(
                        stat -> YearMonth.of(stat.getYear(), stat.getMonth()),
                        stat -> stat
                ));

        for (int i = 6; i >= 0; i--) {
            YearMonth ym = currentMonth.minusMonths(i);
            String monthLabel = ym.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            
            MonthlyStatProjection stat = statsMap.get(ym);
            long count = stat != null ? stat.getCount() : 0;
            BigDecimal rev = stat != null ? stat.getRevenue() : BigDecimal.ZERO;
            
            revenueTimeline.add(RevenueData.builder().month(monthLabel).amount(rev).build());
            monthlyBookings.add(BookingData.builder().month(monthLabel).count(count).build());
        }

        // 3. Category Data (Trek difficulty distribution)
        List<DifficultyStatProjection> rawDifficultyStats = trekRepository.getDifficultyStats();
        List<CategoryData> categoryData = rawDifficultyStats.stream().map(d -> {
            String color = switch (d.getDifficulty()) {
                case "EASY" -> "#10B981";
                case "MODERATE" -> "#F59E0B";
                case "DIFFICULT" -> "#EF4444";
                case "EXTREME" -> "#8B5CF6";
                default -> "#3B82F6";
            };
            return CategoryData.builder()
                    .name(d.getDifficulty())
                    .value(d.getCount())
                    .color(color)
                    .build();
        }).collect(Collectors.toList());

        // 4. Recent Bookings (Top 5)
        List<Booking> top5Bookings = bookingRepository.findTop5ByOrderByBookedAtDesc();
        List<RecentBooking> recentBookings = top5Bookings.stream().map(b -> RecentBooking.builder()
                .id(b.getBookingReference())
                .user(b.getUser().getFirstName() + " " + b.getUser().getLastName())
                .trek(b.getDeparture().getTrek().getTitle())
                .date(b.getDeparture().getStartDate().format(DATE_FORMATTER))
                .amount(b.getTotalAmount())
                .status(b.getStatus().name())
                .build()
        ).collect(Collectors.toList());

        // 5. Recent Activity (Merge recent users and recent bookings)
        List<User> recentUsers = userRepository.findTop5ByOrderByCreatedAtDesc();
        List<RecentActivity> activities = new ArrayList<>();
        
        recentBookings.forEach(rb -> {
            // Find original booking to get exact bookedAt
            Booking original = top5Bookings.stream().filter(b -> b.getBookingReference().equals(rb.getId())).findFirst().orElse(null);
            if (original != null) {
                activities.add(RecentActivity.builder()
                        .id(rb.getId())
                        .type("booking")
                        .message("New booking: " + rb.getUser() + " - " + rb.getTrek())
                        .timestamp(original.getBookedAt())
                        .timeAgo(getTimeAgo(original.getBookedAt()))
                        .build());
            }
        });
        
        recentUsers.forEach(u -> {
            activities.add(RecentActivity.builder()
                    .id(u.getId().toString())
                    .type("user")
                    .message("New user registered: " + u.getFirstName() + " " + u.getLastName())
                    .timestamp(u.getCreatedAt())
                    .timeAgo(getTimeAgo(u.getCreatedAt()))
                    .build());
        });
        
        // Sort descending by timestamp and take top 5
        activities.sort(Comparator.comparing(RecentActivity::getTimestamp).reversed());
        List<RecentActivity> recentActivity = activities.stream().limit(5).collect(Collectors.toList());

        // 6. Upcoming Batches (Top 5 nearest future open departures)
        List<TrekDeparture> departures = departureRepository.findTop5ByStatusAndIsActiveTrueAndTrekPublishedTrueAndStartDateGreaterThanEqualOrderByStartDateAsc(DepartureStatus.OPEN, today);
        List<UpcomingBatch> upcomingBatches = departures.stream().map(d -> UpcomingBatch.builder()
                .id(d.getId().toString())
                .trekName(d.getTrek().getTitle())
                .date(d.getStartDate().format(DATE_FORMATTER))
                .registered(d.getTotalSeats() - d.getAvailableSeats())
                .capacity(d.getTotalSeats())
                .build()
        ).collect(Collectors.toList());

        return DashboardResponse.builder()
                .stats(stats)
                .revenueTimeline(revenueTimeline)
                .monthlyBookings(monthlyBookings)
                .trekCategories(categoryData)
                .recentBookings(recentBookings)
                .recentActivity(recentActivity)
                .upcomingBatches(upcomingBatches)
                .build();
    }
    
    private String getTimeAgo(Instant instant) {
        if (instant == null) return "Unknown";
        long minutes = ChronoUnit.MINUTES.between(instant, Instant.now());
        if (minutes < 60) return minutes + "m ago";
        long hours = ChronoUnit.HOURS.between(instant, Instant.now());
        if (hours < 24) return hours + "h ago";
        long days = ChronoUnit.DAYS.between(instant, Instant.now());
        return days + "d ago";
    }
}
