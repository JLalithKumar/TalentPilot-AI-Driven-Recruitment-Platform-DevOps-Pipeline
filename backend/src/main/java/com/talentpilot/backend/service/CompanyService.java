package com.talentpilot.backend.service;

import com.talentpilot.backend.dto.CompanyDto;
import com.talentpilot.backend.entity.Company;
import com.talentpilot.backend.entity.User;
import com.talentpilot.backend.repository.CompanyRepository;
import com.talentpilot.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public CompanyDto createCompany(CompanyDto dto, String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        Company company = Company.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .website(dto.getWebsite())
                .logoUrl(dto.getLogoUrl())
                .recruiter(recruiter)
                .build();
        
        company = companyRepository.save(company);
        dto.setId(company.getId());
        return dto;
    }

    public List<CompanyDto> getCompaniesByRecruiter(String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        return companyRepository.findByRecruiterId(recruiter.getId()).stream().map(c -> {
            CompanyDto dto = new CompanyDto();
            dto.setId(c.getId());
            dto.setName(c.getName());
            dto.setDescription(c.getDescription());
            dto.setWebsite(c.getWebsite());
            dto.setLogoUrl(c.getLogoUrl());
            return dto;
        }).toList();
    }
}
