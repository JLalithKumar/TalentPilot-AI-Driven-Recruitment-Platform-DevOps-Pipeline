package com.talentpilot.backend.service;

import com.talentpilot.backend.dto.ApplicationDto;
import com.talentpilot.backend.entity.Application;
import com.talentpilot.backend.entity.ApplicationStatus;
import com.talentpilot.backend.entity.CandidateProfile;
import com.talentpilot.backend.entity.Job;
import com.talentpilot.backend.entity.User;
import com.talentpilot.backend.repository.ApplicationRepository;
import com.talentpilot.backend.repository.CandidateProfileRepository;
import com.talentpilot.backend.repository.JobRepository;
import com.talentpilot.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;

    public ApplicationDto applyForJob(Long jobId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Candidate profile not found"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Application application = Application.builder()
                .job(job)
                .candidateProfile(profile)
                .status(ApplicationStatus.APPLIED)
                .matchScore(calculateMatchScore(job, profile)) // Simple rule-based matching
                .build();
        
        application = applicationRepository.save(application);
        return mapToDto(application);
    }

    public List<ApplicationDto> getMyApplications(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId()).orElseThrow();
        return applicationRepository.findByCandidateProfileId(profile.getId()).stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    public List<ApplicationDto> getApplicationsForJob(Long jobId, String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail).orElseThrow();
        Job job = jobRepository.findById(jobId).orElseThrow();
        
        if (!job.getCompany().getRecruiter().getId().equals(recruiter.getId())) {
            throw new RuntimeException("Unauthorized to view these applications");
        }
        
        return applicationRepository.findByJobId(jobId).stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    public ApplicationDto updateApplicationStatus(Long applicationId, ApplicationStatus status, String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail).orElseThrow();
        Application application = applicationRepository.findById(applicationId).orElseThrow();
        
        if (!application.getJob().getCompany().getRecruiter().getId().equals(recruiter.getId())) {
            throw new RuntimeException("Unauthorized to update this application");
        }
        
        application.setStatus(status);
        application = applicationRepository.save(application);
        return mapToDto(application);
    }

    private Double calculateMatchScore(Job job, CandidateProfile profile) {
        // Simplified mock logic: Check overlap of skills in job requirements vs parsed skills
        if (profile.getParsedSkills() == null || job.getRequirements() == null || job.getRequirements().isEmpty()) {
            return 0.0;
        }
        
        String[] required = job.getRequirements().toLowerCase().split(",");
        String candidateSkills = profile.getParsedSkills().toLowerCase();
        
        int matches = 0;
        for (String req : required) {
            if (candidateSkills.contains(req.trim())) {
                matches++;
            }
        }
        return (double) matches / required.length * 100.0;
    }

    private ApplicationDto mapToDto(Application app) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(app.getId());
        dto.setJobId(app.getJob().getId());
        dto.setCandidateProfileId(app.getCandidateProfile().getId());
        dto.setStatus(app.getStatus());
        dto.setMatchScore(app.getMatchScore());
        return dto;
    }
}
