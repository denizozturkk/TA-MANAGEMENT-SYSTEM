package edu.bilkent.cs319.team9.ta_management_system.dto;

import edu.bilkent.cs319.team9.ta_management_system.model.Department;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TutorGraderApplicationDto {
    private Long id;

    private String studentId;
    private String fullName;
    private Integer classYear;
    private Float cgpa;
    private Department dept;

    private String email;
    private String mobilePhone;

    private boolean turkishCitizen;
    private boolean completedOneYear;
    private boolean cgpaAbove2;
    private boolean noDisciplinary;
    private boolean notOnLeave;

    private String transcriptPath;
    private List<String> labCourses;
    private List<String> gradershipCourses;

    private Map<String,String> preferredSectionsByCourse;
    private Map<String,String> letterGradesByCourse;
    private String priorExperience;
    private boolean infoConfirmed;
    private String additionalNotes;

    private LocalDateTime submittedAt;
}
