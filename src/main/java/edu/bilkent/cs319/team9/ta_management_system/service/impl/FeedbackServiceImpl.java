package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.dto.FeedbackResponse;
import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.Feedback;
import edu.bilkent.cs319.team9.ta_management_system.model.User;
import edu.bilkent.cs319.team9.ta_management_system.repository.FeedbackRepository;
import edu.bilkent.cs319.team9.ta_management_system.repository.UserRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.FeedbackService;
import edu.bilkent.cs319.team9.ta_management_system.service.MailService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {
    private final FeedbackRepository feedbackRepo;
    private final UserRepository userRepo;
    private final MailService mailService;

    @Override
    @Transactional
    public void sendFeedback(String senderEmail, String message) {
        User sender = userRepo.findByEmail(senderEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));
        Feedback fb = Feedback.builder()
                .sender(sender)
                .message(message)
                .build();
        feedbackRepo.save(fb);

        String subject = "Thank you for your feedback!";
        String body = String.format(
                "Hi %s,\n\n" +
                        "Thank you for taking the time to send us your feedback.  “%s”\n\n" +
                        "We really appreciate it and will review it as soon as possible.\n\n" +
                        "— The TA Management System Team",
                sender.getFirstName(),
                message
        );
        mailService.sendEmail(senderEmail, subject, body);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeedbackResponse> listAllFeedback() {
        return feedbackRepo.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(fb -> new FeedbackResponse(
                        fb.getId(),
                        fb.getSender().getEmail(),
                        fb.getMessage(),
                        fb.getCreatedAt()))
                .collect(Collectors.toList());
    }
}

