package com.talentpilot.backend.service;

import com.talentpilot.backend.dto.request.AuthRequest;
import com.talentpilot.backend.dto.request.RegisterRequest;
import com.talentpilot.backend.dto.response.AuthResponse;
import com.talentpilot.backend.entity.CandidateProfile;
import com.talentpilot.backend.entity.Company;
import com.talentpilot.backend.entity.Role;
import com.talentpilot.backend.entity.User;
import com.talentpilot.backend.repository.CandidateProfileRepository;
import com.talentpilot.backend.repository.CompanyRepository;
import com.talentpilot.backend.repository.UserRepository;
import com.talentpilot.backend.security.CustomUserDetails;
import com.talentpilot.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.CANDIDATE)
                .build();
        
        userRepository.save(user);

        if (user.getRole() == Role.CANDIDATE) {
            CandidateProfile profile = CandidateProfile.builder()
                    .user(user)
                    .build();
            candidateProfileRepository.save(profile);
        } else if (user.getRole() == Role.RECRUITER) {
            String companyName = request.getCompanyName();
            if (companyName == null || companyName.trim().isEmpty()) {
                companyName = user.getFirstName() + " " + user.getLastName() + "'s Company";
            }
            Company company = Company.builder()
                    .name(companyName.trim())
                    .recruiter(user)
                    .build();
            companyRepository.save(company);
        }

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String jwtToken = jwtUtil.generateToken(userDetails);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        
        CustomUserDetails userDetails = new CustomUserDetails(user);
        String jwtToken = jwtUtil.generateToken(userDetails);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();
    }
}
