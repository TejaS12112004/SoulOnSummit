package com.trekmanagement.user.dto;

import lombok.Data;

@Data
public class UpdatePreferencesRequest {
    private boolean notifyBookingUpdates;
    private boolean notifyUpcomingTreks;
    private boolean notifyPromotions;
}
