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
    private String taskType;
    private int workload;
    private Float duration;

    @Enumerated(EnumType.STRING)
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
