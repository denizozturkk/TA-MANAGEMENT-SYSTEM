package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.*;
import edu.bilkent.cs319.team9.ta_management_system.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    /** Profile Management **/
    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> viewProfile() {
        return ResponseEntity.ok(userService.getMyProfile());
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest req) {
        userService.changeMyPassword(req);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/me/contact")
    public ResponseEntity<Void> changeContact(@Valid @RequestBody ChangeContactRequest req) {
        userService.changeMyContact(req);
        return ResponseEntity.ok().build();
    }

    /** Notifications **/
    @GetMapping("/me/notifications")
    public ResponseEntity<List<NotificationDto>> getNotifications() {
        return ResponseEntity.ok(userService.getMyNotifications());
    }

    /** Recover & Logout **/
    @PostMapping("/recover-password")
    public ResponseEntity<Void> recoverPassword(@RequestBody Map<String,String> body) {
        userService.recoverPassword(body.get("email"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        userService.logout();
        return ResponseEntity.ok().build();
    }
}

