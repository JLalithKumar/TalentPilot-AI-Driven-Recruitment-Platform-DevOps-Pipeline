package com.talentpilot.backend.controller;

import com.talentpilot.backend.dto.ApplicationDto;
import com.talentpilot.backend.entity.ApplicationStatus;
import com.talentpilot.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
public class ApplicationController {
    private final ApplicationService applicationService;

    @PostMapping("/job/{jobId}")
    public ResponseEntity<ApplicationDto> applyForJob(@PathVariable Long jobId, Authentication authentication) {
        return ResponseEntity.ok(applicationService.applyForJob(jobId, authentication.getName()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ApplicationDto>> getMyApplications(Authentication authentication) {
        return ResponseEntity.ok(applicationService.getMyApplications(authentication.getName()));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationDto>> getApplicationsForJob(@PathVariable Long jobId, Authentication authentication) {
        return ResponseEntity.ok(applicationService.getApplicationsForJob(jobId, authentication.getName()));
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<ApplicationDto> updateApplicationStatus(
            @PathVariable Long applicationId, 
            @RequestParam ApplicationStatus status, 
            Authentication authentication) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(applicationId, status, authentication.getName()));
    }
}
