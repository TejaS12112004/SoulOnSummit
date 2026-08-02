package com.trekmanagement.admin.dto;

import java.math.BigDecimal;

public interface MonthlyStatProjection {
    int getYear();
    int getMonth();
    long getCount();
    BigDecimal getRevenue();
}
