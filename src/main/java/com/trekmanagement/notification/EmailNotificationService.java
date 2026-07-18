package com.trekmanagement.notification;

import com.trekmanagement.booking.Booking;

public interface EmailNotificationService {

    void sendConfirmation(Booking booking);

    void sendCancellation(Booking booking);
}
