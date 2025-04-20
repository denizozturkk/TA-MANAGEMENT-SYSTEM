package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@SuperBuilder
public class SwapRequest {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private SwapStatus status;

    private LocalDateTime requestDate;

    @ManyToOne @JoinColumn(name = "ta_id")
    private TA ta;

    @OneToOne @JoinColumn(name = "proctor_assignment_id")
    private ProctorAssignment proctorAssignment;
}

