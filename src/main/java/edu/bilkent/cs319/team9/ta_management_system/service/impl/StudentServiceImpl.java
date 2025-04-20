package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.Student;
import edu.bilkent.cs319.team9.ta_management_system.repository.StudentRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {
    private final StudentRepository repo;

    @Override
    public Student create(Student s) {
        return repo.save(s);
    }

    @Override
    @Transactional(readOnly = true)
    public Student findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Student", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Student> findAll() {
        return repo.findAll();
    }

    @Override
    public Student update(Long id, Student s) {
        if (!repo.existsById(id)) throw new NotFoundException("Student", id);
        s.setId(id);
        return repo.save(s);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}