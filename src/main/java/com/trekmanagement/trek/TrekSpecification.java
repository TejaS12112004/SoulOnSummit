package com.trekmanagement.trek;

import com.trekmanagement.trek.dto.TrekFilterRequest;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public final class TrekSpecification {

    private TrekSpecification() {}

    /**
     * Builds a compound Specification from a TrekFilterRequest.
     * All predicates are AND-ed together.
     * Used by both public listing (enforces published=true, isActive=true)
     * and admin listing (no enforced constraints unless caller adds them).
     */
    public static Specification<Trek> fromFilter(TrekFilterRequest filter, boolean publicOnly) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (publicOnly) {
                predicates.add(cb.isTrue(root.get("published")));
                predicates.add(cb.isTrue(root.get("isActive")));
            }

            if (filter.getIsActive() != null && !publicOnly) {
                predicates.add(cb.equal(root.get("isActive"), filter.getIsActive()));
            }

            if (filter.getPublished() != null && !publicOnly) {
                predicates.add(cb.equal(root.get("published"), filter.getPublished()));
            }

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
                predicates.add(cb.greaterThanOrEqualTo(root.get("durationDays"), filter.getMinDurationDays()));
            }

            if (filter.getMaxDurationDays() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("durationDays"), filter.getMaxDurationDays()));
            }

            if (filter.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), filter.getMinPrice()));
            }

            if (filter.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), filter.getMaxPrice()));
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

            if (filter.getStartDateFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("startDate"), filter.getStartDateFrom()));
            }

            if (filter.getStartDateTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("startDate"), filter.getStartDateTo()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
