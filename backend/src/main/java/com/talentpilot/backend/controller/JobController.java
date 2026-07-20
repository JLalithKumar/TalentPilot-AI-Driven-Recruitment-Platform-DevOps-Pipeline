package com.talentpilot.backend.controller;

import com.talentpilot.backend.dto.JobDto;
import com.talentpilot.backend.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class JobController {
    private final JobService jobService;

    @PostMapping("/company/{companyId}")
    public ResponseEntity<JobDto> createJob(@PathVariable Long companyId, @RequestBody JobDto dto) {
        return ResponseEntity.ok(jobService.createJob(dto, companyId));
    }

    @PostMapping
    public ResponseEntity<JobDto> createJobAuto(@RequestBody JobDto dto, Authentication authentication) {
        return ResponseEntity.ok(jobService.createJobAutoCompany(dto, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<JobDto>> getAllJobs(Authentication authentication) {
        return ResponseEntity.ok(jobService.getAllActiveJobs(authentication.getName()));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<JobDto>> getJobsByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(jobService.getJobsByCompany(companyId));
    }
}
