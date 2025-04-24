package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.dto.*;
import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.exception.BadRequestException;
import edu.bilkent.cs319.team9.ta_management_system.model.Notification;
import edu.bilkent.cs319.team9.ta_management_system.model.User;
import edu.bilkent.cs319.team9.ta_management_system.repository.NotificationRepository;
import edu.bilkent.cs319.team9.ta_management_system.repository.UserRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.MailService;
import edu.bilkent.cs319.team9.ta_management_system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationRepository notificationRepository;
    private final MailService mailService;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileDto getMyProfile() {
        User u = getCurrentUser();
        return new UserProfileDto(
                u.getId(),
                u.getFirstName(),
                u.getLastName(),
                u.getEmail(),
                u.getPhoneNumber(),
                u.getPhotoURL()
        );
    }

    @Override
    @Transactional
    public void changeMyPassword(ChangePasswordRequest req) {
        User u = getCurrentUser();
        if (!passwordEncoder.matches(req.getCurrentPassword(), u.getPassword())) {
            throw new BadRequestException("Wrong Password");
        }
        if (passwordEncoder.matches(req.getNewPassword(), u.getPassword())) {
            throw new BadRequestException("New password must differ from old one");
        }
        u.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(u);
    }

    @Override
    @Transactional
    public void changeMyContact(ChangeContactRequest req) {
        User u = getCurrentUser();
        u.setPhoneNumber(req.getPhoneNumber());
        u.setEmail(req.getEmail());
        userRepository.save(u);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDto> getMyNotifications() {
        Long userId = getCurrentUser().getId();
        return notificationRepository.findByRecipient_IdOrderByCreatedAtDesc(userId)
                          .stream()
                .map(n -> new NotificationDto()
                        .setId(n.getId())
                        .setMessage(n.getMessage())
                        .setTimestamp(n.getCreatedAt())
                        .setRead(n.isRead()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void recoverPassword(String email) {
        User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
        // generate a temporary password
        String temp = RandomStringUtils.randomAlphanumeric(10);
        u.setPassword(passwordEncoder.encode(temp));
        userRepository.save(u);

        // send it via email
        String subject = "Your new temporary password";
        String body = "Hello " + u.getFirstName() + ",\n\n"
                + "Your temporary password is: " + temp + "\n"
                + "Please log in and change it immediately.\n\n"
                + "– TA Management System";
        mailService.sendEmail(u.getEmail(), subject, body);
    }

    @Override
    public void logout() {
        // stateless JWT: client just discards the token
    }
}
