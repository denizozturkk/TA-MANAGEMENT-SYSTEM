package edu.bilkent.cs319.team9.ta_management_system.model;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@NoArgsConstructor
@SuperBuilder
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    private String examName;
    private String department;
    private LocalDateTime dateTime;
    private Float duration;
    private String examType;
    private Integer numProctors;

    @ManyToOne @JoinColumn(name = "offering_id")
    private Offering offering;

    @ManyToOne
    @JoinColumn(name = "faculty_member_id")
    private FacultyMember faculty;

    @OneToMany(mappedBy = "exam")
    private Set<ProctorAssignment> proctorAssignments;

    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ExamRoom> examRooms;
}
