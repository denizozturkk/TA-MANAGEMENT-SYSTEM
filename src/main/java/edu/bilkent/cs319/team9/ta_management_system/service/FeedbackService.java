package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.dto.FeedbackResponse;

import java.util.List;

public interface FeedbackService {
    void sendFeedback(String senderEmail, String message);
    List<FeedbackResponse> listAllFeedback();
}

