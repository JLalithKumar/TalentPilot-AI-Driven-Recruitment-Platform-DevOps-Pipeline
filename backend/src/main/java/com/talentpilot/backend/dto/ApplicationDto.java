package com.talentpilot.backend.dto;

import com.talentpilot.backend.entity.ApplicationStatus;
import lombok.Data;

@Data
public class ApplicationDto {
    private Long id;
    private Long jobId;
    private Long candidateProfileId;
    private ApplicationStatus status;
    private Double matchScore;
}
