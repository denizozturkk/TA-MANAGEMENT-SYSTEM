package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.Student;
import java.util.List;

public interface StudentService {
    Student create(Student s);
    Student findById(Long id);
    List<Student> findAll();
    Student update(Long id, Student s);
    void delete(Long id);
}
