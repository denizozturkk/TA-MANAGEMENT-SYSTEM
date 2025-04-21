package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Data
@NoArgsConstructor
@SuperBuilder
public class ProctorAssignment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status;

    @ManyToOne @JoinColumn(name = "ta_id")
    private TA assignedTA;

    @ManyToOne @JoinColumn(name = "exam_id")
    private Exam exam;

    @ManyToOne
    @JoinColumn(name = "roomNumber")
    private Classroom classroom;

    @OneToOne(mappedBy = "proctorAssignment")
    private SwapRequest swapRequest;
}
