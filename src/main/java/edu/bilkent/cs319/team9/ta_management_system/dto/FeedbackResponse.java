package edu.bilkent.cs319.team9.ta_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackResponse {
    private Long id;
    private String senderEmail;
    private String message;
    private LocalDateTime createdAt;
}
