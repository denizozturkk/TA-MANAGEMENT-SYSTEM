package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.TutorGraderApplication;
import edu.bilkent.cs319.team9.ta_management_system.repository.TutorGraderApplicationRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.TutorGraderApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class TutorGraderApplicationServiceImpl
        implements TutorGraderApplicationService {

    private final TutorGraderApplicationRepository repo;

    @Override
    public TutorGraderApplication create(TutorGraderApplication app) {
        app.setSubmittedAt(LocalDateTime.now());
        return repo.save(app);
    }

    @Override
    @Transactional(readOnly = true)
    public TutorGraderApplication findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Application", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TutorGraderApplication> findAll() {
        return repo.findAll();
    }

    @Override
    public TutorGraderApplication update(Long id, TutorGraderApplication app) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("Application", id);
        }
        app.setId(id);
        return repo.save(app);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
