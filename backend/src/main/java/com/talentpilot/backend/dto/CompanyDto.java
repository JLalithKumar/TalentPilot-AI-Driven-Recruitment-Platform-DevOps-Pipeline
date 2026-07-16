package com.talentpilot.backend.dto;

import lombok.Data;

@Data
public class CompanyDto {
    private Long id;
    private String name;
    private String description;
    private String website;
    private String logoUrl;
}
