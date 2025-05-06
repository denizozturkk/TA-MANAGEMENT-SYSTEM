package edu.bilkent.cs319.team9.ta_management_system.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ExamDto {
    private Long id;
    private String examName;
    private String department;
    private LocalDateTime dateTime;
    private Float duration;
    private String examType;
    private Integer numProctors;

    private Long offeringId;
    private Long facultyId;
    private List<ExamRoomDto> examRooms;
    private String courseCode;
}
