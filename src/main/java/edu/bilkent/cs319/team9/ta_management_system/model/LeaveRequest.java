package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@SuperBuilder
public class LeaveRequest {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;

    @Enumerated(EnumType.STRING)
    private LeaveStatus status;

    // Should store a Proctoring Assignment object as well
    @OneToOne
    @JoinColumn(name = "proctor_assignment_id")
    private ProctorAssignment proctorAssignment;

    @ManyToOne @JoinColumn(name = "ta_id")
    private TA ta;
}
