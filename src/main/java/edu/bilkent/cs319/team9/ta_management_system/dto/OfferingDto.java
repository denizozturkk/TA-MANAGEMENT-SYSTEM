package edu.bilkent.cs319.team9.ta_management_system.dto;

import edu.bilkent.cs319.team9.ta_management_system.model.*;
import java.util.Set;

public class OfferingDto {
    private Long id;

    private String section;
    private String semester;
    private Integer year;
    private FacultyMember instructor;
    private Course course;
    private Set<TA> tas;
    private Set<Student> students;
    private Set<Exam> exams;
    private SemesterData semesterData;
}
