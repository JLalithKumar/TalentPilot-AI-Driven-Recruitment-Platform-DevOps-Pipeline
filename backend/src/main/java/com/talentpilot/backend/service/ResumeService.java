package com.talentpilot.backend.service;

import com.talentpilot.backend.entity.CandidateProfile;
import com.talentpilot.backend.entity.User;
import com.talentpilot.backend.repository.CandidateProfileRepository;
import com.talentpilot.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final S3Service s3Service;
    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    
    @Value("${ai.service.url}")
    private String aiServiceUrl;

    public CandidateProfile uploadAndParseResume(MultipartFile file, String userEmail) throws IOException {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    CandidateProfile newProfile = new CandidateProfile();
                    newProfile.setUser(user);
                    return candidateProfileRepository.save(newProfile);
                });

        // 1. Upload to S3
        String key = s3Service.uploadFile(file);
        String url = s3Service.getFileUrl(key);
        profile.setResumeUrl(url);

        // 2. Call AI Service to parse
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        });

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(aiServiceUrl + "/parse-resume", requestEntity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                if ("success".equals(responseBody.get("status"))) {
                    profile.setParsedSkills((String) responseBody.get("skills"));
                    profile.setParsedExperience((String) responseBody.get("experience"));
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to call AI service: " + e.getMessage());
        }

        return candidateProfileRepository.save(profile);
    }

    public CandidateProfile getProfile(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return candidateProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    CandidateProfile newProfile = new CandidateProfile();
                    newProfile.setUser(user);
                    return candidateProfileRepository.save(newProfile);
                });
    }
}
