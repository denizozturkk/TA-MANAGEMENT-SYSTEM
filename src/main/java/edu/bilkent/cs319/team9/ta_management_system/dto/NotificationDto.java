package edu.bilkent.cs319.team9.ta_management_system.dto;

import lombok.*;
import lombok.experimental.Accessors;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)     // <— enables your chained .setXxx() calls
public class NotificationDto {
    private Long id;
    private String message;
    private LocalDateTime timestamp;
    private boolean read;
}
