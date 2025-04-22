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
public class Exam {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String examID;
    private LocalDateTime dateTime;
    private Float duration;
    private String examType;
    private Integer numProctors;

    @ManyToOne
    @JoinColumn(name = "roomNumber")
    private Classroom classroom;

    @ManyToOne @JoinColumn(name = "offering_id")
    private Offering offering;

    @ManyToOne
    @JoinColumn(name = "faculty_member_id")
    private FacultyMember faculty;

    @OneToMany(mappedBy = "exam")
    private Set<ProctorAssignment> proctorAssignments;
}
