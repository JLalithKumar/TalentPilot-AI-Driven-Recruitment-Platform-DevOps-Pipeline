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
import com.talentpilot.backend.util.MatchScoreUtil;
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
                .matchScore(MatchScoreUtil.calculate(job, profile)) // Dynamic matching logic
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

    private ApplicationDto mapToDto(Application app) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(app.getId());
        dto.setJobId(app.getJob().getId());
        dto.setCandidateProfileId(app.getCandidateProfile().getId());
        dto.setStatus(app.getStatus());
        
        Job j = app.getJob();
        CandidateProfile cp = app.getCandidateProfile();
        Double calculatedScore = MatchScoreUtil.calculate(j, cp);
        
        System.out.println("=== DIAGNOSTIC MATCH SCORE ===");
        System.out.println("Job ID: " + j.getId());
        System.out.println("Job Requirements: " + j.getRequirements());
        System.out.println("Job Description: " + j.getDescription());
        System.out.println("Candidate ID: " + cp.getId());
        System.out.println("Candidate Parsed Skills: " + cp.getParsedSkills());
        System.out.println("Calculated Score: " + calculatedScore);
        System.out.println("==============================");
        
        dto.setMatchScore(calculatedScore);
        dto.setAppliedAt(app.getAppliedAt());
        
        User candidate = app.getCandidateProfile().getUser();
        if (candidate != null) {
            dto.setCandidateFirstName(candidate.getFirstName());
            dto.setCandidateLastName(candidate.getLastName());
            dto.setCandidateEmail(candidate.getEmail());
        }
        return dto;
    }
}
