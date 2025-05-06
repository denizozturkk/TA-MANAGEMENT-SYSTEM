package edu.bilkent.cs319.team9.ta_management_system.repository;

import edu.bilkent.cs319.team9.ta_management_system.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCourseCode(String courseCode);
}
