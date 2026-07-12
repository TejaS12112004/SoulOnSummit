package com.trekmanagement.trek;

import com.trekmanagement.trek.dto.TrekFilterRequest;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public final class TrekSpecification {

    private TrekSpecification() {}

    /**
     * Builds a compound Specification from a TrekFilterRequest.
     * All predicates are AND-ed.
     *
     * Price and date filters now operate on TrekDeparture via correlated
     * EXISTS subqueries, since these fields no longer exist on Trek.
     *
     * publicOnly = true  → enforces published=true, isActive=true,
     *                       and existence of at least one active OPEN future departure.
     * publicOnly = false → admin view; no departure existence required.
     */
    public static Specification<Trek> fromFilter(TrekFilterRequest filter, boolean publicOnly) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // ── Trek-level flags ──────────────────────────────────────────────
            if (publicOnly) {
                predicates.add(cb.isTrue(root.get("published")));
                predicates.add(cb.isTrue(root.get("isActive")));
            } else {
                if (filter.getIsActive() != null) {
                    predicates.add(cb.equal(root.get("isActive"), filter.getIsActive()));
                }
                if (filter.getPublished() != null) {
                    predicates.add(cb.equal(root.get("published"), filter.getPublished()));
                }
            }

            // ── Trek content filters ──────────────────────────────────────────
            if (StringUtils.hasText(filter.getTitle())) {
                predicates.add(cb.like(
                    cb.lower(root.get("title")),
                    "%" + filter.getTitle().toLowerCase().strip() + "%"
                ));
            }

            if (filter.getDifficulty() != null) {
                predicates.add(cb.equal(root.get("difficulty"), filter.getDifficulty()));
            }

            if (filter.getMinDurationDays() != null) {
                predicates.add(cb.greaterThanOrEqualTo(
                    root.get("durationDays"), filter.getMinDurationDays()));
            }

            if (filter.getMaxDurationDays() != null) {
                predicates.add(cb.lessThanOrEqualTo(
                    root.get("durationDays"), filter.getMaxDurationDays()));
            }

            if (StringUtils.hasText(filter.getState())) {
                predicates.add(cb.like(
                    cb.lower(root.get("state")),
                    "%" + filter.getState().toLowerCase().strip() + "%"
                ));
            }

            if (StringUtils.hasText(filter.getLocation())) {
                predicates.add(cb.like(
                    cb.lower(root.get("location")),
                    "%" + filter.getLocation().toLowerCase().strip() + "%"
                ));
            }

            if (filter.getFeatured() != null) {
                predicates.add(cb.equal(root.get("featured"), filter.getFeatured()));
            }

            // ── Departure-based filters (subquery) ────────────────────────────
            // Price filters: match treks that have at least one departure
            // whose effective price (discountPrice ?? price) falls in range.
            boolean hasPriceFilter = filter.getMinPrice() != null || filter.getMaxPrice() != null;
            boolean hasDateFilter  = filter.getStartDateFrom() != null || filter.getStartDateTo() != null;

            if (publicOnly || hasPriceFilter || hasDateFilter) {
                Subquery<Long> depSubquery = query.subquery(Long.class);
                Root<TrekDeparture> dep = depSubquery.from(TrekDeparture.class);
                depSubquery.select(cb.literal(1L));

                List<Predicate> depPredicates = new ArrayList<>();
                depPredicates.add(cb.equal(dep.get("trek"), root));
                depPredicates.add(cb.isTrue(dep.get("isActive")));
                depPredicates.add(cb.equal(dep.get("status"), DepartureStatus.OPEN));

                if (publicOnly) {
                    // Public listing: only future departures
                    depPredicates.add(cb.greaterThan(dep.get("startDate"), LocalDate.now()));
                }

                if (filter.getMinPrice() != null) {
                    // effective price = COALESCE(discountPrice, price) >= minPrice
                    // Since we cannot use COALESCE in JPA Criteria portably for nullable,
                    // we use: (discountPrice IS NOT NULL AND discountPrice >= minPrice)
                    //       OR (discountPrice IS NULL AND price >= minPrice)
                    Predicate discountGte = cb.and(
                        cb.isNotNull(dep.get("discountPrice")),
                        cb.greaterThanOrEqualTo(dep.get("discountPrice"), filter.getMinPrice())
                    );
                    Predicate priceGte = cb.and(
                        cb.isNull(dep.get("discountPrice")),
                        cb.greaterThanOrEqualTo(dep.get("price"), filter.getMinPrice())
                    );
                    depPredicates.add(cb.or(discountGte, priceGte));
                }

                if (filter.getMaxPrice() != null) {
                    Predicate discountLte = cb.and(
                        cb.isNotNull(dep.get("discountPrice")),
                        cb.lessThanOrEqualTo(dep.get("discountPrice"), filter.getMaxPrice())
                    );
                    Predicate priceLte = cb.and(
                        cb.isNull(dep.get("discountPrice")),
                        cb.lessThanOrEqualTo(dep.get("price"), filter.getMaxPrice())
                    );
                    depPredicates.add(cb.or(discountLte, priceLte));
                }

                if (filter.getStartDateFrom() != null) {
                    depPredicates.add(cb.greaterThanOrEqualTo(
                        dep.get("startDate"), filter.getStartDateFrom()));
                }

                if (filter.getStartDateTo() != null) {
                    depPredicates.add(cb.lessThanOrEqualTo(
                        dep.get("startDate"), filter.getStartDateTo()));
                }

                depSubquery.where(depPredicates.toArray(new Predicate[0]));
                predicates.add(cb.exists(depSubquery));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
