package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.FeedbackRequest;
import edu.bilkent.cs319.team9.ta_management_system.dto.FeedbackResponse;
import edu.bilkent.cs319.team9.ta_management_system.security.CustomUserDetails;
import edu.bilkent.cs319.team9.ta_management_system.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    // any authenticated non-admin can post feedback
    @PostMapping
    public ResponseEntity<Void> postFeedback(@AuthenticationPrincipal CustomUserDetails user,
                                             @Valid @RequestBody FeedbackRequest req) {
        feedbackService.sendFeedback(user.getUsername(), req.getMessage());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // only admins can fetch all feedback
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<FeedbackResponse>> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.listAllFeedback());
    }
}

