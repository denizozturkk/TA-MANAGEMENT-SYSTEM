package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.Course;
import java.util.List;
import java.util.Optional;

public interface CourseService {
    Course create(Course c);
    Course findById(Long id);
    List<Course> findAll();
    Course update(Long id, Course c);
    void delete(Long id);
    Optional<Course> findByCode(String courseCode);
}
