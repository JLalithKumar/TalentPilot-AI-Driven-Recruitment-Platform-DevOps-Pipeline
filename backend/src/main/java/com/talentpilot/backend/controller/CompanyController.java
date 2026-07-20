package com.talentpilot.backend.controller;

import com.talentpilot.backend.entity.Company;
import com.talentpilot.backend.entity.User;
import com.talentpilot.backend.repository.CompanyRepository;
import com.talentpilot.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/company")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    @GetMapping("/my")
    public ResponseEntity<?> getMyCompany(Authentication authentication) {
        User recruiter = userRepository.findByEmail(authentication.getName()).orElseThrow();
        Company company = companyRepository.findByRecruiterId(recruiter.getId())
                .orElseGet(() -> companyRepository.save(Company.builder()
                        .name(recruiter.getFirstName() + "'s Company")
                        .recruiter(recruiter)
                        .build()));
        return ResponseEntity.ok(Map.of(
                "id", company.getId(),
                "name", company.getName(),
                "description", company.getDescription() != null ? company.getDescription() : "",
                "website", company.getWebsite() != null ? company.getWebsite() : "",
                "recruiterName", recruiter.getFirstName() + " " + recruiter.getLastName(),
                "recruiterEmail", recruiter.getEmail()
        ));
    }

    @PutMapping("/my")
    public ResponseEntity<?> updateMyCompany(@RequestBody Map<String, String> body, Authentication authentication) {
        User recruiter = userRepository.findByEmail(authentication.getName()).orElseThrow();
        Company company = companyRepository.findByRecruiterId(recruiter.getId())
                .orElseGet(() -> Company.builder()
                        .name(recruiter.getFirstName() + "'s Company")
                        .recruiter(recruiter)
                        .build());

        if (body.containsKey("name") && !body.get("name").isBlank()) {
            company.setName(body.get("name"));
        }
        if (body.containsKey("description")) {
            company.setDescription(body.get("description"));
        }
        if (body.containsKey("website")) {
            company.setWebsite(body.get("website"));
        }

        Company saved = companyRepository.save(company);
        return ResponseEntity.ok(Map.of(
                "message", "Company updated successfully",
                "id", saved.getId(),
                "name", saved.getName(),
                "description", saved.getDescription() != null ? saved.getDescription() : "",
                "website", saved.getWebsite() != null ? saved.getWebsite() : ""
        ));
    }
}
