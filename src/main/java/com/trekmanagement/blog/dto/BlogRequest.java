package com.trekmanagement.blog.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BlogRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    private String slug;
    
    private String summary;
    
    private String body;
    
    private String featuredImage;
}
