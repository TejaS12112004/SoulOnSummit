package com.trekmanagement.trek;

import com.trekmanagement.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "treks")
public class Trek extends BaseEntity {

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "subtitle", length = 255)
    private String subtitle;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "location", nullable = false, length = 255)
    private String location;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "country", nullable = false, length = 100)
    private String country = "India";

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty", nullable = false, length = 20)
    private TrekDifficulty difficulty;

    @Column(name = "duration_days", nullable = false)
    private Integer durationDays;

    @Column(name = "distance_km", precision = 8, scale = 2)
    private BigDecimal distanceKm;

    @Column(name = "max_altitude")
    private Integer maxAltitude;

    @Column(name = "summit_point", length = 255)
    private String summitPoint;

    @Column(name = "latitude", precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "discount_price", precision = 10, scale = 2)
    private BigDecimal discountPrice;

    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;

    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "pickup_point", length = 255)
    private String pickupPoint;

    @Column(name = "drop_point", length = 255)
    private String dropPoint;

    @Column(name = "cover_image_url", columnDefinition = "TEXT")
    private String coverImageUrl;

    @Column(name = "itinerary_pdf_url", columnDefinition = "TEXT")
    private String itineraryPdfUrl;

    @Column(name = "included", columnDefinition = "TEXT")
    private String included;

    @Column(name = "excluded", columnDefinition = "TEXT")
    private String excluded;

    @Column(name = "things_to_carry", columnDefinition = "TEXT")
    private String thingsToCarry;

    @Column(name = "cancellation_policy", columnDefinition = "TEXT")
    private String cancellationPolicy;

    @Column(name = "featured", nullable = false)
    private boolean featured = false;

    @Column(name = "published", nullable = false)
    private boolean published = false;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @OneToMany(
        mappedBy = "trek",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    @OrderBy("displayOrder ASC")
    private List<TrekImage> images = new ArrayList<>();
}
