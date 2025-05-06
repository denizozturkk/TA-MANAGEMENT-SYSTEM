package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.Course;
import edu.bilkent.cs319.team9.ta_management_system.repository.CourseRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {
    private final CourseRepository repo;

    @Override
    public Course create(Course c) {
        return repo.save(c);
    }

    @Override
    @Transactional(readOnly = true)
    public Course findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Course", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Course> findAll() {
        return repo.findAll();
    }

    @Override
    public Course update(Long id, Course c) {
        if (!repo.existsById(id)) throw new NotFoundException("Course", id);
        c.setId(id);
        return repo.save(c);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Override
    public Optional<Course> findByCode(String courseCode) {
        return repo.findByCourseCode(courseCode);
    }
}