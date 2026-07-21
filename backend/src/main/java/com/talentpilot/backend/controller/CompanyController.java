package com.talentpilot.backend.controller;

import com.talentpilot.backend.entity.Company;
import com.talentpilot.backend.entity.User;
import com.talentpilot.backend.repository.CompanyRepository;
import com.talentpilot.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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
        return ResponseEntity.ok(buildCompanyResponse(company, recruiter));
    }

    @PutMapping("/my")
    public ResponseEntity<?> updateMyCompany(@RequestBody Map<String, String> body, Authentication authentication) {
        User recruiter = userRepository.findByEmail(authentication.getName()).orElseThrow();
        Company company = companyRepository.findByRecruiterId(recruiter.getId())
                .orElseGet(() -> Company.builder()
                        .name(recruiter.getFirstName() + "'s Company")
                        .recruiter(recruiter)
                        .build());

        if (body.get("name") != null && !body.get("name").isBlank()) {
            company.setName(body.get("name"));
        }
        if (body.get("description") != null) {
            company.setDescription(body.get("description"));
        }
        if (body.get("website") != null) {
            company.setWebsite(body.get("website"));
        }

        Company saved = companyRepository.save(company);
        return ResponseEntity.ok(buildCompanyResponse(saved, recruiter));
    }

    private Map<String, Object> buildCompanyResponse(Company company, User recruiter) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", company.getId());
        map.put("name", company.getName() != null ? company.getName() : "");
        map.put("description", company.getDescription() != null ? company.getDescription() : "");
        map.put("website", company.getWebsite() != null ? company.getWebsite() : "");
        String fullName = (recruiter.getFirstName() != null ? recruiter.getFirstName() : "") +
                (recruiter.getLastName() != null ? " " + recruiter.getLastName() : "");
        map.put("recruiterName", fullName.trim());
        map.put("recruiterEmail", recruiter.getEmail() != null ? recruiter.getEmail() : "");
        return map;
    }
}
