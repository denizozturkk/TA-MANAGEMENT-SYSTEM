package edu.bilkent.cs319.team9.ta_management_system.dto;

import edu.bilkent.cs319.team9.ta_management_system.model.DutyStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class DutyLogDto {
    private Long id;
    private String taskType;
    private int workload;
    private LocalDateTime startTime;
    private LocalDateTime dateTime;
    private LocalDateTime endTime;
    private DutyStatus status;

    private Long taId;
    private Long facultyId;
    private Set<Long> classroomIds; // Only IDs are enough for serialization

    private Long offeringId;

    private String reason;

    private String fileNameTa;
    private String contentTypeTa;
}
