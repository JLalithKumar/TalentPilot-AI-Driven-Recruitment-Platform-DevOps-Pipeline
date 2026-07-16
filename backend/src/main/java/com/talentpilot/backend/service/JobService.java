package com.talentpilot.backend.service;

import com.talentpilot.backend.dto.JobDto;
import com.talentpilot.backend.entity.Company;
import com.talentpilot.backend.entity.Job;
import com.talentpilot.backend.repository.CompanyRepository;
import com.talentpilot.backend.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {
    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;

    public JobDto createJob(JobDto dto, Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        
        Job job = Job.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .requirements(dto.getRequirements())
                .company(company)
                .isActive(true)
                .build();
        
        job = jobRepository.save(job);
        dto.setId(job.getId());
        dto.setCompanyId(companyId);
        dto.setActive(job.isActive());
        return dto;
    }

    public List<JobDto> getAllActiveJobs() {
        return jobRepository.findByIsActiveTrue().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<JobDto> getJobsByCompany(Long companyId) {
        return jobRepository.findByCompanyId(companyId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private JobDto mapToDto(Job job) {
        JobDto dto = new JobDto();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setLocation(job.getLocation());
        dto.setRequirements(job.getRequirements());
        dto.setCompanyId(job.getCompany().getId());
        dto.setActive(job.isActive());
        return dto;
    }
}
