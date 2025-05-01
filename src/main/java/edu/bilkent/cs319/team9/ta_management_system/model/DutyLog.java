package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@SuperBuilder
public class DutyLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dateTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "task_type", nullable = false, length = 20)
    private DutyType taskType;

    private Long workload;
    private LocalDateTime startTime;

    private Long duration;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private DutyStatus status;

    @ManyToOne @JoinColumn(name = "ta_id")
    private TA ta;

    @ManyToOne @JoinColumn(name = "faculty_id")
    private FacultyMember faculty;

    @ManyToMany
    @JoinTable(
            name = "dutylog_classroom",
            joinColumns = @JoinColumn(name = "dutylog_id"),
            inverseJoinColumns = @JoinColumn(name = "classroom_id")
    )
    private Set<Classroom> classrooms;
}
