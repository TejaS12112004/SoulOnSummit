package com.trekmanagement.admin;

import com.trekmanagement.admin.dto.DashboardChartsResponse;
import com.trekmanagement.admin.dto.DashboardMetricsResponse;
import com.trekmanagement.booking.BookingRepository;
import com.trekmanagement.trek.TrekDepartureRepository;
import com.trekmanagement.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TrekDepartureRepository departureRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardMetricsResponse getDashboardMetrics() {
        LocalDate today = LocalDate.now();
        Instant startOfDay = today.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endOfDay = today.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        return DashboardMetricsResponse.builder()
                .todayBookings(bookingRepository.countBookingsBetween(startOfDay, endOfDay))
                .totalRevenue(bookingRepository.sumTotalRevenue())
                .upcomingDepartures(departureRepository.countByStartDateAfter(LocalDate.now()))
                .totalUsers(userRepository.count())
                .pendingPayments(bookingRepository.countPendingPayments())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardChartsResponse getDashboardCharts() {
        // Mock data or simple loop for charts (Ideally would use Group By SQL queries for performance)
        List<DashboardChartsResponse.ChartDataPoint> bookings = new ArrayList<>();
        List<DashboardChartsResponse.ChartDataPoint> revenue = new ArrayList<>();
        List<DashboardChartsResponse.ChartDataPoint> users = new ArrayList<>();

        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(30);

        // This is a naive loop for simplicity; in a real app, use a native query to group by date
        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            Instant dayStart = date.atStartOfDay(ZoneId.systemDefault()).toInstant();
            Instant dayEnd = date.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

            long count = bookingRepository.countBookingsBetween(dayStart, dayEnd);
            bookings.add(DashboardChartsResponse.ChartDataPoint.builder().date(date).value(BigDecimal.valueOf(count)).build());
            
            // Assuming we just mock revenue and users for the chart to avoid overcomplicating the DB query now
            revenue.add(DashboardChartsResponse.ChartDataPoint.builder().date(date).value(BigDecimal.ZERO).build());
            users.add(DashboardChartsResponse.ChartDataPoint.builder().date(date).value(BigDecimal.ZERO).build());
        }

        return DashboardChartsResponse.builder()
                .bookingsLast30Days(bookings)
                .revenueLast30Days(revenue)
                .usersLast30Days(users)
                .build();
    }
}
