package com.talentpilot.backend.controller;

import com.talentpilot.backend.dto.CompanyDto;
import com.talentpilot.backend.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
public class CompanyController {
    private final CompanyService companyService;

    @PostMapping
    public ResponseEntity<CompanyDto> createCompany(@RequestBody CompanyDto dto, Authentication authentication) {
        return ResponseEntity.ok(companyService.createCompany(dto, authentication.getName()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<CompanyDto>> getMyCompanies(Authentication authentication) {
        return ResponseEntity.ok(companyService.getCompaniesByRecruiter(authentication.getName()));
    }
}
