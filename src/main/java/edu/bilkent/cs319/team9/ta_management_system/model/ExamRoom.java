package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "exam_room")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ExamRoom {

    @EmbeddedId
    private ExamRoomId id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @MapsId("examId")
    @JoinColumn(name = "exam_id")
    private Exam exam;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @MapsId("classroomId")
    @JoinColumn(name = "classroom_id")
    private Classroom classroom;

    /** How many proctors should be assigned here */
    @Column(nullable = false)
    private Integer numProctors;
}