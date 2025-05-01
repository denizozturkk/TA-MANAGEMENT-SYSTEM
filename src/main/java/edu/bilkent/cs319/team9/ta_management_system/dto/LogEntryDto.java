package edu.bilkent.cs319.team9.ta_management_system.dto;

import edu.bilkent.cs319.team9.ta_management_system.model.LogType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LogEntryDto {
    private Long id;
    private LogType type;
    private LocalDateTime timestamp;
    private String event;
    private String actorID;
}
