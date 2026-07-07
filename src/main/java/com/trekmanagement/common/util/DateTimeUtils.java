package com.trekmanagement.common.util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;

public final class DateTimeUtils {

    private DateTimeUtils() {}

    public static Instant nowPlusDays(int days) {
        return Instant.now().plus(days, ChronoUnit.DAYS);
    }

    public static Instant nowPlusHours(int hours) {
        return Instant.now().plus(hours, ChronoUnit.HOURS);
    }

    public static boolean isExpired(Instant expiry) {
        return Instant.now().isAfter(expiry);
    }

    public static boolean isAfterNow(LocalDate date) {
        return date.isAfter(LocalDate.now(ZoneOffset.UTC));
    }

    public static long hoursUntil(Instant target) {
        return ChronoUnit.HOURS.between(Instant.now(), target);
    }
}
