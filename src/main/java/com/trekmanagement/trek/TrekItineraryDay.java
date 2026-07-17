package com.trekmanagement.trek;

import com.trekmanagement.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * A single day in the day-wise itinerary for a Trek.
 * The itinerary is a reusable template shared by every departure of the same trek.
 * Ordered per-trek by displayOrder ASC.
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "trek_itinerary_days")
public class TrekItineraryDay extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "trek_id", nullable = false)
    private Trek trek;

    @Column(name = "day_number", nullable = false)
    private Integer dayNumber;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "stay", length = 255)
    private String stay;

    @Column(name = "meals", length = 255)
    private String meals;

    @Column(name = "distance_km", precision = 8, scale = 2)
    private BigDecimal distanceKm;

    @Column(name = "duration_hours", precision = 5, scale = 2)
    private BigDecimal durationHours;

    @Column(name = "altitude")
    private Integer altitude;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "display_order", nullable = false)
    private int displayOrder = 0;
}
