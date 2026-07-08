package com.trekmanagement.trek;

import com.trekmanagement.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "trek_images")
public class TrekImage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "trek_id", nullable = false)
    private Trek trek;

    @Column(name = "image_url", nullable = false, columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "caption", length = 255)
    private String caption;

    @Column(name = "display_order", nullable = false)
    private int displayOrder = 0;

    public TrekImage(Trek trek, String imageUrl, String caption, int displayOrder) {
        this.trek = trek;
        this.imageUrl = imageUrl;
        this.caption = caption;
        this.displayOrder = displayOrder;
    }
}
