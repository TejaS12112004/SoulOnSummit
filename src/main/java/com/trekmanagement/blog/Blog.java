package com.trekmanagement.blog;

import com.trekmanagement.common.BaseEntity;
import com.trekmanagement.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "blogs")
public class Blog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "slug", nullable = false, unique = true, length = 255)
    private String slug;

    @Column(name = "summary", length = 500)
    private String summary;

    @Column(name = "body", nullable = false, columnDefinition = "TEXT")
    private String body;

    @Column(name = "featured_image")
    private String featuredImage;

    @Column(name = "published", nullable = false)
    private Boolean published = false;

    @Column(name = "published_at")
    private Instant publishedAt;
}
