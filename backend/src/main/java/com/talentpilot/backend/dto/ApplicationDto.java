package com.talentpilot.backend.dto;

import com.talentpilot.backend.entity.ApplicationStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ApplicationDto {
    private Long id;
    private Long jobId;
    private Long candidateProfileId;
    private String candidateFirstName;
    private String candidateLastName;
    private String candidateEmail;
    private ApplicationStatus status;
    private Double matchScore;
    private LocalDateTime appliedAt;
}
