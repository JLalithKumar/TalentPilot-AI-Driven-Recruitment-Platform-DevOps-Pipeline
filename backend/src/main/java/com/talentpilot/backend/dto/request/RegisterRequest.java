package com.talentpilot.backend.dto.request;

import com.talentpilot.backend.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private Role role;
    private String companyName;
}
