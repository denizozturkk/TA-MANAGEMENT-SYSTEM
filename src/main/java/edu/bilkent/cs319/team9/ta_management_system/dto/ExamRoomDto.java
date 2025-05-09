// src/main/java/edu/bilkent/cs319/team9/ta_management_system/dto/ExamRoomDto.java
package edu.bilkent.cs319.team9.ta_management_system.dto;

import lombok.Data;

@Data
public class ExamRoomDto {
    private Long examId;
    private Long classroomId;
    private Integer numProctors;
}
