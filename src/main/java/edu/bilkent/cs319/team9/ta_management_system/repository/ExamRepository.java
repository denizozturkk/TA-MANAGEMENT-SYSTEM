package edu.bilkent.cs319.team9.ta_management_system.repository;

import edu.bilkent.cs319.team9.ta_management_system.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findAllByFaculty_Id(Long facultyId);
}
