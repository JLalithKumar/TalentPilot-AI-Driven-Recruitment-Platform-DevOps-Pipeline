package com.talentpilot.backend.service;

import com.talentpilot.backend.dto.JobDto;
import com.talentpilot.backend.entity.CandidateProfile;
import com.talentpilot.backend.entity.Company;
import com.talentpilot.backend.entity.Job;
import com.talentpilot.backend.entity.Role;
import com.talentpilot.backend.entity.User;
import com.talentpilot.backend.repository.CandidateProfileRepository;
import com.talentpilot.backend.repository.CompanyRepository;
import com.talentpilot.backend.repository.JobRepository;
import com.talentpilot.backend.repository.UserRepository;
import com.talentpilot.backend.util.MatchScoreUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {
    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;

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
        dto.setCompanyName(company.getName());
        dto.setActive(job.isActive());
        return dto;
    }

    public JobDto createJobAutoCompany(JobDto dto, String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        Company company = companyRepository.findByRecruiterId(recruiter.getId())
                .orElseGet(() -> {
                    Company c = Company.builder()
                            .name(recruiter.getFirstName() + " " + recruiter.getLastName() + "'s Company")
                            .recruiter(recruiter)
                            .build();
                    return companyRepository.save(c);
                });
        return createJob(dto, company.getId());
    }

    public List<JobDto> getAllActiveJobs(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        CandidateProfile profile = null;
        if (user != null && user.getRole() == Role.CANDIDATE) {
            profile = candidateProfileRepository.findByUserId(user.getId()).orElse(null);
        }
        
        final CandidateProfile finalProfile = profile;
        return jobRepository.findByIsActiveTrue().stream()
                .map(job -> mapToDto(job, finalProfile))
                .collect(Collectors.toList());
    }

    public List<JobDto> getJobsByCompany(Long companyId) {
        return jobRepository.findByCompanyId(companyId).stream()
                .map(job -> mapToDto(job, null))
                .collect(Collectors.toList());
    }

    private JobDto mapToDto(Job job, CandidateProfile profile) {
        JobDto dto = new JobDto();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setLocation(job.getLocation());
        dto.setRequirements(job.getRequirements());
        dto.setCompanyId(job.getCompany().getId());
        dto.setCompanyName(job.getCompany().getName());
        dto.setActive(job.isActive());
        if (profile != null) {
            dto.setMatchScore(MatchScoreUtil.calculate(job, profile));
        }
        return dto;
    }
}
