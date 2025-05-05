package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.dto.LoginRequest;
import edu.bilkent.cs319.team9.ta_management_system.dto.LoginResponse;
import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.LogEntry;
import edu.bilkent.cs319.team9.ta_management_system.model.LogEventType;
import edu.bilkent.cs319.team9.ta_management_system.model.User;
import edu.bilkent.cs319.team9.ta_management_system.repository.LogEntryRepository;
import edu.bilkent.cs319.team9.ta_management_system.repository.UserRepository;
import edu.bilkent.cs319.team9.ta_management_system.security.CustomUserDetails;
import edu.bilkent.cs319.team9.ta_management_system.security.CustomUserDetailsService;
import edu.bilkent.cs319.team9.ta_management_system.security.JwtUtil;
import edu.bilkent.cs319.team9.ta_management_system.service.AuthService;
import edu.bilkent.cs319.team9.ta_management_system.service.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authManager;
    private final CustomUserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final LogEntryRepository logRepo;
    private final MailService mailService;

    @Override
    @Transactional
    public LoginResponse login(LoginRequest req) {
        String email = req.getEmail();
        try {
            // authenticate
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, req.getPassword())
            );
            CustomUserDetails details = (CustomUserDetails) auth.getPrincipal();

            // record a success log
            logRepo.save(LogEntry.builder()
                    .timestamp(LocalDateTime.now())
                    .email(email)
                    .eventType(LogEventType.LOGIN_SUCCESS)
                    .details("Granted: " + details.getAuthorities())
                    .build());

            // generate JWT + return role
            String token = jwtUtil.generateToken(details.getUsername());
            return new LoginResponse(token, details.getRole(), details.getId());

        } catch (Exception ex) {
            // record a failure log
            logRepo.save(LogEntry.builder()
                    .timestamp(LocalDateTime.now())
                    .email(email)
                    .eventType(LogEventType.LOGIN_FAILURE)
                    .details(ex.getMessage())
                    .build());
            // rethrow so controller can return 401
            throw ex;
        }
    }

    @Override
    @Transactional
    public void recoverPassword(String email) {
        User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        // generate + persist temp password
        String temp = RandomStringUtils.randomAlphanumeric(10);
        u.setPassword(passwordEncoder.encode(temp));
        userRepository.save(u);

        // record a reset log
        logRepo.save(LogEntry.builder()
                .timestamp(LocalDateTime.now())
                .email(email)
                .eventType(LogEventType.PASSWORD_RESET  )
                .details("Temporary password sent")
                .build());

        // send email
        String subject = "Your new temporary password";
        String body = "Hello " + u.getFirstName() + ",\n\n"
                + "Your temporary password is: " + temp + "\n"
                + "Please log in and change it immediately.\n\n"
                + "– TA Management System";
        mailService.sendEmail(u.getEmail(), subject, body);
    }
}
