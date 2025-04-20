package edu.bilkent.cs319.team9.ta_management_system.service.impl;


import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.Exam;
import edu.bilkent.cs319.team9.ta_management_system.repository.ExamRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {
    private final ExamRepository repo;

    @Override
    public Exam create(Exam e) {
        return repo.save(e);
    }

    @Override
    @Transactional(readOnly = true)
    public Exam findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Exam", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Exam> findAll() {
        return repo.findAll();
    }

    @Override
    public Exam update(Long id, Exam e) {
        if (!repo.existsById(id)) throw new NotFoundException("Exam", id);
        e.setId(id);
        return repo.save(e);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
