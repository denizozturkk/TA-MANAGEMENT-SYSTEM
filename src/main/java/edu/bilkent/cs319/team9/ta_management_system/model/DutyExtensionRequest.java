package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@SuperBuilder
public class DutyExtensionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reason;

    private int requestedExtensionDays;

    private LocalDateTime requestedAt;

    @Enumerated(EnumType.STRING)
    private ExtensionRequestStatus status;

    @Enumerated(EnumType.STRING)
    private ExcuseType excuseType;

    @ManyToOne
    private TA ta;

    @ManyToOne
    private FacultyMember instructor;

    @ManyToOne
    private DutyLog dutyLog;
}
