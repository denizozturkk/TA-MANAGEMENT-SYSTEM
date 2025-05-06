package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamRoomId implements Serializable {
    private Long examId;
    private Long classroomId;
}