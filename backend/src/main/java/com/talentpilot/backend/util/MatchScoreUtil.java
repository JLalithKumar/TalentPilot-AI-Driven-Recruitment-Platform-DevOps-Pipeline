package com.talentpilot.backend.util;

import com.talentpilot.backend.entity.CandidateProfile;
import com.talentpilot.backend.entity.Job;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class MatchScoreUtil {

    private static final String[] SKILLS_KEYWORDS = {
        "java", "spring boot", "springboot", "spring", "node.js", "nodejs", "express", "python", "django", "flask", "fastapi", "c++", "c#", ".net", "dotnet", "go", "golang", "ruby", "rails", "php", "laravel", "rust",
        "react", "angular", "vue", "javascript", "typescript", "html", "css", "bootstrap", "tailwind", "sass",
        "sql", "mysql", "postgresql", "postgres", "mongodb", "redis", "elasticsearch", "oracle",
        "docker", "kubernetes", "k8s", "aws", "gcp", "azure", "jenkins", "terraform", "ansible", "git", "github", "gitlab", "ci/cd", "cicd", "devops", "linux", "bash", "shell", "prometheus", "grafana", "nginx", "apache"
    };

    public static Double calculate(Job job, CandidateProfile profile) {
        if (profile == null || profile.getParsedSkills() == null || profile.getParsedSkills().isEmpty()) {
            return 0.0;
        }

        List<String> requiredSkills = new ArrayList<>();

        // 1. Parse requirements field (split by comma, semicolon, or newline)
        if (job.getRequirements() != null && !job.getRequirements().isEmpty()) {
            String[] parts = job.getRequirements().toLowerCase().split("[,;\\r\\n]+");
            for (String part : parts) {
                String trimmed = part.trim();
                if (trimmed.isEmpty()) continue;

                boolean foundKnown = false;
                for (String skill : SKILLS_KEYWORDS) {
                    if (trimmed.equals(skill)) {
                        requiredSkills.add(skill);
                        foundKnown = true;
                        break;
                    }
                }

                if (!foundKnown) {
                    for (String skill : SKILLS_KEYWORDS) {
                        if (containsSkill(trimmed, skill)) {
                            requiredSkills.add(skill);
                            foundKnown = true;
                        }
                    }
                }

                // If no known skill was found in this requirement line, add it as literal
                if (!foundKnown) {
                    requiredSkills.add(trimmed);
                }
            }
        }

        // 2. Parse description field line-by-line (only extract list items/short lines)
        if (job.getDescription() != null && !job.getDescription().isEmpty()) {
            String[] lines = job.getDescription().toLowerCase().split("[\\r\\n]+");
            for (String line : lines) {
                String trimmed = line.trim();
                if (trimmed.isEmpty()) continue;

                boolean isListItem = trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.startsWith("•") || trimmed.startsWith("+");
                boolean isShort = trimmed.length() <= 35;

                if (isListItem || isShort) {
                    for (String skill : SKILLS_KEYWORDS) {
                        if (containsSkill(trimmed, skill)) {
                            if (!requiredSkills.contains(skill)) {
                                requiredSkills.add(skill);
                            }
                        }
                    }
                }
            }
        }

        if (requiredSkills.isEmpty()) {
            return 0.0;
        }

        // Candidate's parsed skills
        String candidateSkillsText = profile.getParsedSkills().toLowerCase();

        int matches = 0;
        for (String skill : requiredSkills) {
            if (containsSkill(candidateSkillsText, skill)) {
                matches++;
            }
        }

        return (double) matches / requiredSkills.size() * 100.0;
    }

    private static boolean containsSkill(String text, String skill) {
        if (skill.equals("c++")) {
            return text.contains("c++") || text.contains("cpp");
        }
        if (skill.equals("c#")) {
            return text.contains("c#") || text.contains("c-sharp");
        }
        if (skill.equals(".net")) {
            return text.contains(".net") || text.contains("dotnet");
        }
        String pattern = "\\b" + Pattern.quote(skill) + "\\b";
        return Pattern.compile(pattern).matcher(text).find();
    }
}
