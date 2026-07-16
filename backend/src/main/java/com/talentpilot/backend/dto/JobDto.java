package com.talentpilot.backend.dto;

import lombok.Data;

@Data
public class JobDto {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String requirements;
    private Long companyId;
    private boolean isActive;
}
