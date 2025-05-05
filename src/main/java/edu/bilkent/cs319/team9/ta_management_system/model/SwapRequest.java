package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class SwapRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Enumerated(EnumType.STRING)
    private SwapStatus status;

    private LocalDateTime requestDate;

    @ManyToOne @JoinColumn(name = "ta_id")
    private TA ta;

    /** the assignment A wants to give up */
    @OneToOne @JoinColumn(name = "proctor_assignment_id", nullable = false)
    private ProctorAssignment proctorAssignment;

    /** the assignment A would like to take over (belongs to B) */
    @OneToOne @JoinColumn(name = "target_proctor_assignment_id", nullable = false)
    private ProctorAssignment targetProctorAssignment;
}

