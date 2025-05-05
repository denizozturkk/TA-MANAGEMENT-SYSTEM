package edu.bilkent.cs319.team9.ta_management_system.model;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Offering {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    private String section;
    private String semester;
    private Integer year;

    @ManyToOne @JoinColumn(name = "instructor_id")
    private FacultyMember instructor;

    @ManyToOne @JoinColumn(name = "course_id")
    private Course course;

    @ManyToMany
    @JoinTable(
            name = "offering_ta",
            joinColumns = @JoinColumn(name = "offering_id"),
            inverseJoinColumns = @JoinColumn(name = "ta_id")
    )
    private Set<TA> tas;

    @ManyToMany
    @JoinTable(
            name = "offering_student",
            joinColumns = @JoinColumn(name = "offering_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private Set<Student> students;

    @OneToMany(mappedBy = "offering")
    private Set<Exam> exams;

    @ManyToOne @JoinColumn(name = "semester_data_id")
    private SemesterData semesterData;
}
