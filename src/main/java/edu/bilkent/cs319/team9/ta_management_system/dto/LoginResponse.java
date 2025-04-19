package edu.bilkent.cs319.team9.ta_management_system.dto;

import edu.bilkent.cs319.team9.ta_management_system.model.Role;

import java.util.Set;

public class LoginResponse {
    public String token;
    public Set<Role> roles;
}
