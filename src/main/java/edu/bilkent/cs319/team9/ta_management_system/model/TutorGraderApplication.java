package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "tutor_grader_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class TutorGraderApplication {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentId;
    private String fullName;
    private Integer classYear;      // 1,2,3,4
    private Float cgpa;

    @Enumerated(EnumType.STRING)
    private Department dept;        // CHEM, CS, EE, …

    private String email;
    private String mobilePhone;

    private boolean turkishCitizen;
    private boolean completedOneYear;
    private boolean cgpaAbove2;
    private boolean noDisciplinary;
    private boolean notOnLeave;

    private String transcriptPath;

    @ElementCollection
    @CollectionTable(name = "application_lab_courses", joinColumns = @JoinColumn(name = "application_id"))
    @Column(name = "course_code")
    private List<String> labCourses;

    @ElementCollection
    @CollectionTable(name = "application_gradership_courses", joinColumns = @JoinColumn(name = "application_id"))
    @Column(name = "course_code")
    private List<String> gradershipCourses;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "preferred_sections_by_course", columnDefinition = "JSON")
    private Map<String,String> preferredSectionsByCourse;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "letter_grades_by_course", columnDefinition = "JSON")
    private Map<String,String> letterGradesByCourse;

    @Lob
    private String priorExperience;

    private boolean infoConfirmed;

    @Lob
    private String additionalNotes;

    private LocalDateTime submittedAt;
}
