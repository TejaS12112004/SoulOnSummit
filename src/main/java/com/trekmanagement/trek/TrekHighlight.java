package com.trekmanagement.trek;

import com.trekmanagement.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A single highlight shown on the Trek Details page.
 * Ordered per-trek by displayOrder ASC.
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "trek_highlights")
public class TrekHighlight extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "trek_id", nullable = false)
    private Trek trek;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon_name", length = 100)
    private String iconName;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;
}
