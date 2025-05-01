package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.dto.LoginRequest;
import edu.bilkent.cs319.team9.ta_management_system.dto.LoginResponse;

public interface AuthService {
    /**
     * Try to authenticate; on success returns a JWT + role,
     * on failure throws an AuthenticationException.
     */
    LoginResponse login(LoginRequest req);

    /**
     * Generate a temporary password, update the user, send email,
     * and record a PASSWORD_RESET log entry.
     */
    void recoverPassword(String email);
}
