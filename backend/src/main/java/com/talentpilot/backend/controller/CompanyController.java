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
        return companyRepository.findByRecruiterId(recruiter.getId())
                .map(c -> ResponseEntity.ok(Map.of(
                        "id", c.getId(),
                        "name", c.getName(),
                        "description", c.getDescription() != null ? c.getDescription() : "",
                        "website", c.getWebsite() != null ? c.getWebsite() : "",
                        "recruiterName", recruiter.getFirstName() + " " + recruiter.getLastName(),
                        "recruiterEmail", recruiter.getEmail()
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/my")
    public ResponseEntity<?> updateMyCompany(@RequestBody Map<String, String> body, Authentication authentication) {
        User recruiter = userRepository.findByEmail(authentication.getName()).orElseThrow();
        Company company = companyRepository.findByRecruiterId(recruiter.getId()).orElseThrow();

        if (body.containsKey("name") && !body.get("name").isBlank()) {
            company.setName(body.get("name"));
        }
        if (body.containsKey("description")) {
            company.setDescription(body.get("description"));
        }
        if (body.containsKey("website")) {
            company.setWebsite(body.get("website"));
        }

        companyRepository.save(company);
        return ResponseEntity.ok(Map.of("message", "Company updated successfully"));
    }
}
